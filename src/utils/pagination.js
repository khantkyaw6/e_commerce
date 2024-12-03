exports.paginate = (query, { page, limit = 10 }) => {
  const offset = (page - 1) * limit;
  //string to change number
  const rowPerpage = +limit;
  return {
    ...query,
    offset,
    limit: rowPerpage,
  };
};
