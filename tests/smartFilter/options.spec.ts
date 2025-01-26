import { expect } from "@playwright/test";
import { Given, Scenario, Then, When } from "../common/ghkerkin";

Scenario(
  `When text is entered into the filter bar all options are shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('text is entered', async () => {
      await enterAnItemInSearchBox('G');
    });

    await Then('all matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`all-options-shown.png`);
    });
  }
);


Scenario(
  `When text is entered into the filter bar that matches, only matches are shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('text is entered', async () => {
      await enterAnItemInSearchBox('GBP');
    });

    await Then('only matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`matching-options-shown.png`);
    });
  }
);

Scenario(
  `When numbers are entered into the filter bar that matches, only numeric matches are shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('a number is entered', async () => {
      await enterAnItemInSearchBox('0.5');
    });

    await Then('only numeric matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`numeric-matching-options-shown.png`);
    });
  }
);

Scenario(
  `When dates are entered into the filter bar that matches, only dates matches are shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('a date is entered', async () => {
      await enterAnItemInSearchBox('2024-05-10');
    });

    await Then('only date matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`date-matching-options-shown.png`);
    });
  }
);

Scenario(
  `When a range is entered into the filter bar that matches, only a mathcing range is shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('a range is entered', async () => {
      await enterAnItemInSearchBox('0.5 to 0.8');
    });

    await Then('only numeric matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`matching-range-options-shown.png`);
    });
  }
);

Scenario(
  `When a range with no space is entered into the filter bar that matches, only a mathcing range is shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('a range is entered', async () => {
      await enterAnItemInSearchBox('0.5to0.8');
    });

    await Then('only numeric matching options are shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`matching-range-options-shown.png`);
    });
  }
);

Scenario(
  `When field is entered into the filter bar only the field is shown`,
  async ({
    smartFilterPage: {
      searchBox,
      dropDownBar,
      use,
      enterAnItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
      await searchBox.click();
    });

    await When('field is entered', async () => {
      await enterAnItemInSearchBox('maturityDate');
    });

    await Then('the field option is shown', async () => {
      await expect(dropDownBar).toHaveScreenshot(`field-option-is-shown.png`);
    });
  }
);