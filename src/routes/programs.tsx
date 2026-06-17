import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import lessonImg from "@/assets/programs-students.jpg.asset.json";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Pricing | FutureKeys Music Academy" },
      { name: "description", content: "Physical, home and virtual music lessons. ₦30,000-₦60,000/month. Two classes per week, one hour per session. For children ages 3-15 and adult beginners." },
      { property: "og:title", content: "Programs & Pricing — FutureKeys" },
      { property: "og:description", content: "Premium lesson packages from ₦30,000/month." },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsPage,
});

const standardFeatures = [
  { icon: Calendar, label: "2 Classes Per Week" },
  { icon: Clock, label: "1 Hour Per Session" },
  { icon: Check, label: "Monthly Billing" },
];

function ProgramsPage() {
  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data } = await supabase.from("lesson_packages").select("*").eq("active", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Programs & Pricing</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">Choose Your <span className="text-gradient-gold">Learning Path</span></h1>
          <p className="mt-6 text-navy-foreground/75 max-w-2xl mx-auto">Three premium packages for children ages 3–15 and adult beginners. Pick the format that fits your family.</p>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {standardFeatures.map((f) => (
            <div key={f.label} className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold text-navy"><f.icon className="h-4 w-4" /></div>
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {(packages ?? []).map((p) => {
            const features = (p.features as string[]) ?? [];
            const isPopular = p.badge === "Most Popular";
            return (
              <Card key={p.id} className={`relative p-8 ${isPopular ? "border-gold border-2 shadow-gold lg:-translate-y-4 bg-gradient-to-b from-card to-secondary/50" : "border-border/60"}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-bold uppercase tracking-wider text-navy shadow-gold">
                    {p.badge}
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold text-navy">{p.package_name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-navy">₦{p.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-gold shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={isPopular ? "gold" : "navy"} size="lg" className="w-full mt-7">
                  <Link to="/enroll">Enroll Now</Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-10 lg:grid-cols-2 items-center max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-premium order-2 lg:order-1 aspect-[16/9]">
            <img src={lessonImg.url} alt="FutureKeys students together" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Not sure which package fits?</h2>
            <p className="mt-3 text-muted-foreground">Book a free consultation with our team and we'll guide you to the perfect program for your family.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg"><Link to="/contact">Book Free Consultation</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/enroll">Enroll Now</Link></Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
