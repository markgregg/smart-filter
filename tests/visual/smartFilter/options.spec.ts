import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter'].forEach(view => {
  Scenario(
    `options are visible in dropdown-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAnItemInSearchBox,
      },
    }) => {
      await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('an array has been entered', async () => {
        await enterAnItemInSearchBox('XS1');
      });

      await Then('the options are displayed in the dropdown', async () => {
        await expect(filterBar).toHaveScreenshot(`operator-value-comparison-pill-created-${view}.png`);
      });
    }
  );
});