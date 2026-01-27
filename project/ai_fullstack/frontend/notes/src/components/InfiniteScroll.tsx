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
  return <>{children}</>;
};

export default InfiniteScroll;
