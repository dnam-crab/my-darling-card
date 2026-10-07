import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import sticker8 from "../../assets/images/sticker8.webp";

type DateTimeChoiceProps = {
  onNext: (date: string, time: string) => void;
  onBack: () => void;
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

export function DateTimeChoice({ onNext, onBack }: DateTimeChoiceProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [floatingDays, setFloatingDays] = useState<Record<number, FloatingDay>>({});
  const timeSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeTimeMenu(event: MouseEvent) {
      if (!timeSelectRef.current?.contains(event.target as Node)) {
        setIsTimeMenuOpen(false);
      }
    }

    function closeTimeMenuOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsTimeMenuOpen(false);
    }

    document.addEventListener("mousedown", closeTimeMenu);
    document.addEventListener("keydown", closeTimeMenuOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeTimeMenu);
      document.removeEventListener("keydown", closeTimeMenuOnEscape);
    };
  }, []);

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

    const startPosition = {
      left: Math.min(Math.max(0, rect.left), maxLeft),
      top: Math.min(Math.max(0, rect.top), maxTop),
    };

    setFloatingDays((current) => ({
      ...current,
      [day]: {
        ...startPosition,
        width: rect.width,
        height: rect.height,
      },
    }));

    window.requestAnimationFrame(() => {
      setFloatingDays((current) => ({
        ...current,
        [day]: {
          ...position,
          width: rect.width,
          height: rect.height,
        },
      }));
    });
  }

  return (
    <section className="date-time-choice" data-component="date-time-choice">
      <div className="date-time-card">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>
        <p className="date-time-question">Let&apos;s plan our little adventure</p>
        <p className="date-time-subtitle">Pick a day and time that feels perfect for us</p>

        <div className="date-time-layout">
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

          <div className="time-panel">
            <img className="time-panel-sticker" src={sticker8} alt="" aria-hidden="true" />
            <p className="time-label">When should our date begin?</p>
            <p className="time-hint">Choose when our little adventure begins</p>
            <div className="time-select-wrapper" ref={timeSelectRef}>
              <button
                type="button"
                className={`time-select${isTimeMenuOpen ? " time-select--open" : ""}`}
                aria-label="Select a time"
                aria-haspopup="listbox"
                aria-expanded={isTimeMenuOpen}
                onClick={() => setIsTimeMenuOpen((open) => !open)}
              >
                <span>{selectedTime ?? "Select a time"}</span>
                <span className="time-select-arrow" aria-hidden="true" />
              </button>
              {isTimeMenuOpen && (
                <div className="time-select-menu" role="listbox" aria-label="Available times">
                  {times.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      role="option"
                      aria-selected={selectedTime === time.label}
                      className={`time-select-option${selectedTime === time.label ? " time-select-option--selected" : ""}`}
                      onClick={() => {
                        setSelectedTime(time.label);
                        setIsTimeMenuOpen(false);
                      }}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          LOCK IN OUR DATE ♥
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
