# SmartFilter
The SmartFilter is the highest level of the component. The component creates the state provider, which enables all lower level components to access state.

# SmartFilterAgAGrid
The SmartFilterAgGrid is a wrapper around SmartFilter that utilises the AgGrid API to automatically configure the SmartFilter and apply state and sort order. 

SmartFilterAgGrid has all the same properties as SmartFilter the the addition of AgGrid API and Filter function on change event. 

If fields are passed as properties to SmartFilterAgGrid, the fields will override the behaviour of the configured fields. This approach can be used if you want to change the behaviour, or if you want to add a field that doesn't exist.

## Components

### Common Components
- [Boolean Toogle](docs/Components//common/BooleanToggle.md)
- [Button](docs/Components//common/Button.md)
- [Tooltip](docs/Components//common/ToolTip.md)
- [TooltipButton](docs/Components//common/ToolTipButton.md)

### Main Components
- [Array](docs/Components/Array.md)
- [CloseButton](docs/Components/CloseButton.md)
- [Dropdown](docs/Components/Dropdown.md)
- [FilterBar](docs/Components/FilterBar.md)
- [MainSearch](docs/Components/MainSearch.md)
- [Options](docs/Components/Options.md)
- [Pill](docs/Components/Pill.md)
- [PillContainer](docs/Components/PillContainer.md)
- [SearchBox](docs/Components/SearchBox.md)
- [Sort](docs/Components/CloseButton.md)
- [SortPill](docs/Components/CloseButton.md)
- [Suggestions](docs/Components/CloseButton.md)

## Hooks
- [UseExternalClicks](docs/hooks/UseExternalClicks.md)
- [useSizeWatcher](docs/hooks/useSizeWatcher.md)

## State
- [Overview](docs/state/Overview.md)
- [ArrayStore](docs/state/ArrayStore.md)
- [BracketStore](docs/state/BracketStore.md)
- [ConfigStore](docs/state/ConfigStore.md)
- [FilterBarStore](docs/state/FilterBarStore.md)
- [FocusStore](docs/state/FocusStore.md)
- [HintStore](docs/state/HintStore.md)
- [ManagedStore](docs/state/ManagedStore.md)
- [MatcherStore](docs/state/MatcherStore.md)
- [OptionsStore](docs/state/OptionsStore.md)
- [SortStore](docs/state/SortStore.md)
- [StateProvider](docs/state/StateProvider.md)
- [UseState](docs/state/UseState.md)

### Types
- [AgField](docs/types/AgField.md)
- [AgGrid](docs/types/AgGrid.md)
- [Field](docs/types/Field.md)
- [FieldMatches](docs/types/FieldMatches.md)
- [Hint](docs/types/Hint.md)
- [Matcher](docs/types/Matcher.md)
- [Matchers](docs/types/Matchers.md)
- [Operator](docs/types/Operator.md)
- [Option](docs/types/Option.md)
- [PasteOptions](docs/types/PasteOptions.md)
- [SmartFilterProps](docs/types/SmartFilterProps.md)
- [SmartFilterPropsAgGrid](docs/types/SmartFilterPropsAgGrid.md)
- [Sort](docs/types/Sort.md)
- [UiProperties](docs/types/UiProperties.md)
- [Values](docs/types/Values.md)

### Util
- [Colours](docs/util/Colours.md)
- [Common](docs/util/Common.md)
- [Constants](docs/util/Constants.md)
- [DragDrop](docs/util/DragDrop.md)
- [Functions](docs/types/Functions.md)

### AgGrid
- [ClientApi](docs/aggrid/ClientApi.md)
