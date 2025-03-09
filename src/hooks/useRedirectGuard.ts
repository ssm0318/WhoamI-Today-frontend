import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FEED_DEFAULT_REDIRECTION_PATH, FRIEND_DEFAULT_REDIRECTION_PATH } from '@constants/url';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

const useRedirectGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  useEffect(() => {
    if (!location.state) {
      // 직접 접근을 막는 페이지에서는 friends로 redirect
      console.log('redirect');
      navigate(
        featureFlags?.friendList ? FRIEND_DEFAULT_REDIRECTION_PATH : FEED_DEFAULT_REDIRECTION_PATH,
      );
    }
  }, [navigate, location, featureFlags?.friendList]);
};

export default useRedirectGuard;
