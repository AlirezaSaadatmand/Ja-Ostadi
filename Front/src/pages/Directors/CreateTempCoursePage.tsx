import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { useTempCourseStore } from "../../store/tempCourse/useTempCourseStore"
import useTempCourseForm from "./hooks/useTempCourseForm"
import BasicInfoSection from "../../components/tempCourse/BasicInfoSection"
import ClassSection from "../../components/tempCourse/ClassSection"
import FinalExamSection from "../../components/tempCourse/FinalExamSection"
import { GROUPS, UNITS, TERMS } from "./hooks/useTempCourseForm"

const CreateTempCoursePage: React.FC = () => {
  const navigate = useNavigate()
  const { createTempCourse, isLoading, error } = useTempCourseStore()
  
  const {
    form,
    handleFormChange,
    handleDepartmentChange,
    handleSuggestionSelect,
    validationErrors,
    showSecondClass,
    setShowSecondClass,
    departments,
    courseNameSuggestions,
    instructorSuggestions,
    showCourseSuggestions,
    setShowCourseSuggestions,
    showInstructorSuggestions,
    setShowInstructorSuggestions,
    normalizePersian,
    validateForm
  } = useTempCourseForm()

  const handleSubmit = async () => {
    if (!validateForm()) return
    await createTempCourse(form)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            ایجاد درس موقت
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-[#AB8A58] text-white rounded-xl hover:opacity-90"
          >
            <ArrowRight size={18} />
            بازگشت
          </button>
        </div>

        {/* BASIC INFO */}
        <BasicInfoSection
          form={form}
          validationErrors={validationErrors}
          departments={departments}
          courseNameSuggestions={courseNameSuggestions}
          instructorSuggestions={instructorSuggestions}
          showCourseSuggestions={showCourseSuggestions}
          showInstructorSuggestions={showInstructorSuggestions}
          onDepartmentChange={handleDepartmentChange}
          onFormChange={handleFormChange}
          onSuggestionSelect={handleSuggestionSelect}
          onCourseSuggestionToggle={setShowCourseSuggestions}
          onInstructorSuggestionToggle={setShowInstructorSuggestions}
          normalizePersian={normalizePersian}
          GROUPS={GROUPS}
          UNITS={UNITS}
          TERMS={TERMS}
        />

        {/* FIRST CLASS */}
        <ClassSection
          title="کلاس اول"
          day={form.firstDay}
          time={form.firstTime}
          room={form.firstRoom}
          lock={form.firstLock}
          onDayTimeSelect={(day, time) => 
            handleFormChange({ firstDay: day, firstTime: time })
          }
          onRoomChange={(room) => handleFormChange({ firstRoom: room })}
          onLockChange={(lock) => handleFormChange({ firstLock: lock })}
        />

        {/* ADD SECOND CLASS */}
        {!showSecondClass && (
          <button
            onClick={() => setShowSecondClass(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-600 hover:border-[#AB8A58] hover:text-[#AB8A58] transition"
          >
            ➕ افزودن کلاس دوم
          </button>
        )}

        {/* SECOND CLASS */}
        {showSecondClass && (
          <ClassSection
            title="کلاس دوم"
            day={form.secondDay}
            time={form.secondTime}
            room={form.secondRoom}
            lock={form.secondLock}
            onDayTimeSelect={(day, time) => 
              handleFormChange({ secondDay: day, secondTime: time })
            }
            onRoomChange={(room) => handleFormChange({ secondRoom: room })}
            onLockChange={(lock) => handleFormChange({ secondLock: lock })}
          />
        )}

        {/* FINAL EXAM */}
        <FinalExamSection
          date={form.finalExamDate}
          time={form.finalExamTime}
          onDateChange={(date) => handleFormChange({ finalExamDate: date })}
          onTimeChange={(time) => handleFormChange({ finalExamTime: time })}
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#AB8A58] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "در حال ثبت..." : "ثبت درس"}
        </button>
      </div>
    </div>
  )
}

export default CreateTempCoursePage