/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        categoryName_en: 'Health & Beauty',
        categoryName_mm: 'အလှအပ နှင့်ကျန်းမာရေး',
        categoryName_zh: '美丽与健康',
        categoryIcon: 'public/upload/default_image/healthcare.png',
        categoryImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/healthcare.png',
        key: 1,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName_en: 'Electronic Devices',
        categoryName_mm: 'လျှပ်စစ် စက်ကိရိယာ',
        categoryName_zh: '电子设备',
        categoryIcon: 'public/upload/default_image/responsive.png',
        categoryImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/responsive.png',
        key: 2,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Categories', null, {});
  },
};
