import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Colours } from '@/util/colours';
import { Button } from '../common/Button';
import s from './style.module.less';

interface CloseButtonProps {
  onClick: () => void;
}

export const CloseButton = React.memo(({ onClick }: CloseButtonProps) => (
  <div id="sf-pill-close" className={s.closeButton}>
    <Button
      onClick={onClick}
      height={12}
      width={12}
      color={Colours.buttons.delete}
      hoverColor={Colours.buttons.deleteHover}
      backgroundColor={Colours.buttons.deleteBackground}
      hoverBackgroundColor={Colours.buttons.deleteHoverBackground}
      style={{
        alignSelf: 'center',
        marginLeft: '3px',
        paddingBlock: 0,
        paddingInline: 0,
        borderRadius: '3px',
      }}
    >
      <IoClose />
    </Button>
  </div>
));
