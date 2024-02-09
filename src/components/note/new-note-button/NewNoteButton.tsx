import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout } from '@design-system';

function NewNoteButton() {
  const handleClick = () => {
    // TODO (팝업 or 페이지 이동)
  };

  return (
    <Layout.FlexCol
      w={NEW_NOTE_BUTTON_WIDTH}
      mh={12}
      h="100%"
      justifyContent="center"
      alignItems="center"
      gap={8}
    >
      <IconButton size={44} name="add_default" onClick={handleClick} color="TRANSPARENT" />
      <Font.Body type="14_semibold" color="DARK_GRAY" textAlign="center">
        New Note
      </Font.Body>
    </Layout.FlexCol>
  );
}

export const NEW_NOTE_BUTTON_WIDTH = 90;

export default NewNoteButton;
