import React from 'react';
import { SmartFilterAgGridProps } from '@/types/SmartFilterPropsAgGrid';
import { createClientApi } from '@/aggrid/ClientApi';
import { Field, Hints, Matcher } from '@/types';
import { constructFields } from './functions';
import { SmartFilter } from '../SmartFilter/SmartFilter';

export const SmartFilterAgGrid = React.memo((props: SmartFilterAgGridProps) => {
  const {
    gridApi,
    columnApi,
    onFiltersChange,
    onChange,
    matchers,
    fields,
    hints,
    maxOptions,
    dateFormats,
    displayDateFormat,
    returnAllOptions,
  } = props;

  const agClientApi = React.useMemo(
    () => createClientApi(gridApi, columnApi),
    [gridApi, columnApi],
  );

  React.useEffect(() => {
    if (agClientApi && onFiltersChange) {
      const filter = agClientApi.constructFilter(matchers ?? []);
      onFiltersChange(filter);
    }
  }, [matchers, agClientApi]);

  const { overriddenFields, overriddenHints } = React.useMemo<{
    overriddenFields: Field[];
    overriddenHints: Hints;
  }>(() => {
    const autoFields =
      constructFields(
        agClientApi,
        fields,
        dateFormats,
        displayDateFormat,
        returnAllOptions,
        maxOptions,
      ) ?? [];
    return {
      overriddenHints: {
        hintsPerColumn: hints?.hintsPerColumn,
        hintWidth: hints?.hintWidth,
        hintGroups:
          hints?.hintGroups?.map((hint) => {
            const column = agClientApi?.getAgColumn(hint.field);
            const { filterValueGetter } = column?.getColDef() ?? {};
            return {
              ...hint,
              hints: hint.hints
                ? hint.hints
                : agClientApi && column
                  ? () =>
                      agClientApi.findUniqueHintValues(
                        column,
                        hints.hintsPerColumn,
                        typeof filterValueGetter === 'function'
                          ? filterValueGetter
                          : undefined,
                      )
                  : [],
            };
          }) ?? [],
      },
      overriddenFields: [
        ...autoFields,
        ...((fields?.filter(
          (f) => !autoFields?.find((a) => a.name === f.name),
        ) as Field[]) ?? []),
      ],
    };
  }, [fields, hints, agClientApi, dateFormats, displayDateFormat]);

  const handleChanged = React.useCallback(
    (m: Matcher[]) => {
      if (agClientApi) {
        if (onFiltersChange) {
          const filter = agClientApi.constructFilter(m);
          onFiltersChange(filter);
        }
        if (onChange) {
          onChange(m);
        }
      }
    },
    [agClientApi, onFiltersChange, onChange],
  );

  return (
    <SmartFilter
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      fields={overriddenFields}
      hints={overriddenHints}
      onChange={handleChanged}
    />
  );
});
