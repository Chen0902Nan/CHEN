/**
 * @func 查找所有非活跃用户
 * @param users 用户列表
 * @return 非活跃用户列表
 *
 */

async function getInactiveUsers (users) {
  const inactiveUsers = await users.filter(user => user.status === 'INACTIVE')
  return inactiveUsers
}
