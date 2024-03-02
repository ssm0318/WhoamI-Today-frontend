import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { Typo } from '@design-system';

function EditFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.edit_friends' });

  const handleClickSave = () => {
    // TODO
  };

  return (
    <SubHeader
      title={t('title')}
      RightComponent={
        <button type="button" onClick={handleClickSave}>
          <Typo type="title-large" color="PRIMARY">
            {t('save')}
          </Typo>
        </button>
      }
    />
  );
}

export default EditFriends;
