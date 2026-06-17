import { createFileRoute, Link } from "@tanstack/react-router";
import { Piano, Music2, Music3, Music4, Mic2, Guitar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import pianoImg from "@/assets/instr-piano.jpg";
import keyboardImg from "@/assets/instr-keyboard.jpg";
import guitarImg from "@/assets/instr-guitar.jpg";
import drumsImg from "@/assets/instr-drums.jpg";
import violinImg from "@/assets/instr-violin.jpg";
import voiceImg from "@/assets/instr-voice.jpg";

export const Route = createFileRoute("/instruments")({
  head: () => ({
    meta: [
      { title: "Instruments We Teach | Piano, Guitar, Drums, Violin & Voice" },
      { name: "description", content: "Expert music instruction in piano, keyboard, guitar, drums, violin and voice. Beginner to advanced levels for children and adults in Uyo & worldwide." },
      { property: "og:title", content: "Instruments — FutureKeys Music Academy" },
      { property: "og:description", content: "Piano, guitar, drums, violin, voice & keyboard. World-class instruction for all levels." },
      { property: "og:url", content: "https://futurekeysacademy.com/instruments" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/instruments" }],
  }),
  component: InstrumentsPage,
});

const instruments = [
  { name: "Piano", icon: Piano, desc: "Master the king of instruments. From first notes to complex compositions.", level: "Beginner to Advanced", image: pianoImg },
  { name: "Keyboard", icon: Music2, desc: "Versatile electronic playing with sounds, rhythms and modern technique.", level: "Beginner to Advanced", image: keyboardImg },
  { name: "Guitar", icon: Guitar, desc: "Acoustic and electric. Chords, rhythm, fingerstyle, and performance.", level: "Beginner to Advanced", image: guitarImg },
  { name: "Drums", icon: Music3, desc: "Rhythm, coordination and power. Build a solid foundation behind the kit.", level: "Beginner to Advanced", image: drumsImg },
  { name: "Violin", icon: Music4, desc: "Refined classical technique with bow control and ear training.", level: "Beginner to Advanced", image: violinImg },
  { name: "Voice Training", icon: Mic2, desc: "Breath control, range, tone and confident stage performance.", level: "Beginner to Advanced", image: voiceImg },
];

function InstrumentsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Instruments</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">Six Instruments. <span className="text-gradient-gold">World-Class Training.</span></h1>
          <p className="mt-6 text-navy-foreground/75 max-w-2xl mx-auto">Whatever calls to you, we'll guide you from first note to performance-ready.</p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instruments.map((ins) => (
            <Card key={ins.name} className="group overflow-hidden p-0 hover:shadow-premium transition-all hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={ins.image}
                  alt={`${ins.name} instrument`}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />
                <div className="absolute top-3 right-3 rounded-full bg-gold/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">{ins.level}</div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-navy-foreground">
                  <ins.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                  <span className="font-display text-lg font-bold drop-shadow">{ins.name}</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{ins.desc}</p>
                <Button asChild variant="ghost" size="sm" className="mt-4 -ml-3 text-gold hover:text-gold hover:bg-gold/10">
                  <Link to="/enroll">Start learning →</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
