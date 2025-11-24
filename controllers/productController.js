import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  updateProductStock,
  deleteProduct,
} from '../models/productModel.js';

/* =======================================================
   🔹 GET ALL PRODUCTS
======================================================= */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    let products;
    if (category) {
      products = await getProductsByCategory(category);
    } else {
      products = await getAllProducts();
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET PRODUCT BY ID
======================================================= */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 CREATE PRODUCT (MANAGER ONLY)
======================================================= */
export const createProductHandler = async (req, res) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 UPDATE PRODUCT (MANAGER ONLY)
======================================================= */
export const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 UPDATE PRODUCT STOCK (MANAGER ONLY)
======================================================= */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock value is required',
      });
    }

    const product = await updateProductStock(id, stock);

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stock',
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 DELETE PRODUCT (MANAGER ONLY)
======================================================= */
export const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

