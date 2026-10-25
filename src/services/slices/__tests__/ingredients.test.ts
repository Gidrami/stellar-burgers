import { fetchIngredients, ingredientsSlice } from '../ingredients';
import { bun, filling } from './fixtures';

const reducer = ingredientsSlice.reducer;
const ingredients = [bun, filling];

describe('Редьюсер ingredients', () => {
  test('Возвращает начальное состояние для undefined и неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });
  });

  test('pending включает загрузку и сбрасывает ошибку', () => {
    const state = { ingredients: [], loading: false, error: 'Ошибка' };
    expect(reducer(state, fetchIngredients.pending('request'))).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });

  test('fulfilled сохраняет ингредиенты и завершает загрузку', () => {
    const state = { ingredients: [], loading: true, error: null };
    const action = fetchIngredients.fulfilled(ingredients, 'request');
    expect(reducer(state, action)).toEqual({
      ingredients,
      loading: false,
      error: null
    });
  });

  test('rejected записывает ошибку и завершает загрузку', () => {
    const state = { ingredients: [], loading: true, error: null };
    const action = fetchIngredients.rejected(
      new Error('Нет соединения'),
      'request'
    );
    expect(reducer(state, action)).toEqual({
      ingredients: [],
      loading: false,
      error: 'Нет соединения'
    });
  });
});
