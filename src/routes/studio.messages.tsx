import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/studio/messages")({ component: MessagesPage });

function MessagesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("contact_messages").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success("Deleted"); },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy">Contact Messages</h1>
      <div className="grid gap-4">
        {(data ?? []).map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-navy">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ""} · {new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={m.status} onValueChange={(v) => update.mutate({ id: m.id, status: v })}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["New","Replied","Closed"].map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Button asChild size="icon" variant="ghost"><a href={`mailto:${m.email}`}><Mail className="h-4 w-4" /></a></Button>
                <Button size="icon" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap">{m.message}</p>
          </Card>
        ))}
        {(!data || data.length === 0) && <p className="text-center text-muted-foreground py-12">No messages yet.</p>}
      </div>
    </div>
  );
}
