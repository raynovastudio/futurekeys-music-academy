import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, CalendarDays, TrendingUp, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: total } = useQuery({
    queryKey: ["analytics-total"],
    queryFn: async () => {
      const { count } = await supabase.from("page_visits").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });

  const { data: today } = useQuery({
    queryKey: ["analytics-today", todayStart],
    queryFn: async () => {
      const { count } = await supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("created_at", todayStart);
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });

  const { data: week } = useQuery({
    queryKey: ["analytics-week", weekStart],
    queryFn: async () => {
      const { count } = await supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("created_at", weekStart);
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });

  const { data: month } = useQuery({
    queryKey: ["analytics-month", monthStart],
    queryFn: async () => {
      const { count } = await supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("created_at", monthStart);
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });

  const { data: daily } = useQuery({
    queryKey: ["analytics-daily", weekStart],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_visits")
        .select("created_at")
        .gte("created_at", weekStart)
        .order("created_at", { ascending: true });
      if (!data) return [];
      const map = new Map<string, number>();
      for (const v of data) {
        const d = new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        map.set(d, (map.get(d) ?? 0) + 1);
      }
      return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
    },
    refetchInterval: 30_000,
  });

  const { data: topPages } = useQuery({
    queryKey: ["analytics-pages"],
    queryFn: async () => {
      const { data } = await supabase.from("page_visits").select("path");
      if (!data) return [];
      const map = new Map<string, number>();
      for (const v of data) {
        const p = v.path || "/";
        map.set(p, (map.get(p) ?? 0) + 1);
      }
      return Array.from(map.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
    refetchInterval: 30_000,
  });

  const maxDaily = Math.max(...(daily ?? []).map((d) => d.count), 1);

  const cards = [
    { label: "Total Visits", value: total ?? 0, icon: Eye, color: "from-blue-500 to-blue-700" },
    { label: "Today", value: today ?? 0, icon: CalendarDays, color: "from-amber-500 to-amber-700" },
    { label: "This Week", value: week ?? 0, icon: TrendingUp, color: "from-green-500 to-green-700" },
    { label: "This Month", value: month ?? 0, icon: Globe, color: "from-purple-500 to-purple-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">Analytics</h1>
        <p className="text-muted-foreground mt-1">Website visitor statistics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-xl font-bold text-navy mb-4">Last 7 Days</h2>
          {(!daily || daily.length === 0) ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No data yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {daily.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-navy">{d.count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-gold to-gold/60 rounded-t"
                    style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.date}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold text-navy mb-4">Top Pages</h2>
          {(!topPages || topPages.length === 0) ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {topPages.map((p, i) => {
                const maxCount = topPages[0].count;
                return (
                  <div key={p.path} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-navy truncate">{p.path || "/"}</span>
                        <span className="text-muted-foreground">{p.count}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
