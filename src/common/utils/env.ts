export default {
  production(): boolean {
    return process.env.NODE_ENV !== 'development';
  },
  dev(): boolean {
    return process.env.NODE_ENV === 'development';
  }
};
