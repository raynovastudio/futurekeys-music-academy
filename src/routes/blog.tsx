import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | FutureKeys Music Academy – Music Education Insights" },
      { name: "description", content: "Music education tips, practice advice, child development insights and success stories from FutureKeys Music Academy in Uyo, Nigeria." },
      { property: "og:title", content: "FutureKeys Blog – Music Education Insights" },
      { property: "og:description", content: "Tips, advice and stories on music education, practice and child development." },
      { property: "og:url", content: "https://futurekeysacademy.com/blog" },
    ],
    links: [{ rel: "canonical", href: "https://futurekeysacademy.com/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data } = useQuery({
    queryKey: ["blog-published"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <section className="bg-gradient-hero text-navy-foreground py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Insights</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold">Music Education <span className="text-gradient-gold">Insights</span></h1>
        </div>
      </section>

      <Section>
        {(!data || data.length === 0) ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Articles coming soon. In the meantime, follow us on social for daily tips.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <Link to="/blog/$slug" params={{ slug: p.slug }} key={p.id}>
                <Card className="overflow-hidden p-0 hover:shadow-premium transition-all hover:-translate-y-1 h-full">
                  {p.featured_image ? (
                    <img src={p.featured_image} alt={p.title} className="h-48 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-48 bg-gradient-hero flex items-center justify-center text-gold text-5xl font-display">♪</div>
                  )}
                  <div className="p-6">
                    {p.category && <p className="text-xs font-semibold uppercase tracking-wider text-gold">{p.category}</p>}
                    <h3 className="mt-2 font-display text-lg font-bold text-navy line-clamp-2">{p.title}</h3>
                    {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 text-gold font-medium">Read <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
