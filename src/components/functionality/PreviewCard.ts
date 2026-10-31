import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICardPreview, IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class PreviewCard extends Card<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.cardDescription = ensureElement<HTMLElement>(".card__text", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit("PreviewCard:click");
    });
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.cardImage, `${CDN_URL}${value}`);
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set disabled(value: boolean) {
    this.cardButton.disabled = value;
    this.cardButton.classList.toggle('button_disabled', value);
  }
}