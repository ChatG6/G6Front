import { motion } from "framer-motion";

export default function PurpleLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        className="w-32 h-32 border-8 border-indigo-700 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
