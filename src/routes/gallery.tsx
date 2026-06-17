import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/section";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | FutureKeys Music Academy – Student Moments" },
      { name: "description", content: "Browse moments from our music lessons, student performances, recitals and events in Uyo, Akwa Ibom." },
      { property: "og:title", content: "Gallery — FutureKeys Music Academy" },
      { property: "og:description", content: "See FutureKeys students, performances and events in action." },
      { property: "og:url", content: "https://futurekeysacademy.com/gallery" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/gallery" }],
  }),
  component: GalleryPage,
});

const categories = ["All", "Performances", "Lessons", "Events", "Instruments"];

const galleryItems = [
  { id: "perf-1", title: "End-of-Term Piano Recital", category: "Performances", src: "/Gallery/performances/performances-1.jpeg" },
  { id: "perf-2", title: "Student Solo Performance", category: "Performances", src: "/Gallery/performances/performances-2.jpeg" },
  { id: "perf-3", title: "Guitar Ensemble Showcase", category: "Performances", src: "/Gallery/performances/performances-3.jpeg" },
  { id: "perf-4", title: "Young Pianist in Concert", category: "Performances", src: "/Gallery/performances/performances-4.jpeg" },
  { id: "perf-5", title: "Duet Performance Night", category: "Performances", src: "/Gallery/performances/performances-5.jpeg" },
  { id: "perf-6", title: "Violin Solo Recital", category: "Performances", src: "/Gallery/performances/performances-6.jpeg" },
  { id: "perf-7", title: "Group Music Concert", category: "Performances", src: "/Gallery/performances/performances-7.jpeg" },
  { id: "less-1", title: "Piano Practice Session", category: "Lessons", src: "/Gallery/lessons/lessons-1.jpeg" },
  { id: "less-2", title: "Guitar Chord Mastery", category: "Lessons", src: "/Gallery/lessons/lessons-2.jpeg" },
  { id: "less-3", title: "Drum Technique Class", category: "Lessons", src: "/Gallery/lessons/lessons-3.jpeg" },
  { id: "less-4", title: "Violin Bow Control", category: "Lessons", src: "/Gallery/lessons/lessons-4.jpeg" },
  { id: "less-5", title: "Voice Training Warm-Up", category: "Lessons", src: "/Gallery/lessons/lessons-5.jpeg" },
  { id: "less-6", title: "Keyboard Fundamentals", category: "Lessons", src: "/Gallery/lessons/lessons-6.jpeg" },
  { id: "less-7", title: "One-on-One Music Tutoring", category: "Lessons", src: "/Gallery/lessons/lessons-7.jpeg" },
  { id: "evt-1", title: "Music Academy Open Day", category: "Events", src: "/Gallery/events/events-1.jpeg" },
  { id: "evt-2", title: "Masterclass Workshop", category: "Events", src: "/Gallery/events/events-2.jpeg" },
  { id: "evt-3", title: "Student Graduation Ceremony", category: "Events", src: "/Gallery/events/events-3.jpeg" },
  { id: "evt-4", title: "Music Camp Festival", category: "Events", src: "/Gallery/events/events-4.jpeg" },
  { id: "evt-5", title: "Parent-Teacher Music Forum", category: "Events", src: "/Gallery/events/events-5.jpeg" },
  { id: "evt-6", title: "Community Outreach Concert", category: "Events", src: "/Gallery/events/events-6.jpeg" },
  { id: "evt-7", title: "Awards and Recognition Day", category: "Events", src: "/Gallery/events/events-7.jpeg" },
  { id: "inst-1", title: "Grand Piano Showcase", category: "Instruments", src: "/Gallery/instruments/instruments-1.jpeg" },
  { id: "inst-2", title: "Acoustic Guitar Display", category: "Instruments", src: "/Gallery/instruments/instruments-2.jpeg" },
  { id: "inst-3", title: "Drum Set Arrangement", category: "Instruments", src: "/Gallery/instruments/instruments-3.jpeg" },
  { id: "inst-4", title: "Violin Craftsmanship", category: "Instruments", src: "/Gallery/instruments/instruments-4.jpeg" },
  { id: "inst-5", title: "Electronic Keyboard Setup", category: "Instruments", src: "/Gallery/instruments/instruments-5.jpeg" },
  { id: "inst-6", title: "Studio Recording Equipment", category: "Instruments", src: "/Gallery/instruments/instruments-6.jpeg" },
];

function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? galleryItems : galleryItems.filter((i) => i.category === active)),
    [active],
  );

  function prev() {
    if (lightboxIdx === null) return;
    setLightboxIdx(lightboxIdx === 0 ? filtered.length - 1 : lightboxIdx - 1);
  }

  function next() {
    if (lightboxIdx === null) return;
    setLightboxIdx(lightboxIdx === filtered.length - 1 ? 0 : lightboxIdx + 1);
  }

  return (
    <>
      <section className="relative bg-gradient-hero text-navy-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4 font-semibold">Gallery</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
            Moments That <span className="text-gradient-gold">Make Music</span>
          </h1>
          <p className="mt-4 text-navy-foreground/70 max-w-xl mx-auto text-sm md:text-base">
            A visual journey through our lessons, performances, and the joy of music at FutureKeys.
          </p>
        </div>
      </section>

      <Section className="py-12 md:py-16">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => {
            const count = c === "All" ? galleryItems.length : galleryItems.filter((i) => i.category === c).length;
            return (
              <button key={c} onClick={() => setActive(c)}
                className={`group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === c
                    ? "bg-navy text-navy-foreground shadow-lg scale-105"
                    : "bg-secondary text-foreground/60 hover:bg-secondary/80 hover:text-foreground"
                }`}>
                {c}
                <span className={`ml-1.5 text-xs ${active === c ? "text-gold" : "text-foreground/40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {filtered.map((item, i) => {
            const heights = [240, 320, 280, 360, 200, 300, 260, 340];
            const h = heights[i % heights.length];
            return (
              <button
                key={item.id}
                onClick={() => setLightboxIdx(i)}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-card hover:shadow-xl transition-all duration-500"
                style={{ height: `${h}px` }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-semibold">{item.title}</p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-0.5">{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors">
            <X className="h-8 w-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors p-2">
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white transition-colors p-2">
            <ChevronRight className="h-10 w-10" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-sm">
            {lightboxIdx + 1} / {filtered.length}
          </div>
          <img
            src={filtered[lightboxIdx].src}
            alt={filtered[lightboxIdx].title}
            className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
