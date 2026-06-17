import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { supabase } from "@/integrations/supabase/client";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";

const postQuery = (slug: string) => queryOptions({
  queryKey: ["blog-post", slug],
  queryFn: async () => {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
    if (!data) throw notFound();
    return data;
  },
});

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.meta_title || loaderData?.title || "Article"} | FutureKeys` },
      { name: "description", content: loaderData?.meta_description || loaderData?.excerpt || "FutureKeys blog article" },
      { property: "og:title", content: loaderData?.title ?? "Article" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${params.slug}` },
      ...(loaderData?.featured_image ? [{ property: "og:image", content: loaderData.featured_image }] : []),
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  component: BlogPostPage,
  errorComponent: () => <div className="container py-20 text-center">Could not load article.</div>,
  notFoundComponent: () => <div className="container py-20 text-center">Article not found.</div>,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  return (
    <article>
      {post.featured_image && (
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
      <Section>
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-6"><Link to="/blog"><ArrowLeft className="h-4 w-4" /> All articles</Link></Button>
          {post.category && <p className="text-xs font-semibold uppercase tracking-wider text-gold">{post.category}</p>}
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-extrabold text-navy">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {post.author && <span>By {post.author}</span>}
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <div className="mt-10 prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-foreground/85">
            {post.content}
          </div>
        </div>
      </Section>
    </article>
  );
}
