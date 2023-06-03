import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useRedirectGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      // 직접 접근을 막는 페이지에서는 home으로 redirect
      navigate('/home');
    }
  }, [navigate, location]);
};

export default useRedirectGuard;
