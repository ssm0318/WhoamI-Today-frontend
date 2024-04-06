import Divider from '@components/_common/divider/Divider';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  return (
    <Layout.FlexCol w="100%" bgColor="WHITE">
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        ph={DEFAULT_MARGIN}
        pv={12}
      >
        <Profile user={myProfile} />
      </Layout.FlexRow>
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexCol pv={12} pl={12} w="100%">
        <ResponseSection />
      </Layout.FlexCol>
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexCol pt={12} pl={12} pb="default" w="100%">
        <NoteSection />
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default My;
