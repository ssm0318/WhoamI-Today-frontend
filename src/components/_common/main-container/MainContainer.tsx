import { ReactNode } from 'react';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { RootContainer } from '@styles/wrappers';

interface MainContainerProps {
  children: ReactNode;
  mb?: number;
  visibility?: boolean;
}
function MainContainer({
  children,
  mb = BOTTOM_TABBAR_HEIGHT,
  visibility = true,
}: MainContainerProps) {
  return (
    <Layout.FlexRow
      justifyContent="center"
      bgColor="BLACK"
      w="100%"
      mb={mb}
      style={{ display: visibility ? 'block' : 'none' }}
    >
      <RootContainer w="100%" bgColor="WHITE">
        {children}
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default MainContainer;
