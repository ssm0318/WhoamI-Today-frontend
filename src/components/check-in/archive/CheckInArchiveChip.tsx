import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';

function CheckInArchiveChip() {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.segmented' });
  const navigate = useNavigate();
  const { archivedCount, pinnedCount } = useArchiveCounts();

  return (
    <Layout.FlexRow gap={4} alignItems="center" style={{ flexShrink: 0 }}>
      <Chip onClick={() => navigate('/check-in/archive?tab=all')}>
        {t('all')} ({archivedCount})
      </Chip>
      <Chip onClick={() => navigate('/check-in/archive?tab=pinned')}>
        {t('pinned')} ({pinnedCount})
      </Chip>
    </Layout.FlexRow>
  );
}

function Chip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Layout.FlexRow
      bgColor="WHITE"
      outline="LIGHT_GRAY"
      ph={8}
      pv={4}
      rounded={8}
      alignItems="center"
      onClick={onClick}
      style={{ flexShrink: 0, cursor: 'pointer' }}
    >
      <Typo type="label-large" color="DARK_GRAY">
        {children}
      </Typo>
    </Layout.FlexRow>
  );
}

export default CheckInArchiveChip;
