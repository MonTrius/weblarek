import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasketPreview } from "../../types";

export class BasketPreview extends Component<IBasketPreview> {
  protected basketProducts: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.basketProducts = ensureElement<HTMLElement>(".basket__list", this.container);
    this.basketPrice = ensureElement<HTMLElement>(".basket__price", this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit("order:start");
    });
  }


  setValidButton(value: boolean) {
    this.basketButton.disabled = value;
  }

  setItems(items: HTMLElement[]) {
    if (items.length === 0) {
      const descr = document.createElement('P');
      descr.textContent = "Корзина пуста";
      this.basketProducts.replaceChildren(descr);
      this.basketButton.disabled = true;
    } else {
      this.basketProducts.replaceChildren(...items);
      this.basketButton.disabled = false;
    }
  }

  setPrice(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }
}
