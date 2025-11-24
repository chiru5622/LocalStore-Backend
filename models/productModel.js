import prisma from '../config/prisma.js';

/* =======================================================
   🔹 CREATE PRODUCT
======================================================= */
export const createProduct = async (productData) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || '',
        image: productData.image || '📦',
        category: productData.category,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        lowStockThreshold: parseInt(productData.lowStockThreshold) || 10,
      },
    });
    return product;
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ALL PRODUCTS
======================================================= */
export const getAllProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET PRODUCT BY ID
======================================================= */
export const getProductById = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error('❌ Error fetching product:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET PRODUCTS BY CATEGORY
======================================================= */
export const getProductsByCategory = async (category) => {
  try {
    const products = await prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 UPDATE PRODUCT
======================================================= */
export const updateProduct = async (id, updates) => {
  try {
    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
    if (updates.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(updates.lowStockThreshold);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return product;
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 UPDATE PRODUCT STOCK
======================================================= */
export const updateProductStock = async (id, stock) => {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) },
    });
    return product;
  } catch (error) {
    console.error('❌ Error updating product stock:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 DELETE PRODUCT
======================================================= */
export const deleteProduct = async (id) => {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    throw error;
  }
};
