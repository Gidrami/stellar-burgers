import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  moveIngredient,
  removeIngredient,
  TConstructorState
} from '../constructor';
import { bun, filling } from './fixtures';

const reducer = constructorSlice.reducer;
const emptyState: TConstructorState = { bun: null, ingredients: [] };
const first = { ...filling, id: 'first' };
const second = { ...filling, id: 'second' };
const populated: TConstructorState = {
  bun: { ...bun, id: 'bun' },
  ingredients: [first, second]
};

describe('Редьюсер burgerConstructor', () => {
  test('Возвращает начальное состояние для undefined и неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('Добавляет булку', () => {
    const action = addIngredient(bun);
    const state = reducer(emptyState, action);
    expect(state).toEqual({
      bun: { ...bun, id: expect.any(String) },
      ingredients: []
    });
    expect(state.bun?.id).toBeTruthy();
  });

  test('Добавляет начинку', () => {
    const action = addIngredient(filling);
    const state = reducer(emptyState, action);
    expect(state).toEqual({
      bun: null,
      ingredients: [{ ...filling, id: expect.any(String) }]
    });
    expect(state.ingredients[0].id).toBeTruthy();
  });

  test('Генерирует разные id при повторном добавлении одной начинки', () => {
    const state = reducer(
      reducer(emptyState, addIngredient(filling)),
      addIngredient(filling)
    );

    expect(state.ingredients).toEqual([
      { ...filling, id: expect.any(String) },
      { ...filling, id: expect.any(String) }
    ]);
    expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
  });

  test('Удаляет начинку по id', () => {
    expect(reducer(populated, removeIngredient(first.id))).toEqual({
      bun: populated.bun,
      ingredients: [second]
    });
  });

  test('Перемещает начинку вверх', () => {
    const action = moveIngredient({ index: 1, direction: 'up' });
    expect(reducer(populated, action)).toEqual({
      bun: populated.bun,
      ingredients: [second, first]
    });
  });

  test('Перемещает начинку вниз', () => {
    const action = moveIngredient({ index: 0, direction: 'down' });
    expect(reducer(populated, action)).toEqual({
      bun: populated.bun,
      ingredients: [second, first]
    });
  });

  test('Очищает конструктор', () => {
    expect(reducer(populated, clearConstructor())).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
