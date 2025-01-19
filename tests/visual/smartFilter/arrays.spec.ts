import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter'].forEach(view => {
  Scenario(
    `Array items are shown in the dropdown-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        pause,
        enterAndSelectItemInSearchBox,
        clickPill,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('enter an array', async () => {
        await enterAndSelectItemInSearchBox('XS1');
        await enterAndSelectItemInSearchBox('XS2');
        await pause(100);
      });

      await And('click on  pill', async () => {
        await clickPill(0);
        await pause(250);
      });

      await Then('the sort options are shown', async () => {
        await expect(filterBar).toHaveScreenshot(`sort-options-displayed-${view}.png`);
      });
    }
  );
});