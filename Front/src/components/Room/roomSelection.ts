import type { RoomItem } from "../../types";
import {
  ROOM_DATA,
  matchPlanRoom,
  normalizeRoomName,
} from "./classroomPlanModel";

export interface RoomOptionGroup {
  label: string;
  rooms: RoomItem[];
}

const GROUP_LABELS = [
  "ساختمان مهندسی",
  "ساختمان علوم پایه",
  "آزمایشگاه‌ها",
  "کارگاه‌ها",
  "سالن‌ها و سایر فضاها",
];

const searchTerm = (value: string) =>
  normalizeRoomName(value).replace(/[\s()[\]]/g, "");
const roomNameOrder = new Intl.Collator("fa", { numeric: true });

export function getRoomOptionGroups(
  rooms: RoomItem[],
  query: string,
): RoomOptionGroup[] {
  const engineeringRoomIds = new Set<number>();
  for (const planRoom of ROOM_DATA) {
    const room = matchPlanRoom(planRoom, rooms);
    if (room) engineeringRoomIds.add(room.id);
  }

  const groups = GROUP_LABELS.map((label) => ({
    label,
    rooms: [] as RoomItem[],
  }));
  const term = searchTerm(query);

  for (const room of rooms) {
    const name = normalizeRoomName(room.room);
    let groupIndex = 4;
    if (engineeringRoomIds.has(room.id) || /^2\d{2}\s*(الف|ب)?$/.test(name))
      groupIndex = 0;
    else if (name.includes("علوم پایه")) groupIndex = 1;
    else if (name.includes("آزمایشگاه")) groupIndex = 2;
    else if (name.includes("کارگاه")) groupIndex = 3;

    const group = groups[groupIndex];
    if (
      !term ||
      searchTerm(room.room).includes(term) ||
      searchTerm(group.label).includes(term)
    ) {
      group.rooms.push(room);
    }
  }

  return groups
    .filter((group) => group.rooms.length > 0)
    .map((group) => ({
      ...group,
      rooms: group.rooms.sort((a, b) =>
        roomNameOrder.compare(
          normalizeRoomName(a.room),
          normalizeRoomName(b.room),
        ),
      ),
    }));
}
