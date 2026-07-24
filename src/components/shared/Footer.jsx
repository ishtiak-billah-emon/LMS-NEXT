import Link from "next/link";

import { GraduationCap, Phone, MapPin } from "lucide-react";

import { FaFacebookF, FaYoutube } from "react-icons/fa";

import { MdEmail } from "react-icons/md";
import { SUPPORT_EMAIL, SUPPORT_PHONE, ADDRESS } from "@/app/constants";
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card">
      {/* ======================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/5 blur-3xl"></div>

      {/* Decorative SVG */}
      <div className="absolute right-0 top-0 opacity-20">
        <svg width="400" height="160" viewBox="0 0 400 160" fill="none">
          <path
            d="M20 120C120 20 280 20 380 120"
            stroke="#6366F1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="container relative z-10 mx-auto px-4 py-20">
        {/* ======================================================
            TOP GRID
        ====================================================== */}

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* ======================================================
              BRAND
          ====================================================== */}

          <div>
            {/* Logo */}
            <Link href="/" className="mb-6 inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-text-primary">
                  TUTOR TIME
                </h2>

                <p className="text-sm text-text-secondary">Learn Smartly</p>
              </div>
            </Link>

            {/* Description */}
            <p className="mb-8 max-w-sm leading-relaxed text-text-secondary">
              Modern learning platform for SSC, HSC, and admission students with
              structured premium courses and smart learning experience.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-text-secondary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>

              {/* Youtube */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-text-secondary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                <FaYoutube className="h-5 w-5" />
              </a>

              {/* Email */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-text-secondary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                <MdEmail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ======================================================
              QUICK LINKS
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-text-primary">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-text-secondary transition hover:text-primary"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="text-text-secondary transition hover:text-primary"
                >
                  Courses
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="text-text-secondary transition hover:text-primary"
                >
                  Blogs
                </Link>
              </li>

              <li>
                <Link
                  href="/about-us"
                  className="text-text-secondary transition hover:text-primary"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================
              COURSE CATEGORIES
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-text-primary">
              Categories
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/courses"
                  className="text-text-secondary transition hover:text-primary"
                >
                  SSC Mathematics
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="text-text-secondary transition hover:text-primary"
                >
                  HSC Mathematics
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="text-text-secondary transition hover:text-primary"
                >
                  Admission Preparation
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="text-text-secondary transition hover:text-primary"
                >
                  Model Test & CQ Solve
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================
              CONTACT
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-xl font-bold text-text-primary">
              Contact
            </h3>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MdEmail className="h-5 w-5" />
                </div>

                <div>
                  <p className="mb-1 font-semibold text-text-primary">Email</p>

                  <p className="text-sm text-text-secondary">{SUPPORT_EMAIL}</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="mb-1 font-semibold text-text-primary">Phone</p>

                  <p className="text-sm text-text-secondary">{SUPPORT_PHONE}</p>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="mb-1 font-semibold text-text-primary">
                    Address
                  </p>

                  <p className="text-sm text-text-secondary">{ADDRESS}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM
        ====================================================== */}

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          {/* Copyright */}
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} Tutor Time. All rights reserved.
          </p>

          {/* Bottom Links */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-text-secondary transition hover:text-primary"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-text-secondary transition hover:text-primary"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/refund-policy"
              className="text-sm text-text-secondary transition hover:text-primary"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
