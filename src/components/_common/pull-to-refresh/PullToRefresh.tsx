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
  const handleRefresh = async () => {
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error; // 에러를 다시 throw하여 컴포넌트가 적절히 처리하도록 함
    }
  };

  return (
    <Layout.FlexCol w="100%">
      <DefaultPullToRefresh
        onRefresh={handleRefresh}
        pullDownThreshold={100}
        resistance={2.5}
        fetchMoreThreshold={100}
        maxPullDownDistance={100}
        isPullable
        pullingContent=""
      >
        <S.PullToRefreshContainer>{children}</S.PullToRefreshContainer>
      </DefaultPullToRefresh>
    </Layout.FlexCol>
  );
}
export default PullToRefresh;
