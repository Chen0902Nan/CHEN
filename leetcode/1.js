var validateCoupons = function(code, businessLine, isActive) {
    const groups = [[], [], [], []];
    const ans = [];
    
    for (let i = 0; i < code.length; i++) {
        if (code[i] && check(code[i], isActive[i])) {
            switch (businessLine[i]) {
                case "electronics":
                    groups[0].push(code[i]);
                    break;
                case "grocery":
                    groups[1].push(code[i]);
                    break;
                case "pharmacy":
                    groups[2].push(code[i]);
                    break;
                case "restaurant":
                    groups[3].push(code[i]);
                    break;
            }
        }
    }
    
    for (let group of groups) {
        group.sort();
        ans.push(...group);
    }
    
    return ans;
};

const check = (code, isActive) => {
    for (let char of code) {
        if (char !== '_' && !(/[a-zA-Z0-9]/).test(char)) {
            return false;
        }
    }
    return isActive;
}

作者：力扣官方题解
链接：https://leetcode.cn/problems/coupon-code-validator/solutions/3853498/you-hui-quan-xiao-yan-qi-by-leetcode-sol-6noh/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。