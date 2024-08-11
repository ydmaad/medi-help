import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { Tables } from "@/types/supabase";
import { EventInput } from "@fullcalendar/core";

type MedicineType = Tables<"medications">;
type CalendarMedicineType = {
  id: string;
  medi_time: string;
  medications: MedicineType;
};

const CalendarCheckbox = () => {
  const { user } = useAuthStore();
  const [checkedMedicines, setCheckedMedicines] = useState<MedicineType[]>([]);

  useEffect(() => {
    const fetchCheckedMedicines = async () => {
      if (user) {
        try {
          const { data } = await axios.get(`/api/calendar?user_id=${user.id}`);

          // 데이터를 가공하여 각 날짜별로 체크된 약들의 목록을 추출
          const allCheckedMedicines: MedicineType[] = [];
          data.forEach((event: EventInput) => {
            event.calendar_medicine.forEach((medicine: CalendarMedicineType) => {
              allCheckedMedicines.push(medicine.medications);
            });
          });

          setCheckedMedicines(allCheckedMedicines);
        } catch (error) {
          console.log("Error fetching checked medicines", error);
        }
      }
    };

    fetchCheckedMedicines();
  }, [user]);

  return (
    <div>
      <h2>복용 약 필터</h2>
      <ul>
        {checkedMedicines.map((medicine) => (
          <li key={medicine.id}>
            {medicine.medi_nickname} ({medicine.medi_name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarCheckbox;
