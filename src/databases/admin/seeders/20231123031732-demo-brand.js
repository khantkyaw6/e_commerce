/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Brands', [
      {
        brandName: 'Brand One',
        brandImage: 'public/upload/default_image/360_F_307275664_15Tve0AwO6sPhOWb24w0BbVpK3nN1RLs.jpg',
        brandImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/360_F_307275664_15Tve0AwO6sPhOWb24w0BbVpK3nN1RLs.jpg',
        key: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        brandName: 'Brand Two',
        brandImage: 'public/upload/default_image/images.png',
        brandImageUrl: 'https://s3-ecommerce-web.s3.ap-southeast-1.amazonaws.com/public/upload/default_image/images.png',
        key: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Brands', null, {});
  },
};
