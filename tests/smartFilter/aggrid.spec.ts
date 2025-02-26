import { expect } from '@playwright/test';
import { Given, Scenario, Then, When } from '../common/ghkerkin';

['smartfilteraggrid'].forEach((view) => {
  Scenario(
    `Enetering filter values in smart filter automatically filters ag-grid-${view}`,
    async ({
      smartFilterPage: { agGrid, use, enterAndSelectItemInSearchBox },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a value is entered into smart filter', async () => {
        await enterAndSelectItemInSearchBox('SELL', 'Side');
      });

      await Then('ag-grid is updated', async () => {
        await expect(agGrid).toHaveScreenshot(
          `ag-grid-filtered-to-show-sells-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `More filtering ag-grid-${view}`,
    async ({
      smartFilterPage: {
        agGrid,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a value is entered into smart filter', async () => {
        await enterAndSelectItemInSearchBox('maturitydate > 2050-01-01');
        await enterAndSelectItemInSearchBox('active true');
      });

      await Then('ag-grid is updated', async () => {
        await expect(filterBar).toHaveScreenshot(
          `filter-bar-has-options-${view}.png`,
        );
        await expect(agGrid).toHaveScreenshot(
          `ag-grid-is-filtered-${view}.png`,
        );
      });
    },
  );
});
