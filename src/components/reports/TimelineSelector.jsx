/* eslint-disable react/prop-types */
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { formatDay, formatMonth, formatWeek } from "../../utils/formatDate";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TimelineSelector({
  view,
  setView,
  date,
  setDate,
  timeStamps,
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  let formattedDate = null;
  let prevBtnHandler = null;
  let nextBtnHandler = null;

  if (view === "day") {
    formattedDate = formatDay(date);
    prevBtnHandler = () =>
      setDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
      );
    nextBtnHandler = () => {
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );
      if (newDate < new Date()) setDate(newDate);
    };
  } else if (view === "week") {
    formattedDate = formatWeek(timeStamps.start, timeStamps.end);
    prevBtnHandler = () => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      setDate(newDate);
    };
    nextBtnHandler = () => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      if (newDate < new Date()) setDate(newDate);
    };
  } else {
    formattedDate = formatMonth(timeStamps.start, timeStamps.end);
    prevBtnHandler = () =>
      setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    nextBtnHandler = () => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
      if (nextMonth < new Date()) setDate(nextMonth);
    };
  }

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;

    if (view === "day") {
      setDate(selectedDate);
    } else if (view === "week") {
      setDate(selectedDate);
    } else {
      setDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }

    setIsCalendarOpen(false); // close the popover
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 mb-3">
      <Tabs
        value={view}
        onValueChange={(val) => {
          setView(val);
          setDate(new Date());
        }}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Date navigation */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <button
          onClick={prevBtnHandler}
          className="p-2 bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="relative font-medium px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-center">
          {formattedDate}
        </span>

        <button
          onClick={nextBtnHandler}
          className="p-2 bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {view === "month" ? (
          <Select
            value={`${date.getFullYear()}-${date.getMonth()}`}
            onValueChange={(val) => {
              const [year, month] = val.split("-").map(Number);
              setDate(new Date(year, month, 1));
            }}
          >
            <SelectTrigger className="w-[120px] sm:w-[140px] text-sm sm:text-base">
              <SelectValue>
                {date.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: new Date().getMonth() + 1 }).map(
                (_, monthIndex) => (
                  <SelectItem
                    key={`${date.getFullYear()}-${monthIndex}`}
                    value={`${date.getFullYear()}-${monthIndex}`}
                  >
                    {`${new Date(date.getFullYear(), monthIndex).toLocaleString(
                      "default",
                      {
                        month: "long",
                      },
                    )} ${date.getFullYear()}`}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        ) : (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-2 bg-accent p-2 sm:p-3"
                size="icon"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 sm:p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(d) => d > new Date()}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
