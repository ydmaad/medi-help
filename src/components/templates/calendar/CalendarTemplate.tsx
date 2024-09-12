"use client";
import React, { useEffect, useState } from "react";

import CalendarView from "./calendarView/CalendarView";
import Loading from "@/components/atoms/Loading";
import { useEventsStore, useMediNameFilter } from "@/store/calendar";
import { useAuthStore } from "@/store/auth";
import { TIME_OF_TIME } from "@/constants/constant";
import { EventInput } from "@fullcalendar/core";
import axios from "axios";
import CalendarCheckbox from "./calendarView/CalendarCheckbox";

const CalendarTemplate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { setEvents } = useEventsStore();
  const { user } = useAuthStore();
  const { mediNames } = useMediNameFilter();

  useEffect(() => {
    getEventsData();
  }, [user, mediNames]);

  const getEventsData = async () => {
    try {
      if (user) {
        const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);

        {
          const newEvents: EventInput[] = [];
          data.map((event: EventInput) => {
            if (event.calendar_medicine.length !== 0) {
              const setEventList = (time: string) => {
                let eventList = event.calendar_medicine.filter(
                  (medicine: any) => {
                    return medicine.medi_time === time;
                  }
                );

                const newEventList = eventList.filter((e: any) => {
                  return mediNames.includes(e.medications.medi_nickname);
                });

                let countMedicines = newEventList.length;

                if (countMedicines !== 0) {
                  let medicineNickname =
                    newEventList[0].medications.medi_nickname;
                  newEvents.push({
                    groupId: event.id,
                    title:
                      countMedicines !== 1
                        ? `${medicineNickname} 외 ${countMedicines - 1}개`
                        : `${medicineNickname}`,
                    start: `${event.start_date} ${
                      TIME_OF_TIME[newEventList[0].medi_time]
                    }`,
                    extendProps: {
                      medi_time: newEventList[0].medi_time,
                      medicineList: newEventList.map(
                        (medicine: any) => medicine.medications.id
                      ),
                    },
                  });
                }
              };

              setEventList("morning");
              setEventList("afternoon");
              setEventList("evening");
            }
          });
          setEvents(newEvents);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("axios error", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <CalendarCheckbox />
      <CalendarView />
    </>
  );
};

export default CalendarTemplate;
