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
              <a href="https://instagram.com" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="https://tiktok.com" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors text-xs font-bold">TT</a>
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
