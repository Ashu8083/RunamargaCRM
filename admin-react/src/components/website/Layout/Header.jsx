import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Header({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/60 backdrop-blur-[10px]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => go("/")}
          >
            <img
              src="/websiteimages/runamarga1.png"
              className="h-[55px]"
              alt="Runamarga"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">

            {/*
            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer px-3 py-2"
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/calculator", {
                    state: { scrollTo: "calculator" },
                  });
                } else {
                  document
                    .getElementById("calculator")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }
              }}
            >
              <span className="text-base">
                EMI Calculator
              </span>
            </button>

            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer px-3 py-2"
              onClick={() => go("/blogs")}
            >
              <span className="text-base">
                Blogs
              </span>
            </button>
            */}

            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer px-3 py-2 hover:bg-transparent"
              onClick={() => go("/about")}
            >
              <span className="text-base">
                About Us
              </span>
            </button>

            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer px-3 py-2 hover:bg-transparent"
              onClick={() => go("/contactus")}
            >
              <span className="text-base">
                Contact
              </span>
            </button>

          </div>

          {/* Phone + Mobile Menu */}
          <div className="flex items-center gap-4">

            {/* Phone */}
            <a
              href="tel:+918147740043"
              className="hidden lg:block text-white no-underline text-base"
            >
              📞 +91 8147740043
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden text-white bg-transparent border-none p-2 cursor-pointer hover:bg-transparent"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="w-7 h-7" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setMenuOpen(false)}
        >
          {/* Drawer */}
          <div
            className="absolute top-0 right-0 w-[280px] h-full bg-black text-white flex flex-col justify-center gap-4 p-8"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 text-white bg-transparent border-none p-2 cursor-pointer hover:bg-transparent"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

            {/* Blogs */}
            {/* <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer py-2 hover:bg-transparent"
              onClick={() => go("/blogs")}
            >
              <span className="text-base">
                Blogs
              </span>
            </button> */}

            {/* About */}
            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer py-2 hover:bg-transparent"
              onClick={() => go("/about")}
            >
              <span className="text-base">
                About
              </span>
            </button>

            {/* Contact */}
            <button
              type="button"
              className="text-white bg-transparent border-none cursor-pointer py-2 hover:bg-transparent"
              onClick={() => go("/contactus")}
            >
              <span className="text-base">
                Contact
              </span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}