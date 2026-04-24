import { useEffect, useRef } from "react";

// load more 通用组件
interface InfiniteScrollProps {
  hasMore: boolean; // 是否所有数据都加载了 分页
  isLoading?: boolean; // 滚动到底部 加载更多 避免重复触发
  onLoadMore: () => void; // 更多加载的一个抽象 /api/posts?page=2&limit=10
  children: React.ReactNode; // InfiniteScroll 通用的滑动功能，滚动的具体内容接受定制
}
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  onLoadMore,
  isLoading = false,
  children,
}) => {
  // react 中不建议直接访问dom 使用 useRef
  // HTMLDivElement React 前端全局提供
  const sentinelRef = useRef<HTMLDivElement>(null);
  // 只有组件挂载之后 sentinelRef.current
  useEffect(() => {
    if (!hasMore || isLoading) return;
    // 浏览器内部 没有性能问题
    const observer = new IntersectionObserver(
      (entries) => {
        // 进入视窗 viewport
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        // 目标像素有多少(百分比)进入视窗，就触发回调
        threshold: 0,
      },
    );
    const sentinelEl = sentinelRef.current;
    if (sentinelEl) observer.observe(sentinelEl);
    // 卸载(路由切换)
    // 更新时
    return () => {
      if (sentinelEl) observer.unobserve(sentinelEl);
    };
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <>
      {children}
      {/* Intersection Observer 哨兵元素 */}
      <div ref={sentinelRef} className="h-4" />
      {isLoading && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          加载中...
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
