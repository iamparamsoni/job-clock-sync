import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  items: Array<{
    name: string;
    path: string;
  }>;
}

export const Navigation = ({ items }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6">
        <div className="flex gap-8">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "py-4 text-sm font-medium transition-colors hover:text-primary border-b-2",
                location.pathname === item.path
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
