// const router = require('express').Router();
// const { Tag, Product, ProductTag } = require('../../models');

// // The `/api/tags` endpoint

// router.get('/', (req, res) => {
//   // find all tags
//   // be sure to include its associated Product data
// });

// router.get('/:id', (req, res) => {
//   // find a single tag by its `id`
//   // be sure to include its associated Product data
// });

// router.post('/', (req, res) => {
//   // create a new tag
// });

// router.put('/:id', (req, res) => {
//   // update a tag's name by its `id` value
// });

// router.delete('/:id', (req, res) => {
//   // delete on tag by its `id` value
// });

// module.exports = router;

const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag,
      },
    });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tags' });
  }
});

// get one tag by id
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        through: ProductTag,
      },
    });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      res.json(tag);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the tag' });
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create the tag' });
  }
});

// update a tag's name by id
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!rowsUpdated) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      res.status(200).json({ message: 'Tag updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update the tag' });
  }
});

// delete a tag by id
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
    } else {
      await tag.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the tag' });
  }
});

module.exports = router;
