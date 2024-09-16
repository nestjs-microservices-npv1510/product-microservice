import { v4 as uuidV4 } from 'uuid';

interface IProduct {
  id?: string;
  name: string;
  price: number;
  available?: boolean;
  description?: string;
}

export class Product implements IProduct {
  public id: string;
  public name: string;
  public price: number;
  public available: boolean;
  public description: string;

  constructor(name, price, available, description) {
    this.id = uuidV4();

    this.name = name;
    this.price = price;
    this.available = available || false;
    this.description = description || '';
  }
}
