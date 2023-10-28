import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_REDIRECTION_PATH } from '@constants/url';

const useRedirectGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      // 직접 접근을 막는 페이지에서는 friends로 redirect
      navigate(DEFAULT_REDIRECTION_PATH);
    }
  }, [navigate, location]);
};

export default useRedirectGuard;
