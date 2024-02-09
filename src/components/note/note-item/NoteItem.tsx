import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@components/_common/icon-button/IconButton';
import LikeButton from '@components/_common/like-button/LikeButton';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { Note } from '@models/note';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { NEW_NOTE_BUTTON_WIDTH } from '../new-note-button/NewNoteButton';

interface NoteItemProps {
  note: Note;
}

function NoteItem({ note }: NoteItemProps) {
  const { content, created_at, id } = note;
  const navigate = useNavigate();
  const [overflowActive, setOverflowActive] = useState<boolean>(false);

  const handleClickMore = (e: MouseEvent) => {
    e.stopPropagation();
    //
  };

  const handleClickNote = () => {
    return navigate(`/notes/${id}`);
  };

  const handleClickComment = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (content.length > MAX_NOTE_CONTENT_LENGTH) {
      setOverflowActive(true);
    }
  }, [content]);

  return (
    <Layout.FlexCol
      w={NOTE_WIDTH}
      p={12}
      gap={8}
      outline="LIGHT"
      rounded={12}
      onClick={handleClickNote}
    >
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at))}
        </Typo>
        <IconButton name="dots_menu" onClick={handleClickMore} />
      </Layout.FlexRow>
      <Layout.FlexCol
        style={{
          position: 'relative',
        }}
      >
        <Typo type="body-large" color="BLACK">
          {overflowActive ? (
            <>
              {`${content.slice(0, MAX_NOTE_CONTENT_LENGTH)}...`}
              <Typo type="body-medium" color="BLACK" italic underline ml={3}>
                more
              </Typo>
            </>
          ) : (
            content
          )}
        </Typo>
      </Layout.FlexCol>
      <Layout.FlexRow gap={12}>
        <LikeButton postType="Note" post={note} iconSize={24} m={0} />
        <IconButton name="comment" onClick={handleClickComment} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

const NOTE_GAP = 16;
const NOTE_MARGIN = 12;
export const NOTE_WIDTH = SCREEN_WIDTH - NEW_NOTE_BUTTON_WIDTH - 4 * NOTE_MARGIN - NOTE_GAP * 2;
export const NOTE_HEIGHT = 144;

const MAX_NOTE_CONTENT_LENGTH = 140;
export default NoteItem;
