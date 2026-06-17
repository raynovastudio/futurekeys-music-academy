import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FutureKeys Music Academy | Uyo, Akwa Ibom, Nigeria" },
      { name: "description", content: "Call 08028869046 or 08086834172. Email futurekeysmusicacademyconsepts@gmail.com. Visit our music academy in Uyo, Akwa Ibom State, Nigeria." },
      { property: "og:title", content: "Contact FutureKeys Music Academy | Uyo, Nigeria" },
      { property: "og:description", content: "Call, message or visit our Uyo music academy. Start your musical journey today." },
      { property: "og:url", content: "https://futurekeysacademy.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message too short").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name, email: parsed.data.email,
      phone: parsed.data.phone || null, message: parsed.data.message,
    });
    setLoading(false);
    if (error) { toast.error("Could not send. Please try again."); return; }
    toast.success("Message sent! We'll respond shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">Let's Start a <span className="text-gradient-gold">Conversation</span></h1>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-5 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold text-navy"><Phone className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Call us</p>
                  <p className="font-semibold text-navy mt-1">08028869046</p>
                  <p className="font-semibold text-navy">08086834172</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold text-navy"><Mail className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                  <a href="mailto:futurekeysmusicacademyconsepts@gmail.com" className="font-semibold text-navy mt-1 break-all hover:text-gold">futurekeysmusicacademyconsepts@gmail.com</a>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold text-navy"><MapPin className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Visit</p>
                  <p className="font-semibold text-navy mt-1">Uyo, Akwa Ibom State, Nigeria</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Connect</p>
              <div className="flex gap-2">
                <a href="https://wa.me/2348028869046" className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] text-white px-3 py-2 text-sm font-medium hover:opacity-90"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                <a href="https://instagram.com" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary hover:bg-accent"><Instagram className="h-4 w-4" /></a>
                <a href="https://facebook.com" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary hover:bg-accent"><Facebook className="h-4 w-4" /></a>
              </div>
            </Card>
          </div>

          <Card className="lg:col-span-3 p-8">
            <h2 className="font-display text-2xl font-bold text-navy">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We typically respond within 24 hours.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full name</Label><Input id="name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="mt-1.5" required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="mt-1.5" required /></div>
              </div>
              <div><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} className="mt-1.5" /></div>
              <div><Label htmlFor="message">Message</Label><Textarea id="message" value={form.message} onChange={(e)=>setForm({...form, message: e.target.value})} className="mt-1.5 min-h-32" required /></div>
              <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
                {loading ? "Sending..." : <>Send message <Send className="h-4 w-4" /></>}
              </Button>
            </form>
          </Card>
        </div>

        <div className="mt-14 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-card border">
          <iframe
            title="FutureKeys location"
            src="https://www.google.com/maps?q=Uyo,+Akwa+Ibom,+Nigeria&output=embed"
            className="w-full h-80 border-0"
            loading="lazy"
          />
        </div>
      </Section>
    </>
  );
}
