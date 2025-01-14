import type { Meta, StoryObj } from '@storybook/react';

import { SmartFilterAgGrid } from './SmartFilterAgGrid';

const meta = {
  component: SmartFilterAgGrid,
} satisfies Meta<typeof SmartFilterAgGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};