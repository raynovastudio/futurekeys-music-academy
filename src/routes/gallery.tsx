import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";

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

const categories = ["All", "Physical Lessons", "Home Lessons", "Virtual Lessons", "Student Performances", "Events"];

// Visual fallback when no admin uploads yet — uses gradient cards
function placeholderItems() {
  const cats = ["Physical Lessons", "Home Lessons", "Virtual Lessons", "Student Performances", "Events"];
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `p-${i}`,
    title: `Moment ${i + 1}`,
    category: cats[i % cats.length],
    image_url: "",
    description: null,
  }));
}

function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const items = data && data.length > 0 ? data : placeholderItems();
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Gallery</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">Moments That <span className="text-gradient-gold">Make Music</span></h1>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active === c ? "bg-navy text-navy-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/70"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => item.image_url && setLightbox(item.image_url)}
              className="block w-full break-inside-avoid overflow-hidden rounded-2xl group relative shadow-card hover:shadow-premium transition-all"
              style={{ height: `${180 + ((i * 53) % 180)}px` }}
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.title ?? ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-navy via-navy/80 to-navy/60 flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-gold text-3xl font-display font-bold">♪</p>
                    <p className="text-navy-foreground/70 text-xs uppercase tracking-wider mt-1">{item.category}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-navy-foreground text-sm font-medium">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white" onClick={() => setLightbox(null)}><X className="h-7 w-7" /></button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}
