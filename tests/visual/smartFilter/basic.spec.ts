import { expect } from "@playwright/test";
import { Given, Scenario, Then } from "../common/ghkerkin";


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
      await expect(filterBar).toHaveScreenshot('smart-filter-basic.png');
    })
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
      await expect(filterBar).toHaveScreenshot('smart-filter-basic.png');
    })
  }
)