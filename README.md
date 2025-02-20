# Smart Filter

Smart Filter is a powerful tool designed to help you filter and manage your data efficiently.

## Features

- Easy to use interface
- Advanced filtering options
- Flexible and powerful filtering
- Customizable filters

#### Lists
![Lists](./docs/images/Lists.png)

#### Ranges
![Ranges](./docs/images/Ranges.png)

#### Boolean
![Boolean](./docs/images/Boolean.png)

#### Dates
![Dates](./docs/images/Dates.png)

#### Numbers
![Numbers](./docs/images/Numbers.png)

#### Filter Sentences
![Filter Sentences](./docs/images/FullFilterSentence.png)

#### Partial Filter Sentences
![Partial Filter Sentences](./docs/images/FullFilterSentence.png)

#### Quick Entry
![Quick Entry](./docs/images/QuickFilter1.png)

#### Lookups
![Lookups](./docs/images/Lookups.png)

## demo page
[Demo Page](https://markgregg.github.io/smart-filter/?path=/story/examples-smartfilter--primary)

## Installation

To install Smart Filter, follow these steps:

```bash
npm i smart-filter
```

## Usage
There are two versions of the SmartFilter. The standalone version that can work with any grid and data soruce, and the Ag-Grid version that is configured using the Ag-Grid column defintions.

### SmartFitler
The StandAlone SmartFilter should be used if you are not using Ag-Grid or if you are using a server-side data source.

```
const fields = [
  {
    name: 'isin',
    title: 'ISIN',
    operators: ['=', '!'],
    fieldMatchers: [
      {
        lookup: (text: string) => findMatching(text, (bond) => bond.isin),
        lookupOnPaste: (text: string) => findItem(text, (bond) => bond.isin),
      },
    ],
    allowList: true,
    allowBlanks: true,
  },
  {
    name: 'side',
    title: 'Side',
    operators: ['=', '!'],
    fieldMatchers: [
      {
        ignoreCase: true,
        source: ['BUY', 'SELL'],
      },
    ],
    allowBlanks: true,
  },
  {
    name: 'currency',
    title: 'CCY',
    operators: ['=', '!'],
    fieldMatchers: [
      {
        lookup: (text: string) => findMatching(text, (bond) => bond.currency),
      },
    ],
    allowList: true,
    allowBlanks: true,
  },
  {
    name: 'issueDate',
    title: 'IssueDate',
    operators: numberComparisons,
    editorType: 'dateString',
    dateTimeFormat: 'YYYY-MM-DD',
    allowRange: true,
    allowBlanks: true,
    precedence: 8,
  },
  {
    name: 'maturityDate',
    title: 'MaturityDate',
    operators: numberComparisons,
    editorType: 'dateString',
    dateTimeFormat: 'YYYY-MM-DD',
    allowRange: true,
    allowBlanks: true,
    precedence: 9,
  },
  {
    name: 'coupon',
    title: 'Coupon',
    operators: numberComparisons,
    editorType: 'float',
    allowRange: true,
    allowBlanks: true,
    precedence: 7,
  },
  {
    name: 'issuer',
    title: 'Issuer',
    operators: stringComparisons,
    editorType: 'text',
    allowList: true,
    allowBlanks: true,
  },
  {
    name: 'hairCut',
    title: 'Hair Cut',
    operators: numberComparisons,
    editorType: 'float',
    allowRange: true,
    allowBlanks: true,
    precedence: 6,
  },
  {
    name: 'active',
    title: 'Active',
    operators: defaultComparisons,
    editorType: 'bool',
    allowBlanks: true,
    precedence: 10,
  },
  {
    name: 'sector',
    title: 'Sector',
    operators: ['=', '!'],
    fieldMatchers: [
      {
        lookup: (text: string) =>
          findMatching(text, (bond) => bond.categories.sector),
      },
    ],
    allowList: true,
    allowBlanks: true,
  },
];

const operators: Operator[] = [
  { symbol: '=', description: 'Equals' },
  { symbol: '!', description: 'Not equals' },
];

const hintGroups: HintGrouping[] = [
  {
    title: 'CCY',
    field: 'currency',
    hints: ['GBP', 'USD', 'EUR'],
  },
  {
    title: 'Maturity',
    field: 'maturityDate',
    hints: [
      {
        display: '< 5Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        comparison: '<',
      },
      {
        display: '5Y - 10Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '10Y - 15Y',
        text: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '15Y - 20Y',
        text: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '20Y - 30Y',
        text: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '30Y - 40Y',
        text: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '> 40Y',
        text: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        comparison: '>',
      },
    ],
  },
  {
    title: 'Active',
    field: 'active',
    hints: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
  {
    title: 'Coupon',
    field: 'coupon',
    hints: [
      {
        display: '< 0.5',
        text: '0.5',
        value: 0.5,
        comparison: '<',
      },
      {
        display: '0.5 - 1',
        text: '0.5',
        value: 0.5,
        textTo: '1',
        valueTo: 1,
      },
      {
        display: '1 - 2',
        text: '1',
        value: 1,
        textTo: '2',
        valueTo: 2,
      },
      {
        display: '2 - 3',
        text: '2',
        value: 2,
        textTo: '3',
        valueTo: 3,
      },
      {
        display: '3 - 4',
        text: '3',
        value: 3,
        textTo: '4',
        valueTo: 4,
      },
      {
        display: '4 - 5',
        text: '4',
        value: 4,
        textTo: '5',
        valueTo: 5,
      },
      {
        display: '> 5',
        text: '5',
        value: 5,
        comparison: '>',
      },
    ],
  },
];

<SmartFilterComponent
  matchers={matchers}
  onChange={handleChange}
  fields={fields}
  operators={operators}
  hints={hints}
  size={size}
  showUndoIcon={!queryParams.noIcons}
/>
```

### SmartFilterAgGrid
The Ag-Grid version of SmartFilter should be used if you are using Ag-Grid with a client side row model.

```
const operators: Operator[] = [
  { symbol: '=', description: 'Equals' },
  { symbol: '!', description: 'Not equals' },
];

const hintGroups: HintGrouping[] = [
  {
    title: 'CCY',
    field: 'currency',
    hints: ['GBP', 'USD', 'EUR'],
  },
  {
    title: 'Maturity',
    field: 'maturityDate',
    hints: [
      {
        display: '< 5Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        comparison: '<',
      },
      {
        display: '5Y - 10Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '10Y - 15Y',
        text: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '15Y - 20Y',
        text: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '20Y - 30Y',
        text: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '30Y - 40Y',
        text: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '> 40Y',
        text: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        comparison: '>',
      },
    ],
  },
  {
    title: 'Active',
    field: 'active',
    hints: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
  {
    title: 'Coupon',
    field: 'coupon',
    hints: [
      {
        display: '< 0.5',
        text: '0.5',
        value: 0.5,
        comparison: '<',
      },
      {
        display: '0.5 - 1',
        text: '0.5',
        value: 0.5,
        textTo: '1',
        valueTo: 1,
      },
      {
        display: '1 - 2',
        text: '1',
        value: 1,
        textTo: '2',
        valueTo: 2,
      },
      {
        display: '2 - 3',
        text: '2',
        value: 2,
        textTo: '3',
        valueTo: 3,
      },
      {
        display: '3 - 4',
        text: '3',
        value: 3,
        textTo: '4',
        valueTo: 4,
      },
      {
        display: '4 - 5',
        text: '4',
        value: 4,
        textTo: '5',
        valueTo: 5,
      },
      {
        display: '> 5',
        text: '5',
        value: 5,
        comparison: '>',
      },
    ],
  },
];

<SmartFilterAgGridCompoent
  matchers={matchers}
  onChange={handleChange}
  onFiltersChange={handleFilterChange}
  operators={operators}
  hints={hints}
  size={size}
  showUndoIcon={!queryParams.noIcons}
  returnAllOptions
  gridApi={gridApi}
  columnApi={columnApi}
/>
```

## Contributions

[Code Structure](docs/Structure.md)

[Demos](docs/StoryBook.md)

[Testing](docs/Playwright.md)

[Merge Requests](docs/MergeRequests.md)