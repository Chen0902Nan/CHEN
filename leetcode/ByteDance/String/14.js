/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    const s0 = strs[0];
    for (let j = 0; j < s0.length; j++) { // 从左到右
        for (const s of strs) { // 从上到下
            if (j === s.length || s[j] !== s0[j]) { // 这一列有字母缺失或者不同
                return s0.slice(0, j); // 0 到 j-1 是公共前缀
            }
        }
    }
    return s0;
}