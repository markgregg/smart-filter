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