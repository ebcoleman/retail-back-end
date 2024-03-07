

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: Product,
      },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// get one category by id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: {
        model: Product,
      },
    });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.json(category);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the category' });
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create the category' });
  }
});

// update a category by id
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!rowsUpdated) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json({ message: 'Category updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update the category' });
  }
});

// delete a category by id
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      await category.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the category' });
  }
});

module.exports = router;
