import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICard } from "../../types";

export class BasketCard extends Card<ICard> {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit("basketCard:remove", {id: this.cardId});
    });
  }

  setIndex(value: number) {
    this.cardIndex.textContent = String(value);
  }
}