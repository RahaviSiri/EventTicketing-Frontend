import React from "react";
import { Link } from "react-router-dom";
import { FacebookIcon, TwitterIcon, InstagramIcon } from "lucide-react"; // Optional if you use lucide-react

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-[#2d545e]">
            Event<span className="text-[#c89666]">Ease</span>
          </h2>
          <p className="text-sm mt-2">
            Plan, manage and book events with ease. A complete ticketing
            solution for organizers and attendees.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-blue-600">
                Events
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-md font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-400">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-pink-500">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm border-t py-4 bg-gray-50">
        © {new Date().getFullYear()} EventEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
