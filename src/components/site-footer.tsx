import { Link } from "@tanstack/react-router";
import { Music, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import logo2 from "@/assets/2.png";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground mt-20">
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo2} alt="FutureKeys Music Academy" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-5 text-sm text-navy-foreground/70 leading-relaxed">
              The Future of Music Starts Here. Premium music education for children and adults.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/75">
              <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-gold">Programs & Pricing</Link></li>
              <li><Link to="/instruments" className="hover:text-gold">Instruments</Link></li>
              <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-gold">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold mb-4">Get Started</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/75">
              <li><Link to="/enroll" className="hover:text-gold">Enroll Now</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Book Consultation</Link></li>
              <li><Link to="/testimonials" className="hover:text-gold">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-navy-foreground/75">
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" /><span>08028869046<br/>08086834172</span></li>
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" /><a href="mailto:futurekeysmusicacademyconsepts@gmail.com" className="hover:text-gold break-all">futurekeysmusicacademyconsepts@gmail.com</a></li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" /><span>Uyo, Akwa Ibom State, Nigeria</span></li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://www.instagram.com/futurekeysmusicacademy" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="https://www.facebook.com/share/1D5kcgmqV3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="https://www.tiktok.com/@fkma26" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors">
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-navy-foreground/60">
          <p>© {new Date().getFullYear()} FutureKeys Music Academy. All rights reserved.</p>
          <p>The Future of Music Starts Here.</p>
        </div>
      </div>
    </footer>
  );
}
