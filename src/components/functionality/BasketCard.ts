import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IBasketCard, ICardActions } from "../../types";

export class BasketCard extends Card<IBasketCard> {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);

    if (actions?.onClick) {
      this.cardButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}