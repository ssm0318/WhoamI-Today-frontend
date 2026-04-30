import Loader from '@components/_common/loader/Loader';
import { Layout, Typo } from '@design-system';
import { MutualTrait } from '@models/user';

interface MutualTraitsListProps {
  traits: MutualTrait[];
  isLoading: boolean;
  emptyText: string;
}

function MutualTraitsList({ traits, isLoading, emptyText }: MutualTraitsListProps) {
  if (isLoading) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Loader />
      </Layout.FlexCol>
    );
  }

  if (traits.length === 0) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {emptyText}
        </Typo>
      </Layout.FlexCol>
    );
  }

  return (
    <Layout.FlexCol w="100%">
      {traits.map((trait) => (
        <Layout.FlexRow key={trait.id} w="100%" pv={6}>
          <Typo type="label-large">{trait.content}</Typo>
        </Layout.FlexRow>
      ))}
    </Layout.FlexCol>
  );
}

export default MutualTraitsList;
