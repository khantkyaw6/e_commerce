const Tag = require('../../databases/admin/models').Tag;

const tagService = {
  index: async () => {
    try {
      const tags = await Tag.findAll({
        where: { deletedAt: null },
        attributes: ['id', 'tagName', 'key'],
      });

      return {
        status: 200,
        message: 'Retrieved All Tag Lists Successfully.',
        data: tags,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  store: async (req) => {
    try {
      const { tagName } = req.body;
      const existingTag = await Tag.findOne({ where: { tagName } });

      if (existingTag) {
        throw new Error('Tag name already exists');
      }

      const tag = await Tag.create({ tagName });

      if (!tag) {
        throw new Error('Failed to create tag');
      }

      const updatedTag = await Tag.findByPk(tag.id);
      await updatedTag.update({ key: updatedTag.id });

      return {
        status: 200,
        message: 'Tag created successfully',
        data: tag,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (req) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      await tag.update({ tagName: req.body.tagName });

      return {
        status: 200,
        message: 'Tag updated successfully',
        data: tag,
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  delete: async (req) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      await tag.destroy();

      return {
        status: 200,
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = tagService;
