import type { Post } from "@/types";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart } from "lucide-react";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const navigate = useNavigate();

  return (
    <li>
      <button
        type="button"
        onClick={() => navigate(`/post/${post.id}`)}
        className="fade-up group flex w-full items-start gap-3 rounded-2xl border border-white/70 bg-white/92 p-4 text-left shadow-[0_8px_22px_rgba(15,56,76,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,56,76,0.14)]"
      >
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="truncate text-base font-semibold text-foreground">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{post.brief}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar size="sm">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{post.user.name}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.totalComments ?? 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {post.totalLikes ?? 0}
              </span>
            </div>
          </div>
        </div>

        {post.thumbnail && (
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
            <img
              loading="lazy"
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </button>
    </li>
  );
}
