import { Leaf, Linkedin } from "lucide-react";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Green <span className="text-primary">Steps</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Track your carbon footprint, earn eco points, and take meaningful
              steps toward a greener future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/track", label: "Track Carbon" },
                { href: "/suggestions", label: "Eco Tips" },
                { href: "/rewards", label: "Rewards" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-foreground">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {[
                { Icon: SiGithub, href: "#", label: "GitHub" },
                { Icon: SiX, href: "#", label: "X / Twitter" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: SiInstagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {year}. Built with ❤ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p>Making the planet greener, one step at a time.</p>
        </div>
      </div>
    </footer>
  );
}
