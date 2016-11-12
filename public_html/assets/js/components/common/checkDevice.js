const checkDevice = () => {
  if ($(window).width() > 1009) {
    return 'desktop';
  }
  return 'mobile';
};

export default checkDevice;
