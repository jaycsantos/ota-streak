"use client";

import fetcher from "@/lib/fetcher";
import { useParams } from "next/navigation";

import useSWR from "swr";
import StreakDay, { StreakDayDto } from "./StreakDay";

export default function Streaks() {
  const params = useParams();
  const { data, isLoading, error } = useSWR<StreaksDto>(
    `streaks/${params.id}`,
    fetcher,
  );

  return (
    <div className="flex max-w-full flex-col justify-center gap-10">
      <span>{error && JSON.stringify(error)}</span>
      {!isLoading && (
        <h1 className="text-center text-[56px] font-medium">
          Your streak&nbsp;
          <span className="inline-block">is {data?.total} </span>
        </h1>
      )}
      <div className="overflow-auto rounded-2xl border-2 border-[#E6E6E6] bg-white p-6">
        <div className="flex flex-row">
          {data?.days
            .toReversed()
            .map((day, i) => <StreakDay key={i} data={day} />)}
        </div>
      </div>
    </div>
  );
}

interface StreaksDto {
  total: number;
  activitiesToday: number;
  days: Array<StreakDayDto>;
}
