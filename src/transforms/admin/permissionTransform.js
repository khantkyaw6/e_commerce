/* eslint-disable no-unused-vars */
module.exports = {
  // single transformation
  transform: async (_data) => {
    return {};
  },

  //array transformation
  transformCollection: (datas = []) => {
    const result = {
      total_count: datas.count,
      page: +datas.page,
      limit: +datas.limit,
      total_page: datas.totalPages,
      data: datas.data,
    };

    if (datas.totalGroupCount) {
      result.total_group_count = datas.totalGroupCount;
    }

    return result;
  },
};
