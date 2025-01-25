import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter', 'smartfilteraggrid'].forEach(view => {
  Scenario(
    `All icons are shown when enabled-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await Then('the Smart Filter mathces valid screenshot', async () => {
        await expect(filterBar).toHaveScreenshot(`icons-shown-${view}.png`);
      });
    }
  );

  Scenario(
    `All icons are hidden when not enabled-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(`${view}?noIcons`);
      });

      await Then('the Smart Filter mathces valid screenshot', async () => {
        await expect(filterBar).toHaveScreenshot(`no-icons-shown-${view}.png`);
      });
    }
  )

  Scenario(
    `Filterbar has blue border when inner element has focus-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('the mouse is over the filterbar', async () => {
        await filterBar.click();
      });

      await Then('the focus border is shown in the screenshot', async () => {
        await expect(filterBar).toHaveScreenshot(`focus-has-border-${view}.png`);
      })
    }
  )

  Scenario(
    `The expand icon is disabled when content too small-${view}`,
    async ({
      smartFilterPage: {
        expandIcon,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('the mouse is over the filterbar', async () => {
        await expandIcon.hover();
      });

      await Then('the expand icon does not highlight', async () => {
        await expect(expandIcon).toHaveScreenshot(`expand-icon-not-highlighted-${view}.png`);
      })
    }
  )

  Scenario(
    `The expand icon highlights when content is bigger than control area-${view}`,
    async ({
      smartFilterPage: {
        expandIcon,
        enterAndSelectItemInSearchBox,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(`${view}?width=400`);
      });

      await When('the pills take more space than the filterbar', async () => {
        await enterAndSelectItemInSearchBox('XS1');
        await enterAndSelectItemInSearchBox('GBP');
      });

      await And('the mouse is over the filterbar', async () => {
        await expandIcon.hover();
      });

      await Then('the focus border is shown in the screenshot', async () => {
        await expect(expandIcon).toHaveScreenshot(`expand-icon-highlighted-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking the expand icon extends the filter bar-${view}`,
    async ({
      smartFilterPage: {
        expandIcon,
        innerFilterBar,
        enterAndSelectItemInSearchBox,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(`${view}?width=400`);
      });

      await When('the pills take more space than the filterbar', async () => {
        await enterAndSelectItemInSearchBox('XS1');
        await enterAndSelectItemInSearchBox('GBP');
        await enterAndSelectItemInSearchBox('*bank');
        await enterAndSelectItemInSearchBox('XS1');
        await enterAndSelectItemInSearchBox('EUR');
      });

      await And('the expand icon is clicked', async () => {
        await expandIcon.click();
      });

      await Then('the fitlerbar gows to show all content', async () => {
        await expect(innerFilterBar).toHaveScreenshot(`expanded-filter-bar-${view}.png`);
      });
    }
  );

  Scenario(
    `The clear button clears all content-${view}`,
    async ({
      smartFilterPage: {
        clearIcon,
        filterBar,
        enterAndSelectItemInSearchBox,
        sortSelectionButton,
        selectSortSuggestion,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('pills are entered', async () => {
        await enterAndSelectItemInSearchBox('XS1');
      });

      await And('and sort pills entered', async () => {
        await sortSelectionButton.hover();
        await selectSortSuggestion('maturityDate', 'asc');
      });

      await And('the clear button is clicked', async () => {
        await clearIcon.click();
      });

      await Then('the filterbar content is cleared', async () => {
        await expect(filterBar).toHaveScreenshot(`filterbar-is-clear-${view}.png`);
      });
    }
  );

  Scenario(
    `Filter bar is expanded when a large size-${view}`,
    async ({
      smartFilterPage: {
        innerFilterBar,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(`${view}?size=large`);
      });

      await When('the filterbar is clicked', async () => {
        await innerFilterBar.click();
      });

      await Then('the fitlerbar is shown at the correct size', async () => {
        await expect(innerFilterBar).toHaveScreenshot(`large-filter-bar-${view}.png`);
      });
    }
  );

  Scenario(
    `Filter bar is smaller when a compact size-${view}`,
    async ({
      smartFilterPage: {
        innerFilterBar,
        use,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(`${view}?size=compact`);
      });

      await When('the filterbar is clicked', async () => {
        await innerFilterBar.click();
      });

      await Then('the fitlerbar is shown at the correct size', async () => {
        await expect(innerFilterBar).toHaveScreenshot(`compact-filter-bar-${view}.png`);
      });
    }
  );
});