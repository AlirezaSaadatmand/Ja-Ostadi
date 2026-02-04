import React from "react"
import TimeDaySelector from "../../components/tempCourse/TimeDaySelector"

interface ClassSectionProps {
  title: string
  day: string
  time: string
  room: string
  lock: boolean
  onDayTimeSelect: (day: string, time: string) => void
  onRoomChange: (value: string) => void
  onLockChange: (checked: boolean) => void
}

const ClassSection: React.FC<ClassSectionProps> = ({
  title,
  day,
  time,
  room,
  lock,
  onDayTimeSelect,
  onRoomChange,
  onLockChange,
}) => {
  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AB8A58]"

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="font-semibold text-lg text-gray-800">
        {title}
      </h2>

      <TimeDaySelector
        title="انتخاب زمان"
        value={day ? { day, time } : null}
        onSelect={onDayTimeSelect}
      />

      <input
        className={inputClass}
        placeholder="کلاس / اتاق"
        value={room}
        onChange={(e) => onRoomChange(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={lock}
          onChange={(e) => onLockChange(e.target.checked)}
          className="accent-[#AB8A58]"
        />
        قفل کردن روز و ساعت {title}
      </label>
    </div>
  )
}

export default ClassSection