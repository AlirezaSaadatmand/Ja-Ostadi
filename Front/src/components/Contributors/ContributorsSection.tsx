"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useContributorsStore } from "../../store/common/useContributorsStore"
import config from "../../config/config"
import { Github, Users, ExternalLink, X } from "lucide-react"

const ContributorsSection: React.FC = () => {
  const { contributors, isLoading, error, fetchContributors } = useContributorsStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    fetchContributors()
  }, [fetchContributors])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    if (!isSmallScreen) {
      setIsExpanded(false)
    }
  }, [isSmallScreen])

  const ContributorsList = () => (
    <div
      className={`
        flex justify-center gap-2 
        overflow-x-auto sm:overflow-x-hidden 
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2
        flex-wrap sm:flex-nowrap 
      `}
    >
      {contributors.map((contributor) => (
        <div
          key={contributor.id}
          className="flex flex-col items-center group flex-shrink-0 w-14 sm:w-14"
        >
          <a
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform duration-200 group-hover:scale-110"
          >
            <img
              src={contributor.avatar_url || "/placeholder.svg"}
              alt={contributor.login}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 group-hover:border-indigo-400 transition-all duration-200 shadow-sm group-hover:shadow-md mx-auto"
            />
          </a>
          <span
            className="text-[10px] text-gray-600 mt-1 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 text-center w-full overflow-hidden"
          >
            {contributor.login.length > 9
              ? "..." + contributor.login.slice(0, 9)
              : contributor.login}
          </span>
        </div>
      ))}
    </div>
  )

  if (isSmallScreen && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        aria-label="مشاهده مشارکت‌کنندگان"
      >
        <Users className="w-5 h-5" />
      </button>
    )
  }

  if (isSmallScreen && isExpanded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 text-center max-w-sm w-full relative">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="flex justify-center gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <>
              <Github className="cursor-pointer w-8 h-8 text-gray-400 mx-auto mb-3" />
              <a
                href={config.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex  items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Github className="cursor-pointer w-4 h-4 ml-2" />
                مشاهده پروژه
                <ExternalLink className="w-4 h-4 mr-2" />
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-indigo-600 ml-2" />
                <h3 className="text-base font-bold text-gray-900">مشارکت‌کنندگان</h3>
              </div>

              {contributors.length === 0 ? (
                <div className="text-center py-6">
                  <Github className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">یافت نشد</p>
                </div>
              ) : (
                <ContributorsList />
              )}

              <div className="pt-4 border-t border-gray-200">
                <a
                  href={config.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Github className="w-4 h-4 ml-2" />
                  مشاهده پروژه
                  <ExternalLink className="w-4 h-4 mr-2" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 text-center min-w-[200px] sm:min-w-[280px]">
        <div className="animate-pulse">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mx-auto mb-3 sm:mb-4"></div>
          <div className="flex justify-center gap-2 sm:gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 text-center min-w-[200px] sm:min-w-[280px]">
        <Github className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 sm:mb-3" />
        <a
          href={config.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Github className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          مشاهده پروژه
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 text-center min-w-[200px] sm:min-w-[280px] border border-gray-100">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 ml-1 sm:ml-2" />
        <h3 className="text-sm sm:text-base font-bold text-gray-900">مشارکت‌کنندگان</h3>
      </div>

      {contributors.length === 0 ? (
        <div className="text-center py-4 sm:py-6">
          <Github className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm text-gray-500">یافت نشد</p>
        </div>
      ) : (
        <ContributorsList />
      )}

      <div className="pt-3 sm:pt-4 border-t border-gray-200">
        <a
          href={config.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Github className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          مشاهده پروژه
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        </a>
      </div>
    </div>
  )
}

export default ContributorsSection
