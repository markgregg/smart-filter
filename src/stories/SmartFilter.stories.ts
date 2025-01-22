import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SmartFilter } from './SmartFilter';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Examples/SmartFilter',
  component: SmartFilter,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    exampleWidth: {
      control: 'number',
      description: 'The width of the example',
    },
    exampleHeight: {
      control: 'number',
      description: 'The height of the example',
    },
    size: {
      options: ['compact', 'normal', 'large'],
    },
    enableSort: {
      control: 'boolean',
      description: 'If true sort options are available',
    },
    hintsPerColumn: {
      control: 'number',
      description: 'The number of hints per column',
    },
    hintWidth: {
      control: 'number',
      description: 'The width of each hint',
    },
    /* sortHints: {
      control: 'boolean',
      description: 'If true sort hints are shown',
    }, */
    allowLocking: {
      control: 'boolean',
      description: 'If true allow pills to be locked',
    },
    debounce: {
      control: 'number',
      description: 'The delay before sending promises',
    },
    pageSize: {
      control: 'number',
      description: 'The number of items to jump when pressing page up/down',
    },
    showSearchIcon: {
      control: 'boolean',
      description: 'If true the search icon is shown',
    },
    showUndoIcon: {
      control: 'boolean',
      description: 'If true the undo icon is shown',
    },
    maxValueWidth: {
      control: 'number',
      description: 'The max width of each value',
    },
    sortPillWidth: {
      control: 'number',
      description: 'The width of the sort pill',
    },
    maxDropdownHeight: {
      control: 'number',
      description: 'The max height of the dropdown box',
    },
    dropdownWidth: {
      control: 'number',
      description: 'The width of the dropdown box',
    },
    optionWidth: {
      control: 'number',
      description: 'the width of an opton',
    },
    showDropdownOnMouseOver: {
      control: 'boolean',
      description:
        'If true dropdown is only shown when the mouse enters the control',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt to be show in the search input box',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
    onSortChange: fn(),
    onClear: fn(),
    onLock: fn(),
    onExpand: fn(),
  },
} satisfies Meta<typeof SmartFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    size: 'normal',
    exampleHeight: 600,
    exampleWidth: 1000,
    enableSort: true,
    showSearchIcon: true,
  },
};
