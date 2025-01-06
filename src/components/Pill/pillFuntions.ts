export const clonePill = (pill: HTMLElement): HTMLElement => {
  const clonedPill = pill.cloneNode(true) as HTMLElement;
  clonedPill.style.position = 'absolute';
  clonedPill.style.left = '-10000px';
  clonedPill.style.top = '-10000px';
  clonedPill.style.width = `${pill.clientWidth}px`;
  clonedPill.style.height = `${pill.clientHeight}px`;

  const childrenToRemove: ChildNode[] = [];
  clonedPill.childNodes.forEach((child) => {
    if (!('id' in child) || child.id !== 'pill-content') {
      childrenToRemove.push(child);
    }
  });
  childrenToRemove.forEach((child) => clonedPill.removeChild(child));

  const childrenToRemove2: ChildNode[] = [];
  clonedPill.firstChild?.childNodes.forEach((child) => {
    if (!('id' in child) || child.id === 'pill-close') {
      childrenToRemove2.push(child);
    }
  });
  childrenToRemove2.forEach((child) =>
    clonedPill.firstChild?.removeChild(child),
  );
  document.body.appendChild(clonedPill);
  return clonedPill;
};

export const removePillFromDocument = (clonedPill: HTMLElement) => {
  if (document.body.contains(clonedPill)) {
    document.body.removeChild(clonedPill);
  }
};
