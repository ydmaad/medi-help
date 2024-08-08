import { ValueType } from "@/types/calendar";
import { EventInput } from "@fullcalendar/core";

// Medicines Set.
interface Medicines {
  events: EventInput[];
  setViewEvents: React.Dispatch<React.SetStateAction<boolean>>;
  values: ValueType;
  setValues: React.Dispatch<React.SetStateAction<ValueType>>;
}
export const setViewMedicines = ({
  events,
  setViewEvents,
  values,
  setValues,
}: Medicines) => {
  let editList = events.filter((event) => {
    return event.start?.toString().split(" ")[0] === values.start_date;
  });

  if (editList.length !== 0) {
    setViewEvents(true);
    let viewEvent = editList.filter((event: EventInput) => {
      return values.medi_time === event.extendProps.medi_time;
    })[0];

    if (viewEvent) {
      setValues({
        ...values,
        medicine_id: viewEvent.extendProps.medicineList,
      });
    }
  }

  if (editList.length === 0) {
    setViewEvents(false);
    setValues({
      ...values,
      medicine_id: [],
      side_effect: "",
    });
  }
};

// side_effect 입력란 onChange 함수
export const handleContentChange = (
  event:
    | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement>,
  setValues: React.Dispatch<React.SetStateAction<ValueType>>
) => {
  const { name, value } = event.target;
  setValues((prev) => {
    return { ...prev, [name]: value };
  });
};
