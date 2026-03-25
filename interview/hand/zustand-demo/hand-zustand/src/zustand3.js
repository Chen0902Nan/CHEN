export function createStore(){
  let state={count:0}
  const getState=()=>state
  // 不重复的数组容器 新的数据结构
  // 确保不重复关注 建立订阅者关系的一个容器
  const listenners=new Set() // 所有的订阅者
  const setState=((newState)=>{
    state=newState
    // 通知所有的订阅者，执行订阅函数
    listenners.forEach(listenner=>listenner())
  })
const subscribe=(listenner)=>{
  listenners.add(listenner)
  return ()=>listenners.delete(listenner)
}

return {
  getState,
  setState,
  subscribe
}

}

