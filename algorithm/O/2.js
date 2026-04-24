function traverse(arr) {
  var outlen = arr.length; // 1
  // i + n +1 +n
  for (var i = 0; i < outlen; i++) {
    // n
    var inlen = arr[i].length;
    // n + n*(n+1) + n*n
    for (var j = 0; j < inlen; j++) {
      // n*n
      console.log(arr[i][j]);
    }
  }
}

// 3n^2 + 5n +1
