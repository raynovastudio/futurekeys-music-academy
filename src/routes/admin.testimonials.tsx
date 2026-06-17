import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", testimonial: "", rating: 5, featured: false });
  const { data } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("created_at",{ascending:false})).data ?? [],
  });
  const add = useMutation({
    mutationFn: async () => { await supabase.from("testimonials").insert(form); },
    onSuccess: () => { qc.invalidateQueries({queryKey:["admin-testimonials"]}); toast.success("Added"); setOpen(false); setForm({name:"",role:"",testimonial:"",rating:5,featured:false}); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("testimonials").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({queryKey:["admin-testimonials"]}),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-navy">Testimonials</h1>
        <Button variant="gold" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/> Add testimonial</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map(t => (
          <Card key={t.id} className="p-5 relative">
            <div className="flex items-center gap-1 text-gold">{[...Array(t.rating ?? 5)].map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current"/>)}</div>
            <p className="mt-2 text-sm text-foreground/80">"{t.testimonial}"</p>
            <p className="mt-3 font-semibold text-navy text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={()=>confirm("Delete?")&&del.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add testimonial</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div><Label>Role (e.g. Parent, Student)</Label><Input value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/></div>
            <div><Label>Testimonial</Label><Textarea value={form.testimonial} onChange={e=>setForm({...form,testimonial:e.target.value})}/></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})}/></div>
            <Button onClick={()=>add.mutate()} variant="navy" className="w-full" disabled={!form.name || !form.testimonial}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
