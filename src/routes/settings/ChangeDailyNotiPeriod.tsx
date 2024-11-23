import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import WeekPicker from '@components/_common/week-picker/WeekPicker';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout } from '@design-system';
import { DayOfWeek, MyProfile } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';

function ChangeDailyNotiTime() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.change_daily_noti_period' });
  const { id, token } = useParams();
  const navigate = useNavigate();

  const { myProfile, updateMyProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));

  const [notiPeriodDays, setNotiPeriodDays] = useState<DayOfWeek[]>(
    myProfile ? myProfile?.noti_period_days : [0, 1, 2, 3, 4, 5, 6],
  );

  const handleChange = (period: DayOfWeek[]) => {
    setNotiPeriodDays(period);
  };

  const handleClickConfirm = () => {
    if (!myProfile) return;
    editProfile({
      profile: {
        noti_period_days: notiPeriodDays,
      },
      onSuccess: (data: MyProfile) => {
        updateMyProfile({ ...data });
        openToast({ message: t('success') });
        navigate('/settings');
      },
      onError: () => {
        openToast({ message: t('error') });
      },
    });
  };

  return (
    <Layout.FlexCol w="100%">
      <SubHeader typo="title-large" title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" gap={10} ph={24} alignItems="center">
        {/* week picker */}
        <WeekPicker initialDays={notiPeriodDays} onWeekChange={handleChange} />
      </Layout.FlexCol>
      <Layout.Absolute
        l={0}
        b={20 + (id && token ? 0 : BOTTOM_TABBAR_HEIGHT)}
        w="100%"
        alignItems="center"
        ph="default"
      >
        <Button.Confirm
          status="normal"
          sizing="stretch"
          text={t('confirm')}
          onClick={handleClickConfirm}
        />
      </Layout.Absolute>
    </Layout.FlexCol>
  );
}

export default ChangeDailyNotiTime;
