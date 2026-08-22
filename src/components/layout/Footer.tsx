import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-neutral-500">
          © {currentYear} 🌾 AgroLease. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <a href="#" className="hover:text-primary-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary-500 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary-500 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
