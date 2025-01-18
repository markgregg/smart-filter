import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

Scenario(
  'Dropdown suggestions are shown when mouse over',
  async ({
    smartFilterPage: {
      filterBar,
      suggestions,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartfilteraggrid?noIcons');
    });

    await When('the mouse is over the filterbar', async () => {
      await filterBar.hover();
    });

    await Then('the suggestions are shown as in the screenshot', async () => {
      await expect(suggestions).toHaveScreenshot('suggestions-shown-on-hover.png');
    })
  }
)

Scenario(
  'A pill is created when a field option is clicked',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      selectFieldSuggestion,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();

    });

    await When('a field option is selected', async () => {
      await selectFieldSuggestion('maturityDate');
    });

    await Then('the field pill is shown in the filterbar', async () => {
      await expect(filterBar).toHaveScreenshot('filter-bar-has-field-option.png');
    })
  }
)

Scenario(
  'A pill is created when a sort option is clicked',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      selectSortSuggestion,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();

    });

    await When('a field option is selected', async () => {
      await selectSortSuggestion('maturityDate', 'desc');
    });

    await Then('the sort pill is shown in the filterbar', async () => {
      await expect(filterBar).toHaveScreenshot('filter-bar-has-sort-option.png');
    })
  }
)

Scenario(
  'Brackets pills are created when brackets are selected',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      selectOperatorBarItemSuggestion,
      use,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();

    });

    await When('brackets are selected', async () => {
      await selectOperatorBarItemSuggestion('open');
      await selectOperatorBarItemSuggestion('close');
    });

    await Then('the brackets appear as pills', async () => {
      await expect(filterBar).toHaveScreenshot('brackets-as-pills.png');
    })
  }
)

Scenario(
  'Suggestions change when a pill is selected',
  async ({
    smartFilterPage: {
      searchBox,
      suggestions,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
    },
  }) => {
    await Given('the SmartFilter test page is shown andthe suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await selectPill(0);
    });

    await Then('the suggestions dropdown shows only field options', async () => {
      await expect(suggestions).toHaveScreenshot('field-options.png');
    })
  }
)

Scenario(
  'Selecting an operator applies the operator to the pill',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
      selectOperatorBarItemSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await selectPill(0);
    });

    await And('the not comparison is selected', async () => {
      await selectOperatorBarItemSuggestion('ne')
    });

    await Then('the comparison operator is applied to the pill', async () => {
      await expect(filterBar).toHaveScreenshot('not-applied-to-field.png');
    })
  }
)

Scenario(
  'Selecting empty removes the pills value',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
      selectOperatorBarItemSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await selectPill(0);
    });

    await And('the empty option is selected', async () => {
      await selectOperatorBarItemSuggestion('ne')
    });

    await Then('the pills value is removed', async () => {
      await expect(filterBar).toHaveScreenshot('pill-has-no-value.png');
    })
  }
)

Scenario(
  'Selecting list removes turns the pills into a list',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
      selectOperatorBarItemSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('XS1');
      await selectPill(0);
    });

    await And('the list option is selected', async () => {
      await selectOperatorBarItemSuggestion('list')
    });

    await Then('the pills is transformed into a list', async () => {
      await expect(filterBar).toHaveScreenshot('pill-is-a-list.png');
    })
  }
)


Scenario(
  'Selecting range removes turns the pills into a range',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
      selectOperatorBarItemSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('0.5');
      await selectPill(0);
    });

    await And('the range option is selected', async () => {
      await selectOperatorBarItemSuggestion('range')
    });

    await Then('the pills is transformed into a range', async () => {
      await expect(filterBar).toHaveScreenshot('pill-is-a-range.png');
    })
  }
)

Scenario(
  'Selecting or removes adds the or operator',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      selectPill,
      selectOperatorBarItemSuggestion,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a pill is selected', async () => {
      await enterAndSelectItemInSearchBox('5');
      await enterAndSelectItemInSearchBox('GBP');
      await selectPill(1);
    });

    await And('the or option is selected', async () => {
      await selectOperatorBarItemSuggestion('or')
    });

    await Then('the pills is transformed into a range', async () => {
      await expect(filterBar).toHaveScreenshot('pill-has-or-operator.png');
    })
  }
)

Scenario(
  'Selecting group shows all group hints',
  async ({
    smartFilterPage: {
      searchBox,
      suggestions,
      use,
      selectHintGroup,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a hint group is selected', async () => {
      await selectHintGroup('Maturity');
    });

    await Then('the all items for group are shown', async () => {
      await expect(suggestions).toHaveScreenshot('all-group-hints.png');
    })
  }
);

Scenario(
  'Selecting a hint creates a pill',
  async ({
    smartFilterPage: {
      searchBox,
      filterBar,
      use,
      selectHintItem,
    },
  }) => {
    await Given('the SmartFilter test page is shown and the suggestion panel is visible', async () => {
      await use('smartfilteraggrid');
      await searchBox.click();
    });

    await When('a hint group is selected', async () => {
      await selectHintItem('Maturity', 1);
    });

    await Then('the all items for group are shown', async () => {
      await expect(filterBar).toHaveScreenshot('pill-created-from-hint.png');
    })
  }
);