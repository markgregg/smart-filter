import React from 'react';
import { SmartFilterAgGridProps } from '@/types/SmartFilterPropsAgGrid';
import { createClientApi } from '@/aggrid/ClientApi';
import { Field, Hints, Matcher } from '@/types';
import { constructFields } from './functions';

export const SmartFilter = React.memo((props: SmartFilterAgGridProps) => {
  const {
    gridApi,
    columnApi,
    onFiltersChanged,
    onChange,
    matchers,
    fields,
    hints,
    dateFormats,
    displayDateFormat,
  } = props;

  const agClientApi = React.useMemo(() => createClientApi(gridApi, columnApi), [gridApi, columnApi]);

  React.useEffect(() => {
    if (agClientApi && onFiltersChanged) {
      const filter = agClientApi.constructFilter(matchers ?? []);
      onFiltersChanged(filter);
    }
  }, [matchers, agClientApi]);

  const { overriddenFields, overriddenHints } = React.useMemo<{ overriddenFields: Field[], overriddenHints: Hints }>(() => {
    const autoFields = constructFields(agClientApi, fields, dateFormats, displayDateFormat) ?? [];
    return {
      overriddenHints: {
        hintsPerColumn: hints?.hintsPerColumn,
        hintWidth: hints?.hintWidth,
        hintGroups: hints?.hintGroups?.map((hint) => {
          const column = agClientApi?.getAgColumn(hint.field);
          return {
            ...hint,
            hints: hint.hints
              ? hint.hints
              : agClientApi && column
                ? () => {
                  return agClientApi.findUniqueHintValues(
                    column,
                    hints.hintsPerColumn,
                    column?.getColDef().filterValueGetter,
                  );
                }
                : []
          }
        }) ?? [],
      },
      overriddenFields: [
        ...(autoFields),
        ...((fields?.filter((f) => !autoFields?.find((a) => a.name === f.name) && f.title) as Field[]) ?? []),
      ],
    }
  }, [fields, hints, agClientApi, dateFormats, displayDateFormat]);

  const handleChanged = React.useCallback((m: Matcher[]) => {
    if (agClientApi) {
      if (onFiltersChanged) {
        const filter = agClientApi.constructFilter(m);
        onFiltersChanged(filter);
      }
      if (onChange) {
        onChange(m);
      }
    }
  }, [agClientApi, onFiltersChanged, onChange]);


  return (<SmartFilter
    {...props}
    fields={overriddenFields}
    hints={overriddenHints}
    onChange={handleChanged}
  />)
});
