export const openVideoInApp = (url: string) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        actionType: 'OPEN_VIDEO',
        url,
      }),
    );
  } else {
    window.open(url);
  }
};
