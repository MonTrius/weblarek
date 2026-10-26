import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IModal } from "../../types";

export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement;
  protected modalButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(".modal__content", this.container);
    this.modalButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);

    this.modalButton.addEventListener('click', () => {
      this.modalClose();
      this.events.emit("modal:close");
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.modalClose();
        this.events.emit("modal:close");
      }
    });
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  modalOpen(): void {
    this.container.classList.add("modal_active");
  }

  modalClose(): void {
    this.container.classList.remove("modal_active");
  }
}
