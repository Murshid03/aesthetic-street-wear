import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Twitter, ArrowRight } from "lucide-react";

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
    <footer className="bg-foreground text-background">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container mx-auto container-px py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-background" style={{ fontFamily: "Syne, sans-serif" }}>
                Get 10% off your first order
              </h3>
              <p className="text-sm text-background/60 mt-0.5">
                Subscribe for exclusive drops & style tips
              </p>
            </div>
            <form className="flex w-full sm:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 h-10 px-4 rounded-xl bg-white/10 border border-white/20 text-background text-sm placeholder:text-background/40 focus:outline-none focus:border-primary/60 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="h-10 px-5 gradient-primary rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0"
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto container-px py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-bold text-background leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>Aesthetic</p>
                <p className="text-[10px] text-primary font-semibold tracking-widest uppercase">Street Wear</p>
              </div>
            </div>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs mb-5">
              Premium men's fashion designed for the modern street-savvy individual. Quality craft, bold style.
            </p>
            <div className="flex gap-2">
              {[
                { href: "https://instagram.com", label: "Instagram", icon: Instagram },
                { href: "https://twitter.com", label: "Twitter", icon: Twitter },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-background/60 hover:bg-primary/80 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold text-background/40 uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/65 hover:text-background transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-bold text-background/40 uppercase tracking-widest mb-4">Account</h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/65 hover:text-background transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-background/40 uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-3">
              {[
                { icon: Mail, text: "hello@aestheticstreet.com" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Chennai, Tamil Nadu, India" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-background/65">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/40">
            © {year} Aesthetic Street Wear. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-background/40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
