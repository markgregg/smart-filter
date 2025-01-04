import * as React from 'react';
import AgGridViewManager, {
  AgGridViewManagerApi,
  View,
  localStoragePersistence,
} from 'ag-grid-view-manager';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import { SmartFilter } from '@/components/SmartFilter';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import style from './style.module.less';

export const App = () => {

  return (
    <div className={style.mainContainer}>
      <div className={style.mainMultiselect}>
        <SmartFilter
          fields={[
            {
              name: 'test', title: 'test', operators: ['=', '!'],
              fieldMatchers: [
                {
                  source: ['test', 'test1', 'test2', 'test3', 'test4', 'test5']
                }
              ],
              allowList: true, allowRange: true, allowBlanks: true
            },
            { name: 'test2', title: 'test2', operators: ['=', '!'], fieldMatchers: [], allowList: true, editorType: 'text' },
            { name: 'bool', title: 'boolean', operators: ['=', '!'], fieldMatchers: [], editorType: 'bool' },
            { name: 'date', title: 'date', operators: ['=', '!'], fieldMatchers: [], editorType: 'date', min: '01/01/2025', allowList: true },
            { name: 'datetime', title: 'date time', operators: ['=', '!'], fieldMatchers: [], editorType: 'datetime', allowList: true },
            { name: 'integer', title: 'integer', operators: ['=', '!'], fieldMatchers: [], editorType: 'integer', allowRange: true, allowList: true },
            { name: 'float', title: 'float', operators: ['=', '!'], fieldMatchers: [], editorType: 'float', allowList: true }
          ]}
          operators={[{ symbol: '=', description: 'Equals' }, { symbol: '!', description: 'Not equals' }]}
          hints={{
            hintGroups: [
              {
                title: 'test',
                field: 'test',
                hints: [
                  { field: 'test', dislayText: 'test', text: 'test', value: 'test' },
                  { field: 'test', dislayText: 'test1', text: 'test1', value: 'test1' },
                  { field: 'test', dislayText: 'test2', text: 'test2', value: 'test2' },
                  { field: 'test', dislayText: 'test3', text: 'test3', value: 'test3' },
                  { field: 'test', dislayText: 'test4', text: 'test4', value: 'test4' },
                  { field: 'test', dislayText: 'test5', text: 'test5', value: 'test5' }
                ]
              },
              {
                title: 'test2',
                hints: [
                  { field: 'test2', dislayText: 'test', text: 'test', value: 'test' },
                  { field: 'test2', dislayText: 'test1', text: 'test1', value: 'test1' },
                  { field: 'test2', dislayText: 'test2', text: 'test2', value: 'test2' },
                ]
              }
            ]
          }}
        />
      </div>
    </div>
  );
}
