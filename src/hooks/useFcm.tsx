import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { useEffect, useState } from "react";
import {
  requestPermission,
  addForegroundMessageEventListener,
  firebaseConfig,
  getFCMRegistrationToken,
} from "../utils/firebaseHelpers";
import { getMobileDeviceInfo } from "../utils/getUserAgent";

const useFcm = () => {
  //   const currentUser = useSelector((state) => state.userReducer.currentUser);
  //   const dispatch = useDispatch();
  //   const history = useHistory();

  const { isMobile } = getMobileDeviceInfo();

  const [notiPermissionStatus, setNotiPermissionStatus] = useState(
    !isMobile ? Notification.permission : null
  );

  const requestPermissionHandler = async () => {
    const permission = await requestPermission();
    setNotiPermissionStatus(permission);
  };

  useEffect(() => {
    // if (!currentUser || isMobile) return;
    if (isMobile) return;

    const initializeFcm = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        if (notiPermissionStatus !== "granted" || !app || !messaging) return;

        const token = await getFCMRegistrationToken(messaging);
        addForegroundMessageEventListener(messaging);

        // dispatch(setFcmToken(token));
      } catch (e) {
        console.log(e);
      }
    };

    initializeFcm();
  }, [notiPermissionStatus, isMobile]);

  return { notiPermissionStatus, requestPermissionHandler };
};

export default useFcm;
