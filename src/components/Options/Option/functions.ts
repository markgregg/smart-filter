export const splitText = (
  itemText: string,
  matchText: string,
): [string, string, string] => {
  const index = itemText
    .toLocaleLowerCase()
    .indexOf(matchText.toLocaleLowerCase());
  return index === -1
    ? ['', itemText, '']
    : [
        itemText.substring(0, index),
        itemText.substring(index, index + matchText.length),
        itemText.substring(index + matchText.length, itemText.length),
      ];
};
