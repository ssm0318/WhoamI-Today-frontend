import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FRIEND_DEFAULT_REDIRECTION_PATH,
  FRIENDS_Q_DEFAULT_REDIRECTION_PATH,
} from '@constants/url';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

const useRedirectGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  useEffect(() => {
    if (!location.state) {
      navigate(
        featureFlags?.friendList
          ? FRIEND_DEFAULT_REDIRECTION_PATH
          : FRIENDS_Q_DEFAULT_REDIRECTION_PATH,
      );
    }
  }, [navigate, location, featureFlags?.friendList]);
};

export default useRedirectGuard;
