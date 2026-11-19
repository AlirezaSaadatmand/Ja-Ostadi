import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import type { RoomItem } from "../../types";
import { ROOM_DATA, matchPlanRoom } from "./classroomPlanModel";
import type { PlanRoom } from "./classroomPlanModel";
import "./ClassroomPlan.css";

interface Props {
  rooms: RoomItem[];
  selectedRoomId: string | null;
  unavailableRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onUnavailableRoom: (room: PlanRoom) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Camera extends Point {
  scale: number;
}

interface Drag {
  id: number;
  point: Point;
  client: Point;
  camera: Camera;
  moved: boolean;
}

const INITIAL_CAMERA: Camera = { x: 0, y: 0, scale: 1 };
const CENTER: Point = { x: 550, y: 310 };

const zoomAt = (camera: Camera, factor: number, anchor: Point): Camera => {
  const scale = Math.min(3.5, Math.max(0.8, camera.scale * factor));
  const ratio = scale / camera.scale;
  return {
    x: anchor.x - (anchor.x - camera.x) * ratio,
    y: anchor.y - (anchor.y - camera.y) * ratio,
    scale,
  };
};

const svgPoint = (svg: SVGSVGElement, client: Point): Point => {
  const matrix = svg.getScreenCTM();
  if (!matrix) return client;
  const point = svg.createSVGPoint();
  point.x = client.x;
  point.y = client.y;
  return point.matrixTransform(matrix.inverse());
};

const SERVICES: Record<string, [number, number, number, number][]> = {
  C: [
    [-204, -58, 34, 46],
    [-170, -58, 34, 46],
    [-77, -58, 30, 46],
    [-47, -58, 63, 46],
    [-185, 12, 35, 46],
    [-150, 12, 36, 46],
    [-55, 12, 30, 46],
  ],
  A: [
    [-16, -58, 63, 46],
    [47, -58, 30, 46],
    [141, -58, 34, 46],
    [175, -58, 28, 46],
    [25, 12, 30, 46],
    [114, 12, 36, 46],
    [150, 12, 35, 46],
  ],
  B: [
    [338, 142, 29, 48],
    [483, 142, 32, 48],
    [537, 142, 32, 48],
    [685, 142, 56, 48],
    [365, 212, 27, 46],
    [497, 212, 34, 46],
    [554, 212, 34, 46],
    [678, 212, 55, 46],
  ],
};

const Services = ({ block, clipId }: { block: string; clipId?: string }) => (
  <g clipPath={clipId ? `url(#${clipId})` : undefined} aria-hidden="true">
    {SERVICES[block].map(([x, y, width, height]) => {
      const doorY = y < 0 || (block === "B" && y < 200) ? y + height : y;
      return (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            className="service-floor"
          />
          <path
            d={`M${x + width / 2 - 5} ${doorY}h10`}
            stroke="#fafcf5"
            strokeWidth="2"
          />
        </g>
      );
    })}
  </g>
);

const Stairs = ({ center = false }: { center?: boolean }) => (
  <g className="stairs" aria-hidden="true">
    <rect
      x={center ? -24 : -23}
      y={center ? -40 : -45}
      width={center ? 48 : 46}
      height={center ? 40 : 45}
    />
    <path
      d={
        center ? "M-15 0V-30H15V0M-7 0V-22H7V0" : "M-14 0V-35H14V0M-7 0V-26H7V0"
      }
      fill="none"
    />
    {[-28, -24, -20, -16, -12, -8, -4].map((y) => (
      <path key={y} d={`M-23 ${y}h9m28 0h9`} className="stair-line" />
    ))}
    <path d="M-14 -35h28m-28 4h28" className="stair-line" />
  </g>
);

const ClassroomPlan = ({
  rooms,
  selectedRoomId,
  unavailableRoomId,
  onSelectRoom,
  onUnavailableRoom,
}: Props) => {
  const clipPrefix = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const [dragging, setDragging] = useState(false);
  const cameraRef = useRef(INITIAL_CAMERA);
  const drag = useRef<Drag | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{
    distance: number;
    camera: Camera;
    anchor: Point;
  } | null>(null);
  const suppressClick = useRef(false);

  const updateCamera = useCallback((next: Camera) => {
    cameraRef.current = next;
    setCamera(next);
  }, []);

  const zoom = (factor: number) =>
    updateCamera(zoomAt(cameraRef.current, factor, CENTER));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? svg.clientHeight
            : 1);
      updateCamera(
        zoomAt(
          cameraRef.current,
          Math.exp(-delta * 0.0015),
          svgPoint(svg, { x: event.clientX, y: event.clientY }),
        ),
      );
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [updateCamera]);

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    const client = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, client);
    suppressClick.current = false;
    const entries = Array.from(pointers.current.values());
    if (entries.length === 2) {
      pinch.current = {
        distance: Math.hypot(
          entries[0].x - entries[1].x,
          entries[0].y - entries[1].y,
        ),
        camera: { ...cameraRef.current },
        anchor: svgPoint(event.currentTarget, {
          x: (entries[0].x + entries[1].x) / 2,
          y: (entries[0].y + entries[1].y) / 2,
        }),
      };
      drag.current = null;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    } else if (entries.length === 1) {
      drag.current = {
        id: event.pointerId,
        point: svgPoint(event.currentTarget, client),
        client,
        camera: { ...cameraRef.current },
        moved: false,
      };
    } else {
      suppressClick.current = true;
    }
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const client = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, client);
    const entries = Array.from(pointers.current.values());
    if (pinch.current && entries.length === 2) {
      const midpoint = svgPoint(event.currentTarget, {
        x: (entries[0].x + entries[1].x) / 2,
        y: (entries[0].y + entries[1].y) / 2,
      });
      const distance = Math.hypot(
        entries[0].x - entries[1].x,
        entries[0].y - entries[1].y,
      );
      const next = zoomAt(
        pinch.current.camera,
        distance / Math.max(1, pinch.current.distance),
        pinch.current.anchor,
      );
      next.x += midpoint.x - pinch.current.anchor.x;
      next.y += midpoint.y - pinch.current.anchor.y;
      suppressClick.current = true;
      updateCamera(next);
      return;
    }
    const currentDrag = drag.current;
    if (!currentDrag || currentDrag.id !== event.pointerId) return;
    if (
      !currentDrag.moved &&
      Math.hypot(
        client.x - currentDrag.client.x,
        client.y - currentDrag.client.y,
      ) > 5
    ) {
      currentDrag.moved = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (currentDrag.moved) {
      const point = svgPoint(event.currentTarget, client);
      updateCamera({
        x: currentDrag.camera.x + point.x - currentDrag.point.x,
        y: currentDrag.camera.y + point.y - currentDrag.point.y,
        scale: currentDrag.camera.scale,
      });
    }
  };

  const endPointer = (event: PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (pinch.current) {
      pinch.current = null;
      suppressClick.current = true;
      const remaining = Array.from(pointers.current.entries())[0];
      drag.current = remaining
        ? {
            id: remaining[0],
            point: svgPoint(event.currentTarget, remaining[1]),
            client: remaining[1],
            camera: { ...cameraRef.current },
            moved: true,
          }
        : null;
    } else if (drag.current?.id === event.pointerId) {
      drag.current = null;
    }
    if (!pointers.current.size) setDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoom(1.2);
    }
    if (event.key === "-") {
      event.preventDefault();
      zoom(1 / 1.2);
    }
    if (event.key === "Home" || event.key === "0") {
      event.preventDefault();
      updateCamera(INITIAL_CAMERA);
    }
    const offsets: Record<string, [number, number]> = {
      ArrowLeft: [35, 0],
      ArrowRight: [-35, 0],
      ArrowUp: [0, 35],
      ArrowDown: [0, -35],
    };
    if (offsets[event.key]) {
      event.preventDefault();
      updateCamera({
        ...cameraRef.current,
        x: cameraRef.current.x + offsets[event.key][0],
        y: cameraRef.current.y + offsets[event.key][1],
      });
    }
  };

  const renderRooms = (block: string) =>
    ROOM_DATA.filter((room) => room.block === block).map((room) => {
      const match = matchPlanRoom(room, rooms);
      const selected = unavailableRoomId
        ? room.id === unavailableRoomId
        : !!match && match.id.toString() === selectedRoomId;
      const select = () => {
        if (rooms.length === 0) return;
        if (match) onSelectRoom(match.id.toString());
        else onUnavailableRoom(room);
      };
      const doorX = room.x + room.w - 13;
      const doorY = room.side === "top" ? room.y + room.h : room.y;
      const sign = room.side === "top" ? -1 : 1;
      return (
        <g
          key={room.id}
          className={`room${selected ? " selected" : ""}${match ? "" : " unavailable"}`}
          data-room-id={room.id}
          role="button"
          tabIndex={rooms.length ? 0 : -1}
          aria-disabled={rooms.length === 0}
          aria-pressed={selected}
          aria-controls="room-schedule"
          aria-label={
            room.number
              ? `نمایش برنامه کلاس ${room.label}`
              : "کلاس با شماره نامشخص"
          }
          onClick={() => {
            if (!suppressClick.current) select();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              select();
            }
          }}
        >
          <title>
            {room.number
              ? `کلاس ${room.label}${rooms.length && !match ? "؛ برنامه‌ای در سامانه ثبت نشده است" : ""}`
              : "شماره کلاس نامشخص است"}
          </title>
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            className="room-floor"
          />
          {room.number && (
            <text
              x={room.x + room.w / 2}
              y={room.y + room.h / 2}
              className="room-number"
              lang="fa"
              direction="rtl"
              style={room.label.includes(" ") ? { fontSize: 11 } : undefined}
            >
              {room.label}
            </text>
          )}
          <path
            d={`M${doorX} ${doorY}v${sign * 9}a9 9 0 0 ${sign < 0 ? 1 : 0} 9 ${-sign * 9}`}
            className="door"
          />
        </g>
      );
    });

  return (
    <section className="classroom-plan" aria-labelledby={`${clipPrefix}-title`}>
      <h3 id={`${clipPrefix}-title`} className="map-heading">
        طبقه ۲ ساختمان مهندسی
      </h3>
      <div className="map-stage">
        <svg
          ref={svgRef}
          className={`floor-plan${dragging ? " dragging" : ""}`}
          viewBox="0 0 1100 620"
          tabIndex={0}
          aria-label="نقشه کلاس‌ها؛ برای انتخاب روی کلاس کلیک کنید یا Enter بزنید. نقشه را بکشید و برای بزرگ‌نمایی از دکمه‌ها استفاده کنید."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointer}
          onPointerCancel={(event) => {
            suppressClick.current = true;
            endPointer(event);
          }}
          onPointerLeave={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId))
              endPointer(event);
          }}
          onKeyDown={handleKeyDown}
        >
          <defs>
            <clipPath id={`${clipPrefix}-left`}>
              <polygon points="-330,-60 23.64,-60 -23.64,60 -330,60" />
            </clipPath>
            <clipPath id={`${clipPrefix}-right`}>
              <polygon points="-23.64,-60 330,-60 330,60 23.64,60" />
            </clipPath>
          </defs>
          <g
            transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}
          >
            <path
              className="plan-outline"
              d="M57.73 381.18 316.37 140 783.63 140 1042.27 381.18 960.43 468.94 736.37 260 363.63 260 139.57 468.94Z"
            />
            <path
              className="corridor-line"
              d="M99 425 340 200 760 200 1001 425"
            />
            <g transform="translate(340 200) rotate(-43)">
              <Services block="C" clipId={`${clipPrefix}-left`} />
              {renderRooms("C")}
              <g transform="translate(-173 -60)">
                <Stairs />
              </g>
              <rect
                x="-367"
                y="-20"
                width="37"
                height="40"
                className="service-floor"
              />
              <path d="M-225 60v13h25V60" className="stairs" fill="none" />
              <path d="M-227 63h29m-29 4h29m-29 4h29" className="stair-line" />
            </g>
            <g transform="translate(760 200) rotate(43)">
              <Services block="A" clipId={`${clipPrefix}-right`} />
              {renderRooms("A")}
              <g transform="translate(173 -60)">
                <Stairs />
              </g>
              <rect
                x="330"
                y="-20"
                width="37"
                height="40"
                className="service-floor"
              />
              <path d="M200 60v13h25V60" className="stairs" fill="none" />
              <path d="M198 63h29m-29 4h29m-29 4h29" className="stair-line" />
            </g>
            <Services block="B" />
            {renderRooms("B")}
            <g transform="translate(526 140)">
              <Stairs center />
            </g>
            <path d="M514 260v14h25v-14" className="stairs" fill="none" />
            <path d="M511 264h31m-31 4h31m-31 4h31" className="stair-line" />
            <path d="M519 425h62" stroke="#c3cdb8" strokeWidth="1" />
          </g>
        </svg>
        <div className="map-controls" aria-label="کنترل نقشه" dir="ltr">
          <button
            type="button"
            aria-label="کوچک‌نمایی"
            onClick={() => zoom(1 / 1.2)}
            disabled={camera.scale <= 0.8}
          >
            <Minus />
          </button>
          <button
            type="button"
            aria-label="بزرگ‌نمایی"
            onClick={() => zoom(1.2)}
            disabled={camera.scale >= 3.5}
          >
            <Plus />
          </button>
          <button
            type="button"
            aria-label="بازنشانی نقشه"
            onClick={() => updateCamera(INITIAL_CAMERA)}
          >
            <Maximize />
          </button>
        </div>
      </div>
      <div className="map-caption">
        <p>روی کلاس کلیک کنید تا برنامهٔ هفتگی آن در پایین نمایش داده شود.</p>
        <div className="map-legend">
          <span>
            <i className="available-key" />
            کلاس ثبت‌شده
          </span>
          <span>
            <i className="selected-key" />
            کلاس انتخاب‌شده
          </span>
          <span>
            <i className="unavailable-key" />
            بدون اطلاعات
          </span>
        </div>
      </div>
    </section>
  );
};

export default ClassroomPlan;
