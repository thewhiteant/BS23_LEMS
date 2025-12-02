import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">YourBrand</h3>
            <p className="text-sm text-gray-400">
              Build, discover and join events. Simple, fast and
              community-driven.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              © {new Date().getFullYear()} YourBrand
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <a className="hover:underline" href="#all-events">
                  All events
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#create">
                  Create event
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#categories">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>
                <a className="hover:underline" href="#help">
                  Help center
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#docs">
                  Docs
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="text-white font-semibold mb-3">Stay updated</h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe to get the latest events and updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // placeholder: wire this to your newsletter API
                alert("Thanks! (connect this form to your API)");
              }}
              className="flex gap-2"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md text-gray-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cherry text-white rounded-md hover:brightness-105 transition"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
