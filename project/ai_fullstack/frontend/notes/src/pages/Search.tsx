import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchStore } from "@/store/useSearchStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const navigate = useNavigate();

  const { loading, suggestions, search, history, clearHistory } =
    useSearchStore();

  const handleSearch = (nextKeyword: string) => {
    const trimmed = nextKeyword.trim();
    setKeyword(trimmed);
    if (trimmed) {
      void search(trimmed);
    }
  };

  useEffect(() => {
    if (debouncedKeyword.trim()) {
      void search(debouncedKeyword);
    }
  }, [debouncedKeyword, search]);

  return (
    <div className="min-h-screen px-4 pt-3">
      <div className="sticky top-2 z-30 mb-4 rounded-2xl border border-white/70 bg-white/85 p-2 shadow-[0_10px_20px_rgba(15,56,76,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/75" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索话题、技术栈、项目关键词"
              className="h-10 rounded-xl border-0 bg-secondary pl-9 pr-9 shadow-none focus-visible:ring-2"
            />
            {keyword && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setKeyword("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="secondary"
            className="h-10 rounded-xl px-3"
            onClick={() => handleSearch(keyword)}
          >
            搜索
          </Button>
        </div>
      </div>

      {!keyword && (
        <div className="space-y-4">
          {history.length > 0 && (
            <Card className="fade-up">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">搜索历史</h2>
                  <Button variant="ghost" size="sm" onClick={() => clearHistory()}>
                    清空
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="fade-up border-dashed bg-white/75">
            <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
              输入关键词后，将展示语义搜索结果与推荐内容。
            </CardContent>
          </Card>
        </div>
      )}

      {keyword && (
        <Card className="fade-up">
          <CardContent className="p-0">
            <ScrollArea className="h-[66vh]">
              {loading && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  正在检索内容...
                </div>
              )}

              {!loading && suggestions.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  没有匹配结果，试试更短或更具体的关键词。
                </div>
              )}

              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full border-b border-border/70 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/70"
                >
                  {item}
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchPage;
