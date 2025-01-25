import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter'].forEach(view => {
  Scenario(
    `Unmatched brackats are coloured red to show an error-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('a bracket is entered', async () => {
        await selectOperatorBarItemSuggestion('open');
      });

      await Then('the bracket is coloured red to show an error', async () => {
        await expect(filterBar).toHaveScreenshot(`bracket-highlighted-red-${view}.png`);
      });
    }
  );

  Scenario(
    `Matching brackets will highlight when hovered over-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        pause,
        selectOperatorBarItemSuggestion,
        hoverOverPill,
      },
    }) => {
      await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
        await use(view);
        await searchBox.click();
      });

      await When('barcekts have been entered', async () => {
        await selectOperatorBarItemSuggestion('open');
        await pause(100);
        await selectOperatorBarItemSuggestion('open');
        await pause(100);
        await selectOperatorBarItemSuggestion('close');
        await pause(100);
        await selectOperatorBarItemSuggestion('close');
        await pause(100);
      });

      await And('A bracket is hovered over', async () => {
        await hoverOverPill(2)
      });

      await Then('the matching backet also highlights', async () => {
        await expect(filterBar).toHaveScreenshot(`matching-barckets-highlighted-${view}.png`);
      });
    }
  );
});