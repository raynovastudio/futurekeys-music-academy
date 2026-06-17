import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Users, Heart, GraduationCap, Globe2, Award, Star, Quote, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero.jpg";
import ctaStage from "@/assets/cta-stage.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FutureKeys Music Academy | Premium Music Lessons in Uyo, Nigeria" },
      { name: "description", content: "Premium music education for children (ages 3–15) and adults in Uyo. Piano, guitar, drums, violin & voice lessons — physical, home & virtual worldwide." },
      { property: "og:title", content: "FutureKeys Music Academy — The Future of Music Starts Here" },
      { property: "og:description", content: "Premium music education for children & adults. Piano, guitar, drums, violin & voice worldwide." },
      { property: "og:url", content: "https://futurekeysacademy.com" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com" }],
  }),
  component: HomePage,
});

const features = [
  { icon: Sparkles, title: "Practical Learning", body: "Real-world music skills and performance confidence." },
  { icon: GraduationCap, title: "Expert Mentorship", body: "Personalized guidance from experienced instructors." },
  { icon: Users, title: "Child-Focused Programs", body: "Specialized pathways for ages 3–15." },
  { icon: Heart, title: "Beginner-Friendly Adults", body: "Perfect for adults starting from zero." },
  { icon: Globe2, title: "Global Virtual Learning", body: "Students in Nigeria, UK and Scotland." },
  { icon: Award, title: "Confidence & Character", body: "Developing musicians and leaders." },
];

function HomePage() {
  const { data: packages } = useQuery({
    queryKey: ["packages-home"],
    queryFn: async () => {
      const { data } = await supabase.from("lesson_packages").select("*").eq("active", true).order("sort_order");
      return data ?? [];
    },
  });
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-navy-foreground min-h-[640px] md:min-h-[720px] lg:min-h-[820px] flex items-center">
        {/* Background image */}
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
        {/* Navy overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/75" />
        {/* Subtle gold radial accents */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_20%_30%,_oklch(0.78_0.13_85_/_0.35),_transparent_55%),radial-gradient(circle_at_80%_70%,_oklch(0.5_0.2_280_/_0.25),_transparent_55%)]" />

        <div className="container relative mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 w-full">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              The Future of Music Starts Here
            </div>
            <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Building the Next Generation of <span className="text-gradient-gold">Musicians</span>
            </h1>
            <p className="mt-6 text-lg text-navy-foreground/85 max-w-2xl mx-auto leading-relaxed">
              Premium music education for children and adults through practical, performance-based training in Uyo and worldwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/enroll">Enroll Now <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outlineGold" size="xl"><Link to="/contact">Book Free Consultation</Link></Button>
            </div>

          </div>

          {/* Piano keys floating decoration on the right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1 opacity-80">
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="h-8 w-3 rounded-md bg-white shadow-lg animate-piano-key" style={{ animationDelay: `${i*0.15}s` }} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <Section>
        <SectionHeader eyebrow="Why Choose Us" title="Why FutureKeys is Different" description="Six reasons families across three countries trust us with their musical journey." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group relative p-7 border-border/60 hover:border-gold/60 hover:shadow-premium transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-gold opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy/80 text-gold shadow-card">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* PROGRAMS */}
      <Section muted>
        <SectionHeader eyebrow="Programs" title="Premium Lesson Packages" description="Two classes per week, one hour per session. Choose the format that fits your family." />
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
                <h3 className="font-display text-xl font-bold text-navy">{p.package_name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{p.location}</p>
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

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeader eyebrow="Success Stories" title="What Parents & Students Say" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(testimonials ?? []).map((t) => (
            <Card key={t.id} className="p-7 hover:shadow-premium transition-all">
              <Quote className="h-7 w-7 text-gold/60" />
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">"{t.testimonial}"</p>
              <div className="mt-5 flex items-center gap-1 text-gold">
                {[...Array(t.rating ?? 5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <div className="mt-3">
                <p className="font-semibold text-sm text-navy">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="!py-24">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-navy-foreground text-center shadow-premium">
          <img src={ctaStage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/75" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_oklch(0.78_0.13_85_/_0.5),_transparent_60%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Ready to Start Your <span className="text-gradient-gold">Musical Journey?</span></h2>
            <p className="mt-4 text-navy-foreground/80 max-w-xl mx-auto">Join hundreds of families building confidence, character and lifelong musical skills.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/enroll">Enroll Today</Link></Button>
              <Button asChild variant="outlineGold" size="xl"><Link to="/contact">Contact Us</Link></Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
