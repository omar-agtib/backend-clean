import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "../lib/cn";

interface UserMenuProps {
  email?: string;
  name?: string;
  onLogout: () => void;
}

export default function UserMenu({ email, name, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const displayName = name || email || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-center h-10 px-3 rounded-xl transition duration-200",
          "bg-card border border-border hover:bg-muted",
          "text-foreground text-sm font-medium",
          isOpen && "bg-muted"
        )}
      >
        <div className="h-6 w-6 rounded-full bg-primary text-primaryForeground flex items-center justify-center mr-2 text-xs font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline truncate">{displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs text-mutedForeground">Signed in as</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {displayName}
            </p>
            {email && email !== name && (
              <p className="text-xs text-mutedForeground truncate">{email}</p>
            )}
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Could navigate to profile in future
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Could navigate to settings in future
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error rounded-lg hover:bg-muted transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
