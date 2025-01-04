/* import Matcher from '../component/types/Matcher'
import Config from '../component/types/Config'
import Field, {
  defaultComparison,
  numberComparisons,
  stringComparisons,
} from '../component/types/Field'

const matcherAnd: Matcher = {
  key: 'test',
  operator: '&',
  comparison: '=',
  field: 'test',
  value: 'value',
  text: 'text',
}

const openBracket: Matcher = {
  key: 'test',
  operator: '&',
  comparison: '(',
  field: '',
  value: '',
  text: '',
}

const closeBracket: Matcher = {
  key: 'test',
  operator: '&',
  comparison: ')',
  field: '',
  value: '',
  text: '',
}

const testFields: Field[] = [
  {
    name: 'list',
    title: 'list of strings',
    comparisons: defaultComparison,
    precedence: 2,
    selectionLimit: 2,
    definitions: [
      {
        source: ['asdas', 'assda', 'loadsp'],
      },
    ],
  },
  {
    name: 'promise',
    title: 'Promise list',
    comparisons: defaultComparison,
    precedence: 1,
    definitions: [
      {
        source: async (text) =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(
                  ['delayed', 'aploked', 'loadxx'].filter((item) =>
                    item.includes(text),
                  ),
                ),
              250,
            )
          }),
      },
    ],
  },
  {
    name: 'function',
    title: 'Functions',
    comparisons: numberComparisons,
    definitions: [
      {
        match: (text: string) => !Number.isNaN(Number(text)),
        value: (text: string) => Number.parseInt(text, 10),
      },
    ],
  },
  {
    name: 'regex',
    title: 'Regular Expression',
    comparisons: stringComparisons,
    precedence: 3,
    definitions: [
      {
        match: /^[a-zA-Z]{2,}$/,
        value: (text: string) => text,
      },
    ],
  },
]

const testConfig: Config = {
  fields: testFields,
  defaultComparison: '=',
  and: '&',
  or: '|',
  comparisons: ['=', '!', '*', '!*', '<*', '>*', '>', '<', '>=', '<=', '!'],
  comparisonDescriptions: [],
  operators: 'Complex',
  defaultItemLimit: 10,
}

const testConfig2: Config = {
  fields: testFields,
  defaultComparison: '=',
  and: '&',
  or: '|',
  comparisons: ['=', '!', '*', '!*', '<*', '>*', '>', '<', '>=', '<=', '!'],
  comparisonDescriptions: [{ symbol: '=', description: 'equals' }],
  operators: 'Complex',
  defaultItemLimit: 10,
  functions: [
    {
      name: 'testfunc',
    },
  ],
}

const singleMatcher: Matcher[] = [
  {
    key: 'test',
    operator: '&',
    comparison: '=',
    field: 'test',
    value: 'value',
    text: 'text',
  },
]

const dualMatchers = (comp: string): Matcher[] => [
  {
    key: 'test',
    operator: '&',
    comparison: comp,
    field: 'test',
    value: 'value',
    text: 'text',
  },
  {
    key: 'test2',
    operator: '&',
    comparison: comp,
    field: 'test',
    value: 'value',
    text: 'text',
  },
]

const multipleMatchers: Matcher[] = [
  {
    key: 'test',
    operator: '&',
    comparison: '=',
    field: 'test',
    value: 'value',
    text: 'text',
  },
  {
    key: 'test2',
    operator: '|',
    comparison: '=',
    field: 'test',
    value: 'value2',
    text: 'text2',
  },
  {
    key: 'test3',
    operator: '&',
    comparison: '=',
    field: 'test',
    value: 'value3',
    text: 'text3',
  },
]

const multipleListMatchers: Matcher[] = [
  {
    key: 'test',
    operator: '&',
    comparison: '=',
    field: 'list',
    value: 'value',
    text: 'text',
  },
  {
    key: 'test2',
    operator: '|',
    comparison: '=',
    field: 'list',
    value: 'value2',
    text: 'text2',
  },
  {
    key: 'test3',
    operator: '&',
    comparison: '=',
    field: 'test',
    value: 'value3',
    text: 'text3',
  },
]

export {
  singleMatcher,
  dualMatchers,
  multipleMatchers,
  multipleListMatchers,
  matcherAnd,
  testConfig,
  testConfig2,
  testFields,
  openBracket,
  closeBracket,
}
*/
