import "./scss/styles.scss";
import { Buyer } from "./components/models/Buyer";
import { Basket } from "./components/models/Basket";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { WebApi } from "./components/models/WebApi";
import { API_URL } from "./utils/constants";

const pproductCatalog = new ProductCatalog();
pproductCatalog.setProducts(apiProducts.items);

console.log("Массив товаров из каталога:", pproductCatalog.getProducts());
console.log(
  "Товар найденный по id:",
  pproductCatalog.getProductByID("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
pproductCatalog.setPreview(apiProducts.items[3]);
console.log(
  "Получение товара для подробного отображения:",
  pproductCatalog.getPreview(),
);

const bBasket = new Basket();
bBasket.addProduct(apiProducts.items[0]);
bBasket.addProduct(apiProducts.items[1]);
bBasket.addProduct(apiProducts.items[2]);
console.log(
  "Получение массива товаров, которые находятся в корзине:",
  bBasket.getSelectedProducts(),
);
console.log(
  "Получение стоимости всех товаров в корзине:",
  bBasket.getPriceBasket(),
);
bBasket.delProduct(apiProducts.items[1].id);
console.log(
  "Получение количества товаров в корзине:",
  bBasket.getProductsBasket(),
);
console.log(
  "Проверка наличия товара в корзине по его id, полученного в параметр метода:",
  bBasket.isInBasket("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
bBasket.clearBasket();
console.log(
  "Получение количества товаров в корзине:",
  bBasket.getProductsBasket(),
);

const bBuyer = new Buyer();
bBuyer.setBuyerData({
  payment: "card",
  address: "Kaluga, George Amelina",
  email: "example123@mail.ru",
});

console.log("Проверка валидации данных:", bBuyer.isValidData());
console.log("Получение всех данных покупателя:", bBuyer.getBuyerData());
console.log("Очистка данных покупателя:", bBuyer.clearBuyerData());
console.log("Проверка валидации данных:", bBuyer.isValidData());
console.log("Получение всех данных покупателя:", bBuyer.getBuyerData());

const api = new Api(API_URL);
const webApi = new WebApi(api);
webApi
  .getProductsRequest()
  .then((products) => {
    pproductCatalog.setProducts(products);
    console.log("Массив товаров от сервера:", pproductCatalog.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка API:", error);
  });