import { ReactElement } from 'react';
import { Layout, Typo } from '@design-system';
import { HeaderWrapper } from './Header.styled';

interface HeaderContainerProps {
  title: string;
  rightButtons: ReactElement;
}
function HeaderContainer({ title, rightButtons }: HeaderContainerProps) {
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
        <Layout.FlexRow>
          <Typo type="head-line">{title}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow gap={8} alignItems="center">
          {rightButtons}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default HeaderContainer;
