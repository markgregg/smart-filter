import { FaAsterisk, FaArtstation, FaAvianex } from 'react-icons/fa';
import { SmartFilter } from '@/components/SmartFilter';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import style from './style.module.less';

export function App() {
  return (
    <div className={style.mainContainer}>
      <div className={style.mainMultiselect}>
        <SmartFilter
          allowLocking
          fields={[
            {
              name: 'test',
              title: 'test',
              operators: ['=', '!'],
              fieldMatchers: [
                {
                  source: ['test', 'test1', 'test2', 'test3', 'test4', 'test5'],
                },
              ],
              allowList: true,
              allowRange: true,
              allowBlanks: true,
            },
            {
              name: 'test2',
              title: 'test2',
              operators: ['=', '!'],
              fieldMatchers: [],
              allowList: true,
              editorType: 'text',
              allowRange: true,
              iconMap: new Map([
                ['test', FaAsterisk],
                ['test2', FaArtstation],
                ['test3', FaAvianex],
              ]),
              display: 'both',
            },
            {
              name: 'bool',
              title: 'boolean',
              operators: ['=', '!'],
              fieldMatchers: [],
              editorType: 'bool',
            },
            {
              name: 'date',
              title: 'date',
              operators: ['=', '!'],
              fieldMatchers: [],
              editorType: 'date',
              min: '01/01/2025',
              allowList: true,
            },
            {
              name: 'datetime',
              title: 'date time',
              operators: ['=', '!'],
              fieldMatchers: [],
              editorType: 'datetime',
              allowList: true,
            },
            {
              name: 'integer',
              title: 'integer',
              operators: ['=', '!'],
              fieldMatchers: [],
              editorType: 'integer',
              allowRange: true,
              allowList: true,
            },
            {
              name: 'float',
              title: 'float',
              operators: ['=', '!'],
              fieldMatchers: [],
              editorType: 'float',
              allowList: true,
            },
          ]}
          operators={[
            { symbol: '=', description: 'Equals' },
            { symbol: '!', description: 'Not equals' },
          ]}
          hints={{
            hintGroups: [
              {
                title: 'test',
                field: 'test',
                hints: [
                  { display: 'test', text: 'test', value: 'test' },
                  { display: 'test1', text: 'test1', value: 'test1' },
                  { display: 'test2', text: 'test2', value: 'test2' },
                  { display: 'test3', text: 'test3', value: 'test3' },
                  { display: 'test4', text: 'test4', value: 'test4' },
                  { display: 'test5', text: 'test5', value: 'test5' },
                ],
              },
              {
                title: 'test2',
                field: 'test2',
                hints: [
                  {
                    display: (
                      <div>
                        test <FaAsterisk />
                      </div>
                    ),
                    text: 'test',
                    value: 'test',
                  },
                  {
                    display: (
                      <div>
                        test1 <FaArtstation />
                      </div>
                    ),
                    text: 'test1',
                    value: 'test1',
                  },
                  {
                    display: (
                      <div>
                        test2 <FaAvianex />
                      </div>
                    ),
                    text: 'test2',
                    value: 'test2',
                  },
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
