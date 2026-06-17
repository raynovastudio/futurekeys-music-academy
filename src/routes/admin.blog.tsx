import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

type Post = {
  id?: string; title: string; slug: string; content: string; excerpt: string;
  featured_image: string; category: string; author: string; published: boolean;
  meta_title: string; meta_description: string;
};
const empty: Post = { title: "", slug: "", content: "", excerpt: "", featured_image: "", category: "", author: "", published: false, meta_title: "", meta_description: "" };

function BlogAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const save = useMutation({
    mutationFn: async (p: Post) => {
      const payload = { ...p, updated_at: new Date().toISOString() };
      if (p.id) { await supabase.from("blog_posts").update(payload).eq("id", p.id); }
      else { await supabase.from("blog_posts").insert(payload); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Saved"); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("blog_posts").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  function startNew() { setEditing(empty); setOpen(true); }
  function startEdit(p: any) { setEditing({ ...empty, ...p }); setOpen(true); }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-navy">Blog Posts</h1>
        <Button variant="gold" onClick={startNew}><Plus className="h-4 w-4" /> New post</Button>
      </div>

      <div className="grid gap-3">
        {(data ?? []).map((p) => (
          <Card key={p.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-navy">{p.title}</p>
              <p className="text-xs text-muted-foreground">/{p.slug} · {p.published ? "Published" : "Draft"} · {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => confirm("Delete post?") && del.mutate(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
        {(!data || data.length === 0) && <p className="text-center text-muted-foreground py-12">No posts yet. Create one!</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editing.title} onChange={(e)=>setEditing({...editing, title: e.target.value, slug: editing.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e)=>setEditing({...editing, slug: e.target.value})} /></div>
              <div><Label>Category</Label><Input value={editing.category} onChange={(e)=>setEditing({...editing, category: e.target.value})} placeholder="e.g. Practice Tips" /></div>
              <div><Label>Author</Label><Input value={editing.author} onChange={(e)=>setEditing({...editing, author: e.target.value})} /></div>
              <div><Label>Featured image URL</Label><Input value={editing.featured_image} onChange={(e)=>setEditing({...editing, featured_image: e.target.value})} /></div>
              <div><Label>Excerpt</Label><Textarea value={editing.excerpt} onChange={(e)=>setEditing({...editing, excerpt: e.target.value})} /></div>
              <div><Label>Content</Label><Textarea className="min-h-60" value={editing.content} onChange={(e)=>setEditing({...editing, content: e.target.value})} /></div>
              <div><Label>Meta title (SEO)</Label><Input value={editing.meta_title} onChange={(e)=>setEditing({...editing, meta_title: e.target.value})} /></div>
              <div><Label>Meta description (SEO)</Label><Textarea value={editing.meta_description} onChange={(e)=>setEditing({...editing, meta_description: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={editing.published} onCheckedChange={(v)=>setEditing({...editing, published: v})} /><Label>Published</Label></div>
              <Button onClick={()=>save.mutate(editing)} variant="navy" className="w-full">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
