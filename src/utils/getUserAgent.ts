export const isMac = (userAgent = window?.navigator.userAgent) => {
  if (!userAgent) return false;
  return /Mac/i.test(userAgent);
};

export const isApp: boolean = window?.ReactNativeWebView || false;

export const getMobileDeviceInfo = (userAgent = window?.navigator.userAgent) => {
  // isMobile : 앱, 모바일 웹 모두 해당
  const isMobile = /Mobile/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isOtherMobile = /webOS|BlackBerry/i.test(userAgent);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isOtherMobile,
  };
};
