export const getDevServerHostname = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return window.location.hostname;
  }
  return 'localhost';
};

export const getDevHttpOrigin = (port = 8000) => `http://${getDevServerHostname()}:${port}`;

export const getCurrentWsOrigin = () => {
  if (typeof window === 'undefined') return 'ws://localhost:3000';
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}`;
};
