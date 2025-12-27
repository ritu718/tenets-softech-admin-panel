"use client";

import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onClickScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-in-out ${
        showButton
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <button
        onClick={onClickScrollToTop}
        aria-label="Scroll to top"
        className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_35px_rgba(37,99,235,0.8)] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1"
      >
        {/* Glow ring effect */}
        <span className="absolute inset-0 rounded-full bg-blue-500 opacity-25 blur-xl group-hover:opacity-40 transition duration-500"></span>

        {/* Icon */}
        <FiArrowUp
          size={26}
          className="relative z-10 text-white drop-shadow-lg animate-bounce"
        />

        {/* Subtle ripple on hover */}
        <span className="absolute inset-0 rounded-full border border-blue-400 opacity-0 group-hover:opacity-70 animate-ping"></span>
      </button>
    </div>
  );
}
