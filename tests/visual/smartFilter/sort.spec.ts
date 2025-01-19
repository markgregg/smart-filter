import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter'].forEach(view => {
  Scenario(
    `Sort items are shown in the dropdown-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        pause,
        selectSortSuggestion,
        clickSort,
        sortOptions,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('enter sort items', async () => {
        await selectSortSuggestion('isin', 'asc');
        await selectSortSuggestion('currency', 'desc');
        await selectSortSuggestion('side', 'asc');
        await pause(100);
      });

      await And('click on sort pill', async () => {
        await clickSort();
        await pause(250);
      });

      await Then('the sort options are shown', async () => {
        const sortOpts = await sortOptions();
        await expect(sortOpts).toHaveScreenshot(`sort-options-displayed-${view}.png`);
      });
    }
  );
});