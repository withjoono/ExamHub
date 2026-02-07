"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser, type User } from "@/lib/auth/user"
import { api } from "@/lib/api/client"

interface WrongAnswerItem {
  id: number
  studentId: number
  mockExamId: number
  examQuestionId: number
  subjectAreaName?: string
  subjectName?: string
  questionNumber: number
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
  score?: number
  earnedScore?: number
  wrongReason?: string
  reviewCount: number
  lastReviewedAt?: string
  isBookmarked: boolean
  difficulty?: string
  correctRate?: number
  mockExamName?: string
  mockExamYear?: number
  mockExamMonth?: number
}

interface WrongAnswerList {
  studentId: number
  items: WrongAnswerItem[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

interface SummaryData {
  studentId: number
  totalAnswers: number
  correctCount: number
  wrongCount: number
  overallCorrectRate: number
  bookmarkedCount: number
  needReviewCount: number
  bySubject: {
    subjectAreaName: string
    subjectName?: string
    totalCount: number
    wrongCount: number
    needReviewCount: number
    wrongRate: number
  }[]
}

interface ExamSummary {
  mockExamId: number
  mockExamName: string
  year?: number
  month?: number
  totalCount: number
  wrongCount: number
  wrongRate: number
}

export default function WrongAnswersPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerItem[]>([])
  const [examList, setExamList] = useState<ExamSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 필터 상태
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"all" | "byExam">("byExam")

  // SSO 인증
  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser()
      setUser(userData)
      setAuthLoading(false)
    }
    fetchUser()
  }, [])

  // 데이터 로드
  useEffect(() => {
    if (authLoading || !user) return

    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        // 요약 통계와 모의고사별 현황 동시 조회
        const [summaryRes, byExamRes] = await Promise.all([
          api.get<SummaryData>(`/api/wrong-answers/student/${user!.id}/summary`),
          api.get<{ studentId: number; exams: ExamSummary[] }>(`/api/wrong-answers/student/${user!.id}/by-exam`),
        ])
        setSummary(summaryRes)
        setExamList(byExamRes.exams || [])
      } catch (err) {
        console.error('데이터 로드 실패:', err)
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [authLoading, user])

  // 오답 목록 로드 (필터 변경 시)
  useEffect(() => {
    if (authLoading || !user) return

    async function fetchWrongAnswers() {
      try {
        const params: Record<string, string | number | boolean> = { wrongOnly: true, limit: 100 }
        if (selectedExamId) params.mockExamId = selectedExamId
        if (selectedSubject) params.subjectAreaName = selectedSubject

        const res = await api.get<WrongAnswerList>(`/api/wrong-answers/student/${user!.id}`, params)
        setWrongAnswers(res.items || [])
      } catch (err) {
        console.error('오답 목록 로드 실패:', err)
      }
    }
    fetchWrongAnswers()
  }, [authLoading, user, selectedExamId, selectedSubject])

  // 북마크 토글
  const handleToggleBookmark = async (id: number) => {
    try {
      await api.put(`/api/wrong-answers/${id}/bookmark`)
      setWrongAnswers(prev => prev.map(a =>
        a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a
      ))
    } catch (err) {
      console.error('북마크 토글 실패:', err)
    }
  }

  // 복습 기록
  const handleRecordReview = async (id: number) => {
    try {
      await api.put(`/api/wrong-answers/${id}/review`)
      setWrongAnswers(prev => prev.map(a =>
        a.id === id ? { ...a, reviewCount: a.reviewCount + 1 } : a
      ))
    } catch (err) {
      console.error('복습 기록 실패:', err)
    }
  }

  // 로딩 / 미로그인 상태
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">오답노트</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg border border-yellow-300 text-center">
            ⚠️ 오답노트를 보려면 먼저 로그인해주세요.
            <br />
            <span className="text-sm">상단 네비게이션 바에서 로그인할 수 있습니다.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <span>홈</span> &gt; <span>모의고사</span> &gt; <span className="text-[#7b1e7a]">오답노트</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">오답노트</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md border border-red-300 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">데이터 로딩 중...</div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            {summary && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 전체 요약</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{summary.totalAnswers}</div>
                    <div className="text-xs text-gray-500">전체 풀이</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{summary.correctCount}</div>
                    <div className="text-xs text-gray-500">정답</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{summary.wrongCount}</div>
                    <div className="text-xs text-gray-500">오답</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className={`text-2xl font-bold ${summary.overallCorrectRate >= 80 ? 'text-green-600' : summary.overallCorrectRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {summary.overallCorrectRate}%
                    </div>
                    <div className="text-xs text-gray-500">정답률</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{summary.needReviewCount}</div>
                    <div className="text-xs text-gray-500">복습 필요</div>
                  </div>
                </div>

                {/* 과목별 통계 */}
                {summary.bySubject.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">과목별 오답률</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {summary.bySubject.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <span className="text-sm text-gray-700">
                            {s.subjectAreaName}{s.subjectName ? ` - ${s.subjectName}` : ''}
                          </span>
                          <span className={`text-sm font-bold ${s.wrongRate >= 50 ? 'text-red-600' : s.wrongRate >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {s.wrongCount}/{s.totalCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Bar */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("byExam")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "byExam" ? "bg-white text-[#7b1e7a] shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                모의고사별
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "all" ? "bg-white text-[#7b1e7a] shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                전체 오답
              </button>
            </div>

            {activeTab === "byExam" ? (
              /* 모의고사별 현황 */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">모의고사별 오답 현황</h2>
                  {examList.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">📝</div>
                      <p>아직 채점한 모의고사가 없습니다.</p>
                      <button
                        onClick={() => router.push('/main/input')}
                        className="mt-4 px-6 py-2 bg-[#7b1e7a] text-white rounded-md hover:bg-[#5a165a] transition-colors text-sm"
                      >
                        모의고사 입력하기
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {examList.map((exam) => (
                        <div
                          key={exam.mockExamId}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#d4a5d3] hover:bg-[#fdf5fd] transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedExamId(exam.mockExamId)
                            setActiveTab("all")
                          }}
                        >
                          <div>
                            <div className="font-medium text-gray-900">{exam.mockExamName}</div>
                            <div className="text-sm text-gray-500">
                              {exam.year}년 {exam.month}월
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">{exam.wrongCount}</div>
                              <div className="text-xs text-gray-500">오답</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-700">{exam.totalCount}</div>
                              <div className="text-xs text-gray-500">전체</div>
                            </div>
                            <div className="text-gray-400">→</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 전체 오답 목록 */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      오답 목록
                      {selectedExamId && (
                        <button
                          onClick={() => setSelectedExamId(null)}
                          className="ml-2 text-sm font-normal text-[#7b1e7a] hover:underline"
                        >
                          (필터 해제)
                        </button>
                      )}
                    </h2>
                    <div className="text-sm text-gray-500">총 {wrongAnswers.length}건</div>
                  </div>

                  {/* 과목 필터 */}
                  {summary && summary.bySubject.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => setSelectedSubject("")}
                        className={`px-3 py-1 rounded-full text-sm ${!selectedSubject ? 'bg-[#7b1e7a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        전체
                      </button>
                      {[...new Set(summary.bySubject.map(s => s.subjectAreaName))].map(area => (
                        <button
                          key={area}
                          onClick={() => setSelectedSubject(area)}
                          className={`px-3 py-1 rounded-full text-sm ${selectedSubject === area ? 'bg-[#7b1e7a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  )}

                  {wrongAnswers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">✅</div>
                      <p>오답이 없습니다!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {wrongAnswers.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            {/* 문제 번호 */}
                            <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-sm">
                              {answer.questionNumber}
                            </div>

                            {/* 과목 & 시험 정보 */}
                            <div>
                              <div className="font-medium text-gray-900">
                                {answer.subjectAreaName || '미분류'}
                                {answer.subjectName && <span className="text-gray-500"> - {answer.subjectName}</span>}
                              </div>
                              <div className="text-xs text-gray-500">
                                {answer.mockExamName}
                                {answer.difficulty && (
                                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${answer.difficulty.startsWith('상') ? 'bg-red-100 text-red-700' :
                                      answer.difficulty.startsWith('중') ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    난이도: {answer.difficulty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            {/* 내 답 vs 정답 */}
                            <div className="text-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-red-600 font-bold">{answer.selectedAnswer}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-green-600 font-bold">{answer.correctAnswer}</span>
                              </div>
                              <div className="text-xs text-gray-400">내 답 → 정답</div>
                            </div>

                            {/* 점수 */}
                            {answer.score && (
                              <div className="text-center">
                                <div className="text-sm font-bold text-gray-600">{answer.score}점</div>
                                <div className="text-xs text-gray-400">배점</div>
                              </div>
                            )}

                            {/* 복습 횟수 */}
                            <div className="text-center">
                              <div className={`text-sm font-bold ${answer.reviewCount > 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                                {answer.reviewCount}회
                              </div>
                              <div className="text-xs text-gray-400">복습</div>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleToggleBookmark(answer.id)}
                                className={`p-1.5 rounded-full transition-colors ${answer.isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'}`}
                                title="북마크"
                              >
                                ★
                              </button>
                              <button
                                onClick={() => handleRecordReview(answer.id)}
                                className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                title="복습 완료"
                              >
                                ✓
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 입력 페이지 이동 */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => router.push('/main/input')}
                className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                입력페이지로
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
