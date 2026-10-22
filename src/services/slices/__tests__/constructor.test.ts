import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  initialState,
  moveIngredient,
  removeIngredient,
  TConstructorState
} from '../constructor';
import { bun, filling } from './fixtures';

const reducer = constructorSlice.reducer;
const first = { ...filling, id: 'first' };
const second = { ...filling, id: 'second' };
const populated: TConstructorState = {
  bun: { ...bun, id: 'bun' },
  ingredients: [first, second]
};

describe('Редьюсер burgerConstructor', () => {
  test('Возвращает начальное состояние для undefined и неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('Добавляет булку', () => {
    const action = addIngredient(bun);
    expect(reducer(initialState, action)).toEqual({
      bun: action.payload,
      ingredients: []
    });
  });

  test('Добавляет начинку', () => {
    const action = addIngredient(filling);
    expect(reducer(initialState, action)).toEqual({
      bun: null,
      ingredients: [action.payload]
    });
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
    expect(reducer(populated, clearConstructor())).toEqual(initialState);
  });
});
