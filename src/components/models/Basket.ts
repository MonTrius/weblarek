import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected selectedProducts: IProduct[];

  constructor(protected events: IEvents) {
    this.selectedProducts = [];
  }

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addProduct(item: IProduct): void {
    this.selectedProducts.push(item);
    this.events.emit("basket:change");
  }

  delProduct(item: IProduct): void {
    this.selectedProducts = this.selectedProducts.filter(
      selectedProduct => selectedProduct.id !== item.id);
    this.events.emit("basket:change");
  }

  clearBasket(): void {
    this.selectedProducts = [];
    this.events.emit("basket:change");
  }

  getPriceBasket(): number {
    return this.selectedProducts.reduce(
      (price, selectedProduct) => price + (selectedProduct.price || 0),
      0,
    );
  }

  getProductsBasket(): number {
    return this.selectedProducts.length;
  }

  isInBasket(id: string): boolean {
    return this.selectedProducts.some((item) => item.id === id);
  }
}