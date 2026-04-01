/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  const sArray=new Array(26).fill(0)
  const pArray=new Array(26).fill(0)

  for(let i=0;i<p.length;i++){
    pArray[p[i].charCodeAt()-'a'.charCodeAt()]++
  }
  let left=0
  let n=p.length
  let ans=[]
  for(let right=0;right<s.length;right++){
    if(right-left+1>n){
      sArray[s[left].charCodeAt()-'a'.charCodeAt()]--
      left++
    }
    sArray[s[right].charCodeAt()-'a'.charCodeAt()]++
    
    if(sArray.toString()===pArray.toString()){
      ans.push(left)
    }
  }
    return ans
};