import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useNotiPermission = () => {
  const [notiPermission, setNotiPermission] = useState(Notification.permission);
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const getBannerDescription = (permissionState?: typeof Notification.permission): string[] => {
    switch (permissionState) {
      case 'default':
        return [
          t('allow_notification_to_receive_updates_from_friends_as_push_notifications'),
          t('click_here_to_check_your_system_preferences'),
        ];
      case 'denied':
        return [
          t('push_notifications_are_currently_disabled'),
          t('if_you_want_to_receive_notifications_please_enable_the_system_notification_settings'),
        ];
      case 'granted':
        return [
          t('push_notifications_are_currently_enabled'),
          t(
            `if_you_don't_want_to_receive_notifications_please_disable_the_system_notification_settings`,
          ),
        ];
      default:
        return [];
    }
  };

  const getSettingDescription = (permissionState?: typeof Notification.permission): string[] => {
    switch (permissionState) {
      case 'default':
        return [t('click_here_to_check_your_system_preferences')];
      case 'denied':
        return [
          t('push_notifications_are_currently_disabled'),
          t('if_you_want_to_receive_notifications_please_enable_the_system_notification_settings'),
        ];
      case 'granted':
      default:
        return [];
    }
  };

  return {
    getBannerDescription,
    getSettingDescription,
    notiPermission,
    setNotiPermission,
  };
};

export default useNotiPermission;
