export const isMac = (userAgent = window?.navigator.userAgent) => {
  if (!userAgent) return false;
  return /Mac/i.test(userAgent);
};

export const getMobileDeviceInfo = (
  userAgent = window?.navigator.userAgent
) => {
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
