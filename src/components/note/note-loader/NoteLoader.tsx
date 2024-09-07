import ContentLoader from 'react-content-loader';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';

const NOTE_WIDTH = SCREEN_WIDTH;

export function NoteLoader() {
  return (
    <Layout.FlexCol p={12} rounded={12} outline="LIGHT" w="100%">
      <ContentLoader width={NOTE_WIDTH} height={90}>
        <circle cx={22} cy={22} r={22} />
        <rect x={52} y={15} rx="6" ry="6" width="85" height="12" />
        <rect x={0} y={54} rx="6" ry="6" width={NOTE_WIDTH - 48} height="12" />
        <rect x={0} y={80} rx="6" ry="6" width={NOTE_WIDTH - 48} height="12" />
      </ContentLoader>
    </Layout.FlexCol>
  );
}

export default NoteLoader;
