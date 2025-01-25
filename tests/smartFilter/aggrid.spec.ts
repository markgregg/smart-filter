import { expect } from "@playwright/test";
import { Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilteraggrid'].forEach(view => {
  Scenario(
    `Enetering filter values in smart filter automatically filters ag-grid-${view}`,
    async ({
      smartFilterPage: {
        agGrid,
        use,
        enterAndSelectItemInSearchBox,
        pause,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a value is entered into smart filter', async () => {
        await enterAndSelectItemInSearchBox('SELL');
        await pause(250);
      });

      await Then('ag-grid is updated', async () => {
        await expect(agGrid).toHaveScreenshot(`ag-grid-filtered-to-show-sells-${view}.png`);
      });
    }
  );

  Scenario(
    `Enetering sort fields in smart filter automatically sorts ag-grid-${view}`,
    async ({
      smartFilterPage: {
        agGrid,
        sortSelectionButton,
        use,
        selectSortSuggestion,
        pause,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a field is entered into smart filter', async () => {
        await sortSelectionButton.hover();
        await selectSortSuggestion('isin', 'desc');
        await pause(250);
      });

      await Then('ag-grid is updated', async () => {
        await expect(agGrid).toHaveScreenshot(`ag-grid-sorted-by-isin-${view}.png`);
      });
    }
  );

  Scenario(
    `Sorting and filtering ag-grid-${view}`,
    async ({
      smartFilterPage: {
        agGrid,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        sortSelectionButton,
        selectSortSuggestion,
        pause,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a value is entered into smart filter', async () => {
        await enterAndSelectItemInSearchBox('maturitydate > 2050-01-01');
        await enterAndSelectItemInSearchBox('active true');
        await sortSelectionButton.hover();
        await selectSortSuggestion('isin', 'asc');
        await pause(250);
      });

      await Then('ag-grid is updated', async () => {
        await expect(filterBar).toHaveScreenshot(`filter-bar-has-options-${view}.png`);
        await expect(agGrid).toHaveScreenshot(`ag-grid-sorted-and-filtered-${view}.png`);
      });
    }
  );
});