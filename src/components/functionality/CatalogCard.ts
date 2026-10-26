import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICard } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CatalogCard extends Card<ICard> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);

    this.container.addEventListener('click', () => {
      this.events.emit("CatalogCard:click", {id: this.cardId});
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
}