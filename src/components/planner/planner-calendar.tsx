"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { PlannerDayDetail } from "./planner-day-detail";

interface CalendarItem {
  id: string;
  type: "emi" | "subscription";
  name: string;
  subtitle: string;
  amount: number;
  dueDate: string;
  day: number;
  status: "UPCOMING" | "PAID" | "MISSED";
}

interface Props {
  month: number;
  year: number;
  items: CalendarItem[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function PlannerCalendar({ month, year, items }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
  const todayDate = today.getDate();

  const monthLabel = new Date(year, month - 1).toLocaleString("en-US", { month: "long" });

  // Group items by day
  const itemsByDay: Record<number, CalendarItem[]> = {};
  for (const item of items) {
    if (!itemsByDay[item.day]) itemsByDay[item.day] = [];
    itemsByDay[item.day].push(item);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedItems = selectedDay ? itemsByDay[selectedDay] ?? [] : [];

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-center text-caption font-semibold text-muted-foreground py-2"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dayItems = itemsByDay[day] ?? [];
            const hasItems = dayItems.length > 0;
            const isToday = isCurrentMonth && day === todayDate;
            const allPaid = hasItems && dayItems.every((it) => it.status === "PAID");
            const hasMissed = dayItems.some((it) => it.status === "MISSED");

            return (
              <button
                key={day}
                type="button"
                onClick={() => hasItems && setSelectedDay(day)}
                className={cn(
                  "relative flex flex-col items-center justify-start rounded-lg p-1 text-body-sm transition-colors min-h-[72px]",
                  hasItems ? "cursor-pointer hover:bg-accent" : "cursor-default",
                  isToday && "ring-2 ring-primary"
                )}
              >
                <span
                  className={cn(
                    "text-caption font-medium",
                    isToday ? "text-primary font-bold" : "text-foreground"
                  )}
                >
                  {day}
                </span>
                {hasItems && (
                  <div className="mt-0.5 flex flex-col gap-0.5 w-full">
                    {dayItems.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight",
                          item.status === "PAID"
                            ? "bg-success-muted text-success"
                            : item.status === "MISSED"
                            ? "bg-destructive-muted text-destructive"
                            : item.type === "emi"
                            ? "bg-primary-muted text-primary"
                            : "bg-chart-4/20 text-chart-4"
                        )}
                      >
                        {item.name}
                      </div>
                    ))}
                    {dayItems.length > 2 && (
                      <span className="text-[10px] text-muted-foreground text-center">
                        +{dayItems.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && selectedItems.length > 0 && (
        <PlannerDayDetail
          day={selectedDay}
          monthLabel={monthLabel}
          items={selectedItems}
          open={!!selectedDay}
          onOpenChange={(open) => !open && setSelectedDay(null)}
        />
      )}
    </>
  );
}
