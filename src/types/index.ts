export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export type BuyerValidation = Partial<Record<keyof IBuyer, string>>;

export type ICardPreview = Pick<IProduct, "description" | "image" | "category">;

export type ICardCatalog = Pick<IProduct, "image" | "category">;

export type IBasketCard = {
  index: number;
}

export const Valuta = "синапсов";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
} 

export type ICard = Pick<IProduct, 'title' | 'price'>;

export interface IForm {
  errors: string;
}

export interface IGallery {
  catalog: HTMLElement[];
}

export interface IHeader {
  counter: number;
}

export interface IModal { 
  content: HTMLElement;
}

export interface IBasketPreview {
  items: HTMLElement[];
  total: number;
}

export interface ISuccess {
  total: number;
}

export interface IContacts extends IForm {
  email: string;
  phone: string;
}

export interface IOrder extends IForm {
  payment: TPayment | null;
  address: string;
}

export interface ICardACtions {
  onClick?: (event: MouseEvent) => void;
}