import { IProduct } from "../../types";

export class ProductCatalog {
  products: IProduct[];
  currentProduct: IProduct | null;

  constructor() {
    this.products = [];
    this.currentProduct = null;
  }

  setProducts(selectedProducts: IProduct[]): void {
    this.products = selectedProducts;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductByID(id: string): IProduct | undefined {
    return this.products.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.currentProduct = item;
  }

  getPreview(): IProduct | null {
    return this.currentProduct;
  }
}