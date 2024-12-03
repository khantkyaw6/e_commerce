const { Op } = require('sequelize');

const Brand = require('../../databases/admin/models').Brand;
const db = require('../../databases/admin/models');
const deleteFile = require('../../helpers/deleteFileHelper');
const uploadFile = require('../../helpers/uploadFileHelper');

const brandService = {
  index: async () => {
    try {
      const brands = await Brand.findAll({
        where: { deletedAt: null },
        attributes: ['id', 'brandName', 'brandImage', 'key', 'brandImageUrl'],
      });
      return {
        status: 200,
        message: 'All Brands List',
        data: brands,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const { brandName } = req.body;
      const existingBrand = await Brand.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [{ brandName }],
            },
            {
              deletedAt: null,
            },
          ],
        },
        transaction: t,
      });

      if (existingBrand) {
        throw new Error('Brand name already exists');
      }

      let brand;
      if (req.file) {
        const result = await uploadFile.toBrand(req.file);
        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload brand image');
        }

        brand = await Brand.create(
          {
            brandName,
            brandImage: result.Key,
            brandImageUrl: result.Location,
          },
          { transaction: t },
        );
      } else {
        brand = await Brand.create(
          {
            brandName,
            brandImage: null,
            brandImageUrl: null,
          },
          {
            transaction: t,
          },
        );
      }

      if (!brand) throw new Error('Failed to create Brand');

      const updatedBrand = await Brand.findByPk(brand.id, { transaction: t });
      await updatedBrand.update({ key: updatedBrand.id }, { transaction: t });

      await t.commit();

      return {
        status: 200,
        message: 'Brand Created Successfully',
        data: brand,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const brand = await Brand.findByPk(req.params.id, {
        where: { deletedAt: null },
        attributes: ['id', 'brandName', 'brandImage'],
      });
      if (!brand) throw new Error('Brand Not Found');

      return {
        status: 200,
        message: 'Retrieved Brand Detail Successfully',
        data: brand,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const t = await db.sequelize.transaction();

    try {
      const brandId = req.params.id;
      const { brandName } = req.body;

      const brandToUpdate = await Brand.findByPk(
        brandId,
        { where: { deletedAt: null } },
        { transaction: t },
      );

      if (!brandToUpdate) throw new Error('Brand Not Found');

      const existingBrand = await Brand.findOne(
        {
          where: {
            [Op.and]: [
              { id: { [Op.ne]: brandId } },
              { brandName },
              { deletedAt: null },
            ],
          },
        },
        { transaction: t },
      );

      if (existingBrand) throw new Error('Brand name already exists');

      let updatedBrand = brandToUpdate;
      if (req.file) {
        const result = await uploadFile.toBrand(req.file);

        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload brand image');
        }

        if (updatedBrand.brandImage) {
          await deleteFile(updatedBrand.brandImage);
        }

        updatedBrand = await brandToUpdate.update(
          {
            brandName,
            brandImage: result.Key,
            brandImageUrl: result.Location,
          },
          { transaction: t },
        );
      } else {
        // If no new file is uploaded, update the brand name only
        updatedBrand = await brandToUpdate.update(
          {
            brandName,
          },
          { transaction: t },
        );
      }

      if (!updatedBrand) throw new Error('Failed to update brand');

      await t.commit();

      return {
        status: 200,
        message: 'Brand Update Successfully',
        data: updatedBrand,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const brand = await Brand.findByPk(req.params.id, {
        where: { deletedAt: null },
      });

      if (!brand) throw new Error('Brand not found');
      const brandImage = brand.brandImage;

      if (brandImage) {
        const deletionResult = await deleteFile(brandImage);
        if (
          deletionResult.DeleteMarker === true ||
          deletionResult.$metadata.httpStatusCode === 204
        ) {
          await brand.update(
            { brandImage: null, brandImageUrl: null },
            { transaction: t },
          );
        } else {
          throw new Error('Error Deleting Brand');
        }
      }

      const result = await brand.destroy({ transaction: t });

      if (!result) {
        throw new Error('Failed to delete brand');
      }

      await t.commit();
      return {
        status: 200,
        message: 'Brand Deleted Successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = brandService;
