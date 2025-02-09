# Field
The field type details how feilds should behave, their type, if they are lists or ranges, their match definitions and numerous other options.

## name
The name of the field. Is used to reference the field everywhere else.
## #title
The display name for the field.
## operators
Comparsion operators that can be used for the field.
## defaultComparison
Default comparison operator to use when one isn't supplied.
## editorType
The type of editor used. If supplied then a match isn't required and if user enters text that matches the data type it will appear in the options list. Can be one of the following;
- 'bool'
- 'integer'
- 'float'
- 'text'
- 'date'
- 'datetime'
- 'dateString'
- 'datetimeString'
## fieldMatchers
Field matches are used to match entered text into an option
## dateTimeFormat
If the field is a date or datetime, then this is the format specifier.
## min
Min value allowed.
## max
Max value allowed.
## increments
When using a numeric editor, this is the value the up and down arrows iwll increment and decrement by. The number can be a fraction.
## precedence
The higher the value, the higher options for the field will appear in the options list.
## instanceLimit
Number of pills for this fill that can be selected in a filter sentence.
## allowList
If true lists can be entered for the field.
## allowRange
If true ranges can be enrted for the field.
## allowBlanks
If true blanks (nulls) can be entered for the field.
## excludeFromSorting
If true the field can not be used for sorting. To sort, sorting must be enabled in the main properties.
## iconMap
If icons are to be displayed. This map will be used to determine the icon to show for a value.
## display
Controls the pills display, can be text, icon, or both.
## textGetter
A method that will extract text from an object. Requried if working with complex objects.
## valueGetter
A method that will extract a value from an object. Requried if working with complex objects.
## displayComponent
If using a custom display component, set the component here.
## editComponent
If using a custom edit component, set the component here.

[Types Overview](./types/Overview.md)