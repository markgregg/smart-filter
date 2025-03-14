import { expect } from '@playwright/test';
import { And, Given, Scenario, Then, When } from '../common/ghkerkin';

['smartfilter', 'smartfilteraggrid'].forEach((view) => {
  Scenario(
    `Dropdown suggestions are shown when mouse over-${view}`,
    async ({ smartFilterPage: { filterBar, suggestions, use } }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('the mouse is over the filterbar', async () => {
        await filterBar.hover();
      });

      await Then('the suggestions are shown as in the screenshot', async () => {
        await expect(suggestions).toHaveScreenshot(
          `suggestions-shown-on-hover-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `A pill is created when a field option is clicked-${view}`,
    async ({
      smartFilterPage: { searchBox, filterBar, selectFieldSuggestion, use },
    }) => {
      await Given(
        'the SmartFilter test page is shown andthe suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a field option is selected', async () => {
        await selectFieldSuggestion('side');
      });

      await Then('the field pill is shown in the filterbar', async () => {
        await expect(filterBar).toHaveScreenshot(
          `filter-bar-has-field-option-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Brackets pills are created when brackets are selected-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        selectOperatorBarItemSuggestion,
        use,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown andthe suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('brackets are selected', async () => {
        await selectOperatorBarItemSuggestion('open');
        await selectOperatorBarItemSuggestion('close');
      });

      await Then('the brackets appear as pills', async () => {
        await expect(filterBar).toHaveScreenshot(
          `brackets-as-pills-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Suggestions change when a pill is selected-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        suggestions,
        use,
        enterAndSelectItemInSearchBox,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127495044',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await Then(
        'the suggestions dropdown shows only field options',
        async () => {
          await expect(suggestions).toHaveScreenshot(
            `field-options-${view}.png`,
          );
        },
      );
    },
  );

  Scenario(
    `Selecting an operator applies the operator to the pill-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127495044',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await And('the not comparison is selected', async () => {
        await selectOperatorBarItemSuggestion('ne');
      });

      await Then('the comparison operator is applied to the pill', async () => {
        await expect(filterBar).toHaveScreenshot(
          `not-applied-to-field-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Selecting empty removes the pills value-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127495044',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await And('the empty option is selected', async () => {
        await selectOperatorBarItemSuggestion('empty');
      });

      await Then('the pills value is removed', async () => {
        await expect(filterBar).toHaveScreenshot(
          `pill-has-no-value-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Selecting list turns the pills into a list-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127495044',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await And('the list option is selected', async () => {
        await selectOperatorBarItemSuggestion('list');
      });

      await Then('the pills is transformed into a list', async () => {
        await expect(filterBar).toHaveScreenshot(`pill-is-a-list-${view}.png`);
      });
    },
  );

  Scenario(
    `Selecting range turns the pills into a range-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox('0.5');
      });

      await And('the range option is selected', async () => {
        await selectOperatorBarItemSuggestion('range');
      });

      await Then('the pills is transformed into a range', async () => {
        await expect(filterBar).toHaveScreenshot(`pill-is-a-range-${view}.png`);
      });
    },
  );

  Scenario(
    `Selecting 'or' adds the or operator-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        selectOperatorBarItemSuggestion,
      },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a pill is selected', async () => {
        await enterAndSelectItemInSearchBox('> 5');
        await enterAndSelectItemInSearchBox(
          'GBP',
          view === 'smartfilteraggrid' ? 'Currency' : 'CCY',
        );
      });

      await And('the or option is selected', async () => {
        await selectOperatorBarItemSuggestion('or');
      });

      await Then('the pills is transformed into a range', async () => {
        await expect(filterBar).toHaveScreenshot(
          `pill-has-or-operator-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Selecting group shows all group hints-${view}`,
    async ({
      smartFilterPage: { searchBox, use, selectHintGroup, suggestions },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a hint group is selected', async () => {
        await selectHintGroup('Maturity');
      });

      await Then('the all items for group are shown', async () => {
        await expect(suggestions).toHaveScreenshot(
          `all-group-hints-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Selecting a hint creates a pill-${view}`,
    async ({
      smartFilterPage: { searchBox, filterBar, use, selectHintItem },
    }) => {
      await Given(
        'the SmartFilter test page is shown and the suggestion panel is visible',
        async () => {
          await use(view);
          await searchBox.click();
        },
      );

      await When('a hint group is selected', async () => {
        await selectHintItem('currency', 1);
      });

      await Then('the all items for group are shown', async () => {
        await expect(filterBar).toHaveScreenshot(
          `pill-created-from-hint-${view}.png`,
        );
      });
    },
  );
});
