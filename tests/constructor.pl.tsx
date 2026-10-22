import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, Locator, Page } from '@playwright/test';
import { TIngredient } from '../src/utils/types';
import userResponse from './fixtures/user.json';
import orderResponse from './fixtures/order.json';

const harPath = path.join(__dirname, 'fixtures', 'ingredients.har');
const har = JSON.parse(readFileSync(harPath, 'utf8'));
const { data: ingredients }: { data: TIngredient[] } = JSON.parse(
  har.log.entries[0].response.content.text
);
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

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(harPath, { url: '**/api/ingredients' });
});

test('Добавление ингредиента в конструктор', async ({ page }) => {
  await page.goto('/');
  await addIngredient(page, filling);
  await expect(
    constructor(page).getByText(filling.name, { exact: true })
  ).toBeVisible();
  await expect(constructor(page).getByRole('listitem')).toHaveCount(1);
});

test('Открытие окна ингредиента и закрытие крестиком', async ({ page }) => {
  await page.goto('/');
  await ingredientCard(page, bun).getByRole('link').click();
  const modal = page.locator('#modals');
  await expect(modal.getByText('Детали ингредиента')).toBeVisible();
  await expect(
    modal.getByRole('heading', { name: bun.name, exact: true })
  ).toBeVisible();

  await modal.getByRole('button').click();
  await expect(modal).toBeEmpty();
});

test('Оформление заказа и очистка конструктора', async ({
  context,
  page,
  baseURL
}) => {
  await context.addCookies([
    { name: 'accessToken', value: 'Bearer mock-access-token', url: baseURL! }
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
  await page.route('**/api/auth/user', (route) =>
    route.fulfill({ json: userResponse })
  );
  await page.route('**/api/orders', (route) =>
    route.fulfill({ json: orderResponse })
  );

  await page.goto('/');
  await expect(
    page.getByRole('link', { name: userResponse.user.name })
  ).toBeVisible();
  await addIngredient(page, bun);
  await addIngredient(page, filling);
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  const modal = page.locator('#modals');
  await expect(
    modal.getByRole('heading', {
      name: String(orderResponse.order.number),
      exact: true
    })
  ).toBeVisible();
  await expectEmptyConstructor(constructor(page));

  await modal.getByRole('button').click();
  await expect(modal).toBeEmpty();
});
