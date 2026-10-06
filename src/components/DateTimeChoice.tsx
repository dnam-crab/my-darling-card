import { useState } from "react";
import { createPortal } from "react-dom";

type DateTimeChoiceProps = {
  onNext: (date: string, time: string) => void;
};

type CalendarDay = {
  day: number;
  muted?: boolean;
};

type FloatingDay = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const calendarDays: CalendarDay[] = [
  ...[27, 28, 29, 30].map((day) => ({ day, muted: true })),
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1 })),
  ...Array.from({ length: 7 }, (_, index) => ({ day: index + 1, muted: true })),
];
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const times = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 12 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const minuteLabel = String(minutes).padStart(2, "0");

  return {
    value: `${String(hour).padStart(2, "0")}:${minuteLabel}`,
    label: `${String(hour).padStart(2, "0")}:${minuteLabel}`,
  };
});

export function DateTimeChoice({ onNext }: DateTimeChoiceProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [floatingDays, setFloatingDays] = useState<Record<number, FloatingDay>>({});

  function moveDateButton(day: number, button: HTMLButtonElement) {
    const rect = button.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const maxLeft = Math.max(0, viewportWidth - rect.width);
    const maxTop = Math.max(0, viewportHeight - rect.height);
    let position = {
      left: Math.min(Math.max(0, rect.left), maxLeft),
      top: Math.min(Math.max(0, rect.top), maxTop),
    };

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = {
        left: Math.random() * maxLeft,
        top: Math.random() * maxTop,
      };
      const distance = Math.hypot(
        candidate.left - rect.left,
        candidate.top - rect.top,
      );

      if (distance > 120) {
        position = candidate;
        break;
      }
    }

    setFloatingDays((current) => ({
      ...current,
      [day]: {
        ...position,
        width: rect.width,
        height: rect.height,
      },
    }));
  }

  return (
    <section className="date-time-choice" data-component="date-time-choice">
      <div className="date-time-card">
        <p className="date-time-question">So... where are you free?</p>
        <p className="date-time-subtitle">Pick a date and time for our date</p>

        <div className="calendar" aria-label="October 2026 calendar">
          <div className="calendar-frame-top" aria-hidden="true">
            <span>✦</span>
            <span>♡</span>
            <span>✦</span>
          </div>
          <p className="calendar-month">October 2026</p>
          <div className="calendar-weekdays" aria-hidden="true">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-days">
            {calendarDays.map(({ day, muted }, index) => (
              muted ? (
                <button
                  className="calendar-day calendar-day--muted"
                  key={`${day}-muted-${index}`}
                  type="button"
                  disabled
                >
                  {day}
                </button>
              ) : floatingDays[day] ? (
                <span
                  className="calendar-day calendar-day--empty"
                  key={`${day}-floating-${index}`}
                />
              ) : (
                <button
                  className={`calendar-day${
                    day === 10 ? " calendar-day--target" : " calendar-day--runner"
                  }${selectedDay === day ? " calendar-day--selected" : ""}`}
                  key={`${day}-current-${index}`}
                  type="button"
                  onMouseEnter={(event) => {
                    if (day !== 10) moveDateButton(day, event.currentTarget);
                  }}
                  onFocus={(event) => {
                    if (day !== 10) moveDateButton(day, event.currentTarget);
                  }}
                  onClick={() => {
                    if (day === 10) setSelectedDay(day);
                  }}
                >
                  {day}
                </button>
              )
            ))}
          </div>
          <div className="calendar-frame-bottom" aria-hidden="true">♡</div>
        </div>

        <p className="time-label">What time?</p>
        <div className="time-select-wrapper">
          <select
            aria-label="Select a time"
            className="time-select"
            value={selectedTime ?? ""}
            onChange={(event) => setSelectedTime(event.target.value)}
          >
            <option disabled value="">
              Select a time
            </option>
            {times.map((time) => (
              <option key={time.value} value={time.label}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="next-button"
          type="button"
          disabled={!selectedDay || !selectedTime}
          onClick={() =>
            onNext(
              `2026-10-${String(selectedDay).padStart(2, "0")}`,
              selectedTime!,
            )
          }
        >
          GET THE DATE ♥
        </button>
      </div>
      {Object.entries(floatingDays).map(([dayValue, position]) => {
        const day = Number(dayValue);

        return createPortal(
          <button
            className="calendar-day calendar-day--runner calendar-day--escaped"
            key={`floating-${day}`}
            type="button"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
            }}
            onMouseEnter={(event) => moveDateButton(day, event.currentTarget)}
            onFocus={(event) => moveDateButton(day, event.currentTarget)}
          >
            {day}
          </button>,
          document.body,
        );
      })}
    </section>
  );
}
