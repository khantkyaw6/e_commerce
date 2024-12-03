const { Op } = require('sequelize');

const Category = require('../../databases/admin/models').Category;
const CategorySubgroup =
  require('../../databases/admin/models').CategorySubgroup;
const Subcategory = require('../../databases/admin/models').Subcategory;
const db = require('../../databases/admin/models');
const deleteFile = require('../../helpers/deleteFileHelper');
const uploadFile = require('../../helpers/uploadFileHelper');

const categorySubgroupService = {
  index: async () => {
    try {
      const categorysubgroups = await CategorySubgroup.findAll({
        where: { deletedAt: null },
        attributes: [
          'id',
          'subgroupName_en',
          'subgroupName_mm',
          'subgroupName_zh',
          'subgroupImage',
          'subgroupImageUrl',
          'key',
          'categoryId',
          'sort',
          'status',
        ],
        include: [
          {
            model: Subcategory,
            as: 'subcategories',
            attributes: [
              'id',
              'id',
              'subcategoryName_en',
              'subcategoryName_mm',
              'subcategoryName_zh',
              'subcategoryImage',
              'sort',
              'status',
            ],
          },
        ],
        order: [['sort', 'ASC']],
      });

      return {
        status: 200,
        message: 'Retrieved All CategorySubgroups Successfully.',
        data: categorysubgroups,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        subgroupName_en,
        subgroupName_mm,
        subgroupName_zh,
        categoryId,
        sort,
        status,
      } = req.body;

      const categoryExists = await Category.findOne({
        where: {
          id: categoryId,
          deletedAt: null, // Check if the category is not deleted
        },
      });

      if (!categoryExists) {
        throw new Error('Category ID does not exist or has been deleted.');
      }

      const existingSubgroup = await CategorySubgroup.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { subgroupName_en },
                { subgroupName_mm },
                { subgroupName_zh },
              ],
            },
            { categoryId },
            { deletedAt: null },
          ],
        },
        transaction: t,
      });

      if (existingSubgroup) {
        throw new Error('Sub Group name already exists in same Category.');
      }

      let categorysubgroup;
      if (req.file) {
        const result = await uploadFile.toCategorySubgroup(req.file);
        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload subgroup image.');
        }

        categorysubgroup = await CategorySubgroup.create(
          {
            subgroupName_en,
            subgroupName_mm,
            subgroupName_zh,
            subgroupImage: result.Key,
            subgroupImageUrl: result.Location,
            categoryId,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        categorysubgroup = await CategorySubgroup.create(
          {
            subgroupName_en,
            subgroupName_mm,
            subgroupName_zh,
            subgroupImage: null,
            subgroupImageUrl: null,
            categoryId,
            sort,
            status,
          },
          { transaction: t },
        );
      }

      if (!categorysubgroup) {
        throw new Error('Failed to create categorysubgroup.');
      }

      const updatedSubgroup = await CategorySubgroup.findByPk(
        categorysubgroup.id,
        { transaction: t },
      );
      await updatedSubgroup.update(
        { key: updatedSubgroup.id },
        { transaction: t },
      );

      await t.commit();

      return {
        status: 200,
        message: 'CategorySubgroup created successfully.',
        data: categorysubgroup,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const categorysubgroup = await CategorySubgroup.findByPk(req.params.id, {
        where: { deletedAt: null },
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
        include: [
          {
            model: Subcategory,
            as: 'subcategories',
            attributes: [
              'id',
              'id',
              'subcategoryName_en',
              'subcategoryName_mm',
              'subcategoryName_zh',
              'subcategoryImage',
            ],
          },
          {
            model: Category,
            as: 'category',
            attributes: [
              'id',
              'categoryName_en',
              'categoryName_mm',
              'categoryName_zh',
              'categoryIcon',
              'sort',
              'status',
            ],
          },
        ],
        order: [['sort', 'ASC']],
      });

      if (!categorysubgroup) {
        throw new Error('CategorySubgroups Not Found.');
      }

      return {
        status: 200,
        message: 'Retrieved CategorySubgroups Details Successfully.',
        data: categorysubgroup,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        subgroupName_en,
        subgroupName_mm,
        subgroupName_zh,
        categoryId,
        sort,
        status,
      } = req.body;
      const subgroupId = req.params.id;

      const subgroupToUpdate = await CategorySubgroup.findByPk(
        subgroupId,
        { where: { deletedAt: null } },
        { transaction: t },
      );

      if (!subgroupToUpdate) {
        throw new Error('Categorysubgroup Not Found.');
      }

      const categoryExists = await Category.findOne({
        where: {
          id: categoryId,
          deletedAt: null,
        },
      });

      if (!categoryExists) {
        throw new Error('Category ID does not exist or has been deleted.');
      }

      const existingSubgroup = await CategorySubgroup.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { subgroupName_en },
                { subgroupName_mm },
                { subgroupName_zh },
              ],
            },
            { categoryId },
            { id: { [Op.ne]: subgroupId } }, // Exclude current category ID from the check
            { deletedAt: null },
          ],
        },
        transaction: t,
      });

      if (existingSubgroup) {
        throw new Error('Sub Group name already exists in same Category');
      }

      let updatedSubgroup = subgroupToUpdate;
      if (req.file) {
        // If a new file is uploaded, update the category icon
        const result = await uploadFile.toCategorySubgroup(req.file);

        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload subgroup image');
        }

        if (updatedSubgroup.subgroupImage) {
          await deleteFile(updatedSubgroup.subgroupImage);
        }

        updatedSubgroup = await subgroupToUpdate.update(
          {
            subgroupName_en,
            subgroupName_mm,
            subgroupName_zh,
            subgroupImage: result.Key,
            subgroupImageUrl: result.Location,
            categoryId,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        // If no new file is uploaded, update the category names only
        updatedSubgroup = await subgroupToUpdate.update(
          {
            subgroupName_en,
            subgroupName_mm,
            subgroupName_zh,
            subgroupImage: null,
            subgroupImageUrl: null,
            categoryId,
            sort,
            status,
          },
          { transaction: t },
        );
      }
      if (!updatedSubgroup) {
        throw new Error('Failed to update subgroup');
      }

      await t.commit();
      return {
        status: 200,
        message: 'CategorySubgroup updated successfully',
        data: updatedSubgroup,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const categorysubgroup = await CategorySubgroup.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: Subcategory,
            as: 'subcategories',
          },
        ],
        transaction: t,
      });

      if (!categorysubgroup) {
        throw new Error('Categorysubgroup not found or already deleted');
      }

      // Deleting subcategories
      const subcategories = categorysubgroup.subcategories;

      if (subcategories.length > 0) {
        for (const subcategory of subcategories) {
          if (subcategory.subcategoryImage) {
            const deletionResult = await deleteFile(
              subcategory.subcategoryImage,
            );
            if (
              deletionResult.DeleteMarker !== true ||
              deletionResult.$metadata.httpStatusCode !== 204
            ) {
              throw new Error('Error deleting subcategory image');
            }
          }
          await subcategory.update(
            { subcategoryImage: null, subcategoryImageUrl: null },
            { transaction: t },
          );
          await subcategory.destroy({ transaction: t });
        }
      }

      if (categorysubgroup.subgroupImage) {
        const subgroupImage = categorysubgroup.subgroupImage;
        const deletionResult = await deleteFile(subgroupImage);

        if (
          deletionResult.DeleteMarker === true ||
          deletionResult.$metadata.httpStatusCode === 204
        ) {
          await categorysubgroup.update(
            { subgroupImage: null, subgroupImageUrl: null },
            { transaction: t },
          );
        } else {
          throw new Error('Error deleting file');
        }
      }

      const result = await categorysubgroup.destroy({ transaction: t });

      if (!result) {
        throw new Error('Failed to delete categorysubgroup');
      }

      await t.commit();
      return {
        status: 200,
        message: 'Categorysubgroup deleted successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = categorySubgroupService;
