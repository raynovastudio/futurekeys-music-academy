import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Sparkles, Award, Shield, Lightbulb, Smile, Crown, TrendingUp } from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import aboutStudent from "@/assets/about-student.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FutureKeys Music Academy | Our Story & Mission in Uyo" },
      { name: "description", content: "Learn about FutureKeys — Uyo's premium music academy for children and adults. Discover our story, vision, and commitment to musical excellence in Akwa Ibom, Nigeria." },
      { property: "og:title", content: "About FutureKeys Music Academy | Uyo, Nigeria" },
      { property: "og:description", content: "Premium music education built on practical training, mentorship and character development in Uyo." },
      { property: "og:url", content: "https://futurekeysacademy.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/about" }],
  }),
  component: AboutPage,
});

const values = [
  { icon: Award, title: "Excellence" }, { icon: Shield, title: "Discipline" },
  { icon: Lightbulb, title: "Creativity" }, { icon: Smile, title: "Confidence" },
  { icon: Crown, title: "Character" }, { icon: TrendingUp, title: "Growth" },
];

const stats = [
  { value: "200+", label: "Students Trained" },
  { value: "3", label: "Countries Reached" },
  { value: "5+", label: "Years of Experience" },
  { value: "98%", label: "Student Satisfaction" },
];

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">About Us</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">A Premium Academy Dedicated to <span className="text-gradient-gold">Musical Excellence</span></h1>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-3">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">More than music. A foundation for life.</h2>
            <div className="mt-6 space-y-4 text-foreground/75 leading-relaxed">
              <p>FutureKeys Music Academy was founded with one belief: every child carries the spark of musical genius, and that spark deserves world-class care.</p>
              <p>Based in Uyo, Akwa Ibom, we serve families locally and internationally — students currently learning from Nigeria, the United Kingdom, and Scotland. Our approach blends rigorous practical technique with mentorship that builds confidence, discipline, and character.</p>
              <p>We are not a hobby class. We are a premium training ground for the next generation of musicians.</p>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-premium">
              <img src={aboutStudent} alt="Student learning piano at FutureKeys" loading="lazy" width={1200} height={800} className="w-full h-auto object-cover" />
            </div>
            <Card className="absolute -bottom-6 -left-6 p-5 bg-gradient-hero text-navy-foreground border-0 shadow-gold max-w-[260px] hidden md:block">
              <Sparkles className="h-7 w-7 text-gold mb-2" />
              <p className="font-display text-base font-bold leading-snug">"The Future of Music Starts Here."</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <Card className="p-8 hover:shadow-premium transition-all">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold"><Eye className="h-6 w-6" /></div>
            <h3 className="mt-5 font-display text-2xl font-bold text-navy">Our Vision</h3>
            <p className="mt-3 text-foreground/75 leading-relaxed">To be a global leader in music education, raising a generation of confident, skilled musicians who will carry the legacy of music into the future.</p>
          </Card>
          <Card className="p-8 hover:shadow-premium transition-all">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-navy"><Target className="h-6 w-6" /></div>
            <h3 className="mt-5 font-display text-2xl font-bold text-navy">Our Mission</h3>
            <p className="mt-3 text-foreground/75 leading-relaxed">To build a strong foundation for the next generation of musicians through professional technique, mentorship, and a supportive community that nurtures both talent and character.</p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Core Values" title="What We Stand For" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {values.map((v) => (
            <Card key={v.title} className="p-6 text-center hover:border-gold/60 hover:-translate-y-1 transition-all">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-gold"><v.icon className="h-6 w-6" /></div>
              <p className="mt-3 font-display font-semibold text-navy">{v.title}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeader eyebrow="Why Parents Trust Us" title="Building Confident Musicians" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((s) => (
            <Card key={s.label} className="p-8 text-center bg-gradient-to-b from-card to-secondary/40 hover:shadow-gold transition-all">
              <p className="font-display text-4xl md:text-5xl font-extrabold text-gradient-gold">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="gold" size="xl"><Link to="/enroll">Start Your Journey</Link></Button>
        </div>
      </Section>
    </>
  );
}
