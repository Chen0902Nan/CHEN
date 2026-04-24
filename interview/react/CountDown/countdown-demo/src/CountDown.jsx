import React, { useState, useEffect, useRef } from "react";
// 接受seconds 参数， 实时显示剩余时间，倒计时结束后显示 结束了
// useState seconds
// useEffect 设置定时器， 每秒更新一次seconds
// 定时器ID 用useRef 保存
// seconds 改了后， useEffect 重新设置定时器
// 移除定时器
// 进阶功能 暂停/继续

const CountDown = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  // 是否结束 可读性
  const [isFinished, setIsFinished] = useState(false);
  // 定时器ID 组件函数多次调用， 定时器ID 不会丢失
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(seconds);
    setIsFinished(false);
    // 启动倒计时
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // 挂载
    // 更新
    // 卸载
  }, [seconds]);

  if (isFinished) {
    return <div>倒计时结束了</div>;
  }

  return <div>{timeLeft} 秒</div>;
};
