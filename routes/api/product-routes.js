
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the product' });
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create the product' });
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedProduct]] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });
    if (!rowsUpdated) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      if (req.body.tagIds && req.body.tagIds.length) {
        await ProductTag.destroy({
          where: {
            product_id: req.params.id,
          },
        });
        const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));
        await ProductTag.bulkCreate(productTagIdArr);
      }
      res.json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update the product' });
  }
});

// delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      await ProductTag.destroy({
        where: {
          product_id: req.params.id,
        },
      });
      await product.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the product' });
  }
});

module.exports = router;
