/// <reference types="react-scripts" />

// React Native WebView 타입 선언
interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  visualViewport?: {
    height: number;
    width: number;
    addEventListener: (event: string, handler: () => void) => void;
    removeEventListener: (event: string, handler: () => void) => void;
  };
}
