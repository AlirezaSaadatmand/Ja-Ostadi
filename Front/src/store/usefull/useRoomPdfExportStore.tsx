import { create } from "zustand"
import html2pdf from "html2pdf.js"
import toast from "react-hot-toast"
import { createRoot, type Root } from "react-dom/client"
import RoomPdfDocument from "../../components/Room/RoomPdfDocument"
import type { RoomScheduleCourse } from "../../types"

interface RoomPdfExportStore {
  isExporting: boolean
  exportRoomPdf: (roomSchedule: RoomScheduleCourse[]) => Promise<void>
}

export const useRoomPdfExportStore = create<RoomPdfExportStore>((set) => ({
  isExporting: false,

  exportRoomPdf: async (roomSchedule) => {
    set({ isExporting: true })
    toast.loading("در حال تولید PDF...", { id: "room-pdf-toast" })

    let div: HTMLDivElement | null = null
    let root: Root | null = null

    try {
      div = document.createElement("div")
      div.style.width = "100%"
      div.style.overflow = "visible"
      div.style.direction = "rtl"
      div.style.backgroundColor = "#fff"
      div.style.display = "flex"
      div.style.flexDirection = "column"
      div.style.alignItems = "center"
      div.style.padding = "30px"

      document.body.appendChild(div)

      root = createRoot(div)
      root.render(<RoomPdfDocument schedule={roomSchedule} />)

      await new Promise((resolve) => setTimeout(resolve, 120))

      const pdfOptions = {
        filename: "برنامه_اتاق.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          foreignObjectRendering: true,
          backgroundColor: "#fff",
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: "pt", format: [1920, 1080], orientation: "landscape" }
      }

      await html2pdf().set(pdfOptions).from(div).save()
      toast.success("PDF با موفقیت ایجاد شد.", { id: "room-pdf-toast" })

    } catch (e) {
      console.error(e)
      toast.error("خطا در ساخت PDF", { id: "room-pdf-toast" })
    } finally {
      root?.unmount()
      div?.remove()
      set({ isExporting: false })
    }
  }
}))
