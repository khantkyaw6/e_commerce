/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CategorySubgroups', [
      {
        subgroupName_en: 'Skin Care',
        subgroupName_mm: 'အသားအရေထိန်းသိမ်းမှုထုတ်ကုန်',
        subgroupName_zh: '皮肤护理',
        subgroupImage: 'public/upload/default_image/skincare.png',
        subgroupImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/skincare.png',
        categoryId: 1,
        key: 1,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        subgroupName_en: 'Bath & Body',
        subgroupName_mm: 'ရေချိုးပစ္စည်းများ',
        subgroupName_zh: '沐浴用品',
        subgroupImage: 'public/upload/default_image/soap.png',
        subgroupImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/soap.png',
        categoryId: 1,
        key: 2,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CategorySubgroups', null, {});
  },
};
