import { MouseEvent } from 'react';
import { Layout } from '@design-system';
import Icon from '../icon/Icon';

interface EmojiButtonProps {
  onClick?: () => void;
}

function EmojiButton({ onClick }: EmojiButtonProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Layout.FlexRow w={48} h={48} alignItems="center" justifyContent="center" m={0}>
      <Icon name="add_reaction" size={23} onClick={handleClick} />
    </Layout.FlexRow>
  );
}

export default EmojiButton;
