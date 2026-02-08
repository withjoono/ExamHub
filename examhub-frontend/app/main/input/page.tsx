"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Loader2, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react"
import { api } from "@/lib/api/client"
import { getUser } from "@/lib/auth/user"

// 학년 코드 변환 (고1 -> H1)
const gradeToCode = (grade: string): string => {
  const mapping: Record<string, string> = {
    "고1": "H1",
    "고2": "H2",
    "고3": "H3",
  }
  return mapping[grade] || grade
}

interface MockExamItem {
  id: number
  code: string
  name: string
  grade: string | null
  year: number | null
  month: number | null
  type: string | null
}

export default function MockExamInputPage() {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedExamId, setSelectedExamId] = useState("")

  // 전체 모의고사 목록
  const [allExams, setAllExams] = useState<MockExamItem[]>([])
  const [loadingExams, setLoadingExams] = useState(true)

  // 기존 데이터 존재 여부 상태 (과목 리스트)
  const [enteredScoreSubjects, setEnteredScoreSubjects] = useState<string[]>([])
  const [enteredAnswerSubjects, setEnteredAnswerSubjects] = useState<string[]>([])
  const [checkingData, setCheckingData] = useState(false)

  const grades = ["고1", "고2", "고3"]

  // 앱 로드 시 전체 모의고사 목록 가져오기
  useEffect(() => {
    async function fetchAllExams() {
      try {
        setLoadingExams(true)
        const res = await api.get<MockExamItem[]>("/api/mock-exams")
        if (res && Array.isArray(res)) {
          setAllExams(res)
        }
      } catch (e) {
        console.error("Failed to fetch mock exams:", e)
      } finally {
        setLoadingExams(false)
      }
    }
    fetchAllExams()
  }, [])

  // 선택한 학년에 해당하는 시험 필터링
  const filteredByGrade = useMemo(() => {
    if (!selectedGrade) return []
    const code = gradeToCode(selectedGrade)
    return allExams.filter((e) => e.grade === code)
  }, [selectedGrade, allExams])

  // 학년에서 가용한 연도 목록
  const availableYears = useMemo(() => {
    const years = new Set(filteredByGrade.map((e) => e.year).filter(Boolean) as number[])
    return Array.from(years).sort((a, b) => b - a)
  }, [filteredByGrade])

  // 학년 + 연도에 해당하는 시험 목록
  const filteredExams = useMemo(() => {
    if (!selectedYear) return []
    const year = parseInt(selectedYear, 10)
    return filteredByGrade
      .filter((e) => e.year === year)
      .sort((a, b) => (a.month || 0) - (b.month || 0))
  }, [selectedYear, filteredByGrade])

  // 선택한 시험 객체
  const selectedExam = useMemo(() => {
    if (!selectedExamId) return null
    return allExams.find((e) => e.id === parseInt(selectedExamId, 10)) || null
  }, [selectedExamId, allExams])

  // 학년 변경시 연도/시험 초기화
  useEffect(() => {
    setSelectedYear("")
    setSelectedExamId("")
    setEnteredScoreSubjects([])
    setEnteredAnswerSubjects([])
  }, [selectedGrade])

  // 연도 변경시 시험 초기화
  useEffect(() => {
    setSelectedExamId("")
    setEnteredScoreSubjects([])
    setEnteredAnswerSubjects([])
  }, [selectedYear])

  // 시험 선택 시 기존 데이터 조회
  useEffect(() => {
    async function checkExistingData() {
      if (!selectedExam) return

      try {
        setCheckingData(true)
        setEnteredScoreSubjects([])
        setEnteredAnswerSubjects([])
        const user = await getUser()
        if (!user) return

        // 1. 점수 존재 확인 - 과목별로 체크
        try {
          const scoreRes = await api.get<any>(`/api/scores/student/${user.id}/exam/${selectedExam.id}`)
          if (scoreRes && scoreRes.data) {
            const scores = scoreRes.data
            const subjects: string[] = []
            if (scores.koreanRawScore !== null && scores.koreanRawScore !== undefined) subjects.push("국어")
            if (scores.mathRawScore !== null && scores.mathRawScore !== undefined) subjects.push("수학")
            if (scores.englishRawScore !== null && scores.englishRawScore !== undefined) subjects.push("영어")
            if (scores.historyRawScore !== null && scores.historyRawScore !== undefined) subjects.push("한국사")
            if (scores.inquiry1RawScore !== null && scores.inquiry1RawScore !== undefined) {
              subjects.push(scores.inquiry1Selection || "탐구1")
            }
            if (scores.inquiry2RawScore !== null && scores.inquiry2RawScore !== undefined) {
              subjects.push(scores.inquiry2Selection || "탐구2")
            }
            if (scores.foreignRawScore !== null && scores.foreignRawScore !== undefined) {
              subjects.push(scores.foreignSelection || "제2외국어")
            }
            setEnteredScoreSubjects(subjects)
          }
        } catch (e) {
          // 점수 없음 (404 등)
        }

        // 2. 답안 존재 확인 - 과목별로 체크
        try {
          const answerRes = await api.get<any>(`/api/wrong-answers/student/${user.id}?mockExamId=${selectedExam.id}&wrongOnly=false&limit=1000`)
          if (answerRes && answerRes.items && answerRes.items.length > 0) {
            const subjectSet = new Set<string>()
            answerRes.items.forEach((item: any) => {
              subjectSet.add(item.subjectName || item.subjectAreaName)
            })
            setEnteredAnswerSubjects(Array.from(subjectSet))
          }
        } catch (e) {
          // 답안 없음
        }

      } catch (error) {
        console.error("Failed to check existing data:", error)
      } finally {
        setCheckingData(false)
      }
    }

    if (selectedExam) {
      checkExistingData()
    }
  }, [selectedExam])

  const handleScoreInput = () => {
    if (!selectedExam) {
      alert("시험을 선택해주세요.")
      return
    }

    const params = new URLSearchParams({
      year: String(selectedExam.year),
      grade: selectedGrade,
      month: String(selectedExam.month),
      mockExamId: String(selectedExam.id),
    })

    router.push(`/main/input/score?${params.toString()}`)
  }

  const handleAnswerInput = () => {
    if (!selectedExam) {
      alert("시험을 선택해주세요.")
      return
    }

    const params = new URLSearchParams({
      year: String(selectedExam.year),
      grade: selectedGrade,
      month: String(selectedExam.month),
      mockExamId: String(selectedExam.id),
    })

    router.push(`/main/input/form?${params.toString()}`)
  }

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
          {/* Mock Exam Selection Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              시험 선택
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
            </h2>

            {loadingExams ? (
              <div className="flex items-center gap-2 text-gray-500 py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>등록된 모의고사 목록 불러오는 중...</span>
              </div>
            ) : allExams.length === 0 ? (
              <div className="flex items-center gap-2 text-yellow-600 py-4">
                <XCircle className="w-5 h-5" />
                <span>등록된 모의고사가 없습니다. 서버 연결을 확인해주세요.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
                  <div className="relative">
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none"
                    >
                      <option value="">학년 선택</option>
                      {grades.map((grade) => {
                        const code = gradeToCode(grade)
                        const count = allExams.filter((e) => e.grade === code).length
                        return (
                          <option key={grade} value={grade} disabled={count === 0}>
                            {grade} ({count}개 시험)
                          </option>
                        )
                      })}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Year Selection — only if grade selected */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      disabled={!selectedGrade || availableYears.length === 0}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedGrade ? "학년을 먼저 선택" : availableYears.length === 0 ? "등록된 시험 없음" : "연도 선택"}
                      </option>
                      {availableYears.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}년
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Exam Selection — only if year selected */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시험</label>
                  <div className="relative">
                    <select
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      disabled={!selectedYear || filteredExams.length === 0}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a] appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedYear ? "연도를 먼저 선택" : filteredExams.length === 0 ? "등록된 시험 없음" : "시험 선택"}
                      </option>
                      {filteredExams.map((exam) => (
                        <option key={exam.id} value={String(exam.id)}>
                          {exam.month}월 - {exam.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* 선택된 시험 정보 및 기존 데이터 상태 */}
            {selectedExam && (
              <div className="mt-4 p-4 rounded-lg border border-green-200 bg-green-50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {selectedExam.name}
                    </span>
                    <span className="text-sm text-green-600">
                      (코드: {selectedExam.code})
                    </span>
                  </div>

                  {checkingData ? (
                    <div className="text-sm text-gray-500 flex items-center gap-2 ml-7">
                      <Loader2 className="w-3 h-3 animate-spin" /> 기존 입력 기록 확인 중...
                    </div>
                  ) : (enteredScoreSubjects.length > 0 || enteredAnswerSubjects.length > 0) ? (
                    <div className="ml-2 space-y-3">
                      {/* 점수 입력 내역 */}
                      {enteredScoreSubjects.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                            <FileText className="w-4 h-4" />
                            📊 점수 입력 내역 ({enteredScoreSubjects.length}과목)
                          </div>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {enteredScoreSubjects.map((subject) => (
                              <span
                                key={subject}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-blue-500 mt-2 pl-6">
                            위 과목의 점수가 이미 입력되어 있습니다. 점수 입력 시 기존 데이터를 수정합니다.
                          </p>
                        </div>
                      )}

                      {/* 답안 입력 내역 */}
                      {enteredAnswerSubjects.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                            <FileText className="w-4 h-4" />
                            ✏️ 답안 입력 내역 ({enteredAnswerSubjects.length}과목)
                          </div>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {enteredAnswerSubjects.map((subject) => (
                              <span
                                key={subject}
                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-purple-500 mt-2 pl-6">
                            위 과목의 답안이 이미 입력되어 있습니다. 정답 입력 시 기존 데이터를 수정합니다.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : !checkingData ? (
                    <div className="ml-7 text-sm text-gray-600">
                      아직 입력된 점수/답안 내역이 없습니다. 아래에서 새로 입력해주세요.
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200 mb-8" />

          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
              <button
                onClick={handleScoreInput}
                disabled={!selectedExam}
                className="flex-1 relative bg-[#7b1e7a] hover:bg-[#5a1559] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                {enteredScoreSubjects.length > 0 ? "점수 수정" : "점수 입력"}
                {enteredScoreSubjects.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded-full shadow-md font-bold">
                    {enteredScoreSubjects.length}과목
                  </span>
                )}
              </button>
              <button
                onClick={handleAnswerInput}
                disabled={!selectedExam}
                className="flex-1 relative bg-[#7b1e7a] hover:bg-[#5a1559] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                {enteredAnswerSubjects.length > 0 ? "정답 수정" : "정답 입력"}
                {enteredAnswerSubjects.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded-full shadow-md font-bold">
                    {enteredAnswerSubjects.length}과목
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
