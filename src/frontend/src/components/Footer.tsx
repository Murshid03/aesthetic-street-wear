import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

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
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-background">
              Aesthetic
              <br />
              Street Wear
            </h2>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">
              Premium mens fashion designed for the modern street-savvy
              individual. Quality craft, bold style.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity bg-background/10"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity bg-background/10"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-label text-xs mb-4 opacity-50">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-label text-xs mb-4 opacity-50">Help</h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-label text-xs mb-4 opacity-50">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm opacity-70">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@aestheticstreet.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm opacity-70">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+1 800-ASW-SHOP</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm opacity-70">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>123 Fashion Ave, NYC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
          <p>© {year} Aesthetic Street Wear. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              className="hover:opacity-100 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
