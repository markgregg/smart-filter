import { expect } from "@playwright/test";
import { Given, Scenario, Then, When } from "../common/ghkerkin";

Scenario(
  'Dropdown suggestions are shown when mouse over',
  async ({
    smartFilterPage: {
      filterBar,
      suggestions,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid?noIcons');
    });

    await When('the mouse is over the filterbar', async () => {
      await filterBar.hover();
    });

    await Then('the suggestions are shown as in the screenshot', async () => {
      await expect(suggestions).toHaveScreenshot('suggestions-shown-on-hover.png');
    })
  }
)

Scenario(
  'A pill is created when a field option is clicked',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      selectFieldSuggestion,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();

    });

    await When('a field option is selected', async () => {
      await selectFieldSuggestion('maturityDate');
    });

    await Then('the field pill is shown in the filterbar', async () => {
      await expect(filterBar).toHaveScreenshot('filter-bar-has-field-option.png');
    })
  }
)

Scenario(
  'A pill is created when a sort option is clicked',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      selectSortSuggestion,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();

    });

    await When('a field option is selected', async () => {
      await selectSortSuggestion('maturityDate', 'desc');
    });

    await Then('the sort pill is shown in the filterbar', async () => {
      await expect(filterBar).toHaveScreenshot('filter-bar-has-sort-option.png');
    })
  }
)