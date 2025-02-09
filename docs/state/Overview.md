# State Overview
State is managed by zustand, which is lightweight and fast.

## Interaction with state
STate is provided to the app by a combination of React.Context and hooks. The [StateProvider](docs/state/StateProvider.md) provides the context and is implemtned in the top level component.

State is access by components lower down in the tree by using [hooks](docs/state/UseState.md)

## State Stores
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