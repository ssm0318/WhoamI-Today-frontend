import { useSearchParams } from 'react-router-dom';
import { PreviewModeProvider } from '@components/view-as/PreviewModeContext';
import ViewAsBanner from '@components/view-as/ViewAsBanner';
import ViewAsTabs from '@components/view-as/ViewAsTabs';
import { Layout } from '@design-system';
import { isVisibilityTier, VisibilityTier } from '@models/viewAs';

const DEFAULT_TIER: VisibilityTier = 'public';

function ViewAsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawAs = searchParams.get('as');
  const tier: VisibilityTier = isVisibilityTier(rawAs) ? rawAs : DEFAULT_TIER;

  const handleSelect = (next: VisibilityTier) => {
    setSearchParams({ as: next }, { replace: true });
  };

  return (
    <PreviewModeProvider viewAs={tier}>
      <Layout.FlexCol w="100%">
        <ViewAsBanner tier={tier} />
        <ViewAsTabs selected={tier} onSelect={handleSelect} />
        {/* Phase 1 Task 1.6 replaces this placeholder with <UserPage /> */}
        <Layout.FlexCol w="100%" p={16}>
          <span>View As — {tier} (placeholder)</span>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </PreviewModeProvider>
  );
}

export default ViewAsPage;
