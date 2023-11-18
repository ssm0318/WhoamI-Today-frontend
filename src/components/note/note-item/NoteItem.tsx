import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout } from '@design-system';
import { Note } from '@models/note';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface NoteItemProps {
  note: Note;
}

function NoteItem({ note }: NoteItemProps) {
  const { content, created_at } = note;

  const myProfile = useBoundStore((state) => state.myProfile);

  if (!myProfile) return null;

  const handleClickMore = () => {
    //
  };

  return (
    <Layout.FlexCol
      w={NOTE_WIDTH}
      p={12}
      gap={8}
      outline="LIGHT"
      rounded={12}
      style={{
        display: 'inline-block',
      }}
    >
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Font.Body type="12_regular" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at))}
        </Font.Body>
        <IconButton name="dots_menu" onClick={handleClickMore} />
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Font.Body type="16_regular" color="BLACK" numberOfLines={4}>
          {content}
        </Font.Body>
      </Layout.FlexRow>
      <Layout.FlexRow gap={12}>
        <IconButton name="heart" onClick={handleClickMore} />
        <IconButton name="comment" onClick={handleClickMore} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export const NOTE_WIDTH = 228;

export default NoteItem;
