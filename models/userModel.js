import prisma from '../config/prisma.js';

/* =======================================================
   🔹 CREATE USER
======================================================= */
export const createUser = async (name, email, password, role, address, location, phone) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role.toLowerCase(),
        address: address || '',
        location: location || { lat: 0, lng: 0 },
        // phone field doesn't exist in existing schema, so we skip it
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 FIND USER BY EMAIL
======================================================= */
export const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 FIND USER BY ID
======================================================= */
export const findUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error('❌ Error finding user by id:', error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ALL USERS (ADMIN)
======================================================= */
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    throw error;
  }
};
