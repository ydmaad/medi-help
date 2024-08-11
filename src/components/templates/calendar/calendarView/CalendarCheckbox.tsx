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
      <h1 className="text-4xl font-bold mb-4 flex items-center">
        <img src="/pencil.png" alt="연필 아이콘" className="w-10 h-10 mr-2" />
        복약 달력
      </h1>
      <h2 className="text-gray-600 text-lg mb-2">복용 약 필터</h2>
      <ul>
        {checkedMedicines.map((medicine) => (
          <li key={medicine.id} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            {medicine.medi_nickname} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarCheckbox;
