import { IBuyer, TPayment, BuyerValidation } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null;
  protected address: string;
  protected phone: string;
  protected email: string;

  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }

    this.events.emit("buyer:change");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearBuyerData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";

    this.events.emit("buyer:change");
  }

  isValidData(): BuyerValidation {
    const errors: BuyerValidation = {};

    if (!this.payment) {
      errors.payment = "Не выбран метод оплаты";
    }
    if (!this.address) {
      errors.address = "Не указан адрес доставки";
    }
    if (!this.phone) {
      errors.phone = "Не указан телефон";
    }
    if (!this.email) {
      errors.email = "Не указана электронная почта";
    }

    return errors;
  }
}