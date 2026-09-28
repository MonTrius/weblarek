import { IApi, IOrderRequest, IOrderResponse, IProduct } from '../../types';

export class WebApi {
  api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsRequest(): Promise<IProduct[]> {
    return this.api.get('/products');
  }

  async postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post('/order', order);
  }
}