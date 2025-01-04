import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import TimePicker from '@components/_common/time-picker/TimePicker';
import WeekPicker from '@components/_common/week-picker/WeekPicker';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout, Typo } from '@design-system';
import { DayOfWeek, MyProfile } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';

function DailyNotiSetting() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.daily_noti_setting' });
  const { id, token } = useParams();
  const navigate = useNavigate();

  const { myProfile, updateMyProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));

  const [notiTime, setNotiTime] = useState(myProfile ? myProfile?.noti_time : '');
  const [notiPeriodDays, setNotiPeriodDays] = useState<DayOfWeek[]>(
    myProfile ? myProfile?.noti_period_days : [],
  );

  const handleChangeTime = (time: string) => {
    setNotiTime(time);
  };

  const handleChangePeriod = (period: DayOfWeek[]) => {
    setNotiPeriodDays(period);
  };

  const handleClickConfirm = () => {
    if (!myProfile) return;
    editProfile({
      profile: {
        noti_time: notiTime,
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
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" gap={20} ph={24} alignItems="center">
        {/* time picker */}
        <Typo type="title-medium">{t('daily_noti_time')}</Typo>
        <TimePicker initialTime={notiTime} onTimeChange={handleChangeTime} />
      </Layout.FlexCol>
      <Layout.FlexCol mt={40} w="100%" gap={20} ph={24} alignItems="center">
        {/* week picker */}
        <Typo type="title-medium">{t('daily_noti_period')}</Typo>
        <WeekPicker initialDays={notiPeriodDays} onWeekChange={handleChangePeriod} />
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

export default DailyNotiSetting;
