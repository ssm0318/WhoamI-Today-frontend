export type OpenVideoPostType = 'check_in_post' | 'check_in_post_story' | 'note' | 'response';

interface OpenVideoOptions {
  postId: number | string;
  postType: OpenVideoPostType;
}

export const openVideoInApp = (url: string, options: OpenVideoOptions) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        actionType: 'OPEN_VIDEO',
        url,
        postId: options.postId,
        postType: options.postType,
      }),
    );
  } else {
    window.open(url);
  }
};
