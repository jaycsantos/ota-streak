import moment from "moment";
import { cn } from "@/lib/cn";
import StreakIcon from "./StreakIcon";

export default function StreakDay({ data }: { data: StreakDayDto }) {
  const isToday = moment(data.date).isSame(new Date(), "day");

  return (
    <div
      className={cn(
        "flex h-[62px] w-[54px] flex-col items-center justify-center gap-2 border-b-2",
        isToday
          ? "border-primary text-primary"
          : "border-[#E6E6E6] text-secondary",
      )}
    >
      <StreakIcon completed={data.state != "INCOMPLETE"} />
      <span className="text-xs">{moment(data.date).format("ddd")}</span>
    </div>
  );
}

export interface StreakDayDto {
  date: string;
  activities: number;
  state: "INCOMPLETE" | "COMPLETED" | "SAVED" | "AT_RISK";
}
