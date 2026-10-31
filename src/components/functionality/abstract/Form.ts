import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IForm } from "../../../types";

export abstract class Form<T extends IForm> extends Component<T> {
  protected formButton: HTMLButtonElement;
  protected formError: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.formButton = ensureElement<HTMLButtonElement>(".modal__actions button", this.container);
    this.formError = ensureElement<HTMLElement>(".form__errors", this.container);

    this.container.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      const formName = this.container.getAttribute("name");
      this.events.emit(`${formName}:submit`);
    });
  }

  protected inputChange(field: keyof T, value: string) {
    this.events.emit("input:change", {field, value});
  }

  set valid(value: boolean) {
    this.formButton.disabled = value;
  }

  set errors(value: string) {
    this.formError.textContent = value;
  }
}