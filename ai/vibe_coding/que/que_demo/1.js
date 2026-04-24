/**
 * @func 根据id查询用户
 * @param {number} id
 * @return {Promise<User>}
 */

async function getUserById (id, user) {
  user = await db.query('select * from user where id = ?', [id])
  return user
}
// 根据邮箱查询用户
async function getUserByEmail (email, user) {
  user = await db.query('select * from user where email = ?', [email])
  return user
}
