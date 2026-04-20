import { useTranslation } from 'react-i18next';
import { Typo } from '@design-system';
import * as S from './UploadLoadingOverlay.styled';

interface UploadLoadingOverlayProps {
  visible: boolean;
}

function UploadLoadingOverlay({ visible }: UploadLoadingOverlayProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'common' });

  if (!visible) return null;

  return (
    <S.Dim role="status" aria-live="polite">
      <S.Spinner />
      <Typo type="body-medium" color="WHITE">
        {t('uploading')}
      </Typo>
    </S.Dim>
  );
}

export default UploadLoadingOverlay;
