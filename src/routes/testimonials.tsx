import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials | FutureKeys Music Academy – Uyo, Nigeria" },
      { name: "description", content: "Hear from parents and students about their FutureKeys experience. Real stories from families in Nigeria, UK & worldwide." },
      { property: "og:title", content: "Testimonials — FutureKeys Music Academy" },
      { property: "og:description", content: "Real stories from real families about their music education journey." },
      { property: "og:url", content: "https://futurekeysacademy.com/testimonials" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data } = useQuery({
    queryKey: ["testimonials-all"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Testimonials</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold">Loved by <span className="text-gradient-gold">Families Worldwide</span></h1>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((t) => (
            <Card key={t.id} className="p-7 hover:shadow-premium transition-all">
              <Quote className="h-8 w-8 text-gold/60" />
              <p className="mt-3 text-foreground/80 leading-relaxed">"{t.testimonial}"</p>
              <div className="mt-5 flex items-center gap-1 text-gold">
                {[...Array(t.rating ?? 5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center text-navy font-bold">{t.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
