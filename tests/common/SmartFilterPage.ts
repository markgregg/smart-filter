import { SortDirection } from "@/types";
import { Locator, Page } from "@playwright/test"

export interface SmartFilterPage {
  readonly filterBar: Locator,
  readonly innerFilterBar: Locator,

  readonly dropDownBar: Locator,

  readonly suggestions: Locator,

  readonly expandIcon: Locator,
  readonly clearIcon: Locator,
  readonly lockIcon: Locator,

  readonly sortSelectionButton: Locator,
  readonly fieldSelectionButton: Locator,

  readonly searchBox: Locator;

  readonly agGrid: Locator;

  readonly sortPill: Locator;

  use: (example: string) => void;
  pause: (milliseconds: number) => void;

  enterAnItemInSearchBox: (text: string) => void;
  enterAndSelectItemInSearchBox: (text: string) => void;
  hoverOverPill: (index: number) => void;
  clickPill: (index: number) => void;
  dragPillTo: (index: number, target: number) => void;

  selectSortSuggestion: (field: string, direction: SortDirection) => void;
  selectFieldSuggestion: (field: string) => void;
  selectOperatorBarItemSuggestion: (option: string) => void;
  selectHintGroup: (group: string) => void;
  selectHintItem: (item: string, index: number) => void;

  clickTextDisplay: () => void;
  clickBooleanToggle: () => void;
  updateTextValue: (text: string) => void;
  updateNumericValue: (value: number) => void;
  updateDateValue: (text: string) => void;
  updateLookupValue: (pillIndex: number, text: string) => void;
  clickClose: () => void;
  clickAccept: () => void;
  getDateEditorValue: () => Promise<string>;

  clickSort: () => void;
  sortOptions: () => Promise<Locator>;
  moveSortItemUp: (field: string) => void;
  moveSortItemDown: (field: string) => void;
  dragSortItemTo: (field: string, toField: string) => void;
  clickSortItemDirection: (field: string, direction: SortDirection) => void;

  deleteArrayItem: (item: string) => void;
  selectArrayItem: (item: string) => void;
}

