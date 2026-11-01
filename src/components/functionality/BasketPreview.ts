import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasketPreview } from "../../types";
import { CURRENCY } from "../../utils/constants";

export class BasketPreview extends Component<IBasketPreview> {
  protected basketProducts: HTMLUListElement;
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketProducts = ensureElement<HTMLUListElement>(".basket__list", this.container);
    this.basketButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.basketPrice = ensureElement<HTMLElement>(".basket__price", this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit("order:start");
    });
  }

  set valid(value: boolean) {
    this.basketButton.disabled = !value;
  }

  set items(items: HTMLElement[]) {
    this.basketProducts.replaceChildren(...items);
  }

  set price(value: number) {
    this.basketPrice.textContent = `${value} ${CURRENCY}`;
  }
}
