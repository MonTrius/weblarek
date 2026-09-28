import { IBuyer, TPayment } from "../../types";

export class Buyer {
  payment: TPayment;
  address: string;
  phone: string;
  email: string;

  constructor() {
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
  }

  isValidData(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

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