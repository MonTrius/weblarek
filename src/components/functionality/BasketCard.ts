import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IBasketCard } from "../../types";

export class BasketCard extends Card<IBasketCard> {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected onDelete: (id: string) => void) {
    super(container);
    
    this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);

    this.cardButton.addEventListener('click', () => {
      const itemId = this.container.dataset.id;
      if (itemId) {
        onDelete(itemId);
      }
    });
  }

  setId(id: string): void {
    this.container.dataset.id = id;
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}