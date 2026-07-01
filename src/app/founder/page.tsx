"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

const power4Out = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out },
  },
};

const staggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: power4Out },
  },
};

const philosophyItems = [
  {
    title: "Spatial Intelligence",
    description:
      "Every volume is studied for proportion, light, and movement \u2014 creating spaces that feel as good as they look.",
  },
  {
    title: "Sustainable Rigour",
    description:
      "Passive design strategies, local materials, and climate-responsive planning form the backbone of every project.",
  },
  {
    title: "Crafted Detailing",
    description:
      "From joinery to junctions, every element is detailed with the precision that defines bespoke architecture.",
  },
  {
    title: "Contextual Modernity",
    description:
      "Contemporary expression that honours site, culture, and tradition without resorting to pastiche.",
  },
  {
    title: "Material Honesty",
    description:
      "Materials are selected for their intrinsic qualities and allowed to express their natural character and age with dignity.",
  },
  {
    title: "Collaborative Process",
    description:
      "Design emerges from dialogue \u2014 with clients, consultants, and craftspeople \u2014 ensuring every voice shapes the outcome.",
  },
];

const credentials = [
  "B.Arch. \u2014 Bachelor of Architecture",
  "A.I.I.A. \u2014 Associate of the Indian Institute of Architects",
  "Registered Architect \u2014 Council of Architecture",
];

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-graphite text-warm-white">
      <ArchitectureNav />

      {/* ────────────────────────────── Hero ────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-32 pt-40 sm:px-10 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#fbf8f2 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        />
        <motion.div
          className="relative z-10 mx-auto max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={staggerReveal}
        >
          <motion.div variants={heroReveal}>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gold" />
              <p className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gold/80">
                The Studio
              </p>
            </div>
            <h1 className="mt-8 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Our Founder
            </h1>
          </motion.div>

          <motion.div variants={heroReveal} className="mt-6 max-w-3xl">
            <p className="text-xl leading-relaxed text-gold/80 sm:text-2xl">
              Visionary Architect &amp; Founder of Ractysh Design Pvt Ltd
            </p>
            <p className="mt-6 text-base leading-relaxed text-warm-muted sm:text-lg">
              Ar. P.M.S. Noorul Fawaaz, B.Arch., A.I.I.A., established Ractysh
              Design Private Limited with a singular vision &mdash; to create
              architecture that transcends the ordinary. His practice is rooted
              in spatial intelligence, sustainable design, and an uncompromising
              commitment to crafted excellence.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap gap-3"
            variants={staggerReveal}
          >
            {credentials.map((cred) => (
              <motion.span
                key={cred}
                className="border border-gold/20 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-stone"
                variants={reveal}
              >
                {cred}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Cinematic Divider ── */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* ────────────────────────────── Origin ────────────────────────────── */}
      <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerReveal}
          >
            <motion.div variants={reveal}>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gold" />
                <p className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gold/60">
                  Origin
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                The Architect&rsquo;s Journey
              </h2>
            </motion.div>

            <motion.div
              className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2"
              variants={staggerReveal}
            >
              <motion.p
                className="text-base leading-relaxed text-warm-muted sm:text-lg"
                variants={reveal}
              >
                Born with a deep curiosity for the built environment, Fawaaz
                pursued his Bachelor of Architecture at one of India&rsquo;s most
                respected institutions, graduating with distinction. His early
                career was shaped by work on landmark projects across Tamil Nadu,
                where he developed a rigorous design methodology rooted in
                context, climate, and craft.
              </motion.p>
              <motion.p
                className="text-base leading-relaxed text-warm-muted sm:text-lg"
                variants={reveal}
              >
                In founding Ractysh Design, he set out to build a studio that
                operates at the intersection of architectural tradition and
                contemporary innovation &mdash; a practice where every line,
                material, and space is considered with intention. Today, he leads
                a multidisciplinary team delivering residential, commercial, and
                institutional projects across South India.
              </motion.p>
            </motion.div>

            <motion.div
              className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3"
              variants={staggerReveal}
            >
              {[
                { value: "12+", label: "Years of Practice" },
                { value: "147+", label: "Projects Delivered" },
                { value: "21", label: "Cities Served" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="border-t border-gold/20 pt-6"
                  variants={reveal}
                >
                  <span className="font-display text-4xl font-bold text-gold sm:text-5xl">
                    {stat.value}
                  </span>
                  <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.3em] text-stone">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────── Studio Philosophy ──────────────────────── */}
      <section className="relative border-t border-warm-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(#c4a15b 0.5px, transparent 0.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerReveal}
          >
            <motion.div variants={reveal}>
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-gold" />
                <p className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gold/60">
                  Studio Philosophy
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Design Values
              </h2>
            </motion.div>

            <motion.div
              className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerReveal}
            >
              {philosophyItems.map((item) => (
                <motion.div
                  key={item.title}
                  className="group border border-warm-white/10 p-8 transition-colors duration-500 hover:border-gold/30"
                  variants={reveal}
                >
                  <div className="mb-4 h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-12 group-hover:bg-gold" />
                  <h3 className="font-display text-xl font-bold text-warm-white sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────── CTA ────────────────────────────── */}
      <section className="relative border-t border-warm-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(196,161,91,0.04) 2px, rgba(196,161,91,0.04) 3px)",
            backgroundSize: "100% 3px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerReveal}
          >
            <motion.p
              className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-gold/60"
              variants={reveal}
            >
              Commission the Studio
            </motion.p>
            <motion.h2
              className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              variants={reveal}
            >
              Begin Your Project
            </motion.h2>
            <motion.p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warm-muted"
              variants={reveal}
            >
              Every great building starts with a conversation. Share your vision
              with the studio and receive a considered proposal tailored to your
              brief.
            </motion.p>
            <motion.div variants={reveal} className="mt-12">
              <Link
                href="/#architecture-consultation-desk"
                className="group inline-flex items-center gap-4 border border-gold/60 px-10 py-5 text-[0.75rem] font-black uppercase tracking-[0.4em] text-gold transition-all duration-500 hover:bg-gold hover:text-graphite"
              >
                <span>Request Consultation</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ArchitectureFooter />
    </main>
  );
}
