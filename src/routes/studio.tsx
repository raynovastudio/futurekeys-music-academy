import { createFileRoute, Outlet, Link, useRouterState, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Users, FileText, Image as ImageIcon, MessageSquare, Star, Package, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo1 from "@/assets/1.png";

export const Route = createFileRoute("/studio")({
  ssr: false,
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: isAdmin, error } = await supabase.rpc("is_admin", { _user_id: u.user.id });
    if (error || !isAdmin) throw redirect({ to: "/" });
  },
  component: AdminLayout,
});

const nav: Array<{ to: string; label: string; icon: any; exact?: boolean }> = [
  { to: "/studio", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/studio/students", label: "Students", icon: Users },
  { to: "/studio/messages", label: "Messages", icon: MessageSquare },
  { to: "/studio/blog", label: "Blog", icon: FileText },
  { to: "/studio/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/studio/testimonials", label: "Testimonials", icon: Star },
  { to: "/studio/packages", label: "Packages", icon: Package },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className={cn("fixed lg:static z-40 inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transition-transform", open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo1} alt="FutureKeys" className="h-8 w-auto object-contain" />
          </Link>
          <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 ml-auto">Admin</span>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as any} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-accent text-gold" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent/60">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex h-14 items-center justify-between bg-card border-b px-4">
          <button onClick={() => setOpen(!open)} className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="font-display font-bold text-navy">FutureKeys Admin</p>
          <div className="w-9" />
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
