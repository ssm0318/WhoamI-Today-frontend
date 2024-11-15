import { MouseEvent } from 'react';
import { Layout } from '@design-system';
import { Note, Response } from '@models/post';
import Icon from '../icon/Icon';

interface EmojiButtonProps {
  post: Response | Note;
  onClick?: () => void;
}

function EmojiButton({ post, onClick }: EmojiButtonProps) {
  const { id } = post;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Layout.FlexRow alignItems="center" m={0}>
      {id && <Icon name="add_emoji" size={23} onClick={handleClick} />}
    </Layout.FlexRow>
  );
}

export default EmojiButton;
