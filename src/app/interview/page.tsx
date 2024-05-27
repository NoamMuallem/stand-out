"use client";
import { type UserProfile } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DatePicker } from "~/components/DatePicker";
import WeekView from "~/components/Weekview/WeekView";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  fetchClerkUserImage,
  getAllUsersWithFreeTimeSlotsInRange,
} from "./action";

export default function InterviewersPage() {
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(addDays(new Date(), 3));
  const { data, isLoading, error } = useQuery({
    queryKey: ["interviewers", startTime, endTime],
    queryFn: async () =>
      await getAllUsersWithFreeTimeSlotsInRange({ startTime, endTime }),
  });

  return (
    <main className="flex min-h-screen w-full flex-col items-stretch justify-start gap-8 px-3 py-5 text-2xl text-black">
      <div className="flex w-full items-center justify-start">
        <DatePicker
          date={startTime}
          setDate={(date) => date && setStartTime(date)}
        />
        <DatePicker
          date={endTime}
          setDate={(date) => date && setEndTime(date)}
        />
      </div>
      <div className="flex flex-col gap-1">
        {isLoading && <LoaderIcon className="mx-auto animate-spin" />}
        {error && <div>{error.message}</div>}
        {data && data.length > 0
          ? data.map((user) => <UserRow key={user.userID} user={user} />)
          : null}
        {!isLoading && !error && (!data || data.length === 0) && (
          <div>קרתה שגיאה בקבלת המידע המבוקש</div>
        )}
      </div>
    </main>
  );
}

const UserRow = ({ user }: { user: UserProfile }) => {
  const { data } = useQuery({
    queryKey: ["users", user.userID],
    queryFn: async () => fetchClerkUserImage({ userID: user.userID }),
  });

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex w-full cursor-pointer items-center justify-start gap-4 rounded border border-slate-600 px-5 py-3">
          {data && (
            <Image width="40" height="40" src={data} alt={user.firstName} />
          )}
          <div>{user.firstName}</div>
          <div>{user.averageRanking}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex w-full flex-col items-center justify-start">
        <WeekView userID={user.userID} />
      </DialogContent>
    </Dialog>
  );
};
