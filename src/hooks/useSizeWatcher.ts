import React from "react";

export const useSizeWatcher = (element: HTMLDivElement | null) => {
  const [width, setWidth] = React.useState<number | undefined>(element?.offsetWidth);
  const [height, setHeight] = React.useState<number | undefined>(element?.offsetHeight);

  React.useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const {
        width: elementWidth,
        height: elementHeight,
      } = entries[0].contentRect;

      setWidth(elementWidth);
      setHeight(elementHeight);
    });
    if (element) {
      observer.observe(element)
      setWidth(element.offsetWidth);
      setHeight(element.offsetHeight);
    }
    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [element]);

  return { width, height };
}