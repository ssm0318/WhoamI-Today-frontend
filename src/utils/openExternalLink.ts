export const openExternalLink = (url: string) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        actionType: 'OPEN_BROWSER',
        url,
      }),
    );
  } else window.open(url);
};
