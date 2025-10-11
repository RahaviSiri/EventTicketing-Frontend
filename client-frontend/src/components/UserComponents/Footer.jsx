import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import colors from "../../constants/colors";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: colors.primary }}
      className="text-white pt-12 pb-6 px-6 md:px-12"
    >
      {/* Top Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-[var(--accent)]">
            EventEase
          </h1>
          <p className="text-sm text-gray-200">
            Your one-stop platform to discover and book the best events around
            you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-200">
            <li>
              <a href="/home" className="hover:text-[var(--accent)]">
                Home
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-[var(--accent)]">
                Events
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-[var(--accent)]">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[var(--accent)]">
                Contact
              </a>
            </li>
            <li>
              <a href="/verify-email" className="hover:text-[var(--accent)]">
                Change Password
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 123 Event Street, Colombo
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@eventhub.com
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-[var(--accent)] transition"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-[var(--accent)] transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white/10 hover:bg-[var(--accent)] transition"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-300">
        © {year} EventEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
