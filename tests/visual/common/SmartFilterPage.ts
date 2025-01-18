import { SortDirection } from "@/types";
import { Locator, Page } from "@playwright/test"

export interface SmartFilterPage {
  readonly filterBar: Locator,
  readonly innerFilterBar: Locator,

  readonly suggestions: Locator,

  readonly expandIcon: Locator,
  readonly clearIcon: Locator,

  readonly sortSelectionbutton: Locator,
  readonly fieldSelectionButton: Locator,

  readonly searchBox: Locator;

  use: (example: string) => void;
  pause: (milliseconds: number) => void;
  enterAndSelectItemInSearchBox: (text: string) => void;
  selectSortSuggestion: (field: string, direction: SortDirection) => void;
  selectFieldSuggestion: (field: string) => void;
  selectOperatorBarItemSuggestion: (option: string) => void;
  selectPill: (index: number) => void;
  selectHintGroup: (group: string) => void;
  selectHintItem: (item: string, index: number) => void;
}

export const createSmartFilterPage = (page: Page): SmartFilterPage => {
  const filterBar = page.locator('#sf-filter-bar');
  const innerFilterBar = page.locator('#sf-inner-filter-bar');

  const suggestions = page.locator('#sf-suggestions');

  const expandIcon = page.locator('#sf-expand-icon');
  const clearIcon = page.locator('#sf-clear-icon');

  const sortSelectionbutton = page.locator('#sf-sort-selection-button');
  const fieldSelectionButton = page.locator('#sf-filter-selection-button');

  const searchBox = page.locator('#sf-search-box');

  return {
    filterBar,
    innerFilterBar,
    suggestions,
    expandIcon,
    clearIcon,
    sortSelectionbutton,
    fieldSelectionButton,
    searchBox,

    use: async (example: string) => await page.goto(`/${example}`),

    pause: async (milliseconds: number) => await page.waitForTimeout(milliseconds),

    enterAndSelectItemInSearchBox: async (text: string) => {
      await searchBox.click();
      await searchBox.fill(text);
      await searchBox.press('Enter');
    },

    /* sugestions start */
    selectSortSuggestion: async (field: string, direction: SortDirection) => {
      await sortSelectionbutton.hover();
      const sortOpt = await page.locator(`#sf-${field}-${direction}-opt`);
      if (!sortOpt) {
        throw Error(`${sortOpt} cannot be found`);
      }
      await sortOpt.click();
    },

    selectFieldSuggestion: async (field: string) => {
      await fieldSelectionButton.hover();
      const fieldOpt = page.locator(`#sf-${field}-opt`);
      if (!fieldOpt) {
        throw Error(`${fieldOpt} cannot be found`);
      }
      await fieldOpt.click();
    },

    selectOperatorBarItemSuggestion: async (option: string) => {
      const operator = await page.locator(`#sf-${option}-operator`);
      if (!operator) {
        throw Error(`${operator} cannot be found`);
      }
      operator.click();
    },

    selectPill: async (index: number) => {
      const pills = await page.$$('#sf-pill-content');
      if (index > pills.length) {
        throw Error(`${index} higher than number of pills (${pills.length})`);
      }
      pills[index].click();
    },

    selectHintGroup: async (group: string) => {
      const hintGroup = await page.locator(`#sf-${group}-group`);
      if (!hintGroup) {
        throw Error(`${hintGroup} cannot be found`);
      }
      hintGroup.click();
    },

    selectHintItem: async (group: string, index: number) => {
      const hints = await page.$$(`#sf-${group}-item`);
      if (index > hints.length) {
        throw Error(`${index} higher than number of hints (${hints.length})`);
      }
      hints[index].click();
    },
    /* sugestions end */
  }
}