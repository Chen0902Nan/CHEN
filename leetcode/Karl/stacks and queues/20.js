/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  if(s.length<=1||s.length%2!==0) return false
  const stack=[]
  const map=new Map()
  map.set('}','{')
  map.set(']','[')
  map.set(')','(')
  for(const x of s){
    if(x==='{'||x==='['||x==='('){
      stack.push(x)
    }else{
      if(stack.pop()!==map.get(x)) return false
    }
  }
return stack.length==0

}