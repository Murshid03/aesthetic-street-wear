import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Twitter, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const shopLinks = [
  { label: "New Arrivals", to: "/" },
  { label: "Shirts", to: "/shirts" },
  { label: "T-Shirts", to: "/tshirts" },
  { label: "Pants", to: "/pants" },
  { label: "Accessories", to: "/accessories" },
];

const helpLinks = [
  { label: "My Account", to: "/account" },
  { label: "My Orders", to: "/account" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Cart", to: "/cart" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white overflow-hidden relative" data-ocid="footer">
      {/* Decorative large text background */}
      <div className="absolute -bottom-10 -right-20 pointer-events-none select-none opacity-[0.02]">
        <h2 className="text-[18vw] font-black italic tracking-tighter leading-none" style={{ fontFamily: "var(--font-display)" }}>
          AESTHETIC
        </h2>
      </div>

      <div className="container mx-auto container-px pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start mb-12">

          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 pr-0 lg:pr-10">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg]">
                <span className="text-white font-black text-xl italic">A</span>
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                Aesthetic
              </span>
            </Link>
            <p className="text-sm text-white/40 font-medium leading-relaxed max-w-sm mb-8" style={{ fontFamily: "var(--font-secondary)" }}>
              Transcending the boundaries of urban fashion. We don't follow trends; we architect the future of street culture through premium craftsmanship.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: "https://instagram.com", icon: Instagram },
                { href: "https://twitter.com", icon: Twitter },
              ].map(({ href, icon: Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6" style={{ fontFamily: "var(--font-accent)" }}>Navigation</h3>
            <ul className="space-y-3.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <div className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6" style={{ fontFamily: "var(--font-accent)" }}>Account</h3>
            <ul className="space-y-3.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    <div className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6" style={{ fontFamily: "var(--font-accent)" }}>Support</h3>
            <div className="space-y-5">
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-1">Email</p>
                <p className="text-sm font-bold group-hover:text-primary transition-colors">hello@aestheticstreet.com</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-1">Global HQ</p>
                <p className="text-sm font-bold group-hover:text-primary transition-colors italic">Chennai, IN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <Link to="/" className="hover:text-white transition-colors">Returns</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">
            © {year} AESTHETIC REVOLUTION.
          </p>
        </div>
      </div>
    </footer>
  );
}
