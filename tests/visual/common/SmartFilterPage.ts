import { Locator, Page } from "@playwright/test"

export interface SmartFilterPage {
  readonly filterBar: Locator,

  use: (example: string) => void;
}

export const createSmartFilterPage = (page: Page): SmartFilterPage => ({
  filterBar: page.locator('#filter-bar'),
  use: async (example: string) => await page.goto(`/${example}`),
})