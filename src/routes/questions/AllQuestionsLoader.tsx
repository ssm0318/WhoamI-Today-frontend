import ContentLoader from 'react-content-loader';
import { Layout } from '@design-system';

export function AllQuestionsLoader() {
  return (
    <>
      {[...Array(7)].map((_, index) => {
        const key = `all_friend_item_loader_${index}`;
        return <PromptCardLoader key={key} />;
      })}
    </>
  );
}

export function PromptCardLoader() {
  return (
    <Layout.FlexCol p={16} rounded={12} outline="LIGHT" w="100%">
      <ContentLoader height={88}>
        <circle cx={14} cy={14} r={14} />
        <rect x={36} y={8} rx="6" ry="6" width="30%" height="12" />
        <rect x={0} y={45} rx="6" ry="6" width="100%" height="12" />
        <rect x={0} y={70} rx="6" ry="6" width="70%" height="12" />
      </ContentLoader>
    </Layout.FlexCol>
  );
}
