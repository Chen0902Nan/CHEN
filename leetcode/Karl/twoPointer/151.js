/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    const len=s.length
    let right=len-1
    let left=right
    let res=[]
    while(right>=0){

      while(right>=0&&s[right]==' '){
        right--
      }
      if (right < 0) break;
      left=right
      let str=''
      while(left>=0&&s[left]!==' '){
        str=s[left]+str
        left--
      }
     res.push(str)
      right=left
    }
    return res.join(' ')
};