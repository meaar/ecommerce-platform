const apiHost = typeof window === 'undefined' ? 'localhost' : window.location.hostname;

export const environment = {
  production: false,
  apiUrl: `http://${apiHost}:3000/api`,
  appVersion: '1.0.0'
};
