# Hint
The hint type represents suggestions in the dropdown list. There are three types of suggestion.

## SingleValueHint 
Repsents a sinlge hint.
### text
The text for the option
### value
The value of the option
### comparison?
if the comparison isn't the default, it needs to be set.
### display
Only really required if comparson is set and you want to make that clear in the option text.

## interface RangeHint 
Used for an option that represent a range.
### text
Option from text
### value
Option from Value
### textTo
Option to text
### valueTo
Option to value
### display
The display text for the option

## interface ArrayHint
This option represents a list of items
### textArray
An array of text 
### valueArray
An array of values
### comparison
if the comparison isn't the default, it needs to be set.
### display
The display text for the option

## stirng
Hints can also just be a single string.

[Types Overview](./Overview.md)