/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Subcategories', [
      {
        subcategoryName_en: 'Suncream',
        subcategoryName_mm: 'နေလောင်ခံခရင်မ်',
        subcategoryName_zh: '防晒霜',
        subcategoryImage: 'public/upload/default_image/350x350.jpg',
        subcategoryImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/350x350.jpg',
        categorySubgroupId: 1,
        key: 1,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        subcategoryName_en: 'Body & Message Oils',
        subcategoryName_mm: 'ခန္ဓာကိုယ်အနှိပ်ဆီများ',
        subcategoryName_zh: '身体油和按摩油',
        subcategoryImage: 'public/upload/default_image/essential-body-care-trio-en~2.jpg',
        subcategoryImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/essential-body-care-trio-en~2.jpg',
        categorySubgroupId: 1,
        key: 2,
        sort: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Subcategories', null, {});
  },
};
