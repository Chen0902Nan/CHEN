type ThrottleFunction<TArgs extends unknown[]> = (...args: TArgs) => void;

export function throttle<TArgs extends unknown[]>(
  fn: ThrottleFunction<TArgs>,
  delay: number,
): ThrottleFunction<TArgs> {
  let lastExecution = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: TArgs) => {
    const now = Date.now();

    if (now < lastExecution + delay) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecution = Date.now();
        fn(...args);
      }, delay);
      return;
    }

    lastExecution = now;
    fn(...args);
  };
}
