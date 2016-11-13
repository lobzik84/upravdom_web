const checkDevice = () => {
  if ($(window).width() > 1024) {
    return 'desktop';
  }
  return 'mobile';
};

export default checkDevice;
