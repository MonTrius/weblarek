import { Card } from "../functionality/abstract/Card";
import { ensureElement } from "../../utils/utils";
import { ICardCatalog, ICardACtions } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CatalogCard extends Card<ICardCatalog> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardACtions) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>(".card__category", this.container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", this.container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
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
}