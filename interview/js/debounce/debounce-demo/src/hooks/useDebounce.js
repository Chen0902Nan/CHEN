import { useState, useEffect, useRef } from "react"
// value 频繁修改的值
// wait  延迟时间
// options 配置对象 高阶
export default function useDebounce(value, wait = 300, options = {}) {
  // 三个参数以上，用对象
  const { leading = false, trailing = true } = options;
  // 防抖后的值
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef);
      if (leading && timerRef.current === null) {
        setDebouncedValue = value;
      }
      timerRef.current = setTimeout(() => {
        if (trailing) {
          setDebouncedValue(value);
        }
        timerRef.current = null;
      }, wait);
    }
    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [value, wait, trailing]);
  return debouncedValue;
}
