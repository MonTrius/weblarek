import { IApi, IOrderRequest, IOrderResponse, IProductResponse } from "../../types";

export class WebApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsRequest(): Promise<IProductResponse> {
    return this.api.get("/product");
  }

  async postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post("/order", order);
  }
}