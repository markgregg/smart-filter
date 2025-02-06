import { expect } from '@playwright/test';
import { And, Given, Scenario, Then, When } from '../common/ghkerkin';

Scenario(
  `Editing an array shows all elements in the array`,
  async ({
    smartFilterPage: {
      dropDownBar,
      use,
      enterAndSelectItemInSearchBox,
      clickTextDisplay,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('an array in entered', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('XS2');
    });

    await And('the pill is selected for edit', async () => {
      await clickTextDisplay();
    });

    await Then('the array is shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`array-is-shown.png`);
    });
  },
);

Scenario(
  `New elements can be add to the array`,
  async ({
    smartFilterPage: {
      dropDownBar,
      use,
      enterAndSelectItemInSearchBox,
      updateLookupValue,
      clickAccept,
      clickTextDisplay,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('an array is entered', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('XS2');
    });

    await And('the pill is selected for edit', async () => {
      await clickTextDisplay();
    });

    await And('a new item is add', async () => {
      await updateLookupValue(0, 'FR0013405222');
      await clickAccept();
    });

    await Then('new items are shown in the array', async () => {
      await expect(dropDownBar).toHaveScreenshot(
        `additional-items-are-shown.png`,
      );
    });
  },
);

Scenario(
  `Elements can be removed from the array`,
  async ({
    smartFilterPage: {
      dropDownBar,
      use,
      enterAndSelectItemInSearchBox,
      deleteArrayItem,
      clickTextDisplay,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('an array is entered', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('XS1907155235');
      await enterAndSelectItemInSearchBox('FR0013405222');
    });

    await And('the pill is selected for edit', async () => {
      await clickTextDisplay();
    });

    await And('an element is removed', async () => {
      await deleteArrayItem('FR0013405222');
    });

    await Then('the item is removed from the array', async () => {
      await expect(dropDownBar).toHaveScreenshot(
        `delected-items-are-removed.png`,
      );
    });
  },
);

Scenario(
  `Array items can be edited`,
  async ({
    smartFilterPage: {
      dropDownBar,
      use,
      enterAndSelectItemInSearchBox,
      selectArrayItem,
      clickTextDisplay,
      updateLookupValue,
      clickAccept,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('an array is entered', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('FR0013405222');
    });

    await And('the pill is selected for edit', async () => {
      await clickTextDisplay();
    });

    await And('an item is updated in the array', async () => {
      await selectArrayItem('FR0013405222');
      await updateLookupValue(0, 'XS1907155235');
      await clickAccept();
    });

    await Then('the item is updated in the array', async () => {
      await expect(dropDownBar).toHaveScreenshot(`the-item-is-updated.png`);
    });
  },
);
