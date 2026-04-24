 type User={
  Id:string;//用户ID
  name:string;//用户名
  email:string;//用户邮箱
  status:'ACTIVE'|'INACTIVE';//用户状态 活跃或非活跃
 }

 async function getUserById(id:string,users:User[]){
const user=await users.find(user=>user.Id===id)           
if(!user){
  throw new Error('用户不存在')
}
return user
 }