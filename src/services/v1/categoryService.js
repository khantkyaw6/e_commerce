const { Op } = require('sequelize');

const Category = require('../../databases/admin/models').Category;
const CategorySubgroup =
  require('../../databases/admin/models').CategorySubgroup;
const Subcategory = require('../../databases/admin/models').Subcategory;
const db = require('../../databases/admin/models');
const deleteFile = require('../../helpers/deleteFileHelper');
const uploadFile = require('../../helpers/uploadFileHelper');

const categoryService = {
  index: async () => {
    try {
      const categories = await Category.findAll({
        where: { deletedAt: null },
        attributes: [
          'id',
          'categoryName_en',
          'categoryName_mm',
          'categoryName_zh',
          'categoryIcon',
          'categoryImageUrl',
          'key',
          'sort',
          'status',
        ],
        include: {
          model: CategorySubgroup,
          as: 'categorysubgroups',
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
          include: {
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
        },
        order: [['sort', 'ASC']],
      });

      return {
        status: 200,
        message: 'Retrieved All Category Lists Successfully.',
        data: categories,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        categoryName_en,
        categoryName_mm,
        categoryName_zh,
        sort,
        status,
      } = req.body;

      const existingCategory = await Category.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { categoryName_en },
                { categoryName_mm },
                { categoryName_zh },
              ],
            },
            { deletedAt: null },
          ],
        },
        transaction: t,
      });

      if (existingCategory) {
        throw new Error('Category name already exists');
      }

      let category;
      if (req.file) {
        const result = await uploadFile.toCategory(req.file);
        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload category icon');
        }

        category = await Category.create(
          {
            categoryName_en,
            categoryName_mm,
            categoryName_zh,
            categoryIcon: result.Key,
            categoryImageUrl: result.Location,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        category = await Category.create(
          {
            categoryName_en,
            categoryName_mm,
            categoryName_zh,
            categoryIcon: null,
            categoryImageUrl: null,
            sort,
            status,
          },
          { transaction: t },
        );
      }

      if (!category) {
        throw new Error('Failed to create category');
      }

      const updatedCategory = await Category.findByPk(category.id, {
        transaction: t,
      });
      await updatedCategory.update(
        { key: updatedCategory.id },
        { transaction: t },
      );

      await t.commit();

      return {
        status: 200,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  show: async (req) => {
    try {
      const category = await Category.findByPk(req.params.id, {
        where: { deletedAt: null },
        attributes: [
          'id',
          'categoryName_en',
          'categoryName_mm',
          'categoryName_zh',
          'categoryIcon',
          'categoryImageUrl',
          'sort',
          'status',
        ],
        include: {
          model: CategorySubgroup,
          as: 'categorysubgroups',
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
          include: {
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
          order: [['sort', 'ASC']],
        },
      });

      if (!category) {
        throw new Error('Category Not Found.');
      }

      return {
        status: 200,
        message: 'Retrieved Category Details Successfully.',
        data: category,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const {
        categoryName_en,
        categoryName_mm,
        categoryName_zh,
        sort,
        status,
      } = req.body;
      const categoryId = req.params.id;

      const categoryToUpdate = await Category.findByPk(
        categoryId,
        { where: { deletedAt: null } },
        { transaction: t },
      );

      if (!categoryToUpdate) {
        throw new Error('Category Not Found.');
      }

      const existingCategory = await Category.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { categoryName_en },
                { categoryName_mm },
                { categoryName_zh },
              ],
            },
            { id: { [Op.ne]: categoryId } }, // Exclude current category ID from the check
            { deletedAt: null },
          ],
        },
        transaction: t,
      });

      if (existingCategory) {
        throw new Error('Category name already exists');
      }

      let updatedCategory = categoryToUpdate;

      if (req.file) {
        // If a new file is uploaded, update the category icon
        const result = await uploadFile.toCategory(req.file);

        if (result.$metadata.httpStatusCode !== 200) {
          throw new Error('Failed to upload category icon');
        }

        if (updatedCategory.categoryIcon) {
          await deleteFile(updatedCategory.categoryIcon);
        }

        updatedCategory = await categoryToUpdate.update(
          {
            categoryName_en,
            categoryName_mm,
            categoryName_zh,
            categoryIcon: result.Key,
            categoryImageUrl: result.Location,
            sort,
            status,
          },
          { transaction: t },
        );
      } else {
        // If no new file is uploaded, update the category names only
        updatedCategory = await categoryToUpdate.update(
          {
            categoryName_en,
            categoryName_mm,
            categoryName_zh,
            sort,
            status,
          },
          { transaction: t },
        );
      }
      if (!updatedCategory) {
        throw new Error('Failed to update category');
      }

      await t.commit();
      return {
        status: 200,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },

  delete: async (req) => {
    const t = await db.sequelize.transaction();
    try {
      const categoryId = req.params.id;

      const category = await Category.findByPk(categoryId, {
        where: { deletedAt: null },
        include: [
          {
            model: CategorySubgroup,
            as: 'categorysubgroups',
            include: {
              model: Subcategory,
              as: 'subcategories',
            },
          },
        ],
        transaction: t,
      });

      if (!category) {
        throw new Error('Category not found or already deleted');
      }

      // Deleting subcategories within each subgroup
      const subgroups = category.categorysubgroups;

      if (subgroups.length > 0) {
        for (const subgroup of subgroups) {
          const subcategories = subgroup.subcategories;

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
          await subgroup.update(
            { subgroupImage: null, subgroupImageUrl: null },
            { transaction: t },
          );
          await subgroup.destroy({ transaction: t });
        }
      }

      if (category.categoryIcon) {
        const categoryIcon = category.categoryIcon;
        const deletionResult = await deleteFile(categoryIcon);

        if (
          deletionResult.DeleteMarker === true ||
          deletionResult.$metadata.httpStatusCode === 204
        ) {
          await category.update(
            { categoryIcon: null, categoryImageUrl: null },
            { transaction: t },
          );
        } else {
          throw new Error('Error deleting file');
        }
      }

      const result = await category.destroy({ transaction: t });

      if (!result) {
        throw new Error('Failed to delete category');
      }

      await t.commit();
      return {
        status: 200,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
  },
};

module.exports = categoryService;
