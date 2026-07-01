"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ashok Kumar",
    role: "Residential Client",
    quote: "The team delivered a beautiful modern residence that perfectly balanced aesthetics and functionality. Their attention to detail exceeded our expectations.",
    project: "Luxury Villa Residence"
  },
  {
    name: "Priya Narayanan",
    role: "Commercial Client",
    quote: "RACTYSH Design transformed our office into a sophisticated and productive workspace. The design process was smooth and highly professional.",
    project: "Corporate Office Interior"
  },
  {
    name: "Mohammed Faizal",
    role: "Business Owner",
    quote: "From planning to execution, every stage reflected exceptional architectural expertise. We highly recommend RACTYSH Design.",
    project: "Commercial Complex"
  },
  {
    name: "Kavya Srinivasan",
    role: "Homeowner",
    quote: "Our dream home became a reality thanks to the creativity and dedication of the RACTYSH Design team.",
    project: "Contemporary Residence"
  }
];

export default function ClientTestimonials() {
  return (
    <motion.div
      className="mt-14 md:mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.div
        className="flex items-center gap-4 mb-8 md:mb-10"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }}
      >
        <div className="h-px w-8 md:w-12 bg-executive-red" />
        <p className="text-[0.55rem] md:text-[0.62rem] font-black uppercase tracking-[0.4em] text-black">
          Client Feedback
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {testimonials.map((item, i) => (
          <motion.div
            key={item.name}
            className="bg-white rounded-xl border border-black/5 p-6 md:p-7 transition-all duration-500 hover:border-executive-red/20"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, si) => (
                <span key={si} className="text-executive-red text-sm md:text-base">★</span>
              ))}
            </div>

            <p className="text-sm md:text-base text-black/70 leading-relaxed italic">
              &ldquo;{item.quote}&rdquo;
            </p>

            <div className="mt-4 pt-4 border-t border-black/5">
              <p className="font-display text-sm md:text-base text-black font-light tracking-tight">
                {item.name}
              </p>
              <p className="text-[0.45rem] md:text-[0.5rem] font-bold uppercase tracking-[0.25em] text-executive-red/80 mt-0.5">
                {item.role}
              </p>
              {item.project && (
                <p className="text-[0.4rem] md:text-[0.45rem] font-bold uppercase tracking-[0.25em] text-black/30 mt-2">
                  Project: <span className="text-black/50">{item.project}</span>
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
