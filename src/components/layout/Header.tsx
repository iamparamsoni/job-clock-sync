import { LogOut, User as UserIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/contexts/AuthContext";

interface HeaderProps {
  userName?: string;
  user?: User | null;
  onLogout: () => void;
}

const Header = ({ userName, user, onLogout }: HeaderProps) => {
  // Display only role name (Vendor or Company) instead of user name
  const displayName = user?.role || "User";

  const initials = displayName
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Hourglass</span>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span>{displayName}</span>
                  {user && <span className="text-xs text-muted-foreground font-normal">{user.email}</span>}
                  {user && <span className="text-xs text-muted-foreground font-normal capitalize">{user.role.toLowerCase()}</span>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
