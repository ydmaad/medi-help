"use client";
import React, { useEffect, useState } from "react";

import CalendarView from "./calendarView/CalendarView";
import Loading from "@/components/atoms/Loading";
import {
  useCalendarStore,
  useEventsStore,
  useMediNameFilter,
  useMedicinesStore,
  useValuesStore,
} from "@/store/calendar";
import { useAuthStore } from "@/store/auth";
import { TIME_OF_TIME } from "@/constants/constant";
import { EventInput } from "@fullcalendar/core";
import axios from "axios";
import CalendarCheckbox from "./calendarView/CalendarCheckbox";
import { Tables } from "@/types/supabase";
import { MedicinesType } from "@/types/calendar";

const CalendarTemplate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { setEvents } = useEventsStore();
  const { setMedicines } = useMedicinesStore();
  const { setCalendar } = useCalendarStore();
  const { values, setValues } = useValuesStore();

  const { user } = useAuthStore();
  const { mediNames } = useMediNameFilter();

  type CalendarType = Tables<"calendar">;

  useEffect(() => {
    if (user) {
      setValues({ ...values, user_id: user.id });

      const getCalendarData = async () => {
        if (user) {
          try {
            const { data } = await axios.get(
              `/api/calendar?user_id=${user.id}`
            );

            // 복약기록 날짜 및 노트 정보
            const newCalendar: CalendarType[] = [];
            data.map((info: CalendarType) => {
              newCalendar.push({
                id: info.id,
                user_id: info.user_id,
                created_at: info.created_at,
                side_effect: info.side_effect,
                start_date: info.start_date,
              });
            });

            setCalendar(newCalendar);
          } catch (error) {
            console.log("axios error", error);
          }
        }
      };

      // 복용중인 약 불러오는 로직
      const getMedicines = async () => {
        if (user) {
          try {
            const { data } = await axios.get(
              `/api/calendar/medi?user_id=${user.id}`
            );

            const newMedicines: MedicinesType[] = [];

            data.medicationRecords.map((record: any) => {
              newMedicines.push({
                id: record.id,
                name: record.medi_nickname,
                time: record.times,
                notification_time: record.notification_time,
              });
            });

            setMedicines(newMedicines);
            return data;
          } catch (error) {
            console.log("medi axios =>", error);
          }
        }
      };

      getCalendarData();
      getMedicines();
    }
  }, [user]);

  useEffect(() => {
    const getEventsData = async () => {
      if (user) {
        try {
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
        } catch (error) {
          console.log("axios error", error);
        }
      }
    };

    getEventsData();
  }, [user, mediNames]);

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
