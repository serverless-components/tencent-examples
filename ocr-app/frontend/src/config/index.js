export default {
  baseUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/'
      : window.env.apiUrl,
  timeout: 10000,
};
