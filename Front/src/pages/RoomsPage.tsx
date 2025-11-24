"use client"

import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import { useRoomStore } from "../store/usefull/useRoomScheduleStore"
import RoomWeeklyTableView from "../components/Room/RoomWeeklyTableView"
import { downloadRoomScheduleExcel } from "../components/Room/DownloadRoomScheduleExcel"

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    rooms,
    roomSchedule,
    isLoading,
    error,
    fetchRooms,
    fetchRoomSchedule,
  } = useRoomStore()

  const selectedRoomId = searchParams.get("roomId")

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      const firstRoom = rooms[0].id.toString()
      setSearchParams({ roomId: firstRoom })
      fetchRoomSchedule(firstRoom)
    }
  }, [rooms, selectedRoomId, setSearchParams, fetchRoomSchedule])

  useEffect(() => {
    if (selectedRoomId) {
      fetchRoomSchedule(selectedRoomId)
    }
  }, [selectedRoomId, fetchRoomSchedule])

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    setSearchParams({ roomId: newId })
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header />
      <div className="block md:hidden bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            برنامه کلاس‌ها
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            نمایش برنامه کلاسی بر اساس کلاس
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 text-center mb-6">
            انتخاب کلاس
          </h2>

          <div className="w-full sm:w-1/2 mx-auto">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              کلاس:
            </label>

            <select
              className="block w-full text-sm border border-gray-300 rounded-md p-2"
              value={selectedRoomId ?? ""}
              onChange={handleRoomChange}
              disabled={rooms.length === 0}
            >
              {rooms.length === 0 ? (
                <option>در حال بارگذاری...</option>
              ) : (
                rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-10 text-gray-600">
            در حال بارگذاری اطلاعات...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            خطا: {error}
          </div>
        )}

        {!isLoading && !error && roomSchedule.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            هیچ برنامه‌ای برای این کلاس یافت نشد.
          </div>
        )}

        {!isLoading && !error && roomSchedule.length > 0 && (
          <>
            <div className="mb-4 text-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => downloadRoomScheduleExcel(roomSchedule)}
              >
                دانلود Excel
              </button>
            </div>

            <RoomWeeklyTableView roomSchedule={roomSchedule} />
          </>
        )}
      </div>
    </div>
  )
}

export default RoomsPage
