import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import { Font, Layout } from '@design-system';

function NewNoteButton() {
  const [t] = useTranslation('translation');

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
      <Icon size={44} name="add_default" onClick={handleClick} color="TRANSPARENT" />
      <Font.Body type="14_semibold" color="DARK_GRAY" textAlign="center">
        {t('notes.new_note')}
      </Font.Body>
    </Layout.FlexCol>
  );
}

export const NEW_NOTE_BUTTON_WIDTH = 90;

export default NewNoteButton;
