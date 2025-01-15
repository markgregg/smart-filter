import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useConfig, useSort, useSortDrag } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { Sort, SortDirection } from '@/types';
import { Colours } from '@/util/colours';
import { SortOption } from '@/components/Suggestions/Operators/FieldSelection/SortOption';
import { clonePill, removePillFromDocument } from '@/util/dragDrop';
import { IoCaretUpSharp, IoCaretDownSharp } from "react-icons/io5";
import { MdDragIndicator } from 'react-icons/md';
import s from './style.module.less';

interface SortItemProps {
  sort: Sort;
  index: number;
}

export const SortItem = React.memo(({ sort, index }: SortItemProps) => {
  const clonedPillRef = React.useRef<HTMLElement | null>(null);
  const { fieldMap } = useConfig((state) => state);
  const field = React.useMemo(
    () => fieldMap?.get(sort.field),
    [fieldMap, sort],
  );
  const { removeSort, updateSort, moveTo, moveUp, moveDown, sort: sortArray } = useSort((state) => state);
  const {
    draggedItem,
    dragOverItem,
    setDragItem,
    setDraggedOverItem,
    clearDragOverItem,
    clearItems,
  } = useSortDrag((state) => state);

  const handleDeleteArrayItem = React.useCallback(() => {
    removeSort(sort.field);
  }, [removeSort, sort]);

  const handleMoveUp = React.useCallback(
    () => {
      moveUp(index);
    },
    [moveUp, index],
  );

  const handleMoveDown = React.useCallback(
    () => {
      moveDown(index);
    },
    [moveDown, index],
  );

  const handleSelect = React.useCallback(
    (selectedField: string, sortDirection: SortDirection) => {
      updateSort(selectedField, sortDirection);
    },
    [updateSort],
  );

  const handleDragStart = React.useCallback(
    (event: React.DragEvent) => {
      if (!draggedItem || draggedItem.item.field !== sort.field) {
        setDragItem(sort, index);
        clonedPillRef.current = clonePill(event.currentTarget as HTMLElement);
        event.dataTransfer.dropEffect = 'move';
        const xLoc = Math.round(clonedPillRef.current.clientWidth / 2);
        event.dataTransfer.setDragImage(clonedPillRef.current, xLoc, 20);
        event.stopPropagation();
      }
    },
    [draggedItem, setDragItem, sort],
  );

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (draggedItem && draggedItem.item.field !== sort.field) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const position =
          bounds.top + bounds.height / 2 > event.clientY ? 'before' : 'after';
        if (
          draggedItem.item.field !== sort.field &&
          (!dragOverItem ||
            dragOverItem.item.field !== sort.field ||
            dragOverItem.position !== position)
        ) {
          setDraggedOverItem(sort, index, position);
        }
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
      } else {
        clearDragOverItem();
      }
    },
    [draggedItem, dragOverItem, sort, index, setDraggedOverItem],
  );

  const clearClonedPill = React.useCallback(() => {
    if (clonedPillRef.current) {
      removePillFromDocument(clonedPillRef.current);
      clonedPillRef.current = null;
    }
  }, [removePillFromDocument]);

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      if (dragOverItem && draggedItem) {
        moveTo(
          draggedItem.index,
          dragOverItem.index,
          dragOverItem.position ?? 'before',
        );
      }
      clearItems();
      clearClonedPill();
      event.stopPropagation();
    },
    [draggedItem, dragOverItem, clearClonedPill, clearItems, moveTo],
  );

  const handleDragEnd = React.useCallback(
    (event: React.DragEvent) => {
      clearItems();
      clearClonedPill();
      event.stopPropagation();
    },
    [clearClonedPill, clearItems],
  );

  return (
    <div className={s.sortItemWrapper}>
      {dragOverItem?.item?.field === sort.field &&
        dragOverItem?.position === 'before' && <div className={s.topInsert} />}
      <div
        className={s.sortItem}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        <Button
          onClick={handleDeleteArrayItem}
          height={12}
          width={12}
          color={Colours.buttons.arrayItem}
          hoverColor={Colours.buttons.arrayItemhover}
          backgroundColor={Colours.buttons.arrayItembackground}
          hoverBackgroundColor={Colours.buttons.arrayItemHoverBackground}
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        >
          <IoClose />
        </Button>
        <div className={s.sortOption} id="pill-content">
          {field && <SortOption field={field} onSelect={handleSelect} />}
        </div>
        <Button
          onClick={handleMoveUp}
          height={26}
          width={26}
          disabled={index === 0}
        >
          {index > 0 ? <IoCaretUpSharp /> : <div />}
        </Button>
        <Button
          onClick={handleMoveDown}
          height={26}
          width={26}
          disabled={index === sortArray.length - 1}
        >
          {index < sortArray.length - 1 ? <IoCaretDownSharp /> : <div />}
        </Button>
        <MdDragIndicator className={s.dragIndicator} />
      </div>
      {dragOverItem?.item?.field === sort.field &&
        dragOverItem?.position === 'after' && (
          <div className={s.bottomInsert} />
        )}
    </div>
  );
});
