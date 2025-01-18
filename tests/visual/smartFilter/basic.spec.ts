import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";


Scenario(
  'All icons are shown when enabled',
  async ({
    smartFilterPage: {
      filterBar,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilter');
    });

    await Then('the Smart Filter mathces valid screenshot', async () => {
      await expect(filterBar).toHaveScreenshot('icons-shown.png');
    });
  }
)

Scenario(
  'All icons are hidden when not enabled',
  async ({
    smartFilterPage: {
      filterBar,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid?noIcons');
    });

    await Then('the Smart Filter mathces valid screenshot', async () => {
      await expect(filterBar).toHaveScreenshot('no-icons-shown.png');
    });
  }
)

Scenario(
  'Filterbar has blue border when inner element has focus',
  async ({
    smartFilterPage: {
      filterBar,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid');
    });

    await When('the mouse is over the filterbar', async () => {
      await filterBar.click();
    });

    await Then('the focus border is shown in the screenshot', async () => {
      await expect(filterBar).toHaveScreenshot('focus-has-border.png');
    })
  }
)

Scenario(
  'The expand icon is disabled when content too small',
  async ({
    smartFilterPage: {
      expandIcon,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid');
    });

    await When('the mouse is over the filterbar', async () => {
      await expandIcon.hover();
    });

    await Then('the expand icon does not highlight', async () => {
      await expect(expandIcon).toHaveScreenshot('expand-icon-not-highlighted.png');
    })
  }
)

Scenario(
  'The expand icon highlights when content is bigger than control area ',
  async ({
    smartFilterPage: {
      expandIcon,
      enterAndSelectItemInSearchBox,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid?width=400');
    });

    await When('the pills take more space than the filterbar', async () => {
      await enterAndSelectItemInSearchBox('XS1');
    });

    await And('the mouse is over the filterbar', async () => {
      await expandIcon.hover();
    });

    await Then('the focus border is shown in the screenshot', async () => {
      await expect(expandIcon).toHaveScreenshot('expand-icon-hhighlighted.png');
    })
  }
)

Scenario(
  'The clear button clears all content',
  async ({
    smartFilterPage: {
      clearIcon,
      filterBar,
      enterAndSelectItemInSearchBox,
      selectSortItem,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid?width=400');
    });

    await When('pills are entered', async () => {
      await enterAndSelectItemInSearchBox('XS1');
    });

    await And('and sort pills entered', async () => {
      await selectSortItem('currency', 'asc');
    });

    await And('the clear button is clicked', async () => {
      await clearIcon.hover();
    });

    await Then('the filterbar content is cleared', async () => {
      await expect(filterBar).toHaveScreenshot('filterbar-is-clear.png');
    })
  }
)