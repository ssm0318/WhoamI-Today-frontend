import React from 'react';
import DefaultPullToRefresh from 'react-simple-pull-to-refresh';

type Props = {
  onRefresh: () => Promise<void>;
};

function PullToRefresh({
  onRefresh,
  children,
}: React.PropsWithChildren<Props & { children: React.ReactElement }>) {
  return (
    <DefaultPullToRefresh
      onRefresh={onRefresh}
      pullDownThreshold={70}
      resistance={3}
      isPullable
      pullingContent=""
    >
      {children}
    </DefaultPullToRefresh>
  );
}
export default PullToRefresh;
