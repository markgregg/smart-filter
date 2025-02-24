import { expect } from '@playwright/test';
import { And, Given, Scenario, Then, When } from '../common/ghkerkin';

Scenario(
  `Pills can be copied and paste`,
  async ({
    smartFilterPage: {
      filterBar,
      clearIcon,
      use,
      enterAndSelectItemInSearchBox,
      clickPill,
      copyToClipBoard,
      pasteFromClipBoard,
    },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('items are entered', async () => {
      await enterAndSelectItemInSearchBox('FR0127739573', 'ISIN');
      await enterAndSelectItemInSearchBox('AT0000A2CGC5', 'ISIN');
      await enterAndSelectItemInSearchBox('or > 0.5');
    });

    await And('the pill are copied and cleared', async () => {
      await clickPill(0, { modifiers: ['Control'], position: { x: 1, y: 1 } });
      await clickPill(1, { modifiers: ['Control'], position: { x: 1, y: 1 } });
      await copyToClipBoard();
      await clearIcon.click();
    });

    await And('the copied contents are paste', async () => {
      await pasteFromClipBoard();
    });

    await Then('the copied pills are shown', async () => {
      await expect(filterBar).toHaveScreenshot(`copied-pills-are-paste.png`);
    });
  },
);

Scenario(
  `Paste and array`,
  async ({
    smartFilterPage: { filterBar, use, addTextToClipBoard, pasteFromClipBoard },
  }) => {
    await Given('the SmartFilter test page is shown', async () => {
      await use('smartFilter');
    });

    await When('an array is copied to the clipboard', async () => {
      await addTextToClipBoard('FR0013405222,FR0127739573,AT000B093190');
    });

    await And('the array is paste', async () => {
      await pasteFromClipBoard();
    });

    await Then('the paste array is shown', async () => {
      await expect(filterBar).toHaveScreenshot(`paste-array-is-sown.png`);
    });
  },
);
