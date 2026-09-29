import { IApi, IOrderRequest, IOrderResponse, IProduct } from "../../types";

export class WebApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsRequest(): Promise<IProduct[]> {
    const apiProducts = await this.api.get<{ items: IProduct[] }>("/product");
    return apiProducts.items;
  }

  async postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const apiOrder = await this.api.post<IOrderResponse>("/order", order);
    return apiOrder;
  }
}