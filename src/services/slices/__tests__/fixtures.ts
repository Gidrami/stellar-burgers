import { TIngredient } from '@utils-types';

export const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 165,
  price: 100,
  image: '/bun.png',
  image_large: '/bun-large.png',
  image_mobile: '/bun-mobile.png'
};

export const filling: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  price: 50
};
