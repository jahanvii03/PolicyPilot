import React from "react";
import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const fullname = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white shadow-[0_10px_24px_rgba(59,130,246,0.22)] ring-1 ring-blue-100/80">
            <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-br from-white/20 to-transparent" />
            <Sparkles className="relative h-5 w-5 drop-shadow-sm" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-lg">
              PolicyPilot
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              Smart guide to employee policies across locations
            </p>
          </div>
        </div>

        {user && (
  <div className="ml-3 flex items-center gap-2 sm:gap-3">
    <div className="hidden md:flex items-center gap-1 rounded-full  px-2.5 py-1.5">
      <div className="text-right leading-tight">
        <p className="max-w-[140px] truncate text-sm font-medium text-slate-900">
          {fullname || user.first_name}
        </p>
      </div>

      <Avatar className="h-9 w-9 ">
        <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-700">
          {getUserInitials(fullname || user.first_name || "U")}
        </AvatarFallback>
      </Avatar>
    </div>

    <Avatar className="h-8 w-8 border md:hidden">
      <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-700">
        {getUserInitials(fullname || user.first_name || "U")}
      </AvatarFallback>
    </Avatar>

    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="h-9 rounded-xl px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:px-3"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:ml-2 sm:inline">Logout</span>
    </Button>
  </div>
)}
      </div>
    </header>
  );
};