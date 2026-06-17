import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, MessageSquare, FileText, Star, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/studio/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [students, pending, messages, blog, testi] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "Pending"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
      ]);
      return {
        students: students.count ?? 0,
        pending: pending.count ?? 0,
        messages: messages.count ?? 0,
        blog: blog.count ?? 0,
        testimonials: testi.count ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent-students"],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Students", value: stats?.students ?? 0, icon: Users, color: "from-blue-500 to-blue-700" },
    { label: "Pending Enrollments", value: stats?.pending ?? 0, icon: Clock, color: "from-amber-500 to-amber-700" },
    { label: "Inquiries", value: stats?.messages ?? 0, icon: MessageSquare, color: "from-purple-500 to-purple-700" },
    { label: "Blog Posts", value: stats?.blog ?? 0, icon: FileText, color: "from-green-500 to-green-700" },
    { label: "Testimonials", value: stats?.testimonials ?? 0, icon: Star, color: "from-rose-500 to-rose-700" },
    { label: "Growth", value: "↗", icon: TrendingUp, color: "from-navy to-navy/70" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's a quick overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-6 hover:shadow-premium transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-3xl font-extrabold text-navy">{c.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-card`}>
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-display text-xl font-bold text-navy">Recent Enrollments</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-muted-foreground border-b">
              <th className="py-2 font-medium">Student</th><th className="py-2 font-medium">Package</th>
              <th className="py-2 font-medium">Instrument</th><th className="py-2 font-medium">Status</th><th className="py-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {(recent ?? []).map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-3">{s.student_name}</td>
                  <td className="py-3">{s.selected_package}</td>
                  <td className="py-3">{s.selected_instrument}</td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{s.status}</span></td>
                  <td className="py-3 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!recent || recent.length === 0) && (<tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No enrollments yet.</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
