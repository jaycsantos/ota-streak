"use client";

import fetcher from "@/lib/fetcher";
import { useParams } from "next/navigation";
import useSWRImmutable from "swr/immutable";
import { motion, AnimatePresence, easeOut, easeIn } from "framer-motion";
import StreakDay from "./StreakDay";
// TODO: maybe create a lint rule to only import types from the api
import type { StreaksDto } from "@api/streaks/streaks-dto";

export default function StreaksPage() {
  const params = useParams();
  // this fetches only once, change to useSWR for real-time updates
  const { data, isLoading, error } = useSWRImmutable<StreaksDto>(
    `streaks/${params.id}`,
    fetcher,
  );

  return (
    <>
      {error && (
        <h2 className="text-center text-4xl text-red-500">Unavailable</h2>
      )}
      <AnimatePresence>
        {!isLoading && !error && (
          <>
            <motion.h1
              className="text-center text-[56px] font-medium"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{
                duration: 1,
                ease: easeIn,
                type: "spring",
                bounce: 0.7,
              }}
            >
              Your streak&nbsp;
              <span className="inline-block">is {data?.total} </span>
            </motion.h1>

            <motion.div
              className="overflow-auto rounded-2xl border-2 border-[#E6E6E6] bg-white p-6 transition-all duration-500"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    ease: easeOut,
                    bounce: 1,
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <div className="flex flex-row">
                {data?.days.map((day, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
                  >
                    <StreakDay data={day} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {isLoading && (
        <div className="text-center">
          <span className="loading"></span>
        </div>
      )}
    </>
  );
}
