import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/students")({ component: StudentsPage });

const statuses = ["Pending", "Contacted", "Active", "Inactive"];

function StudentsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("students").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-students"] }); toast.success("Updated"); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-students"] }); toast.success("Deleted"); },
  });

  const filtered = (data ?? []).filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (q && !`${s.student_name} ${s.parent_name} ${s.parent_email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  function exportCsv() {
    const rows = ["Student,Age,Parent,Phone,Email,Instrument,Package,Status,Date"];
    filtered.forEach((s) => rows.push([s.student_name, s.age, s.parent_name, s.parent_phone, s.parent_email, s.selected_instrument, s.selected_package, s.status, new Date(s.created_at).toLocaleDateString()].join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-navy">Students & Enrollments</h1>
        <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or email…" value={q} onChange={(e)=>setQ(e.target.value)} />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b bg-secondary/50">
            <th className="p-3 font-medium">Student</th>
            <th className="p-3 font-medium">Parent</th>
            <th className="p-3 font-medium">Contact</th>
            <th className="p-3 font-medium">Program</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium"></th>
          </tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-secondary/30">
                <td className="p-3">
                  <p className="font-medium text-navy">{s.student_name}</p>
                  <p className="text-xs text-muted-foreground">Age {s.age} · {s.gender ?? "—"}</p>
                </td>
                <td className="p-3">{s.parent_name}</td>
                <td className="p-3 text-xs">
                  <p>{s.parent_phone}</p>
                  <p className="text-muted-foreground">{s.parent_email}</p>
                </td>
                <td className="p-3 text-xs">
                  <p className="font-medium">{s.selected_instrument}</p>
                  <p className="text-muted-foreground">{s.selected_package}</p>
                </td>
                <td className="p-3">
                  <Select value={s.status} onValueChange={(v) => update.mutate({ id: s.id, status: v })}>
                    <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map(st=> <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => confirm("Delete enrollment?") && del.mutate(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No students found.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
