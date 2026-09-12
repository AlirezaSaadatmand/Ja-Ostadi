import { create } from "zustand";
import type { CourseResponse } from "../../types";

export const days = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"];

export const timeSlots = [
  { label: "8:00 - 10:00", key: "8-10", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10-12", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", key: "12_00-13_30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", key: "13_30-15_30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15_30-17_30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17_30-19_30", start: "17:30", end: "19:30" },
];

export interface TableCell {
  day: string;
  slotKey: string;
  course: CourseResponse | null;
}

interface ScheduleTableStore {
  scheduledCourseIds: number[];
  scheduledCourses: CourseResponse[];
  table: Record<string, TableCell>;
  isLoading: boolean;
  addCourseToSchedule: (course: CourseResponse) => string[];
  removeCourseFromSchedule: (courseId: number) => void;
  clearSchedule: () => void;
  loadCoursesFromIds: (allCourses: CourseResponse[]) => void;
}

const STORAGE_VERSION = 3;
const LOCAL_STORAGE_KEY = "weeklyScheduleV3";

const generateEmptyTable = () => {
  const table: Record<string, TableCell> = {};
  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      const key = `${day}-${slot.key}`;
      table[key] = { day, slotKey: slot.key, course: null };
    });
  });
  return table;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const findMatchingSlotKey = (start: string, end: string) => {
  const normalizedStart = start.padStart(5, "0");
  const normalizedEnd = end.padStart(5, "0");

  const exactMatch = timeSlots.find(
    (slot) => slot.start === normalizedStart && slot.end === normalizedEnd,
  );
  if (exactMatch) return exactMatch.key;

  const courseStart = timeToMinutes(normalizedStart);
  const courseEnd = timeToMinutes(normalizedEnd);

  const overlapMatch = timeSlots.find((slot) => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    return courseStart < slotEnd && courseEnd > slotStart;
  });

  return overlapMatch?.key;
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!serializedState) {
      const newState = {
        version: STORAGE_VERSION,
        scheduledCourseIds: [],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      return { scheduledCourseIds: [] };
    }

    const state = JSON.parse(serializedState);

    if (!state.version || state.version !== STORAGE_VERSION) {
      const newState = {
        version: STORAGE_VERSION,
        scheduledCourseIds: [],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      return { scheduledCourseIds: [] };
    }

    return { scheduledCourseIds: state.scheduledCourseIds || [] };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    const newState = {
      version: STORAGE_VERSION,
      scheduledCourseIds: [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    return { scheduledCourseIds: [] };
  }
};

const saveState = (scheduledCourseIds: number[]) => {
  try {
    const serializedState = JSON.stringify({
      version: STORAGE_VERSION,
      scheduledCourseIds,
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

const buildTableFromCourses = (courses: CourseResponse[]) => {
  const table = generateEmptyTable();

  for (const course of courses) {
    for (const t of course.time) {
      const slotKey = findMatchingSlotKey(t.start_time, t.end_time);
      if (slotKey) {
        const key = `${t.day}-${slotKey}`;
        if (table[key]) {
          table[key] = { ...table[key], course };
        }
      }
    }
  }

  return table;
};

export const useScheduleTableStore = create<ScheduleTableStore>((set, get) => {
  const { scheduledCourseIds: loadedIds } = loadState();

  return {
    scheduledCourseIds: loadedIds,
    scheduledCourses: [],
    table: generateEmptyTable(),
    isLoading: true,

    loadCoursesFromIds: (allCourses: CourseResponse[]) => {
      const { scheduledCourseIds } = get();
      const validCourses: CourseResponse[] = [];
      const validIds: number[] = [];
      const invalidIds: number[] = [];

      for (const id of scheduledCourseIds) {
        const course = allCourses.find((c) => c.course.id === id);
        if (course) {
          validCourses.push(course);
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      }

      if (invalidIds.length > 0) {
        console.warn(
          `Removing invalid course IDs from storage: ${invalidIds.join(", ")}`,
        );
        saveState(validIds);
      }

      const table = buildTableFromCourses(validCourses);

      set({
        scheduledCourses: validCourses,
        scheduledCourseIds: validIds,
        table,
        isLoading: false,
      });
    },

    addCourseToSchedule: (course) => {
      const { scheduledCourses, scheduledCourseIds, table } = get();
      const conflicts: string[] = [];

      for (const t of course.time) {
        const slotKey = findMatchingSlotKey(t.start_time, t.end_time);
        const key = `${t.day}-${slotKey}`;

        if (!slotKey || !table[key]) {
          console.warn(
            `Could not find slot key for time: ${t.start_time}-${t.end_time} on ${t.day}`,
          );
          return [`Invalid slot: ${t.day} ${t.start_time}-${t.end_time}`];
        }

        if (table[key].course) {
          conflicts.push(table[key].course.course.name);
        }
      }

      if (conflicts.length > 0) {
        console.warn(`Conflict detected with: ${conflicts.join(", ")}`);
        return conflicts;
      }

      const newTable = { ...table };
      for (const t of course.time) {
        const slotKey = findMatchingSlotKey(t.start_time, t.end_time);
        if (slotKey) {
          const key = `${t.day}-${slotKey}`;
          newTable[key] = { ...newTable[key], course };
        }
      }

      const newScheduledCourses = [...scheduledCourses, course];
      const newScheduledCourseIds = [...scheduledCourseIds, course.course.id];

      set({
        scheduledCourses: newScheduledCourses,
        scheduledCourseIds: newScheduledCourseIds,
        table: newTable,
      });

      saveState(newScheduledCourseIds);
      return [];
    },

    removeCourseFromSchedule: (courseId) => {
      const { scheduledCourses, scheduledCourseIds, table } = get();
      const updatedCourses = scheduledCourses.filter(
        (c) => c.course.id !== courseId,
      );
      const updatedIds = scheduledCourseIds.filter((id) => id !== courseId);

      const newTable = { ...table };
      Object.keys(newTable).forEach((key) => {
        if (newTable[key].course?.course.id === courseId) {
          newTable[key] = { ...newTable[key], course: null };
        }
      });

      set({
        scheduledCourses: updatedCourses,
        scheduledCourseIds: updatedIds,
        table: newTable,
      });

      saveState(updatedIds);
    },

    clearSchedule: () => {
      set({
        scheduledCourses: [],
        scheduledCourseIds: [],
        table: generateEmptyTable(),
      });
      saveState([]);
    },
  };
});
