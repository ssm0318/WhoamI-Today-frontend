const MAX_WINDOW_WIDTH = 500;
const BOTTOM_TABBAR_HEIGHT = 80;
const TOP_NAVIGATION_HEIGHT = 84;
const DEFAULT_MARGIN = 24;
const SCREEN_WIDTH = typeof window !== 'undefined' ? Math.min(window.innerWidth, 500) : 0;
const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 0;
const TITLE_HEADER_HEIGHT = 56;

const Z_INDEX = {
  TITLE_HEADER: 100,
};

export {
  BOTTOM_TABBAR_HEIGHT,
  TOP_NAVIGATION_HEIGHT,
  DEFAULT_MARGIN,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MAX_WINDOW_WIDTH,
  TITLE_HEADER_HEIGHT,
  Z_INDEX,
};
