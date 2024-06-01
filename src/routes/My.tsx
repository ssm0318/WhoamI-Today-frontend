import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import { Layout, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [t] = useTranslation('translation', {
    keyPrefix: 'my',
  });
  const navigate = useNavigate();

  const handleClickNewNote = () => {
    return navigate('/notes/new');
  };

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
      <Layout.FlexRow ph={15} pv={10} bgColor="WHITE" w="100%" rounded="8px 8px 0px 0px">
        <Layout.FlexRow
          rounded={30}
          alignItems="center"
          w="100%"
          justifyContent="space-between"
          ph={20}
          pv={10}
          outline="LIGHT_GRAY"
          onClick={handleClickNewNote}
        >
          <Typo type="body-medium" color="DARK_GRAY">
            {t('whats_on_your_mind', { username: myProfile?.username })}
          </Typo>
          <Icon name="chat_media_image" size={24} />
        </Layout.FlexRow>
      </Layout.FlexRow>
      <Layout.FlexCol pl={12} pb="default" w="100%" bgColor="WHITE" rounded="0px 0px 8px 8px">
        <NoteSection />
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default My;
