import { expect } from '@playwright/test';
import { And, Given, Scenario, Then, When } from '../common/ghkerkin';

['smartfilter'].forEach((view) => {
  Scenario(
    `When lock icon clicked pills are locked-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        lockIcon,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('pills have been entered', async () => {
        await enterAndSelectItemInSearchBox('GBP', 'CCY');
        await enterAndSelectItemInSearchBox('AT0000A2CGC5', 'ISIN');
        await selectOperatorBarItemSuggestion('open');
      });

      await And('the lock icon is clicked', async () => {
        await lockIcon.click();
      });

      await Then('all pills are locked', async () => {
        await expect(filterBar).toHaveScreenshot(
          `pills-are-locekd-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `When lock icon clicked pills are unlocked-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        lockIcon,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('pills have been entered', async () => {
        await enterAndSelectItemInSearchBox('GBP', 'CCY');
        await enterAndSelectItemInSearchBox('AT0000A2CGC5', 'ISIN');
        await selectOperatorBarItemSuggestion('open');
      });

      await And('the lock icon is clicked', async () => {
        lockIcon.click();
      });

      await And('the lock icon is clicked again', async () => {
        lockIcon.click();
      });

      await Then('all pills are unlocked', async () => {
        await expect(filterBar).toHaveScreenshot(
          `pills-are-unlocekd-${view}.png`,
        );
      });
    },
  );
});
