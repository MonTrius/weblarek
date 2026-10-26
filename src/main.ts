import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { IOrderRequest, IProductResponse /*, IOrderResponse, IProduct */ } from "./types";
import { Api } from "./components/base/Api"; 
import { WebApi } from "./components/models/WebApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { BasketCard } from "./components/functionality/BasketCard";
import { BasketPreview } from "./components/functionality/BasketPreview";
import { CatalogCard } from "./components/functionality/CatalogCard";
import { Contacts } from "./components/functionality/Contacts";
import { Gallery } from "./components/functionality/Gallery";
import { Header } from "./components/functionality/Header";
import { Modal } from "./components/functionality/Modal";
import { Order } from "./components/functionality/Order";
import { PreviewCard } from "./components/functionality/PreviewCard";
import { Success } from "./components/functionality/Success";
import { cloneTemplate, ensureElement } from "./utils/utils";

const events = new EventEmitter();
const api = new Api(API_URL);
const webApi = new WebApi(api);
const bBasket = new Basket(events);
const bBuyer = new Buyer(events);
const pproductCatalog = new ProductCatalog(events);

const contacts = new Contacts(cloneTemplate("#contacts"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const header = new Header(ensureElement(".header"), events);
const modal = new Modal(ensureElement("#modal-container"), events);
const order = new Order(cloneTemplate("#order"), events);
const basketPreview = new BasketPreview(cloneTemplate("#basket"), events);
const success = new Success(cloneTemplate("#success"), events);
const previewCard = new PreviewCard(cloneTemplate("#card-preview"), events);

webApi
  .getProductsRequest()
  .then((products: IProductResponse) => {
  console.log("Массив товаров от сервера");
  pproductCatalog.setProducts(products.items);
}).catch((error) => {
  console.error("Ошибка API:", error);
});

events.on("catalog:change", () => {
  const products = pproductCatalog.getProducts().map((product) => {
    const card = new CatalogCard(cloneTemplate("#card-catalog"), events);
    return card.render(product);
  })
  gallery.render({ catalog: products });
});

events.on("product:change", () => {
  const product = pproductCatalog.getPreview();

  if (!product) {
    return;
  }

  if (product.price === null) {
    previewCard.setButtonText("Недоступно");
  } else {
    previewCard.setButtonText(bBasket.isInBasket(product.id) ? "Удалить из корзины" : "Купить");
  }
  modal.modalOpen();
  modal.render({ content: previewCard.render(product) });
});

events.on("CatalogCard:click", (data: {id: string}) => {
  const pproduct = pproductCatalog.getProductByID(data.id);
  if (pproduct) {
    pproductCatalog.setPreview(pproduct.id);
  }
});

events.on("PreviewCard:click", (data: {id: string}) => {
  const pproduct = pproductCatalog.getProductByID(data.id);
  if (pproduct) {
    bBasket.addProduct(pproduct);
    modal.modalClose();
  }
});

events.on("basket:open", () => {
  header.setCounter(bBasket.getProductsBasket());
  const basketItems = bBasket.getSelectedProducts().map((item, index) => {
    const basketCard = new BasketCard(cloneTemplate("#card-basket"), events);
    basketCard.setCardTitle(item.title);
    basketCard.setIndex(index + 1);
    basketCard.setCardPrice(item.price);
    return basketCard.render(item);
  })
  basketPreview.setItems(basketItems);
  basketPreview.setPrice(bBasket.getPriceBasket());

  modal.modalOpen();
  modal.render({ content: basketPreview.render()});
});

events.on("basketCard:remove", (data: {id: string}) => {
  const pproduct = pproductCatalog.getProductByID(data.id);
  if (pproduct) {
    bBasket.delProduct(pproduct);
  }
});

events.on("basket:change", () =>{
  header.setCounter(bBasket.getProductsBasket());
  const basketItems = bBasket.getSelectedProducts().map((item, index) => {
    const basketCard = new BasketCard(cloneTemplate("#card-basket"), events);
    basketCard.setCardTitle(item.title);
    basketCard.setIndex(index + 1);
    basketCard.setCardPrice(item.price);
    return basketCard.render(item);
  })
  basketPreview.setItems(basketItems);
  basketPreview.setPrice(bBasket.getPriceBasket());
});

events.on("order:start", () => {
  order.setErrors([]);
  modal.render({ content: order.render()});
});

events.on("order:submit", () => {
  contacts.setErrors([]);
  modal.render({ content: contacts.render()});
});

events.on("contacts:submit", () => {
  const orderData: IOrderRequest = {
    ...bBuyer.getBuyerData(), total: bBasket.getPriceBasket(), items: bBasket.getSelectedProducts().map(item => item.id)
  };

  webApi.postOrder(orderData).then(() => {
    bBasket.clearBasket();
    success.setPrice(orderData.total);
  }).catch((error) => console.log('Ошибка при оформлении заказа', error));
  modal.render({ content: success.render()});
});

events.on("input:change", (data: { field: string, value: string}) => {
  bBuyer.setBuyerData({ [data.field]: data.value });
});

events.on("buyer:change", () => {
  const valid = bBuyer.isValidData();
  const buyerData = bBuyer.getBuyerData();
  if (buyerData) {
    if (buyerData.payment) {
      order.setPayment(buyerData.payment);
    }
    order.setAddress(buyerData.address);
    contacts.setEmail(buyerData.email);
    contacts.setPhone(buyerData.phone);
  }
  const orderValid = [];
  if (valid.payment) orderValid.push(valid.payment);
  if (valid.address) orderValid.push(valid.address);
  order.setErrors(orderValid);
  order.setValidButton(orderValid.length > 0);

  const contactsValid = [];
  if (valid.email) contactsValid.push(valid.email);
  if (valid.phone) contactsValid.push(valid.phone);
  contacts.setErrors(contactsValid);
  contacts.setValidButton(contactsValid.length > 0);
});

events.on("success:close", () => {
  modal.modalClose();
});