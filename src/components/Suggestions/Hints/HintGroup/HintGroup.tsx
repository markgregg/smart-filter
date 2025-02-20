import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { IconType } from 'react-icons';
import { TooltipButton } from '@/components/common/TooltipButton';
import { useConfig, useHint } from '@/state/useState';
import s from './style.module.less';

interface HintGroupProps {
  title: string;
  hints: number;
  selected?: boolean;
}

export const HintGroup = React.memo(
  ({ title, hints, selected }: HintGroupProps) => {
    const {
      hints: { hintsPerColumn = 3, hintWidth: width = 110 } = {},
      size = 'normal',
    } = useConfig((state) => state);
    const { selectHintGroup, clearSelection } = useHint((state) => state);

    const hasMore = !selected && hints > hintsPerColumn;

    const handleTitleClick = React.useCallback(() => {
      if (selected) {
        clearSelection();
      } else if (hasMore) {
        selectHintGroup(title);
      }
    }, [selected, clearSelection, selectHintGroup]);

    const renderTitle = (Icon?: IconType, selectable?: boolean) => (
      <div
        className={[s.groupTitle, s[size], selectable ? s.selectable : ''].join(
          ' ',
        )}
        style={{ width }}
      >
        {Icon ? `${title} (${hints})` : title}
        {Icon && <Icon />}
      </div>
    );

    const renderTooltipButton = (
      caption: string,
      idTitle: string,
      Icon?: IconType,
    ) => (
      <TooltipButton
        id={`sf-${idTitle}-group`}
        caption={caption}
        style={{ paddingBlock: 0, paddingInline: 0 }}
        onClick={handleTitleClick}
      >
        {renderTitle(Icon, true)}
      </TooltipButton>
    );

    const render = () => {
      if (selected) {
        return (
          <>{renderTooltipButton(`Close ${title}`, title, MdChevronLeft)}</>
        );
      }
      if (hasMore) {
        return (
          <>{renderTooltipButton(`Open ${title}`, title, MdChevronRight)}</>
        );
      }
      return <div className={s.nobutton}>{renderTitle()}</div>;
    };

    return <div className={s.hintGroup}>{render()}</div>;
  },
);
