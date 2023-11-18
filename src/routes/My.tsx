import Divider from '@components/_common/divider/Divider';
import NoteSection from '@components/note/note-section/NoteSection';
import ReactionSection from '@components/reaction/reaction-section/ReactionSection';
import MyStatus from '@components/status/my-status/MyStatus';
import { Layout } from '@design-system';

function My() {
  return (
    <Layout.FlexCol w="100%" bgColor="BASIC_WHITE">
      {/* Status (Check in) */}
      <Layout.FlexRow w="100%" p={12}>
        <MyStatus />
      </Layout.FlexRow>
      <Divider width={1} />
      {/* Notes */}
      <Layout.FlexCol p={12} w="100%">
        <NoteSection />
      </Layout.FlexCol>
      <Divider width={1} />
      {/* Responses */}
      <ReactionSection emojis={['💪🏻', '😊', '😋']} />
      <Divider width={500} />
      <ReactionSection emojis={['💡', '🙇‍♀️', '🤾', '🤪', '🤯', '🥺']} />
    </Layout.FlexCol>
  );
}

export default My;
