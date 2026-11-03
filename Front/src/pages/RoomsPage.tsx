import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../components/common/PageShell";
import { useRoomStore } from "../store/usefull/useRoomScheduleStore";
import RoomWeeklyTableView from "../components/Room/RoomWeeklyTableView";
import { downloadRoomScheduleExcel } from "../components/Room/DownloadRoomScheduleExcel";
import { useRoomPdfExportStore } from "../store/usefull/useRoomPdfExportStore";

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    rooms,
    roomSchedule,
    isLoading,
    error,
    fetchRooms,
    fetchRoomSchedule,
  } = useRoomStore();

  const selectedRoomId = searchParams.get("roomId");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      const firstRoom = rooms[0].id.toString();
      setSearchParams({ roomId: firstRoom });
      fetchRoomSchedule(firstRoom);
    }
  }, [rooms, selectedRoomId, setSearchParams, fetchRoomSchedule]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchRoomSchedule(selectedRoomId);
    }
  }, [selectedRoomId, fetchRoomSchedule]);

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSearchParams({ roomId: newId });
  };

  return (
    <PageShell
      title="برنامه کلاس‌ها"
      subtitle="نمایش برنامه کلاسی بر اساس کلاس"
    >
      <div>
        <div className="mb-6 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur animate-fade-up sm:p-6">
          <div className="w-full sm:w-1/2 mx-auto">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              انتخاب کلاس
            </label>

            <select
              className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
          <div className="text-center py-12 text-red-600">خطا: {error}</div>
        )}

        {!isLoading && !error && roomSchedule.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            هیچ برنامه‌ای برای این کلاس یافت نشد.
          </div>
        )}
        {!isLoading && !error && roomSchedule.length > 0 && (
          <>
            <div className="mb-4 text-center flex gap-3 justify-center">
              <button
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark"
                onClick={() => downloadRoomScheduleExcel(roomSchedule)}
              >
                دانلود Excel
              </button>

              <button
                className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-900"
                onClick={() =>
                  useRoomPdfExportStore.getState().exportRoomPdf(roomSchedule)
                }
              >
                دانلود PDF
              </button>
            </div>

            <RoomWeeklyTableView roomSchedule={roomSchedule} />
          </>
        )}
      </div>
    </PageShell>
  );
};

export default RoomsPage;
