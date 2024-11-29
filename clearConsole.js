const reg = /console\.log\s*\(([\s\S]*?)\);/g;
module.exports = function (source) {
  if (process.env.NODE_ENV === 'production') {
    source = source.replace(reg, '');
  }
  return source;
};
