import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { NewNoteHeaderWrapper } from './NewNoteHeader.styled';

interface NewNoteHeaderProps {
  title: string;
}

function NewNoteHeader({ title }: NewNoteHeaderProps) {
  const navigate = useNavigate();

  const cancelPost = () => {
    navigate('/my');
  };

  // TODO: 게시물 업로드 toast message 추가
  const confirmPost = () => {
    navigate('/my');
  };

  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  return (
    <NewNoteHeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
        <Layout.FlexRow gap={8} alignItems="center" onClick={cancelPost}>
          {t('cancel')}
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="head-line">{title}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow gap={8} alignItems="center" onClick={confirmPost}>
          {t('post')}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </NewNoteHeaderWrapper>
  );
}

export default NewNoteHeader;
