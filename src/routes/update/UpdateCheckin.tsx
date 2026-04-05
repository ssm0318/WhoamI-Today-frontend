import MainContainer from '@components/_common/main-container/MainContainer';
import { Layout, Typo } from '@design-system';

export default function UpdateCheckin() {
  return (
    <MainContainer>
      <Layout.FlexCol w="100%" alignItems="center" justifyContent="center" pv={40}>
        <Typo type="title-large">Update</Typo>
        <Typo type="body-medium" color="MEDIUM_GRAY" mt={8}>
          Check-in grid coming soon
        </Typo>
      </Layout.FlexCol>
    </MainContainer>
  );
}
