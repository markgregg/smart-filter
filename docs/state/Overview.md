# State Overview
State is managed by zustand, which is lightweight and fast.

## Interaction with state
STate is provided to the app by a combination of React.Context and hooks. The [StateProvider](./state/StateProvider.md) provides the context and is implemtned in the top level component.

State is access by components lower down in the tree by using [hooks](./state/UseState.md)

## State Stores
- [ArrayStore](./state/ArrayStore.md)
- [BracketStore](Overview.md/state/BracketStore.md)
- [ConfigStore](./state/ConfigStore.md)
- [FilterBarStore](./state/FilterBarStore.md)
- [FocusStore](./state/FocusStore.md)
- [HintStore](./state/HintStore.md)
- [ManagedStore](./state/ManagedStore.md)
- [MatcherStore](./state/MatcherStore.md)
- [OptionsStore](./state/OptionsStore.md)
- [SortStore](./state/SortStore.md)
- [StateProvider](./state/StateProvider.md)
- [UseState](./state/UseState.md)