import { Locator, Page } from '@playwright/test';

export interface SmartFilterPage {
  readonly filterBar: Locator;
  readonly innerFilterBar: Locator;

  readonly dropDownBar: Locator;

  readonly suggestions: Locator;

  readonly expandIcon: Locator;
  readonly clearIcon: Locator;
  readonly lockIcon: Locator;

  readonly fieldSelectionButton: Locator;

  readonly searchBox: Locator;

  readonly agGrid: Locator;

  use: (example: string, params?: string) => void;

  enterAnItemInSearchBox: (text: string) => void;
  enterAndSelectItemInSearchBox: (text: string, waitForText?: string) => void;
  hoverOverPill: (index: number) => void;
  clickPill: (
    index: number,
    options?: {
      button?: 'left' | 'right' | 'middle';
      modifiers?: Array<'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'>;
      position?: {
        x: number;
        y: number;
      };
    },
  ) => void;
  dragPillTo: (index: number, target: number) => void;

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

  deleteArrayItem: (item: string) => void;
  selectArrayItem: (item: string) => void;
  copyToClipBoard: () => void;
  pasteFromClipBoard: () => void;
  addTextToClipBoard: (text: string) => void;
}

export const createSmartFilterPage = (page: Page): SmartFilterPage => {
  const filterBar = page.locator('#sf-filter-bar');
  const innerFilterBar = page.locator('#sf-inner-filter-bar');

  const dropDownBar = page.locator('#sf-drop-down');
  const suggestions = page.locator('#sf-suggestions');

  const expandIcon = page.locator('#sf-expand-icon');
  const clearIcon = page.locator('#sf-clear-icon');
  const lockIcon = page.locator('#sf-lock-icon');
  const fieldSelectionButton = page.locator('#sf-filter-selection-button');

  const searchBox = page.locator('#sf-search-box');

  const agGrid = page.locator('#sf-ag-grid');

  const optionsList = page.locator('#sf-options-list');

  return {
    filterBar,
    innerFilterBar,
    dropDownBar,
    suggestions,
    expandIcon,
    clearIcon,
    lockIcon,
    fieldSelectionButton,
    searchBox,
    agGrid,

    use: async (testPage: string, params?: string) => {
      await page.goto(`/${testPage}?automation${params ? `&${params}` : ''}`);
    },

    enterAnItemInSearchBox: async (text: string) => {
      await searchBox.scrollIntoViewIfNeeded();
      await searchBox.click();
      await searchBox.fill(text);
      await optionsList.waitFor({ state: 'visible', timeout: 1000 });
    },

    enterAndSelectItemInSearchBox: async (
      text: string,
      waitForText?: string,
    ) => {
      await searchBox.scrollIntoViewIfNeeded();
      await searchBox.click();
      await searchBox.fill(text);
      await optionsList.waitFor({ state: 'visible', timeout: 1000 });
      if (waitForText) {
        const waitForItem = optionsList.getByText(waitForText);
        await waitForItem.waitFor({ state: 'visible', timeout: 1000 });
      }
      await searchBox.press('Enter');
    },

    hoverOverPill: async (index: number) => {
      const pill = page.locator(`#sf-pill-content-${index}`);
      await pill.hover();
    },

    clickPill: async (
      index: number,
      options?: {
        button?: 'left' | 'right' | 'middle';
        modifiers?: Array<
          'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'
        >;
        position?: {
          x: number;
          y: number;
        };
      },
    ) => {
      const pill = page.locator(`#sf-pill-content-${index}`);
      await pill.click(options);
    },

    dragPillTo: async (index: number, target: number) => {
      const pill = page.locator(`#sf-pill-content-${index}`);
      const targetPill = page.locator(`#sf-pill-content-${target}`);
      await pill.dragTo(targetPill);
    },

    selectFieldSuggestion: async (field: string) => {
      await fieldSelectionButton.hover();
      const fieldOpt = page.locator(`#sf-${field}-opt`);
      await fieldOpt.click();
    },

    selectOperatorBarItemSuggestion: async (option: string) => {
      const operator = page.locator(`#sf-${option}-operator`);
      await operator.click();
    },

    selectHintGroup: async (group: string) => {
      const hintGroup = page.locator(`#sf-${group}-group`);
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
      const textDisplay = page.locator('#sf-text-display');
      await textDisplay.click();
    },

    clickBooleanToggle: async () => {
      const booleanToggle = page.locator('#sf-boolean-toggle');
      await booleanToggle.click();
    },

    updateTextValue: async (text: string) => {
      const texteditor = page.locator('#sf-text-editor');
      await texteditor.fill(text);
      await texteditor.press('Enter');
    },

    updateNumericValue: async (value: number) => {
      const numberEditor = page.locator('#sf-number-editor');
      await numberEditor.fill(`${value}`);
      await numberEditor.press('Enter');
    },

    updateDateValue: async (date: string) => {
      const dateEditor = page.locator('#sf-date-editor');
      await dateEditor.fill(date);
      await dateEditor.press('Enter');
    },

    updateLookupValue: async (pillIndex: number, text: string) => {
      const pill = page.locator(`#sf-pill-content-${pillIndex}`);
      const lookupEditor = await pill.locator('#sf-search-box');
      await lookupEditor.fill(text);
      await optionsList.waitFor({ state: 'visible', timeout: 1000 });
      await lookupEditor.press('Enter');
    },

    clickClose: async () => {
      const close = page.locator(`#sf-editor-close`);
      await close.click();
    },

    clickAccept: async () => {
      const accept = page.locator(`#sf-editor-accept`);
      await accept.click();
    },

    getDateEditorValue: async (): Promise<string> => {
      const dateEditor = page.locator(`#sf-date-editor`);
      const dateValue = await dateEditor.inputValue();
      return dateValue;
    },
    /* End editing */

    /* Array */
    deleteArrayItem: async (item: string) => {
      const deleteButton = page.locator(`#sf-delete-arr-${item}`);
      await deleteButton.click();
    },

    selectArrayItem: async (item: string) => {
      const arrayItem = page.locator(`#sf-arr-item-${item}`);
      await arrayItem.click();
    },
    /* End Array */

    /* Copy/Paste */
    copyToClipBoard: async () => {
      await searchBox.press('Control+c');
    },
    pasteFromClipBoard: async () => {
      await searchBox.press('Control+v');
    },
    addTextToClipBoard: async (text: string) => {
      await page.evaluate(`navigator.clipboard.writeText("${text}")`);
    },
    /* End Copy Paste */
  };
};
