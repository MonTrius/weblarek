import { IProduct } from '../../types';

export class Basket {
  selectedProducts: IProduct[];

  constructor() {
    this.selectedProducts = [];
  }

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addProduct(item: IProduct): void {
    this.selectedProducts.push(item);
  }

  delProduct(item: IProduct): void {
    this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct.id !== item.id)
  }

  clearBasket(): void {
    this.selectedProducts = [];
  }

  getPriceBasket(): number {
    return this.selectedProducts.reduce((price, selectedProduct) => price + (selectedProduct.price || 0), 0);
  }

  getProductsBasket(): number {
    return this.selectedProducts.length;
  }

  isBasket(id: string): boolean {
    return this.selectedProducts.some(item => item.id === id);
  }
}