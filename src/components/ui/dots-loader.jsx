"use client";
import { motion } from "framer-motion";

const DotsLoader = () => (
  <div className="relative flex items-center">
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.7, repeat: Infinity }}
      className="absolute left-2 size-3.5 rounded-full bg-current"
    ></motion.span>
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: 24 }}
      transition={{ duration: 0.7, repeat: Infinity }}
      className="absolute left-2 size-3.5 rounded-full bg-current"
    ></motion.span>
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: 24 }}
      transition={{ duration: 0.7, repeat: Infinity }}
      className="absolute left-8 size-3.5 rounded-full bg-current"
    ></motion.span>
    <motion.span
      initial={{ scale: 1 }}
      animate={{ scale: 0 }}
      transition={{ duration: 0.7, repeat: Infinity }}
      className="absolute left-14 size-3.5 rounded-full bg-current"
    ></motion.span>
  </div>
);

export { DotsLoader };
