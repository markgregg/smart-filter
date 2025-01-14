import React from 'react';
import { MainSearch } from '../MainSearch';
import { useBrackets, useFilterBar, useMatcher } from '../../state/useState';
import { Pill } from '../Pill/Pill';
import s from './style.module.less';

interface PillContainerProps {
  singleLine?: boolean;
  maxWidth: number;
}

export const PillContainer = React.memo(
  ({ singleLine, maxWidth }: PillContainerProps) => {
    const { matchers, editPosition, clearEditPosition } = useMatcher(
      (state) => state,
    );
    const { expanded, enableExpand, setEnableExpand } = useFilterBar(
      (state) => state,
    );
    const updateBracekts = useBrackets((state) => state.updateBracekts);

    React.useEffect(() => {
      updateBracekts(matchers);
    }, [matchers]);

    const checkWidth = (ref: HTMLDivElement | null) => {
      if (ref) {
        if (ref.scrollWidth > maxWidth) {
          if (!enableExpand) {
            setEnableExpand(true);
          }
        } else if (enableExpand && !expanded) {
          setEnableExpand(false);
        }
      }
    };

    const handleMainSearchClick = React.useCallback(
      (event: React.MouseEvent) => {
        clearEditPosition();
        event.stopPropagation();
      },
      [clearEditPosition],
    );

    return (
      <div
        className={[
          s.pillContainer,
          singleLine ? s.singleLine : s.multiLine,
        ].join(' ')}
        ref={checkWidth}
        style={{ maxWidth: maxWidth * 0.97 }}
      >
        {matchers.map((m, i) => (
          <React.Fragment key={m.key}>
            {i === editPosition && <MainSearch reducedWidth position={i} />}
            <Pill matcher={m} index={i} />
          </React.Fragment>
        ))}
        {editPosition === null ? (
          <MainSearch />
        ) : (
          <div
            className={s.searchPlaceholder}
            onClick={handleMainSearchClick}
          />
        )}
      </div>
    );
  },
);