export const createSmartFilterPage = (page: Page): SmartFilterPage => {
  const filterBar = page.locator('#sf-filter-bar');
  const innerFilterBar = page.locator('#sf-inner-filter-bar');

  const dropDownBar = page.locator('#sf-drop-down');
  const suggestions = page.locator('#sf-suggestions');

  const expandIcon = page.locator('#sf-expand-icon');
  const clearIcon = page.locator('#sf-clear-icon');
  const lockIcon = page.locator('#sf-lock-icon');
  const sortSelectionButton = page.locator('#sf-sort-selection-button');
  const fieldSelectionButton = page.locator('#sf-filter-selection-button');

  const searchBox = page.locator('#sf-search-box');

  const agGrid = page.locator('#sf-ag-grid');

  const sortPill = page.locator('#sf-sort-pill');

  return {
    filterBar,
    innerFilterBar,
    dropDownBar,
    suggestions,
    expandIcon,
    clearIcon,
    lockIcon,
    sortSelectionButton,
    fieldSelectionButton,
    searchBox,
    agGrid,
    sortPill,

    use: async (testPage: string) => await page.goto(`/${testPage}`),

    pause: async (milliseconds: number) => await page.waitForTimeout(milliseconds),

    enterAnItemInSearchBox: async (text: string) => {
      await searchBox.scrollIntoViewIfNeeded();
      await searchBox.click();
      await searchBox.fill(text);
      await page.waitForTimeout(50);
    },

    enterAndSelectItemInSearchBox: async (text: string) => {
      await searchBox.scrollIntoViewIfNeeded();
      await searchBox.click();
      await searchBox.fill(text);
      await page.waitForTimeout(50);
      await searchBox.press('Enter');
    },

    hoverOverPill: async (index: number) => {
      const pill = await page.locator(`#sf-pill-content-${index}`);
      if (!pill) {
        throw Error(`pill @ ${index} cannot be found`);
      }
      await pill.hover();
    },

    clickPill: async (index: number) => {
      const pill = await page.locator(`#sf-pill-content-${index}`);
      if (!pill) {
        throw Error(`pill @ ${index} cannot be found`);
      }
      await pill.click();
    },

    dragPillTo: async (index: number, target: number) => {
      const pill = await page.locator(`#sf-pill-content-${index}`);
      if (!pill) {
        throw Error(`pill @ ${index} cannot be found`);
      }
      const targetPill = await page.locator(`#sf-pill-content-${target}`);
      if (!targetPill) {
        throw Error(`pill @ ${target} cannot be found`);
      }
      await pill.dragTo(targetPill);
    },

    /* sugestions start */
    selectSortSuggestion: async (field: string, direction: SortDirection) => {
      const sortOpt = await page.locator(`#sf-${field}-${direction}-opt`);
      if (!sortOpt) {
        throw Error(`sort for ${field} cannot be found`);
      }
      await sortOpt.click();
    },

    selectFieldSuggestion: async (field: string) => {
      await fieldSelectionButton.hover();
      const fieldOpt = await page.locator(`#sf-${field}-opt`);
      if (!fieldOpt) {
        throw Error(`${field} option cannot be found`);
      }
      await fieldOpt.click();
    },

    selectOperatorBarItemSuggestion: async (option: string) => {
      const operator = await page.locator(`#sf-${option}-operator`);
      if (!operator) {
        throw Error(`${option} cannot be found`);
      }
      await operator.click();
    },

    selectHintGroup: async (group: string) => {
      const hintGroup = await page.locator(`#sf-${group}-group`);
      if (!hintGroup) {
        throw Error(`${group} cannot be found`);
      }
      await hintGroup.click();
    },

    selectHintItem: async (group: string, index: number) => {
      const hints = await page.$$(`#sf-${group}-item`);
      if (index > hints.length) {
        throw Error(`${index} higher than number of hints (${hints.length})`);
      }
      await hints[index].click();
    },
    /* sugestions end */

    /* editing */
    clickTextDisplay: async () => {
      const textDisplay = await page.locator('#sf-text-display');
      if (!textDisplay) {
        throw Error('textDisplay cannot be found');
      }
      await textDisplay.click();
    },

    clickBooleanToggle: async () => {
      const booleanToggle = await page.locator('#sf-boolean-toggle');
      if (!booleanToggle) {
        throw Error('booleanToggle cannot be found');
      }
      await booleanToggle.click();
    },

    updateTextValue: async (text: string) => {
      const texteditor = await page.locator('#sf-text-editor');
      if (!texteditor) {
        throw Error('text editor cannot be found');
      }
      await texteditor.fill(text);
      await texteditor.press('Enter');
      await page.waitForTimeout(50);
    },

    updateNumericValue: async (value: number) => {
      const numberEditor = await page.locator('#sf-number-editor');
      if (!numberEditor) {
        throw Error('number editor cannot be found');
      }
      await numberEditor.fill(value + '');
      await numberEditor.press('Enter');
      await page.waitForTimeout(50);
    },

    updateDateValue: async (date: string) => {
      const dateEditor = await page.locator('#sf-date-editor');
      if (!dateEditor) {
        throw Error('date editor cannot be found');
      }
      await dateEditor.fill(date);
      await dateEditor.press('Enter');
      await page.waitForTimeout(50);
    },

    updateLookupValue: async (pillIndex: number, text: string) => {
      const pill = await page.locator(`#sf-pill-content-${pillIndex}`);
      if (!pill) {
        throw Error(`pill @ ${pillIndex} cannot be found`);
      }
      const lookupEditor = await pill.locator('#sf-search-box');

      if (!lookupEditor) {
        throw Error('lookup editor cannot be found');
      }
      await lookupEditor.fill(text);
      await page.waitForTimeout(50);
      await lookupEditor.press('Enter');
    },

    clickClose: async () => {
      const close = await page.locator(`#sf-editor-close`);
      if (!close) {
        throw Error('close cannot be found');
      }
      await close.click();
    },

    clickAccept: async () => {
      const accept = await page.locator(`#sf-editor-accept`);
      if (!accept) {
        throw Error('accept cannot be found');
      }
      await accept.click();
    },

    getDateEditorValue: async (): Promise<string> => {
      const dateEditor = await page.locator(`#sf-date-editor`);
      if (!dateEditor) {
        throw Error('dateEditor cannot be found');
      }
      return await dateEditor.inputValue();
    },
    /* End editing */

    /* sorting */
    clickSort: async () => {
      const sortPill = await page.locator(`#sf-sort-pill`);
      if (!sortPill) {
        throw Error('sort cannot be found');
      }
      await sortPill.click();
    },

    sortOptions: async (): Promise<Locator> => {
      const sortOptions = await page.locator(`#sf-drop-down`);
      if (!sortOptions) {
        throw Error('sort options cannot be found');
      }
      return sortOptions;
    },

    moveSortItemUp: async (field: string) => {
      const sortButton = await page.locator(`#sf-${field}-move-up`);
      if (!sortButton) {
        throw Error('sort button cannot be found');
      }
      await sortButton.click();
    },

    moveSortItemDown: async (field: string) => {
      const sortButton = await page.locator(`#sf-${field}-move-down`);
      if (!sortButton) {
        throw Error('sort button cannot be found');
      }
      await sortButton.click();
    },

    dragSortItemTo: async (field: string, toField: string) => {
      const sortItem = await page.locator(`#sf-sort-item-${field}`);
      if (!sortItem) {
        throw Error('sort item cannot be found');
      }
      const toSortItem = await page.locator(`#sf-sort-item-${toField}`);
      if (!toSortItem) {
        throw Error('sort item cannot be found');
      }
      await sortItem.dragTo(toSortItem);
    },

    clickSortItemDirection: async (field: string, direction: SortDirection) => {
      const sortButton = await page.locator(`#sf-${field}-${direction}-opt`);
      if (!sortButton) {
        throw Error('sort button cannot be found');
      }
      await sortButton.click();
    },
    /* End sorting */

    /* Array */
    deleteArrayItem: async (item: string) => {
      const deleteButton = await page.locator(`#sf-delete-arr-${item}`);
      if (!deleteButton) {
        throw Error('delete button cannot be found');
      }
      await deleteButton.click();
    },

    selectArrayItem: async (item: string) => {
      const arrayItem = await page.locator(`#sf-arr-item-${item}`);
      if (!arrayItem) {
        throw Error('array item cannot be found');
      }
      await arrayItem.click();
    },
    /* End Array */
  }
}