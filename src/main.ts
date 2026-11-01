import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { IBuyer, IOrderRequest, IProductResponse, IProduct } from "./types";
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
const basket = new Basket(events);
const buyer = new Buyer(events);
const productCatalog = new ProductCatalog(events);

const contacts = new Contacts(cloneTemplate("#contacts"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const header = new Header(ensureElement(".header"), events);
const modal = new Modal(ensureElement("#modal-container"));
const order = new Order(cloneTemplate("#order"), events);
const basketPreview = new BasketPreview(cloneTemplate("#basket"), events);
const success = new Success(cloneTemplate("#success"), events);
const previewCard = new PreviewCard(cloneTemplate("#card-preview"), events);

events.on("catalog:change", () => {
  const products = productCatalog.getProducts().map((product) => {
    const card = new CatalogCard(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", { id: product.id }),
    });
    return card.render({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  });
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

  const hasInBasket = basket.isInBasket(product.id);
  const isUnavailable = product.price === null;
  const buttonText = isUnavailable ? "Недоступно" : hasInBasket ? "Удалить из корзины" : "Купить";
  const disabled = isUnavailable;
  
  modal.open();
  modal.render({ content: previewCard.render({
    title: product.title,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    buttonText,
    disabled,
  }) });
});

events.on("PreviewCard:click", () => {
  const product = productCatalog.getPreview();

  if (!product) {
    return;
  }

  if (basket.isInBasket(product.id)) {
    basket.delProduct(product);
  } else {
    basket.addProduct(product);
  }

  modal.close();
});

events.on("basket:open", () => {
  modal.open();
  modal.render({ content: basketPreview.render() });
});

events.on("card:delete", (item: IProduct) => {
  basket.delProduct(item);
}); 

events.on("basket:change", () => {
  const basketItems = basket.getSelectedProducts().map((item, index) => {
    const basketCard = new BasketCard(cloneTemplate("#card-basket"), {
      onClick: () => events.emit("card:delete", item),
    });
    return basketCard.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  basketPreview.render({
    items: basketItems,
    price: basket.getPriceBasket(),
    valid: basket.getProductsBasket() > 0,
  });
  header.counter = basket.getProductsBasket();
});

events.on("order:start", () => {
  modal.render({ content: order.render() });
});

events.on("order:submit", () => {
  modal.render({ content: contacts.render() });
});

events.on("contacts:submit", () => {
  const buyerData = buyer.getBuyerData();
  const details: IOrderRequest = {
    ...buyerData,
    total: basket.getPriceBasket(),
    items: basket.getSelectedProducts().map((item) => item.id),
  };

  webApi
    .postOrder(details)
    .then((response) => {
      basket.clearBasket();
      buyer.clearBuyerData();
      modal.render({ content: success.render({ total: response.total }) });
    })
    .catch((error) => console.log("Ошибка Api", error));
});

events.on("input:change", (data: { field: keyof IBuyer; value: string }) => {
  buyer.setBuyerData({ [data.field]: data.value });
});

events.on("buyer:change", () => {
  const valid = buyer.isValidData();
  const buyerData = buyer.getBuyerData();
  const orderErrors = [];
  const contactsErrors = [];
  
    order.payment = buyerData.payment;
    order.address = buyerData.address;
    contacts.email = buyerData.email;
    contacts.phone = buyerData.phone;

  if (valid.payment) orderErrors.push(valid.payment);
  if (valid.address) orderErrors.push(valid.address);
  order.errors = orderErrors.join(", ");
  order.valid = orderErrors.length === 0;

  if (valid.email) contactsErrors.push(valid.email);
  if (valid.phone) contactsErrors.push(valid.phone);
  contacts.errors = contactsErrors.join(", ");
  contacts.valid = contactsErrors.length === 0;
});

events.on("success:close", () => {
  modal.close();
});

basket.clearBasket();
buyer.clearBuyerData();

webApi
  .getProductsRequest()
  .then((products: IProductResponse) => {
    productCatalog.setProducts(products.items);
  })
  .catch((error) => {
    console.error(error);
  });