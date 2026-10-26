import { Component } from "../base/Component";
import { IGallery } from "../../types";

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  setCatalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}