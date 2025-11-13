/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  const m = new Map()
  //循环遍历strs
  for (s of strs) {
    //将原有字符串，切割，排序，合并成新的key
    const index = s.split('').sort().join('')
    if (!m.has(index)) {
      m.set(index, [])
    }
    //将同一个key的字符串，追加在一起
    m.get(index).push(s)
  }
  //返回所有values
  return Array.from(m.values())
}
