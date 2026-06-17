import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Plus, Trash2, Upload, Images } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdmin });

const BUCKET = "gallery-images";
const cats = ["Physical Lessons","Home Lessons","Virtual Lessons","Student Performances","Events"];

function GalleryAdmin() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: cats[0], image_url: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkCategory, setBulkCategory] = useState(cats[0]);

  const { data } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => (await supabase.from("gallery").select("*").order("created_at",{ascending:false})).data ?? [],
  });

  const add = useMutation({
    mutationFn: async (url: string) => { await supabase.from("gallery").insert({...form, image_url: url}); },
    onSuccess: () => { qc.invalidateQueries({queryKey:["admin-gallery"]}); toast.success("Added"); setOpen(false); setForm({title:"",category:cats[0],image_url:"",description:""}); setFile(null); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("gallery").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({queryKey:["admin-gallery"]}),
  });

  async function handleSubmit() {
    if (!file) return toast.error("Select an image file");
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file);
    if (uploadErr) { setUploading(false); return toast.error(uploadErr.message); }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setUploading(false);
    add.mutate(publicUrl);
  }

  async function handleBulkUpload() {
    if (bulkFiles.length === 0) return toast.error("Select at least one image");
    setUploading(true);
    let success = 0, fail = 0;
    for (const f of bulkFiles) {
      try {
        const ext = f.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, f);
        if (error) { fail++; continue; }
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const title = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        await supabase.from("gallery").insert({ title, category: bulkCategory, image_url: publicUrl, description: "" });
        success++;
      } catch { fail++; }
    }
    setUploading(false);
    qc.invalidateQueries({queryKey:["admin-gallery"]});
    if (success) toast.success(`${success} image${success > 1 ? "s" : ""} uploaded`);
    if (fail) toast.error(`${fail} upload${fail > 1 ? "s" : ""} failed`);
    setBulkFiles([]);
    setBulkOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-navy">Gallery</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>setBulkOpen(true)}><Images className="h-4 w-4" /> Bulk upload</Button>
          <Button variant="gold" onClick={()=>setOpen(true)}><Plus className="h-4 w-4" /> Add image</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(data ?? []).map(g => (
          <Card key={g.id} className="overflow-hidden p-0 group relative">
            <img src={g.image_url} alt={g.title ?? ""} className="h-40 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-medium truncate">{g.title}</p>
              <p className="text-xs text-muted-foreground">{g.category}</p>
            </div>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-card/80 backdrop-blur" onClick={()=>confirm("Delete?")&&del.mutate(g.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
          </Card>
        ))}
      </div>

      {/* Single upload */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add gallery image</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div>
              <Label>Image</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <Button type="button" variant="outline" size="sm" onClick={()=>fileRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" /> Choose file
                </Button>
                <span className="text-sm text-muted-foreground truncate">{file ? file.name : "No file selected"}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v=>setForm({...form,category:v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{cats.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            <Button onClick={handleSubmit} variant="navy" className="w-full" disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk upload */}
      <Dialog open={bulkOpen} onOpenChange={(v) => { if (!uploading) setBulkOpen(v); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Bulk upload images</DialogTitle>
            <DialogDescription>Select multiple images. Titles are auto-generated from filenames.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={()=>bulkFileRef.current?.click()} disabled={uploading}>
                <Images className="h-4 w-4 mr-1" /> Choose files
              </Button>
              <span className="text-sm text-muted-foreground">{bulkFiles.length} file{bulkFiles.length !== 1 ? "s" : ""} selected</span>
              <input ref={bulkFileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => setBulkFiles(Array.from(e.target.files ?? []))} />
            </div>
            <div><Label>Category (applied to all)</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{cats.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {bulkFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {bulkFiles.map((f, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-secondary">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-1">
                      <p className="text-[10px] text-white truncate">{f.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleBulkUpload} variant="navy" className="w-full" disabled={bulkFiles.length === 0 || uploading}>
              {uploading ? `Uploading ${bulkFiles.length} file${bulkFiles.length !== 1 ? "s" : ""}...` : `Upload ${bulkFiles.length} file${bulkFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
