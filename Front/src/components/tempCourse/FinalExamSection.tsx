import React, { useState, useRef, useEffect } from "react"
import { CalendarIcon, ClockIcon, Check, X } from "lucide-react"

interface FinalExamSectionProps {
  date: string
  time: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
}

const FinalExamSection: React.FC<FinalExamSectionProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState({ year: 1403, month: 1, day: 1 })
  const [tempTime, setTempTime] = useState({ hours: 8, minutes: 0 })
  
  const datePickerRef = useRef<HTMLDivElement>(null)
  const timePickerRef = useRef<HTMLDivElement>(null)
  
  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AB8A58] bg-white"

  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ]

  const currentPersianYear = 1403
  const persianYears = Array.from({ length: 5 }, (_, i) => currentPersianYear + i - 2)

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  useEffect(() => {
    if (date) {
      const [year, month, day] = date.split("/").map(Number)
      setTempDate({ year, month, day })
    } else {
      setTempDate({ year: currentPersianYear, month: 1, day: 1 })
    }
  }, [date])

  useEffect(() => {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number)
      setTempTime({ hours, minutes })
    } else {
      setTempTime({ hours: 8, minutes: 0 })
    }
  }, [time])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTempDateSelect = (year: number, month: number, day: number) => {
    setTempDate({ year, month, day })
  }

  const handleTempTimeSelect = (hours: number, minutes: number) => {
    setTempTime({ hours, minutes })
  }

  const applyDateSelection = () => {
    const formattedDate = `${tempDate.year}/${tempDate.month.toString().padStart(2, "0")}/${tempDate.day.toString().padStart(2, "0")}`
    onDateChange(formattedDate)
    setShowDatePicker(false)
  }

  const applyTimeSelection = () => {
    const formattedTime = `${tempTime.hours.toString().padStart(2, "0")}:${tempTime.minutes.toString().padStart(2, "0")}`
    onTimeChange(formattedTime)
    setShowTimePicker(false)
  }

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    const persianToEnglish = (str: string) => {
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
      const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      
      let result = str
      for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i])
      }
      return result
    }
    
    const normalizedValue = persianToEnglish(value)
      .replace(/[^0-9/]/g, '')
      .replace(/\/+/g, '/')
    
    onDateChange(normalizedValue)
    
    if (normalizedValue && normalizedValue.includes('/')) {
      const parts = normalizedValue.split('/').map(Number)
      if (parts.length >= 3) {
        setTempDate({ year: parts[0], month: parts[1], day: parts[2] })
      }
    }
  }

  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    const persianToEnglish = (str: string) => {
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
      const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      
      let result = str
      for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i])
      }
      return result
    }
    
    const normalizedValue = persianToEnglish(value)
      .replace(/[^0-9:]/g, '')
      .replace(/:+/g, ':')
    
    onTimeChange(normalizedValue)
    
    if (normalizedValue && normalizedValue.includes(':')) {
      const [hours, minutes] = normalizedValue.split(':').map(Number)
      setTempTime({ hours, minutes })
    }
  }

  const formatForDisplay = (value: string) => {
    if (!value) return ""
    
    const englishToPersian = (str: string) => {
      const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
      
      let result = str
      for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i])
      }
      return result
    }
    
    return englishToPersian(value)
  }

  const hours = Array.from({ length: 13 }, (_, i) => i + 8)
  const minutes = [0, 15, 30, 45]

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="font-semibold text-lg text-gray-800">
        امتحان نهایی
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              dir="rtl"
              className={inputClass}
              placeholder="۱۴۰۳/۱۰/۱۵"
              value={formatForDisplay(date)}
              onChange={handleManualDateChange}
              onFocus={() => setShowDatePicker(true)}
              readOnly
            />
            <button
              type="button"
              className="absolute left-3 text-gray-500 hover:text-[#AB8A58]"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <CalendarIcon size={20} />
            </button>
          </div>
          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سال
                  </label>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {persianYears.map((y) => (
                      <button
                        key={y}
                        type="button"
                        className={`py-2 text-sm rounded-lg ${y === tempDate.year ? 'bg-[#AB8A58] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleTempDateSelect(y, tempDate.month, tempDate.day)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ماه
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {persianMonths.map((m, index) => (
                      <button
                        key={m}
                        type="button"
                        className={`py-2 text-sm rounded-lg ${index + 1 === tempDate.month ? 'bg-[#AB8A58] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleTempDateSelect(tempDate.year, index + 1, tempDate.day)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    روز
                  </label>
                  <div className="grid grid-cols-7 gap-2 max-h-32 overflow-y-auto">
                    {daysInMonth.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`py-2 text-xs rounded-lg ${d === tempDate.day ? 'bg-[#AB8A58] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleTempDateSelect(tempDate.year, tempDate.month, d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm font-medium text-gray-700">
                    انتخاب شده:{" "}
                    <span className="text-[#AB8A58] font-bold">
                      {tempDate.year}/{tempDate.month.toString().padStart(2, "0")}/{tempDate.day.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                    >
                      <X size={16} />
                      انصراف
                    </button>
                    <button
                      type="button"
                      onClick={applyDateSelection}
                      className="px-4 py-2 bg-[#AB8A58] text-white text-sm rounded-lg hover:opacity-90 flex items-center gap-1"
                    >
                      <Check size={16} />
                      تأیید
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              dir="rtl"
              className={inputClass}
              placeholder="۱۴:۳۰"
              value={formatForDisplay(time)}
              onChange={handleManualTimeChange}
              onFocus={() => setShowTimePicker(true)}
              readOnly
            />
            <button
              type="button"
              className="absolute left-3 text-gray-500 hover:text-[#AB8A58]"
              onClick={() => setShowTimePicker(!showTimePicker)}
            >
              <ClockIcon size={20} />
            </button>
          </div>
          {showTimePicker && (
            <div 
              ref={timePickerRef}
              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4"
            >
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ساعت
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={`py-2 text-sm rounded-lg ${h === tempTime.hours ? 'bg-[#AB8A58] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleTempTimeSelect(h, tempTime.minutes)}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دقیقه
                  </label>
                  <div className="space-y-2">
                    {minutes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`w-full py-2 text-sm rounded-lg ${m === tempTime.minutes ? 'bg-[#AB8A58] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => handleTempTimeSelect(tempTime.hours, m)}
                      >
                        {m.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t">
                <div className="text-sm font-medium text-gray-700">
                  انتخاب شده:{" "}
                  <span className="text-[#AB8A58] font-bold">
                    {tempTime.hours.toString().padStart(2, "0")}:{tempTime.minutes.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <X size={16} />
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={applyTimeSelection}
                    className="px-4 py-2 bg-[#AB8A58] text-white text-sm rounded-lg hover:opacity-90 flex items-center gap-1"
                  >
                    <Check size={16} />
                    تأیید
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
        <div>📝 فرمت تاریخ: <span className="font-mono">سال/ماه/روز</span> مثال: <span className="font-mono">۱۴۰۳/۱۰/۱۵</span></div>
        <div>📝 فرمت زمان: <span className="font-mono">ساعت:دقیقه</span> مثال: <span className="font-mono">۱۴:۳۰</span></div>
        <div className="text-[#AB8A58] mt-1">💡 روی آیکون تقویم یا ساعت کلیک کنید تا انتخابگر باز شود</div>
      </div>
    </div>
  )
}

export default FinalExamSection