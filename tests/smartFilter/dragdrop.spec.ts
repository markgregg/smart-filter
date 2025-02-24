import { expect } from '@playwright/test';
import { And, Given, Scenario, Then, When } from '../common/ghkerkin';

Scenario(
  `Items can be dragged to the left`,
  async ({
    smartFilterPage: {
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      dragPillTo,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('items are entered into the filter bar', async () => {
      await enterAndSelectItemInSearchBox('GBP', 'CCY');
      await enterAndSelectItemInSearchBox('> 0.5');
      await enterAndSelectItemInSearchBox('FR0127739573', 'ISIN');
      await enterAndSelectItemInSearchBox('Tech', 'Sector');
    });

    await And('a pill is dragged to the left', async () => {
      await dragPillTo(2, 0);
    });

    await Then('the pill is moved to a new positon', async () => {
      await expect(filterBar).toHaveScreenshot(`pill-moved-to-start.png`);
    });
  },
);

Scenario(
  `Items can be dragged to the right`,
  async ({
    smartFilterPage: {
      filterBar,
      use,
      enterAndSelectItemInSearchBox,
      dragPillTo,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('items are entered into the filter bar', async () => {
      await enterAndSelectItemInSearchBox('GBP', 'CCY');
      await enterAndSelectItemInSearchBox('> 0.5');
      await enterAndSelectItemInSearchBox('FR0127739573', 'ISIN');
      await enterAndSelectItemInSearchBox('Tech', 'Sector');
    });

    await And('a pill is dragged to the right', async () => {
      await dragPillTo(1, 3);
    });

    await Then('the pill is moved to a new positon', async () => {
      await expect(filterBar).toHaveScreenshot(`pill-moved-to-end.png`);
    });
  },
);
