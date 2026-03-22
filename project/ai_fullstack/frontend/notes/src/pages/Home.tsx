import { useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SlideShow from "@/components/SlideShow";
import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/PostItem";
import { useHomeStore } from "@/store/useHomeStore";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();
  const { banners, posts, hasMore, loadMore, loading } = useHomeStore();

  useEffect(() => {
    if (posts.length === 0) {
      void loadMore();
    }
  }, [loadMore, posts.length]);

  const hotTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 6),
    [posts],
  );

  return (
    <div className="space-y-5 px-4 pt-3">
      <div className="sticky top-2 z-30">
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="flex h-12 w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-4 text-left shadow-[0_8px_22px_rgba(15,56,76,0.08)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,56,76,0.12)]"
        >
          <Search className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">搜索你感兴趣的内容</span>
        </button>
      </div>

      <section className="glass-surface overflow-hidden rounded-3xl p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Daily Digest
        </p>
        <h1 className="mt-2 text-2xl leading-snug text-foreground">
          发现值得收藏的技术笔记
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          聚合前端、后端与 AI 实战灵感，支持滚动加载和快速检索。
        </p>
        {hotTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hotTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </section>

      <SlideShow slides={banners} />

      <section className="space-y-3 pb-2">
        <div className="flex items-end justify-between">
          <h2 className="text-xl text-foreground">文章列表</h2>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {posts.length} Posts
          </span>
        </div>

        <InfiniteScroll hasMore={hasMore} isLoading={loading} onLoadMore={loadMore}>
          <ul className="space-y-3">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </ul>
        </InfiniteScroll>
      </section>
    </div>
  );
}
