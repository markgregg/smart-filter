import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

Scenario(
  `Sort items are shown in the dropdown`,
  async ({
    smartFilterPage: {
      dropDownBar,
      searchBox,
      sortPill,
      sortSelectionButton,
      use,
      pause,
      selectSortSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('sort items are entered', async () => {
      await sortSelectionButton.hover();
      await selectSortSuggestion('side', 'asc');
      await selectSortSuggestion('currency', 'desc');
      await selectSortSuggestion('isin', 'asc');
      await pause(50);
    });

    await And('the sort pill is selectged', async () => {
      await sortPill.click();
      await pause(50);
    });

    await Then('the sort items are shown in the dropdown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`sort-items-are-shown.png`);
    });
  }
);

Scenario(
  `Sort pills can be moved up`,
  async ({
    smartFilterPage: {
      dropDownBar,
      searchBox,
      sortPill,
      sortSelectionButton,
      use,
      pause,
      selectSortSuggestion,
      moveSortItemUp,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('sort items are entered', async () => {
      await sortSelectionButton.hover();
      await selectSortSuggestion('side', 'asc');
      await selectSortSuggestion('currency', 'desc');
      await selectSortSuggestion('isin', 'asc');
      await pause(50);
    });

    await And('the sort pill is selected', async () => {
      await sortPill.click();
      await pause(50);
    });

    await And('the the currency up button is clicked', async () => {
      await moveSortItemUp('currency');
      await pause(50);
    });

    await Then('the sort items are reordered', async () => {
      await expect(dropDownBar).toHaveScreenshot(`sort-items-are-reordered.png`);
    });
  }
);

Scenario(
  `Sort pills can be moved down`,
  async ({
    smartFilterPage: {
      dropDownBar,
      searchBox,
      sortPill,
      sortSelectionButton,
      use,
      pause,
      selectSortSuggestion,
      moveSortItemDown,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('sort items are entered', async () => {
      await sortSelectionButton.hover();
      await selectSortSuggestion('side', 'asc');
      await selectSortSuggestion('currency', 'desc');
      await selectSortSuggestion('isin', 'asc');
      await pause(50);
    });

    await And('the sort pill is selected', async () => {
      await sortPill.click();
      await pause(50);
    });

    await And('the the currency down button is clicked', async () => {
      await moveSortItemDown('currency');
      await pause(50);
    });

    await Then('the sort items are reordered', async () => {
      await expect(dropDownBar).toHaveScreenshot(`sort-items-are-reordered-again.png`);
    });
  }
);

Scenario(
  `Sort pills can be dragged up`,
  async ({
    smartFilterPage: {
      dropDownBar,
      searchBox,
      sortPill,
      sortSelectionButton,
      use,
      pause,
      selectSortSuggestion,
      dragSortItemTo,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('sort items are entered', async () => {
      await sortSelectionButton.hover();
      await selectSortSuggestion('side', 'asc');
      await selectSortSuggestion('currency', 'desc');
      await selectSortSuggestion('isin', 'asc');
      await pause(50);
    });

    await And('the sort pill is selected', async () => {
      await sortPill.click();
      await pause(50);
    });

    await And('the the currency item is dragged up to side', async () => {
      await dragSortItemTo('currency', 'side');
      await pause(50);
    });

    await Then('the sort item has been dragged up', async () => {
      await expect(dropDownBar).toHaveScreenshot(`sort-item-dragged-up.png`);
    });
  }
);

Scenario(
  `Sort pills can be dragged down`,
  async ({
    smartFilterPage: {
      dropDownBar,
      searchBox,
      sortPill,
      sortSelectionButton,
      use,
      pause,
      selectSortSuggestion,
      dragSortItemTo,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('sort items are entered', async () => {
      await sortSelectionButton.hover();
      await selectSortSuggestion('side', 'asc');
      await selectSortSuggestion('currency', 'desc');
      await selectSortSuggestion('isin', 'asc');
      await pause(50);
    });

    await And('the sort pill is selected', async () => {
      await sortPill.click();
      await pause(50);
    });

    await And('the the currency item is dragged down to isin', async () => {
      await dragSortItemTo('currency', 'isin');
      await pause(50);
    });

    await Then('the sort item has been dragged-down', async () => {
      await expect(dropDownBar).toHaveScreenshot(`sort-item-dragged-down.png`);
    });
  }
);