/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
  const map=new Map()
  for(const s of strs){
    const str=s.split('').sort((a,b)=>a-b).join('')
    if(!map.has(str)){
      map.set(str,[])
    }
      map.get(str).push(s)
  }
  return Array.from(map.values())   
};