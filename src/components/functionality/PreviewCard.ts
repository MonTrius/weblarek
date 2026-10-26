import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICardPreview } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class PreviewCard extends Card<ICardPreview> {
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
      this.events.emit("PreviewCard:click", {id: this.cardId});
    });
  }

  setCategory(value: string) {
    this.cardCategory.textContent = value;
    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key == value
      );
    }
  }

  setImageCard(value: string) {
    this.cardImage.src = `${CDN_URL}${value}`;
    this.setImage(this.cardImage, value, this.cardTitle.textContent || "Изображение товара");
  }

  setDescription(value: string) {
    this.cardDescription.textContent = value;
  }

  setButtonText(value: string) {
    this.cardButton.textContent = value;
  }
}