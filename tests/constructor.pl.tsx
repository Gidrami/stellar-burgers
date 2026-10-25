import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, Locator, Page } from '@playwright/test';
import { TIngredient, TOrder, TUser } from '../src/utils/types';

const ingredientsHarPath = path.join(__dirname, 'fixtures', 'ingredients.har');
const userHarPath = path.join(__dirname, 'fixtures', 'user.har');
const orderHarPath = path.join(__dirname, 'fixtures', 'order.har');

function readHarResponse<T>(harPath: string): T {
  const har = JSON.parse(readFileSync(harPath, 'utf8'));
  return JSON.parse(har.log.entries[0].response.content.text);
}

const { data: ingredients } = readHarResponse<{ data: TIngredient[] }>(
  ingredientsHarPath
);
const { user } = readHarResponse<{ user: TUser }>(userHarPath);
const { order } = readHarResponse<{ order: Pick<TOrder, 'number'> }>(orderHarPath);
const [bun, filling] = ingredients;

const ingredientCard = (page: Page, ingredient: TIngredient) =>
  page.getByRole('listitem').filter({
    has: page.getByRole('link', { name: ingredient.name })
  });

const constructor = (page: Page) =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ', exact: true })
  });

async function addIngredient(page: Page, ingredient: TIngredient) {
  await ingredientCard(page, ingredient)
    .getByRole('button', { name: 'Добавить', exact: true })
    .click();
}

async function expectEmptyConstructor(area: Locator) {
  await expect(area.getByText('Выберите булки', { exact: true })).toHaveCount(
    2
  );
  await expect(
    area.getByText('Выберите начинку', { exact: true })
  ).toBeVisible();
  await expect(area.getByRole('listitem')).toHaveCount(0);
}

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(ingredientsHarPath, { url: '**/api/ingredients' });
  });

  test('Добавление ингредиента в конструктор', async ({ page }) => {
    await page.goto('/');
    await addIngredient(page, filling);
    await expect(
      constructor(page).getByText(filling.name, { exact: true })
    ).toBeVisible();
    await expect(constructor(page).getByRole('listitem')).toHaveCount(1);
  });

  test.describe('Модальное окно ингредиента', () => {
    test('Открытие окна второго ингредиента и закрытие крестиком', async ({
      page
    }) => {
      await page.goto('/');
      await ingredientCard(page, filling).getByRole('link').click();
      const modal = page.locator('#modals');
      await expect(modal.getByText('Детали ингредиента')).toBeVisible();
      await expect(
        modal.getByRole('heading', { name: filling.name, exact: true })
      ).toBeVisible();

      await modal.getByRole('button').click();
      await expect(modal).toBeEmpty();
    });
  });

  test.describe('Оформление заказа', () => {
    test.beforeEach(async ({ context, page, baseURL }) => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'Bearer mock-access-token',
          url: baseURL!
        }
      ]);
      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      await page.routeFromHAR(userHarPath, { url: '**/api/auth/user' });
      await page.routeFromHAR(orderHarPath, { url: '**/api/orders' });
    });

    test('Показывает номер заказа и очищает конструктор', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('link', { name: user.name })).toBeVisible();
      await addIngredient(page, bun);
      await addIngredient(page, filling);
      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const modal = page.locator('#modals');
      await expect(
        modal.getByRole('heading', {
          name: String(order.number),
          exact: true
        })
      ).toBeVisible();
      await expectEmptyConstructor(constructor(page));

      await modal.getByRole('button').click();
      await expect(modal).toBeEmpty();
    });
  });
});
