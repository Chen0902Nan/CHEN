const fastSort=function(arr){
if (arr.length <= 1) {
    return arr;
}

  let len=arr.length
  let midIndex=Math.floor(len/2)
  let midValue=arr[midIndex]

  const left=[]
  const mid=[]
  const right=[]
  
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < midValue) {
            left.push(arr[i]);
        } else if (arr[i] > midValue) { 
            right.push(arr[i]);
        } else {
            mid.push(arr[i]);
        }
    }

  return ([...fastSort(left),...mid,...fastSort(right)])
}

const arr1=[1,23,53,45,23,7678,123,93]
console.log(arr1);
console.log(fastSort(arr1));

