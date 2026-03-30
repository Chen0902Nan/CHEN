/**
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function(envelopes) {
    envelopes.sort((a,b)=>a[0]-b[0]||b[1]-a[1])
    const top=[]
    let piles=0
    for(let i=0;i<envelopes.length;i++){
      let poker=envelopes[i][1]
      let left=0,right=piles
      while(left<right){
        let mid=Math.floor((left+right)/2)
        if(top[mid]<poker){
          left=mid+1
        }else if(top[mid]>poker){
          right=mid
        } else{
          right=mid
        }
      }
      if(left==piles) piles++
      top[left]=poker
    }
    return piles
};