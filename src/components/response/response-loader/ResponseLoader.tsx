import ContentLoader from 'react-content-loader';
import { Layout } from '@design-system';
import { POST_DP_TYPE } from '@models/post';
import { RESPONSE_WIDTH, WRAPPER_PADDING } from '../response-item/ResponseItem';

export function ResponseLoader({ type = 'LIST' }: { type?: POST_DP_TYPE }) {
  return (
    <Layout.FlexCol
      p={WRAPPER_PADDING}
      rounded={12}
      outline="LIGHT"
      w={type === 'LIST' ? RESPONSE_WIDTH : '100%'}
    >
      <ContentLoader width={RESPONSE_WIDTH} height={90}>
        <circle cx={22} cy={22} r={22} />
        <rect x={52} y={15} rx="6" ry="6" width="85" height="12" />
        <rect x={0} y={54} rx="6" ry="6" width={RESPONSE_WIDTH - 30} height="12" />
      </ContentLoader>
      <Layout.FlexCol p={16} rounded={12} outline="LIGHT" w="100%">
        <ContentLoader height={90}>
          <circle cx={14} cy={14} r={14} />
          <rect x={36} y={10} rx="6" ry="6" width="83" height="8" />
          <rect x={0} y={50} rx="6" ry="6" width={RESPONSE_WIDTH - 60} height="12" />
          <rect x={0} y={75} rx="6" ry="6" width={RESPONSE_WIDTH - 60} height="12" />
        </ContentLoader>
      </Layout.FlexCol>
      <ContentLoader width={RESPONSE_WIDTH} height={34}>
        <rect x={0} y={15} rx="6" ry="6" width={RESPONSE_WIDTH - 30} height="12" />
      </ContentLoader>
    </Layout.FlexCol>
  );
}

export default ResponseLoader;
