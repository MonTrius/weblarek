import { Form } from "../functionality/abstract/Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IContacts } from "../../types";

export class Contacts extends Form<IContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    
    this.emailElement = ensureElement<HTMLInputElement>("input[name='email']", this.container);
    this.phoneElement = ensureElement<HTMLInputElement>("input[name='phone']", this.container);

    this.emailElement.addEventListener('input', () => {
      this.inputChange('email', this.emailElement.value);
    });

    this.phoneElement.addEventListener('input', () => {
      this.inputChange('phone', this.phoneElement.value);
    });
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }
}