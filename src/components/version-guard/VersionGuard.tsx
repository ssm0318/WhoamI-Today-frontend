import { ReactElement, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

interface Props {
  allowedVersions: VersionType[];
  children: ReactElement;
}

function VersionGuard({ allowedVersions, children }: Props) {
  const location = useLocation();
  const { myProfile, featureFlags } = useBoundStore(UserSelector);
  const openToast = useBoundStore((s) => s.openToast);
  const [t] = useTranslation('translation', { keyPrefix: 'version_guard' });
  const toastShownPathRef = useRef<string | null>(null);

  const currentVer = myProfile?.current_ver;
  const isAllowed = !currentVer || allowedVersions.includes(currentVer);

  useEffect(() => {
    if (!isAllowed && toastShownPathRef.current !== location.pathname) {
      openToast({ message: t('not_available') });
      toastShownPathRef.current = location.pathname;
    }
  }, [isAllowed, location.pathname, openToast, t]);

  if (!isAllowed) {
    const home =
      currentVer === VersionType.VER_Q ? '/feed' : featureFlags?.friendList ? '/friends' : '/feed';
    return <Navigate to={home} replace />;
  }
  return children;
}

export default VersionGuard;
