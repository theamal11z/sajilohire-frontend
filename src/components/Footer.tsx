import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="content-width section-padding">
        <div className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Logo & Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">SajiloHire</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2025 SajiloHire. Built for Aqore Hackathon.
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}