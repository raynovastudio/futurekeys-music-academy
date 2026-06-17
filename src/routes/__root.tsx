import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Try again
          </button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FutureKeys Music Academy | Premium Music Lessons in Uyo, Nigeria" },
      { name: "description", content: "Premium music education for children (ages 3–15) and adults in Uyo. Piano, guitar, drums, violin & voice lessons — physical, home & virtual worldwide. Enroll today." },
      { name: "keywords", content: "music school Uyo, piano lessons Nigeria, guitar lessons Akwa Ibom, music academy, children music classes, adult music lessons, virtual music lessons, drum lessons, violin lessons, voice training" },
      { name: "author", content: "FutureKeys Music Academy" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:title", content: "FutureKeys Music Academy | Premium Music Lessons in Uyo, Nigeria" },
      { property: "og:description", content: "Premium music education for children & adults. Piano, guitar, drums, violin & voice. Physical, home & virtual lessons in Uyo, Nigeria and worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FutureKeys Music Academy" },
      { property: "og:url", content: "https://futurekeysacademy.com" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FutureKeys Music Academy | Premium Music Lessons in Uyo, Nigeria" },
      { name: "twitter:description", content: "Premium music education for children & adults. Piano, guitar, drums, violin & voice worldwide." },
      { property: "og:image", content: "https://futurekeysacademy.com/og-image.jpg" },
      { name: "twitter:image", content: "https://futurekeysacademy.com/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap" },
      { rel: "icon", type: "image/png", href: "/Favicon.png" },
      { rel: "apple-touch-icon", href: "/Favicon.png" },
      { rel: "canonical", href: "https://futurekeysacademy.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicSchool",
          name: "FutureKeys Music Academy",
          description: "Premium music academy in Uyo, Nigeria offering piano, guitar, drums, violin and voice lessons for children and adults.",
          url: "https://futurekeysacademy.com",
          image: "https://futurekeysacademy.com/og-image.jpg",
          address: { "@type": "PostalAddress", addressLocality: "Uyo", addressRegion: "Akwa Ibom", addressCountry: "NG" },
          telephone: ["+2348028869046", "+2348086834172"],
          email: "futurekeysmusicacademyconsepts@gmail.com",
          foundingDate: "2024",
          openingHours: "Mo-Fr 09:00-18:00",
          sameAs: ["https://instagram.com/futurekeysacademy", "https://facebook.com/futurekeysacademy"],
          areaServed: ["Uyo", "Akwa Ibom", "Nigeria", "Worldwide"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Music Lessons",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Piano Lessons" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Guitar Lessons" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Drum Lessons" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Violin Lessons" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Voice Training" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keyboard Lessons" } },
            ],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutShell />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

import { useRouterState } from "@tanstack/react-router";

function LayoutShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) {
    return <Outlet />;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
