"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useMockExamExists } from "@/lib/hooks"

// 학년 코드 변환 (고1 -> H1)
const gradeToCode = (grade: string): string => {
  const mapping: Record<string, string> = {
    "고1": "H1",
    "고2": "H2",
    "고3": "H3",
  }
  return mapping[grade] || grade
}

// 월 문자열에서 숫자 추출 (3월 -> 3)
const monthToNumber = (month: string): number => {
  return parseInt(month.replace("월", ""), 10)
}

export default function MockExamInputPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  
  // API 훅 사용
  const { exists, mockExam, loading: checkLoading, error: checkError, check } = useMockExamExists()

  const years = ["2025", "2024", "2023", "2022", "2021"]
  const grades = ["고1", "고2", "고3"]
  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월"]

  // 선택 변경시 모의고사 존재 여부 확인
  useEffect(() => {
    if (selectedYear && selectedGrade && selectedMonth) {
      const year = parseInt(selectedYear, 10)
      const grade = gradeToCode(selectedGrade)
      const month = monthToNumber(selectedMonth)
      check(year, grade, month)
    }
  }, [selectedYear, selectedGrade, selectedMonth, check])

  const handleScoreInput = () => {
    if (!selectedYear || !selectedGrade || !selectedMonth) {
      alert("연도, 학년, 시행 월을 모두 선택해주세요.")
      return
    }

    const params = new URLSearchParams({
      year: selectedYear,
      grade: selectedGrade,
      month: selectedMonth,
      ...(mockExam?.id && { mockExamId: String(mockExam.id) }),
    })

    router.push(`/mock-analysis/input/score?${params.toString()}`)
  }

  const handleAnswerInput = () => {
    if (!selectedYear || !selectedGrade || !selectedMonth) {
      alert("연도, 학년, 시행 월을 모두 선택해주세요.")
      return
    }

    const params = new URLSearchParams({
      year: selectedYear,
      grade: selectedGrade,
      month: selectedMonth,
      ...(mockExam?.id && { mockExamId: String(mockExam.id) }),
    })

    router.push(`/mock-analysis/input/form?${params.toString()}`)
  }

  const isSelectionComplete = selectedYear && selectedGrade && selectedMonth

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>홈</span>
            <span>›</span>
            <span>모의고사</span>
            <span>›</span>
            <span className="text-[#7b1e7a]">모의고사 입력</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">모의고사 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Mock Exam Input Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              모의고사 입력
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Year Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none"
                  >
                    <option value="">연도</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none"
                  >
                    <option value="">학년</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시행 월</label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none"
                  >
                    <option value="">시행 월</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 모의고사 존재 여부 표시 */}
            {isSelectionComplete && (
              <div className="mt-4 p-4 rounded-lg border">
                {checkLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>모의고사 정보 확인 중...</span>
                  </div>
                ) : checkError ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <XCircle className="w-5 h-5" />
                    <span>서버 연결을 확인해주세요. (오프라인 모드로 진행 가능)</span>
                  </div>
                ) : exists && mockExam ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>
                      <strong>{mockExam.name}</strong> 모의고사가 등록되어 있습니다.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <XCircle className="w-5 h-5" />
                    <span>해당 모의고사 정보가 없습니다. 점수 입력은 가능합니다.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-200 mb-8" />

          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
              <button
                onClick={handleScoreInput}
                disabled={!isSelectionComplete}
                className="flex-1 bg-[#7b1e7a] hover:bg-[#5a1559] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                점수입력
              </button>
              <button
                onClick={handleAnswerInput}
                disabled={!isSelectionComplete}
                className="flex-1 bg-[#7b1e7a] hover:bg-[#5a1559] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                정답입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
