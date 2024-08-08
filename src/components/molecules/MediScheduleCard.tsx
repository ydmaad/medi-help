import Image from "next/image";

interface PillComponentProps {
    pill : {
        time: string;
        pillName: string;
        timeOfDay: string;
        hasTaken: boolean;
    }
}

const TIME_OF_DAY_MAPPING = {
    morning : "아침",
    lunch : "점심",
    dinner : "저녁"
}

const PillComponent: React.FC<PillComponentProps> = ({pill}) => {
    const { hasTaken, time, pillName, timeOfDay } = pill;

    return (
        <div className={`w-full flex py-2 px-4 rounded-[4px] ${hasTaken ? 'bg-[#E9F5FE]' : 'bg-[#F5F6F7]'}`}>
            <Image
                src={hasTaken ? '/pill-filled.svg' : '/pill-inactive.svg'}
                alt="pill"
                width={24}
                height={24}
                className="mr-2"
            />
            <div className="flex flex-col gap-0.5 font-normal">
                <div className={`text-[12px] ${hasTaken ? 'text-[#7C7F86]' : 'text-[#7C7F86]'}`}>
                    <div className={`w-2 h-2 rounded-full ${hasTaken ? 'bg-[#BCE1FD]' : 'bg-[#E0E2E4]'} inline-block mr-1`} />
                    {TIME_OF_DAY_MAPPING[[timeOfDay]]} <span className={hasTaken ? 'text-[#279EF9]' : 'text-[#7C7F86]'}>{time}</span>
                </div>
                <div className={`text-[14px] ${hasTaken ? '' : 'line-through text-[#7C7F86]'}`}>
                    {pillName}
                </div>
            </div>
        </div>
    );
};

export default PillComponent;