import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ISuccess } from "../../types";

export class Success extends Component<ISuccess> {
  protected successButton: HTMLButtonElement;
  protected successPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.successButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
    this.successPrice = ensureElement<HTMLElement>(".order-success__description", this.container);

    this.successButton.addEventListener('click', () =>{
      this.events.emit("success:close");
    })
  }

  set price(value: number) {
    this.successPrice.textContent = `Списано ${value} синапсов`;
  }
}