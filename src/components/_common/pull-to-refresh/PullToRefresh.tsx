import React from 'react';
import DefaultPullToRefresh from 'react-simple-pull-to-refresh';
import { Layout } from '@design-system';
import * as S from './PullToRefresh.styled';

type Props = {
  onRefresh: () => Promise<void>;
};

function PullToRefresh({
  onRefresh,
  children,
}: React.PropsWithChildren<Props & { children: React.ReactElement }>) {
  return (
    <Layout.FlexCol w="100%">
      <DefaultPullToRefresh
        onRefresh={onRefresh}
        pullDownThreshold={20}
        isPullable
        pullingContent=""
      >
        <S.PullToRefreshContainer>{children}</S.PullToRefreshContainer>
      </DefaultPullToRefresh>
    </Layout.FlexCol>
  );
}
export default PullToRefresh;
