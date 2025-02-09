# SmartFilter
The SmartFilter is the highest level of the component. The component creates the state provider, which enables all lower level components to access state.

# SmartFilterAgAGrid
The SmartFilterAgGrid is a wrapper around SmartFilter that utilises the AgGrid API to automatically configure the SmartFilter and apply state and sort order. 

SmartFilterAgGrid has all the same properties as SmartFilter the the addition of AgGrid API and Filter function on change event. 

If fields are passed as properties to SmartFilterAgGrid, the fields will override the behaviour of the configured fields. This approach can be used if you want to change the behaviour, or if you want to add a field that doesn't exist.

## Components

### Common Components
- [Boolean Toogle](./Components/common/BooleanToggle.md)
- [Button](./Components/common/Button.md)
- [Tooltip](./Components/common/ToolTip.md)
- [TooltipButton](./Components/common/ToolTipButton.md)

### Main Components
- [Array](./Components/Array.md)
- [CloseButton](./Components/CloseButton.md)
- [Dropdown](./Components/Dropdown.md)
- [FilterBar](./Components/FilterBar.md)
- [MainSearch](./Components/MainSearch.md)
- [Options](./Components/Options.md)
- [Pill](./Components/Pill.md)
- [PillContainer](./Components/PillContainer.md)
- [SearchBox](./Components/SearchBox.md)
- [Sort](./Components/CloseButton.md)
- [SortPill](./Components/CloseButton.md)
- [Suggestions](./Components/CloseButton.md)

## Hooks
- [UseExternalClicks](./hooks/UseExternalClicks.md)
- [useSizeWatcher](./hooks/useSizeWatcher.md)

## State
- [State Overview](./state/Overview.md)

### Types
- [Types Overview](./types/Overview.md)

### Util
- [Colours](./util/Colours.md)
- [Common](./util/Common.md)
- [Constants](./util/Constants.md)
- [DragDrop](./util/DragDrop.md)
- [Functions](./types/Functions.md)

### AgGrid
- [ClientApi](./aggrid/ClientApi.md)

[Main](../README.md)
