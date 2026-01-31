/* eslint-disable @next/next/no-img-element */
import { Twitter, Mail, Github, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#fcf9e8] text-pencil-gray py-16 mt-24 border-t border-gray-200/50 relative overflow-hidden">
      {/* Paper texture overlay for continuity */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <img
                src="aki_logo.png"
                alt="Aki logo"
                className="w-64 sm:w-32 mb-4"
              />
              {/* <h3 className="text-2xl font-bold  text-ink">Aki</h3> */}
              <span className="text-xs border border-accent-red text-accent-red px-1 rounded transform -rotate-6 hidden">
                Beta
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Master Japanese with the old-school pen & paper method, enhanced
              by AI.
            </p>
            <div className="flex gap-4 justify-center md:justify-start pt-2">
              <Link href="#" className="hover:text-ink transition-colors">
                <Twitter size={20} strokeWidth={1.5} />
              </Link>
              <Link href="#" className="hover:text-ink transition-colors">
                <Github size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-ink">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-ink">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-ink">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@aki.ai"
                  className="flex items-center gap-2 justify-center md:justify-start hover:text-ink group"
                >
                  <Mail size={16} />
                  <span className="group-hover:underline decoration-1 underline-offset-4">
                    mailto:darshjain05.in@gmail.com
                  </span>
                </a>
              </li>
              <li className="text-xs opacity-60 pt-4">
                Made with{" "}
                <Heart
                  size={10}
                  className="inline text-accent-red mx-1 fill-accent-red"
                />{" "}
                in Tokyo & SF
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/40 text-center text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} Aki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
