import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { ICard } from "../../../types";

export abstract class Card<T extends ICard> extends Component<T> {
  protected cardId?: string;
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  setCardId(value: string) {
    this.cardId = value;
  }

  setCardTitle(value: string) {
    this.cardTitle.textContent = value;
  }

  setCardPrice(value: number | null) {
    if (value === null) {
      this.cardPrice.textContent = "Бесценно";
    } else {
      this.cardPrice.textContent = `${value} синапсов`;
    }
  }
}