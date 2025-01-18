import { SortDirection } from "@/types";
import { Locator, Page } from "@playwright/test"

export interface SmartFilterPage {
  readonly filterBar: Locator,

  readonly suggestions: Locator,

  readonly expandIcon: Locator,
  readonly clearIcon: Locator,

  readonly sortSelectionbutton: Locator,
  readonly fieldSelectionButton: Locator,

  readonly searchBox: Locator;

  use: (example: string) => void;
  enterAndSelectItemInSearchBox: (text: string) => void;
  selectSortSuggestion: (field: string, direction: SortDirection) => void;
  selectFieldSuggestion: (field: string) => void;
}

export const createSmartFilterPage = (page: Page): SmartFilterPage => {
  const filterBar = page.locator('#sf-filter-bar');

  const suggestions = page.locator('#sf-suggestions');

  const expandIcon = page.locator('#sf-expand-icon');
  const clearIcon = page.locator('#sf-clear-icon');

  const sortSelectionbutton = page.locator('#sf-sort-selection-button');
  const fieldSelectionButton = page.locator('#sf-filter-selection-button');

  const searchBox = page.locator('#sf-search-box');

  return {
    filterBar,
    suggestions,
    expandIcon,
    clearIcon,
    sortSelectionbutton,
    fieldSelectionButton,
    searchBox,

    use: async (example: string) => await page.goto(`/${example}`),

    enterAndSelectItemInSearchBox: async (text: string) => {
      await searchBox.click();
      await searchBox.fill(text);
      await searchBox.press('Enter');
    },

    selectSortSuggestion: async (field: string, direction: SortDirection) => {
      await sortSelectionbutton.hover();
      await page.locator(`#sf-${field}-${direction}-opt`).click();
    },

    selectFieldSuggestion: async (field: string) => {
      await fieldSelectionButton.hover();
      await page.locator(`#sf-${field}-opt`).click();
    }


  }
}