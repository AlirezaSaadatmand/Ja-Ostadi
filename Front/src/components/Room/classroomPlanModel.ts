import type { RoomItem } from "../../types";

export interface PlanRoom {
  id: string;
  number: string | null;
  label: string;
  block: "A" | "B" | "C";
  capacity: number | null;
  highlighted: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  side: "top" | "bottom";
}

export const ROOM_DATA: PlanRoom[] = [
  {
    id: "C-220",
    number: "220",
    label: "۲۲۰",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -322,
    y: -58,
    w: 59,
    h: 46,
    side: "top",
  },
  {
    id: "C-218",
    number: "218",
    label: "۲۱۸",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -263,
    y: -58,
    w: 59,
    h: 46,
    side: "top",
  },
  {
    id: "C-216",
    number: "216",
    label: "۲۱۶",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -136,
    y: -58,
    w: 59,
    h: 46,
    side: "top",
  },
  {
    id: "C-215",
    number: "215",
    label: "۲۱۵",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -303,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
  {
    id: "C-213",
    number: "213",
    label: "۲۱۳",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -244,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
  {
    id: "C-211",
    number: "211",
    label: "۲۱۱",
    block: "C",
    capacity: 28,
    highlighted: true,
    x: -114,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
  {
    id: "B-214",
    number: "214",
    label: "۲۱۴",
    block: "B",
    capacity: 28,
    highlighted: true,
    x: 367,
    y: 142,
    w: 58,
    h: 48,
    side: "top",
  },
  {
    id: "B-212",
    number: "212",
    label: "۲۱۲",
    block: "B",
    capacity: 28,
    highlighted: true,
    x: 425,
    y: 142,
    w: 58,
    h: 48,
    side: "top",
  },
  {
    id: "B-210",
    number: "210",
    label: "۲۱۰",
    block: "B",
    capacity: 28,
    highlighted: true,
    x: 569,
    y: 142,
    w: 58,
    h: 48,
    side: "top",
  },
  {
    id: "B-208",
    number: "208",
    label: "۲۰۸",
    block: "B",
    capacity: 28,
    highlighted: true,
    x: 627,
    y: 142,
    w: 58,
    h: 48,
    side: "top",
  },
  {
    id: "B-209-b",
    number: "209 (B)",
    label: "۲۰۹ (ب)",
    block: "B",
    capacity: 28,
    highlighted: true,
    x: 392,
    y: 212,
    w: 58,
    h: 46,
    side: "bottom",
  },
  {
    id: "B-209-a",
    number: "209 (A)",
    label: "۲۰۹ (الف)",
    block: "B",
    capacity: 18,
    highlighted: true,
    x: 450,
    y: 212,
    w: 47,
    h: 46,
    side: "bottom",
  },
  {
    id: "B-207",
    number: "207",
    label: "۲۰۷",
    block: "B",
    capacity: 40,
    highlighted: true,
    x: 588,
    y: 212,
    w: 90,
    h: 46,
    side: "bottom",
  },
  {
    id: "A-206",
    number: "206",
    label: "۲۰۶",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 77,
    y: -58,
    w: 64,
    h: 46,
    side: "top",
  },
  {
    id: "A-204",
    number: "204",
    label: "۲۰۴",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 203,
    y: -58,
    w: 59,
    h: 46,
    side: "top",
  },
  {
    id: "A-unmarked",
    number: null,
    label: "نامشخص",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 262,
    y: -58,
    w: 59,
    h: 46,
    side: "top",
  },
  {
    id: "A-205",
    number: "205",
    label: "۲۰۵",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 55,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
  {
    id: "A-203",
    number: "203",
    label: "۲۰۳",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 185,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
  {
    id: "A-201",
    number: "201",
    label: "۲۰۱",
    block: "A",
    capacity: null,
    highlighted: false,
    x: 244,
    y: 12,
    w: 59,
    h: 46,
    side: "bottom",
  },
];

export function normalizeRoomName(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200d]/g, " ")
    .toLowerCase()
    .trim();
}

function roomIdentity(value: string) {
  const normalized = normalizeRoomName(value)
    .replace(
      /^(?:(?:کلاس|اتاق)(?:\s*شماره)?|(?:classroom|room)(?:\s*(?:number|no\.?))?)\s*[:-]?\s*/,
      "",
    )
    .replace(/[()[\]]/g, "")
    .trim();
  const match = normalized.match(/^(\d+)\s*(الف|ب|a|b)?$/);
  if (!match) return undefined;

  return {
    number: match[1].replace(/^0+(?=\d)/, ""),
    section: match[2] === "الف" ? "a" : match[2] === "ب" ? "b" : match[2],
  };
}

/** Resolve map labels to database records without guessing their numeric IDs. */
export function matchPlanRoom(
  planRoom: PlanRoom,
  rooms: RoomItem[],
): RoomItem | undefined {
  if (!planRoom.number) return undefined;
  const planIdentity = roomIdentity(planRoom.number);
  if (!planIdentity) return undefined;

  const candidates = rooms.flatMap((room) => {
    const identity = roomIdentity(room.room);
    return identity?.number === planIdentity.number ? [{ room, identity }] : [];
  });
  const exactMatches = candidates.filter(
    ({ identity }) => identity.section === planIdentity.section,
  );
  if (exactMatches.length === 1) return exactMatches[0].room;
  if (exactMatches.length > 1 || planIdentity.section) return undefined;

  // The source plan calls this room 207, while the schedule calls it 207 الف.
  // Accept a single section only; ambiguous split rooms need an explicit label.
  return candidates.length === 1 ? candidates[0].room : undefined;
}
