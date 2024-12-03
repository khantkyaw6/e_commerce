const { Op } = require('sequelize');

const CategorySubgroup =
  require('../../databases/admin/models').CategorySubgroup;
const Subcategory = require('../../databases/admin/models').Subcategory;
const db = require('../../databases/admin/models');
const deleteFile = require('../../helpers/deleteFileHelper');
const uploadFile = require('../../helpers/uploadFileHelper');

const subcategoryService = {
  index: async () => {
    try {
      const subcategories = await Subcategory.findAll({
        where: { deletedAt: null },
        attributes: [
          'id',
          'subcategoryName_en',
          'subcategoryName_mm',
          'subcategoryName_zh',
          'subcategoryImage',
          'subcategoryImageUrl',
          'categorySubgroupId',
          'key',
          'sort',
          'status',
        ],
        include: {
          model: CategorySubgroup,
          as: 'categorysubgroup',
          attributes: [
            'id',
            'subgroupName_en',
            'subgroupName_mm',
            'subgroupName_zh',
            'subgroupImage',
            'categoryId',
            'sort',
            'status',
          ],
        },
        order: [['sort', 'ASC']],
      });

      return {
        status: 200,
        message: 'Retrieved All Subcategories Successfully.',
        data: subcategories,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        subcategoryName_en,
        subcategoryName_mm,
        subcategoryName_zh,
        categorySubgroupId,
        sort,
        status,
      } = req.body;

      const categorysubgroup = await CategorySubgroup.findOne({
        where: {
          id: categorySubgroupId,
          deletedAt: null,
        },
        transaction: t,
      });

      if (!categorysubgroup) {
        throw new Error('CategorySubgroup Not Found.');
      }

      const existingSubcategory = await Subcategory.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { subcategoryName_en },
                { subcategoryName_mm },
                { subcategoryName_zh },
              ],
            },
            { categorySubgroupId },
            { deletedAt: null },
          ],
        },
      });

      if (existingSubcategory) {
        throw new Error('Subcategory name already exists in same Subgroup.');
      }

      let subcategory;
      if (req.file) {
        const result = await uploadFile.toSubcategory(req.file);
        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload subcategory image.');
        }

        subcategory = await Subcategory.create(
          {
            subcategoryName_en,
            subcategoryName_mm,
            subcategoryName_zh,
            categorySubgroupId,
            subcategoryImage: result.Key,
            subcategoryImageUrl: result.Location,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        subcategory = await Subcategory.create(
          {
            subcategoryName_en,
            subcategoryName_mm,
            subcategoryName_zh,
            categorySubgroupId,
            subcategoryImage: null,
            subcategoryImageUrl: null,
            sort,
            status,
          },
          { transaction: t },
        );
      }

      if (!subcategory) {
        throw new Error('Failed to create subcategory.');
      }

      const updatedSubcategory = await Subcategory.findByPk(subcategory.id, {
        transaction: t,
      });
      await updatedSubcategory.update(
        { key: updatedSubcategory.id },
        { transaction: t },
      );
      await t.commit();

      return {
        status: 200,
        message: 'Subcategory created successfully',
        data: subcategory,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const subcategory = await Subcategory.findByPk(req.params.id, {
        where: { deletedAt: null },
        attributes: [
          'id',
          'subcategoryName_en',
          'subcategoryName_mm',
          'subcategoryName_zh',
          'subcategoryImage',
          'subcategoryImageUrl',
          'categorySubgroupId',
          'sort',
          'status',
        ],
        include: {
          model: CategorySubgroup,
          as: 'categorysubgroup',
          attributes: [
            'id',
            'subgroupName_en',
            'subgroupName_mm',
            'subgroupName_zh',
            'subgroupImage',
            'categoryId',
            'sort',
            'status',
          ],
        },
        order: [['sort', 'ASC']],
      });

      if (!subcategory) {
        throw new Error('Subcategory Not Found.');
      }

      return {
        status: 200,
        message: 'Retrieved Subcategory Details Successfully.',
        data: subcategory,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        subcategoryName_en,
        subcategoryName_mm,
        subcategoryName_zh,
        categorySubgroupId,
        sort,
        status,
      } = req.body;
      const subcategoryId = req.params.id;

      const subcategoryToUpdate = await Subcategory.findByPk(
        subcategoryId,
        { where: { deletedAt: null } },
        { transaction: t },
      );

      if (!subcategoryToUpdate) {
        throw new Error('Subcategory Not Found.');
      }

      const subgroupExists = await CategorySubgroup.findOne({
        where: {
          id: categorySubgroupId,
          deletedAt: null,
        },
        transaction: t,
      });

      if (!subgroupExists) {
        throw new Error('Subgroup ID does not exist or has been deleted.');
      }

      const existingSubcategory = await Subcategory.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { subcategoryName_en },
                { subcategoryName_mm },
                { subcategoryName_zh },
              ],
            },
            { categorySubgroupId },
            { deletedAt: null },
          ],
        },
      });

      if (existingSubcategory) {
        throw new Error('Subcategory name already exists in same Subgroup.');
      }

      let updatedSubcategory = subcategoryToUpdate;
      if (req.file) {
        const result = await uploadFile.toSubcategory(req.file);

        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload subcategory image');
        }

        if (updatedSubcategory.subcategoryImage) {
          await deleteFile(updatedSubcategory.subcategoryImage);
        }

        updatedSubcategory = await updatedSubcategory.update(
          {
            subcategoryName_en,
            subcategoryName_mm,
            subcategoryName_zh,
            categorySubgroupId,
            subcategoryImage: result.Key,
            subcategoryImageUrl: result.Location,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        updatedSubcategory = await updatedSubcategory.update(
          {
            subcategoryName_en,
            subcategoryName_mm,
            subcategoryName_zh,
            categorySubgroupId,
            sort,
            status,
          },
          { transaction: t },
        );
      }

      if (!updatedSubcategory) {
        throw new Error('Failed to update subcategory');
      }

      await t.commit();

      return {
        status: 200,
        message: 'Subcategory updated successfully',
        data: updatedSubcategory,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const subcategory = await Subcategory.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        transaction: t,
      });

      if (!subcategory) {
        throw new Error('Subcategory not found or already deleted');
      }

      const subcategoryImage = subcategory.subcategoryImage;
      if (subcategoryImage) {
        const deletionResult = await deleteFile(subcategoryImage);

        if (
          deletionResult.DeleteMarker === true ||
          deletionResult.$metadata.httpStatusCode === 204
        ) {
          await subcategory.update(
            { subcategoryImage: null, subcategoryImageUrl: null },
            { transaction: t },
          );
        } else {
          throw new Error('Error deleting file');
        }
      }

      const result = await subcategory.destroy({ transaction: t });

      if (!result) {
        throw new Error('Failed to delete subcategory');
      }

      await t.commit();
      return {
        status: 200,
        message: 'Subcategory deleted successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = subcategoryService;
