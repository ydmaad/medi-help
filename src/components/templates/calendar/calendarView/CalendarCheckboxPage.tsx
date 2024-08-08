import React, { useState, useEffect } from "react";
import { EventInput } from "@fullcalendar/core";

interface ExtendedEventInput extends EventInput {
  display?: string;
}

interface CalendarCheckboxProps {
  events: ExtendedEventInput[];
  setEvents: React.Dispatch<React.SetStateAction<ExtendedEventInput[]>>;
}

const CalendarCheckboxPage: React.FC<CalendarCheckboxProps> = ({ events, setEvents }) => {
  const [checkedEvents, setCheckedEvents] = useState<string[]>([]);

  useEffect(() => {
    setCheckedEvents(events.map((event) => event.title || ""));
  }, [events]);

  const handleCheckboxChange = (eventTitle: string) => {
    setCheckedEvents((prev) =>
      prev.includes(eventTitle)
        ? prev.filter((title) => title !== eventTitle)
        : [...prev, eventTitle]
    );
    setEvents((prev) =>
      prev.map((event) =>
        event.title === eventTitle
          ? { ...event, display: prev.find(e => e.title === eventTitle)?.display === 'none' ? 'auto' : 'none' }
          : event
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">약 이름 체크박스</h2>
      <div className="space-y-2">
        {events.map((event) => (
          <label
            key={event.id}
            className="flex items-center justify-between bg-white shadow-md p-2 rounded-lg"
          >
            <span className="text-lg">{event.title}</span>
            <input
              type="checkbox"
              checked={checkedEvents.includes(event.title || "")}
              onChange={() => handleCheckboxChange(event.title || "")}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default CalendarCheckboxPage;
