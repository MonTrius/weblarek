import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { IBuyer, IOrderRequest, IProductResponse } from "./types";
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
const basketshop = new Basket(events);
const buyer = new Buyer(events);
const productCatalog = new ProductCatalog(events);

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
  productCatalog.setProducts(products.items);
}).catch((error) => {
  console.error(error);
});

events.on("catalog:change", () => {
  const products = productCatalog.getProducts().map((product) => {
    const card = new CatalogCard(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", { id: product.id }),
    });
    return card.render(product);
  })
  gallery.render({ catalog: products });
});

events.on("card:select", (product: { id: string }) => {
  productCatalog.setPreview(product.id);
});


events.on("product:change", () => {
  const product = productCatalog.getPreview();

  if (!product) {
    return;
  }

  if (product.price === null) {
    previewCard.buttonText = "Недоступно";
    previewCard.disabled = true;
  } else {
    previewCard.buttonText = basketshop.isInBasket(product.id) ? "Удалить из корзины" : "Купить";
    previewCard.disabled = false;
  }
  modal.open();
  modal.render({ content: previewCard.render(product) });
});

events.on("PreviewCard:click", () => {
  const product = productCatalog.getPreview();

  if (!product) {
    return;
  }

  if (basketshop.isInBasket(product.id)) {
    basketshop.delProduct(product);
  } else {
    basketshop.addProduct(product);
  }

  modal.close();
});

events.on("basket:open", () => {
  buyer.clearBuyerData();
  basketPreview.setPurchase(basketshop.getProductsBasket() === 0);
  modal.open();
  modal.render({content: basketPreview.render()})
});

events.on("basket:change", () =>{
  const basketItems = basketshop.getSelectedProducts().map((item, index) => {
    const basketCard = new BasketCard(cloneTemplate("#card-basket"), () => basketshop.delProduct(item));
    basketCard.setId(item.id)
    return basketCard.render({title: item.title, price: item.price, index: index + 1});
  });
  basketPreview.render({items: basketItems, total: basketshop.getPriceBasket() || 0  });
  header.counter = basketshop.getProductsBasket();
  basketPreview.setPurchase(basketshop.getProductsBasket() === 0);
});

events.on("order:start", () => {
  modal.render({ content: order.render()});
});

events.on("order:submit", () => {
  modal.render({ content: contacts.render()});
});

events.on("contacts:submit", () => {
  const buyerData = buyer.getBuyerData();
  const details: IOrderRequest = {
    ...buyerData, total: basketshop.getPriceBasket(), items: basketshop.getSelectedProducts().map(item => item.id)
  }

  webApi.postOrder(details).then(() => {
    basketshop.clearBasket();
    success.price = details.total;
  }).catch((error) => console.log('Ошибка Api', error));

  modal.render({ content: success.render()});
});

events.on("input:change", (data: { field: keyof IBuyer, value: string }) => {
  buyer.setBuyerData({[data.field]: data.value});
});

events.on("buyer:change", () => {
  const valid = buyer.isValidData();
  const buyerData = buyer.getBuyerData();
  const orderValid = [];
  const contactsValid = [];
  
  if (buyerData) {
    order.payment = buyerData.payment || null;
    order.address = buyerData.address || '';
    contacts.email = buyerData.email || '';
    contacts.phone = buyerData.phone || '';
  }

  if (valid.payment) orderValid.push(valid.payment);
  if (valid.address) orderValid.push(valid.address);
  order.errors = orderValid.join(', ');
  order.valid = orderValid.length > 0;

  if (valid.email) contactsValid.push(valid.email);
  if (valid.phone) contactsValid.push(valid.phone);
  contacts.errors = contactsValid.join(', ');
  contacts.valid = contactsValid.length > 0;
});

events.on("success:close", () => {
  modal.close();
});