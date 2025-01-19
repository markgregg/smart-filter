import { expect } from "@playwright/test";
import { And, Given, Scenario, Then, When } from "../common/ghkerkin";

['smartfilter', 'smartfilteraggrid'].forEach(view => {
  Scenario(
    `Clicking on a text value opens a text editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a text value is entered', async () => {
        await enterAndSelectItemInSearchBox('*Bank');
      });

      await And('a text value is clicked', async () => {
        await clickTextDisplay();
      });

      await Then('a text editor is dispalyed', async () => {
        await expect(filterBar).toHaveScreenshot(`text-editor-shown-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking close shuts the editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        clickClose,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a text value is entered', async () => {
        await enterAndSelectItemInSearchBox('*Bank');
      });

      await And('a text value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the close button is clicked', async () => {
        await clickClose();
      });

      await Then('a text editor is hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`text-editor-is-hidden-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking accept updates the value-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        updateTextValue,
        clickAccept,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a text value is entered', async () => {
        await enterAndSelectItemInSearchBox('*Bank');
      });

      await And('a text value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the value is changed and accept clicked', async () => {
        await updateTextValue("test");
        await clickAccept();
      });

      await Then('the value updated and the editor hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`the-text-is-updated-${view}.png`);
      });
    }
  );


  Scenario(
    `Clicking on a numeric value opens a text editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a numeric value is entered', async () => {
        await enterAndSelectItemInSearchBox('0.5');
      });

      await And('a text value is clicked', async () => {
        await clickTextDisplay();
      });

      await Then('a numeric editor is dispalyed', async () => {
        await expect(filterBar).toHaveScreenshot(`numeric-editor-shown-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking close shuts the numeric editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        clickClose,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a text value is entered', async () => {
        await enterAndSelectItemInSearchBox('0.6');
      });

      await And('a numeric value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the close button is clicked', async () => {
        await clickClose();
      });

      await Then('a numeric editor is hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`numeric-editor-is-hidden-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking accept updates the numeric value-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        updateNumericValue,
        clickAccept,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a numeric value is entered', async () => {
        await enterAndSelectItemInSearchBox('0.6');
      });

      await And('a numeric value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the value is changed and accept clicked', async () => {
        await updateNumericValue(1.2);
        await clickAccept();
      });

      await Then('the value updated and the editor hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`the-number-is-updated-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking on a date value opens a date editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a date value is entered', async () => {
        await enterAndSelectItemInSearchBox('2026-01-14');
      });

      await And('a date value is clicked', async () => {
        await clickTextDisplay();
      });

      await Then('a date editor is dispalyed', async () => {
        await expect(filterBar).toHaveScreenshot(`date-editor-shown-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking close shuts the date editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        clickClose,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a text value is entered', async () => {
        await enterAndSelectItemInSearchBox('2026-01-14');
      });

      await And('a date value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the close button is clicked', async () => {
        await clickClose();
      });

      await Then('a numeric editor is hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`date-editor-is-hidden-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking accept updates the date value-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        updateDateValue,
        clickAccept,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a date value is entered', async () => {
        await enterAndSelectItemInSearchBox('2026-01-14');
      });

      await And('a numeric value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the date is changed and accept clicked', async () => {
        await updateDateValue("2031-07-18");
        await clickAccept();
      });

      await Then('the date updated and the editor hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`the-date-is-updated-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking on a boolean value toggles between true and false-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickBooleanToggle,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a boolean value is entered', async () => {
        await enterAndSelectItemInSearchBox('true');
      });

      await And('a text value is clicked', async () => {
        await clickBooleanToggle();
      });

      await Then('a text editor is dispalyed', async () => {
        await expect(filterBar).toHaveScreenshot(`boolean-value-is-false-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking on a lookup text value opens a text editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a lookup text value is entered', async () => {
        await enterAndSelectItemInSearchBox('XS1');
      });

      await And('a lookup text value is clicked', async () => {
        await clickTextDisplay();
      });

      await Then('a lookup editor is dispalyed', async () => {
        await expect(filterBar).toHaveScreenshot(`lookup-text-editor-shown-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking close shuts the lookup editor-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        clickClose,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a lookup text value is entered', async () => {
        await enterAndSelectItemInSearchBox('XS1');
      });

      await And('a lookup text value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the close button is clicked', async () => {
        await clickClose();
      });

      await Then('the lookup editor is hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`lookup-editor-is-hidden-${view}.png`);
      });
    }
  );

  Scenario(
    `Clicking accept updates the lookup value-${view}`,
    async ({
      smartFilterPage: {
        filterBar,
        use,
        enterAndSelectItemInSearchBox,
        clickTextDisplay,
        updateLookupValue,
        clickAccept,
      },
    }) => {
      await Given('the SmartFilter test page is shown', async () => {
        await use(view);
      });

      await When('a  text value is entered', async () => {
        await enterAndSelectItemInSearchBox('XS1');
      });

      await And('a lookup text value is clicked', async () => {
        await clickTextDisplay();
      });

      await And('the lookup value is changed and accept clicked', async () => {
        await updateLookupValue(0, 'XS2');
        await clickAccept();
      });

      await Then('the lookup value updated and the editor hidden', async () => {
        await expect(filterBar).toHaveScreenshot(`the-lookup-is-updated-${view}.png`);
      });
    }
  );
});