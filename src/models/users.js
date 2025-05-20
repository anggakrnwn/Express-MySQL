const dbPool = require("../config/database");

const getAllUsers = async () => {
  const SQLQuery = `
    SELECT 
      idusers, 
      name, 
      email, 
      address,
      role_id
    FROM users 
    WHERE deleted_at IS NULL`;

  try {
    const [rows] = await dbPool.execute(SQLQuery);
    return rows;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

const createNewUser = async (body) => {
  const SQLQuery = `
    INSERT INTO users 
    (name, email, address, password, role_id) 
    VALUES (?, ?, ?, ?, ?)`;

  try {
      
    let finalRoleId = 1; 
    
    if (body.role_id) {
      if (![1, 2].includes(Number(body.role_id))) {
        throw new Error('Invalid role_id');
      }
      finalRoleId = Number(body.role_id);
    }
    const [result] = await dbPool.execute(SQLQuery, [
      body.name,
      body.email,
      body.address,
      body.password,
      finalRoleId 
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error in createNewUser:", error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const SQLQuery = `
    SELECT idusers, name, email, address, password, role_id 
    FROM users 
    WHERE email = ? 
    LIMIT 1`;

  try {
    const [rows] = await dbPool.execute(SQLQuery, [email]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

const updateUser = async (body, id) => {
  const SQLQuery = `
    UPDATE users 
    SET 
      name = ?,
      email = ?,
      address = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE idusers = ?`;

  try {
    const [result] = await dbPool.execute(SQLQuery, [
      body.name,
      body.email,
      body.address,
      id,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  const SQLQuery = `
    UPDATE users 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE idusers = ?`;

  try {
    const [result] = await dbPool.execute(SQLQuery, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
