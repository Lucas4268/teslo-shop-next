import { ISizes } from "./products";

export interface ICartProduct {
  _id: string;
  image: string;
  price: number;
  size?: ISizes;
  slug: string;
  title: string;
  gender: 'men'|'women'|'kid'|'unisex',
  quantity: number
}
