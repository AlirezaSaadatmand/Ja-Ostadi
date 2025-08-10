import { create } from "zustand"
import html2pdf from "html2pdf.js"
import toast from "react-hot-toast"
import { createRoot } from "react-dom/client"
import PdfDocument from "../../components/PdfDocument"
import type { CourseResponse } from "../../types"
import type { TableCell } from "../schedule/useScheduleTableStore"

interface PdfExportData {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
  days: string[]
  timeSlots: { label: string; key: string; start: string; end: string }[]
}

interface PdfExportStore {
  isExporting: boolean
  exportPdf: (data: PdfExportData) => Promise<void>
}

export const usePdfExportStore = create<PdfExportStore>((set) => ({
  isExporting: false,

  exportPdf: async (data) => {
    set({ isExporting: true })
    toast.loading("در حال تولید PDF...", { id: "pdf-export-toast" })

    let tempDiv: HTMLDivElement | null = null
    let root: ReturnType<typeof createRoot> | null = null

    try {
      tempDiv = document.createElement("div")
      tempDiv.style.width = "100%"
      tempDiv.style.overflow = "visible"
      tempDiv.style.direction = "rtl"
      tempDiv.style.backgroundColor = "#fff"

      document.body.appendChild(tempDiv)

      root = createRoot(tempDiv)
      root.render(<PdfDocument {...data} />)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const opt = {
        margin: 20,
        filename: "برنامه_هفتگی.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          foreignObjectRendering: true,
          backgroundColor: "#fff",
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: "pt", format: [1920, 1080], orientation: "landscape" },
      }

      await html2pdf().set(opt).from(tempDiv).save()

      toast.success("برنامه هفتگی با موفقیت به PDF تبدیل شد.", { id: "pdf-export-toast" })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("خطا در تولید فایل PDF", { id: "pdf-export-toast" })
    } finally {
      if (root) {
        root.unmount()
      }
      if (tempDiv && tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv)
      }
      set({ isExporting: false })
    }
  },
}))
