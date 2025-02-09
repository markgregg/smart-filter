# FieldMatches
This define the method to extract options from text a user entered.

## ListMatch
List matches should be used when you have a static list of values.
### minimumSearchLength
The minimum number of characters to be entered before searching for matches in the list.
### source
A list of items.
### matchOnPaste
If true, the list will be search when a user pastes into the component.
### ignoreCase?: boolean;
If true, the case of items in the list will be ignored.

## PromiseMatch
A promise match is a look up that returns a promise. It should be used if you need to make a remote call to find a match.
### minimumSearchLength
The minimum number of characters to be entered before calling the lookup.
### lookup
This is a function that returns a promise.
### lookupOnPaste
A function that returns a sigle item promise. This function is used to match text when items are pasted in the components.

## ValueMatch
The value match is a match against a regex or a javascript function. It will only ever match to an individual item.
### matchOnPaste
If true, the regex or function will be called when the user pastes text into the component.
### match
The regex or javascript function.
### value
A javascript function that when given text returns a value.
### label
A javascript funciton that when given a value returns text.


[Types Overview](./types/Overview.md)