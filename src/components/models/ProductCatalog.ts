import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  protected products: IProduct[];
  protected currentProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.currentProduct = null;
  }

  setProducts(selectedProducts: IProduct[]): void {
    this.products = selectedProducts;
    this.events.emit("catalog:change");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductByID(id: string): IProduct | undefined {
    return this.products.find((item) => item.id === id);
  }

  setPreview(id: string): void {
    this.currentProduct = this.products.filter(item => item.id === id)[0];
    this.events.emit("product:change");
  }

  getPreview(): IProduct | null {
    return this.currentProduct;
  }
}