import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter'].forEach(view => {
  Scenario(
    `When lock icon clicked pills are locked-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        lockIcon,
        use,
        pause,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('pills have been entered', async () => {
        await enterAndSelectItemInSearchBox('GBP');
        await enterAndSelectItemInSearchBox('XS1');
        await selectOperatorBarItemSuggestion('open');
        await pause(50);
      });

      await And('the lock icon is clicked', async () => {
        lockIcon.click
        await pause(50);
      });

      await Then('all pills are locked', async () => {
        await expect(filterBar).toHaveScreenshot(`pills-are-locekd-${view}.png`);
      });
    }
  );

  Scenario(
    `When lock icon clicked pills aare unlocked-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        lockIcon,
        use,
        pause,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('pills have been entered', async () => {
        await enterAndSelectItemInSearchBox('GBP');
        await enterAndSelectItemInSearchBox('XS1');
        await selectOperatorBarItemSuggestion('open');
        await pause(50);
      });

      await And('the lock icon is clicked', async () => {
        lockIcon.click();
        await pause(50);
      });

      await And('the lock icon is clicked again', async () => {
        lockIcon.click();
      });

      await Then('all pills are unlocked', async () => {
        await expect(filterBar).toHaveScreenshot(`pills-are-unlocekd-${view}.png`);
      });
    }
  );
});