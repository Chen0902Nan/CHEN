var reverse = function (s, left, right) {
  while (left < right) {
    const tmp = s[left]
    s[left++] = s[right]
    s[right--] = tmp
  }
}

var reverseStr = function (s, k) {
  s = s.split('')
  const n = s.length
  for (let i = 0; i < n; i += k * 2) {
    reverse(s, i, Math.min(i + k, n) - 1)
  }
  return s.join('')
}
