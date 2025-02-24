import { expect } from '@playwright/test';
import { Given, Scenario, Then, When } from '../common/ghkerkin';

['smartfilter', 'smartfilteraggrid'].forEach((view) => {
  Scenario(
    `Strings are match to expressions matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('Bank');
      });

      await Then('a matching text pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `text-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Strings are match to lookup matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127739573',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await Then('a matching lookup pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `lookup-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Strings are match to list matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('SELL', 'Side');
      });

      await Then('a matching list pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `matched-list-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Numbers are match to expressions matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('numbers are entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('0.5');
      });

      await Then('a matching mnumber pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `number-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Booleans are match to expressions matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('a bool is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('true');
      });

      await Then('a matching boolean pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `boolean-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `stringDates are match to expressions matchers-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('a string date is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('2025-02-20');
      });

      await Then('a matching boolean pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `string-date-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Ranges can be manually entered-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('numbers are entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('0.5 to 0.8');
      });

      await Then('a range pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `range-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Ranges with no spaces can be manually entered-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('numbers are entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('0.5to0.8');
      });

      await Then('a range pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `range-no-spaces-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Lists can be manually entered-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox(
          'FR0127739573',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
        await enterAndSelectItemInSearchBox(
          'FR0127614701',
          view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
        );
      });

      await Then('a list pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `list-pill-created-${view}.png`,
        );
      });
    },
  );

  /* operators/comaprisons and values */

  Scenario(
    `Comparisons can be entered alongside values-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When(
        'a comparison and text is entered into the search box',
        async () => {
          await enterAndSelectItemInSearchBox('!* Bank');
        },
      );

      await Then(
        'a matching pill with a value and comaprison is created',
        async () => {
          await expect(filterBar).toHaveScreenshot(
            `value-comparison-pill-created-${view}.png`,
          );
        },
      );
    },
  );

  Scenario(
    `Operators and comparisons can be entered alongside values-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When(
        'an operator, a comparison and number are entered into the search box',
        async () => {
          await enterAndSelectItemInSearchBox(
            'FR0127739573',
            view === 'smartfilteraggrid' ? 'Isin' : 'ISIN',
          );
          await enterAndSelectItemInSearchBox('or > 0.5');
        },
      );

      await Then(
        'a matching pill with a value and comaprison is created',
        async () => {
          await expect(filterBar).toHaveScreenshot(
            `operator-value-comparison-pill-created-${view}.png`,
          );
        },
      );
    },
  );

  Scenario(
    `Operators, fields and comparisons can be entered alongside values-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When(
        'an operator, a comparison and number are entered into the search box',
        async () => {
          await enterAndSelectItemInSearchBox('MaturityDate = 2024-12-23');
          await enterAndSelectItemInSearchBox('or coupon > 0.5');
        },
      );

      await Then(
        'a matching pill with a value and comaprison is created',
        async () => {
          await expect(filterBar).toHaveScreenshot(
            `operator-field-value-comparison-pill-created-${view}.png`,
          );
        },
      );
    },
  );

  Scenario(
    `Selecting empty for a value sets the value to null-${view}`,
    async ({
      smartFilterPage: {
        searchBox,
        filterBar,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox('isin empty');
      });

      await Then('a matching text pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `empty-pill-created-${view}.png`,
        );
      });
    },
  );

  Scenario(
    `Smart filter can hadnle complex filter statements-${view}`,
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

      await When('text is entered into the search box', async () => {
        await enterAndSelectItemInSearchBox(
          'GBP',
          view === 'smartfilteraggrid' ? 'Currency' : 'CCY',
        );
        await selectOperatorBarItemSuggestion('open');
        await enterAndSelectItemInSearchBox('> 0.5');
        await enterAndSelectItemInSearchBox('or < 0.8');
        await selectOperatorBarItemSuggestion('close');
      });

      await Then('a matching text pill is created', async () => {
        await expect(filterBar).toHaveScreenshot(
          `complex-pill-created-${view}.png`,
        );
      });
    },
  );
});

/* precedence */
