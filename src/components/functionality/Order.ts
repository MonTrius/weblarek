import { Form } from "../functionality/abstract/Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IOrder, TPayment } from "../../types";

export class Order extends Form<IOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressElement: HTMLInputElement;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>("button[name='card']", this.container);
    this.cashButton = ensureElement<HTMLButtonElement>("button[name='cash']", this.container);
    this.addressElement = ensureElement<HTMLInputElement>("input[name='address']", this.container);

    this.cardButton.addEventListener('click', () => {
      this.inputChange('payment', 'card');
    });

    this.cashButton.addEventListener('click', () => {
      this.inputChange('payment', 'cash');
    });

    this.addressElement.addEventListener('input', () => {
      this.inputChange('address', this.addressElement.value);
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
}