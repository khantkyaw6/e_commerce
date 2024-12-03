const changeGroupName = (str) => {
  const data = str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return data;
};

module.exports = { changeGroupName };
