import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/enroll")({
  head: () => ({
    meta: [
      { title: "Enroll Now | FutureKeys Music Academy" },
      { name: "description", content: "Enroll your child or yourself in FutureKeys premium music lessons. Quick online registration." },
      { property: "og:title", content: "Enroll at FutureKeys" },
      { property: "og:description", content: "Register in minutes. Start your musical journey today." },
      { property: "og:url", content: "/enroll" },
    ],
    links: [{ rel: "canonical", href: "/enroll" }],
  }),
  component: EnrollPage,
});

const instruments = ["Piano", "Keyboard", "Guitar", "Drums", "Violin", "Voice Training"];

const schema = z.object({
  student_name: z.string().trim().min(2).max(100),
  age: z.coerce.number().int().min(3).max(99),
  gender: z.string().optional(),
  parent_name: z.string().trim().min(2).max(100),
  parent_phone: z.string().trim().min(7).max(30),
  parent_email: z.string().trim().email().max(255),
  selected_instrument: z.string().min(1),
  selected_package: z.string().min(1),
  preferred_days: z.string().max(200).optional().or(z.literal("")),
  preferred_time: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function EnrollPage() {
  const navigate = useNavigate();
  const { data: packages } = useQuery({
    queryKey: ["packages-enroll"],
    queryFn: async () => {
      const { data } = await supabase.from("lesson_packages").select("*").eq("active", true).order("sort_order");
      return data ?? [];
    },
  });
  const [form, setForm] = useState({
    student_name: "", age: "", gender: "", parent_name: "", parent_phone: "", parent_email: "",
    selected_instrument: "", selected_package: "", preferred_days: "", preferred_time: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("students").insert({
      ...parsed.data,
      preferred_days: parsed.data.preferred_days || null,
      preferred_time: parsed.data.preferred_time || null,
      notes: parsed.data.notes || null,
      gender: parsed.data.gender || null,
    });
    setLoading(false);
    if (error) { toast.error("Could not submit. Please try again."); return; }
    setDone(true);

    // WhatsApp notification link (admin gets a pre-filled WA message)
    const msg = encodeURIComponent(
      `New Enrollment Request\n\nStudent: ${parsed.data.student_name}\nPackage: ${parsed.data.selected_package}\nInstrument: ${parsed.data.selected_instrument}\nParent: ${parsed.data.parent_name}\nContact: ${parsed.data.parent_phone}`
    );
    window.open(`https://wa.me/2348028869046?text=${msg}`, "_blank");
  }

  if (done) {
    return (
      <Section>
        <Card className="max-w-xl mx-auto p-10 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold"><Check className="h-8 w-8 text-navy" /></div>
          <h2 className="mt-5 font-display text-3xl font-bold text-navy">Enrollment Received!</h2>
          <p className="mt-3 text-muted-foreground">Thank you. Our team will contact you within 24 hours to confirm your start date.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate({ to: "/" })} variant="navy">Back to home</Button>
            <Button onClick={() => { setDone(false); setForm({student_name:"",age:"",gender:"",parent_name:"",parent_phone:"",parent_email:"",selected_instrument:"",selected_package:"",preferred_days:"",preferred_time:"",notes:""});}} variant="outline">Submit another</Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold mb-4">
            <Sparkles className="h-3 w-3" /> Limited spots per term
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">Enrollment <span className="text-gradient-gold">Form</span></h1>
          <p className="mt-4 text-navy-foreground/75 max-w-xl mx-auto">Fill the form and we'll reach out within 24 hours to confirm your start date.</p>
        </div>
      </section>

      <Section>
        <Card className="max-w-3xl mx-auto p-6 md:p-10 shadow-premium">
          <form onSubmit={onSubmit} className="space-y-7">
            <div>
              <h3 className="font-display text-lg font-bold text-navy mb-4">Student Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Student full name *</Label><Input className="mt-1.5" value={form.student_name} onChange={(e)=>setForm({...form, student_name: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Age *</Label><Input className="mt-1.5" type="number" min={3} max={99} value={form.age} onChange={(e)=>setForm({...form, age: e.target.value})} required /></div>
                  <div><Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v)=>setForm({...form, gender: v})}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-navy mb-4">Parent / Guardian Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Label>Parent / guardian name *</Label><Input className="mt-1.5" value={form.parent_name} onChange={(e)=>setForm({...form, parent_name: e.target.value})} required /></div>
                <div><Label>Phone *</Label><Input className="mt-1.5" value={form.parent_phone} onChange={(e)=>setForm({...form, parent_phone: e.target.value})} required /></div>
                <div><Label>Email *</Label><Input className="mt-1.5" type="email" value={form.parent_email} onChange={(e)=>setForm({...form, parent_email: e.target.value})} required /></div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-navy mb-4">Program Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Instrument *</Label>
                  <Select value={form.selected_instrument} onValueChange={(v)=>setForm({...form, selected_instrument: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent>{instruments.map(i=> <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Package *</Label>
                  <Select value={form.selected_package} onValueChange={(v)=>setForm({...form, selected_package: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent>{(packages ?? []).map(p=> <SelectItem key={p.id} value={p.package_name}>{p.package_name} — ₦{p.price.toLocaleString()}/mo</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Preferred days</Label><Input className="mt-1.5" placeholder="e.g. Tue & Thu" value={form.preferred_days} onChange={(e)=>setForm({...form, preferred_days: e.target.value})} /></div>
                <div><Label>Preferred time</Label><Input className="mt-1.5" placeholder="e.g. 4 PM" value={form.preferred_time} onChange={(e)=>setForm({...form, preferred_time: e.target.value})} /></div>
                <div className="sm:col-span-2"><Label>Additional notes</Label><Textarea className="mt-1.5" value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} /></div>
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="gold" size="xl" className="w-full">
              {loading ? "Submitting..." : <>Submit Enrollment <ArrowRight className="h-5 w-5" /></>}
            </Button>
            <p className="text-xs text-center text-muted-foreground">By submitting you'll be redirected to WhatsApp to optionally confirm with our team.</p>
          </form>
        </Card>
      </Section>
    </>
  );
}
