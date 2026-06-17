import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/studio/packages")({ component: PackagesAdmin });

function PackagesAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const { data } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => (await supabase.from("lesson_packages").select("*").order("sort_order")).data ?? [],
  });
  const save = useMutation({
    mutationFn: async (p: any) => {
      const features = typeof p.features === "string" ? p.features.split("\n").map((s: string) => s.trim()).filter(Boolean) : p.features;
      const { error } = await supabase.from("lesson_packages").update({
        package_name: p.package_name, price: Number(p.price), description: p.description,
        features, location: p.location, badge: p.badge || null, active: p.active,
      }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["admin-packages"]}); toast.success("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy">Lesson Packages</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {(data ?? []).map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex justify-between">
              <h3 className="font-display font-bold text-navy">{p.package_name}</h3>
              <Button size="icon" variant="ghost" onClick={()=>setEditing({...p, features: Array.isArray(p.features) ? (p.features as string[]).join("\n") : ""})}><Edit className="h-4 w-4"/></Button>
            </div>
            <p className="font-display text-2xl font-extrabold mt-2">₦{p.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground mt-1">{p.location}</p>
            {p.badge && <span className="inline-block mt-2 text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-gradient-gold text-navy">{p.badge}</span>}
          </Card>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o)=>!o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit package</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.package_name} onChange={e=>setEditing({...editing, package_name:e.target.value})}/></div>
              <div><Label>Price (₦)</Label><Input type="number" value={editing.price} onChange={e=>setEditing({...editing, price:e.target.value})}/></div>
              <div><Label>Location</Label><Input value={editing.location ?? ""} onChange={e=>setEditing({...editing, location:e.target.value})}/></div>
              <div><Label>Badge (optional)</Label><Input value={editing.badge ?? ""} onChange={e=>setEditing({...editing, badge:e.target.value})} placeholder="Most Popular"/></div>
              <div><Label>Description</Label><Textarea value={editing.description ?? ""} onChange={e=>setEditing({...editing, description:e.target.value})}/></div>
              <div><Label>Features (one per line)</Label><Textarea className="min-h-32" value={editing.features} onChange={e=>setEditing({...editing, features:e.target.value})}/></div>
              <div className="flex items-center gap-2"><Switch checked={editing.active} onCheckedChange={v=>setEditing({...editing, active:v})}/><Label>Active</Label></div>
              <Button onClick={()=>save.mutate(editing)} variant="navy" className="w-full">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
