var evalRPN = function(tokens) {
    const st = [];
    for (const token of tokens) {
        const num = parseInt(token);
        if (!Number.isNaN(num)) { // token 是数字
            st.push(num);
            continue;
        }

        const x = st.pop();
        const topIdx = st.length - 1;
        if (token === '+') {
            st[topIdx] += x;
        } else if (token === '-') {
            st[topIdx] -= x;
        } else if (token === '*') {
            st[topIdx] *= x;
        } else {
            st[topIdx] = Math.trunc(st[topIdx] / x); // 向零取整
        }
    }
    return st[0];
};
