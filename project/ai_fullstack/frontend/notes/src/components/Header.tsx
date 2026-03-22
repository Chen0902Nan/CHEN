import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBackBtn?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackBtn = false,
  onBackClick = () => window.history.back(),
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-center px-4">
        <div className="absolute left-4">
          {showBackBtn && (
            <Button variant="ghost" size="icon" onClick={onBackClick}>
              <ArrowLeft size={20} />
            </Button>
          )}
        </div>
        <h1 className="max-w-[68%] truncate text-center text-lg font-semibold tracking-wide text-foreground">
          {title}
        </h1>
        <div className="absolute right-4 w-9" />
      </div>
    </header>
  );
};

export default Header;
