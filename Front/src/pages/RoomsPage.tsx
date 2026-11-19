import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { useRoomStore } from "../store/usefull/useRoomScheduleStore";
import RoomWeeklyTableView from "../components/Room/RoomWeeklyTableView";
import { downloadRoomScheduleExcel } from "../components/Room/DownloadRoomScheduleExcel";
import { useRoomPdfExportStore } from "../store/usefull/useRoomPdfExportStore";
import ClassroomPlan from "../components/Room/ClassroomPlan";
import type { PlanRoom } from "../components/Room/classroomPlanModel";
import { getRoomOptionGroups } from "../components/Room/roomSelection";

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roomQuery, setRoomQuery] = useState("");
  const [unavailableRoom, setUnavailableRoom] = useState<{
    room: PlanRoom;
    search: string;
  } | null>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  const {
    rooms,
    roomSchedule,
    selectedRoom: scheduleRoom,
    isLoading,
    error,
    fetchRooms,
    fetchRoomSchedule,
  } = useRoomStore();

  const selectedRoomId = searchParams.get("roomId");
  const selectedRoom = rooms.find(
    (room) => room.id.toString() === selectedRoomId,
  );
  const unavailablePlanRoom =
    unavailableRoom?.search === searchParams.toString()
      ? unavailableRoom.room
      : null;
  const roomGroups = useMemo(
    () => getRoomOptionGroups(rooms, roomQuery),
    [rooms, roomQuery],
  );
  const filteredRooms = roomGroups.flatMap((group) => group.rooms);
  const selectionVisible =
    !unavailablePlanRoom &&
    filteredRooms.some((room) => room.id.toString() === selectedRoomId);
  const scheduleLoading =
    isLoading || !!(selectedRoom && scheduleRoom?.id !== selectedRoom.id);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoom) {
      const firstRoom = rooms[0].id.toString();
      setSearchParams(
        (params) => {
          params.set("roomId", firstRoom);
          return params;
        },
        { replace: true },
      );
    }
  }, [rooms, selectedRoom, setSearchParams]);

  useEffect(() => {
    if (selectedRoomId && selectedRoom) {
      fetchRoomSchedule(selectedRoomId);
    }
  }, [selectedRoomId, selectedRoom, fetchRoomSchedule]);

  const selectRoom = (roomId: string) => {
    setUnavailableRoom(null);
    setSearchParams((params) => {
      params.set("roomId", roomId);
      return params;
    });
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectRoom(e.target.value);
  };

  const showSchedule = () => {
    scheduleRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 md:pt-24 lg:pt-28" dir="rtl">
      <Header />
      <div className="block md:hidden bg-white shadow-sm border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center ">
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
            <label
              htmlFor="room-search"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              جستجوی کلاس
            </label>
            <div className="relative mb-4">
              <input
                id="room-search"
                type="search"
                className="block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="شماره کلاس، ساختمان یا نوع فضا..."
                value={roomQuery}
                onChange={(event) => setRoomQuery(event.target.value)}
                aria-controls="room-select"
                autoComplete="off"
              />
            </div>
            <label
              htmlFor="room-select"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              کلاس:
            </label>

            <select
              id="room-select"
              className="block w-full text-sm border border-gray-300 rounded-md p-2"
              value={selectionVisible ? (selectedRoomId ?? "") : ""}
              onChange={handleRoomChange}
              disabled={filteredRooms.length === 0}
            >
              <option value="" disabled>
                {rooms.length === 0
                  ? isLoading
                    ? "در حال بارگذاری..."
                    : "کلاسی در دسترس نیست"
                  : filteredRooms.length === 0
                    ? "کلاسی با این جستجو پیدا نشد"
                    : "از فهرست کلاس‌ها انتخاب کنید"}
              </option>
              {roomGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500" role="status">
              {rooms.length > 0 &&
                (roomQuery.trim()
                  ? `${filteredRooms.length.toLocaleString("fa-IR")} کلاس پیدا شد`
                  : `${rooms.length.toLocaleString("fa-IR")} کلاس در دسترس`)}
            </p>
          </div>

          <div className="mt-6">
            <ClassroomPlan
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              unavailableRoomId={unavailablePlanRoom?.id ?? null}
              onSelectRoom={(roomId) => {
                setRoomQuery("");
                selectRoom(roomId);
                showSchedule();
              }}
              onUnavailableRoom={(room) => {
                setUnavailableRoom({ room, search: searchParams.toString() });
                showSchedule();
              }}
            />
          </div>
        </div>

        <section
          id="room-schedule"
          ref={scheduleRef}
          className="scroll-mt-28"
          aria-labelledby="room-schedule-title"
          aria-busy={scheduleLoading && !unavailablePlanRoom}
          aria-live="polite"
        >
          <h2
            id="room-schedule-title"
            className="mb-4 text-center text-lg sm:text-2xl font-semibold text-gray-900"
          >
            {unavailablePlanRoom
              ? unavailablePlanRoom.number
                ? `برنامهٔ هفتگی کلاس ${unavailablePlanRoom.label}`
                : "کلاس با شماره نامشخص"
              : selectedRoom
                ? `برنامهٔ هفتگی کلاس ${selectedRoom.room}`
                : "برنامهٔ هفتگی کلاس"}
          </h2>

          {unavailablePlanRoom && (
            <div
              className="rounded-xl bg-white p-8 text-center text-gray-500"
              role="status"
            >
              {unavailablePlanRoom.number
                ? "برای این کلاس اطلاعات برنامه در سامانه موجود نیست."
                : "شمارهٔ این کلاس در نقشه مشخص نیست؛ کلاس مورد نظر را از فهرست انتخاب کنید."}
            </div>
          )}

          {!unavailablePlanRoom && scheduleLoading && (
            <div className="text-center py-10 text-gray-600">
              در حال بارگذاری اطلاعات...
            </div>
          )}

          {!unavailablePlanRoom && error && (
            <div className="text-center py-12 text-red-600" role="alert">
              خطا: {error}
            </div>
          )}

          {!unavailablePlanRoom &&
            !scheduleLoading &&
            !error &&
            roomSchedule.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                هیچ برنامه‌ای برای این کلاس یافت نشد.
              </div>
            )}
          {!unavailablePlanRoom &&
            !scheduleLoading &&
            !error &&
            roomSchedule.length > 0 && (
              <>
                <div className="mb-4 text-center flex gap-3 justify-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => downloadRoomScheduleExcel(roomSchedule)}
                  >
                    دانلود Excel
                  </button>

                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() =>
                      useRoomPdfExportStore
                        .getState()
                        .exportRoomPdf(roomSchedule)
                    }
                  >
                    دانلود PDF
                  </button>
                </div>

                <RoomWeeklyTableView roomSchedule={roomSchedule} />
              </>
            )}
        </section>
      </div>
    </div>
  );
};

export default RoomsPage;
