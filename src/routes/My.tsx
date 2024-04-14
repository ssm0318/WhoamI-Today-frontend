import Divider from '@components/_common/divider/Divider';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  return (
    <Layout.FlexCol w="100%" bgColor="LIGHT">
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        p={12}
        bgColor="WHITE"
        rounded={8}
      >
        <Profile user={myProfile} />
      </Layout.FlexRow>
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexCol pv={12} pl={12} w="100%" bgColor="WHITE" rounded={8}>
        <ResponseSection />
      </Layout.FlexCol>
      <Divider width={8} bgColor="LIGHT" />
      <Layout.FlexCol pt={12} pl={12} pb="default" w="100%" bgColor="WHITE" rounded={8}>
        <NoteSection />
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default My;
