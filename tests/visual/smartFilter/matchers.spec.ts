import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

Scenario(
  'Strings are match to expressions matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('text is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('Bank');
    });

    await Then('a matching text pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('text-pill-created.png');
    })
  }
)

Scenario(
  'Strings are match to lookup matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('text is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('XS1');
    });

    await Then('a matching lookup pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('lookup-pill-created.png');
    })
  }
)

Scenario(
  'Strings are match to list matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('text is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('SELL');
    });

    await Then('a matching list pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('matched-list-pill-created.png');
    })
  }
)

Scenario(
  'Numbers are match to expressions matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('numbers are entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('0.5');
    });

    await Then('a matching mnumber pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('number-pill-created.png');
    });
  }
);

Scenario(
  'Booleans are match to expressions matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('a bool is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('true');
    });

    await Then('a matching boolean pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('boolean-pill-created.png');
    });
  }
);

Scenario(
  'stringDates are match to expressions matchers',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('a string date is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('2025-02-20');
    });

    await Then('a matching boolean pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('string-date-pill-created.png');
    });
  }
);

Scenario(
  'Ranges can be manually entered',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('numbers are entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('0.5 to 0.8');
    });

    await Then('a range pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('range-pill-created.png');
    });
  }
);

Scenario(
  'Ranges with no spaces can be manually entered',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('numbers are entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('0.5to0.8');
    });

    await Then('a range pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('range-no-spaces-pill-created.png');
    });
  }
);

Scenario(
  'Lists can be manually entered',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('text is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('XS2');
    });

    await Then('a list pill is created', async () => {
      await expect(filterBar).toHaveScreenshot('list-pill-created.png');
    })
  }
)

/* operators/comaprisons and values */

Scenario(
  'Comparisons can be entered alongside values',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('a comparison and text is entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('* Bank');
    });

    await Then('a matching pill with a value and comaprison is created', async () => {
      await expect(filterBar).toHaveScreenshot('value-comparison-pill-created.png');
    })
  }
)

Scenario(
  'Operators and comparisons can be entered alongside values',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('an operator, a comparison and number are entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await enterAndSelectItemInSearchBox('or > 0.5');
    });

    await Then('a matching pill with a value and comaprison is created', async () => {
      await expect(filterBar).toHaveScreenshot('operator-value-comparison-pill-created.png');
    })
  }
)

Scenario(
  'Operators, fields and comparisons can be entered alongside values',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilter');
      await searchBox.click();
    });

    await When('an operator, a comparison and number are entered into the search box', async () => {
      await enterAndSelectItemInSearchBox('Maturity Date = 2024-12-23');
      await enterAndSelectItemInSearchBox('or coupon > 0.5');
    });

    await Then('a matching pill with a value and comaprison is created', async () => {
      await expect(filterBar).toHaveScreenshot('operator-field-value-comparison-pill-created.png');
    })
  }
)

/* precedence */