import { Link } from "@tanstack/react-router";
import { Instagram, Twitter } from "lucide-react";

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
        <h2 className="text-[18vw] font-black italic tracking-tighter leading-none" style={{ fontFamily: "var(--font-brand-primary)" }}>
          AESTHETIC
        </h2>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pt-10 pb-24 lg:pt-16 lg:pb-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-8 lg:mb-12">

          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 pr-0 lg:pr-10">
            <Link to="/" className="flex items-center gap-3 group mb-5">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg]">
                <span className="text-white font-black text-xl italic">A</span>
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter" style={{ fontFamily: "var(--font-brand-primary)" }}>
                Aesthetic
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-white/40 font-medium leading-relaxed max-w-sm mb-6" style={{ fontFamily: "var(--font-secondary)" }}>
              Transcending the boundaries of urban fashion. We don't follow trends; we architect the future of street culture through premium craftsmanship.
            </p>
            <div className="flex items-center gap-6 mb-2 lg:mb-0">
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

          {/* Links Grid: Navigation & Account */}
          <div className="lg:col-span-4 w-full grid grid-cols-2 gap-8 py-6 lg:py-0 border-y border-white/5 lg:border-none">
            {/* Quick Links */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4" style={{ fontFamily: "var(--font-accent)" }}>Navigation</h3>
              <ul className="space-y-3">
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
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4" style={{ fontFamily: "var(--font-accent)" }}>Account</h3>
              <ul className="space-y-3">
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
          </div>

          {/* Contact & Support Strip */}
          <div className="lg:col-span-3 w-full pt-2 lg:pt-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 hidden lg:block" style={{ fontFamily: "var(--font-accent)" }}>Support</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-4">
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-1">Email</p>
                <p className="text-xs sm:text-sm font-bold group-hover:text-primary transition-colors truncate">hello@aestheticstreet.com</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-1">Global HQ</p>
                <p className="text-xs sm:text-sm font-bold group-hover:text-primary transition-colors italic">Chennai, IN</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <Link to="/" className="hover:text-white transition-colors">Returns</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">
            © {year} AESTHETIC STREETWEAR.
          </p>
        </div>
      </div>
    </footer>
  );
}
