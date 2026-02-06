"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDevAuth } from "@/components/auth/DevLogin"
import { mockExamApi } from "@/lib/api/mock-exam"
import { api } from "@/lib/api/client"

export default function MockExamFormPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { studentId, isLoggedIn, isLoading: authLoading } = useDevAuth()

  const year = searchParams.get("year") || ""
  const grade = searchParams.get("grade") || ""
  const month = searchParams.get("month") || ""

  const [mockExamId, setMockExamId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 모의고사 ID 조회
  useEffect(() => {
    async function fetchMockExam() {
      if (!year || !grade || !month) return

      try {
        const monthNum = parseInt(month.replace('월', ''))
        const exams = await mockExamApi.search({
          year: parseInt(year),
          grade,
          month: monthNum,
        })
        if (exams && exams.length > 0) {
          setMockExamId(exams[0].id)
        }
      } catch (error) {
        console.error('모의고사 조회 실패:', error)
      }
    }
    fetchMockExam()
  }, [year, grade, month])

  const getSubjects = () => {
    if (grade === "고1") {
      return ["국어", "수학", "영어", "한국사", "통합사회", "통합과학", "제2외국어"]
    }
    return ["국어", "수학", "영어", "한국사", "탐구1", "탐구2", "제2외국어"]
  }

  const subjects = getSubjects()

  const [selectedSubject, setSelectedSubject] = useState("국어")
  const [answers, setAnswers] = useState<{ [key: string]: number | string }>({})
  const [inquiry1Subject, setInquiry1Subject] = useState("")
  const [inquiry2Subject, setInquiry2Subject] = useState("")
  const [secondForeignLanguage, setSecondForeignLanguage] = useState("")

  const inquirySubjects = {
    사회탐구: ["생활과 윤리", "윤리와 사상", "사회·문화", "한국 지리", "세계 지리", "동아시아사", "세계사"],
    과학탐구: ["물리학Ⅰ", "물리학Ⅱ", "화학Ⅰ", "화학Ⅱ", "생명과학Ⅰ", "생명과학Ⅱ", "지구과학Ⅰ", "지구과학Ⅱ"],
  }

  const secondForeignLanguageSubjects = [
    "독일어",
    "프랑스어",
    "스페인어",
    "중국어",
    "일본어",
    "러시아어",
    "아랍어",
    "베트남어",
    "한문",
  ]

  const getQuestionsForSubject = (subject: string) => {
    if (subject === "국어" || subject === "영어") {
      return Array.from({ length: 45 }, (_, i) => i + 1)
    }
    if (subject === "수학") {
      return Array.from({ length: 30 }, (_, i) => i + 1)
    }
    if (
      subject === "한국사" ||
      subject === "탐구1" ||
      subject === "탐구2" ||
      subject === "통합사회" ||
      subject === "통합과학"
    ) {
      return Array.from({ length: 20 }, (_, i) => i + 1)
    }
    if (subject === "제2외국어") {
      return Array.from({ length: 30 }, (_, i) => i + 1)
    }
    return Array.from({ length: 7 }, (_, i) => i + 1)
  }

  const getMathInputType = (questionNum: number) => {
    if (grade === "고2") {
      // 고2: 1-21번은 5지선다, 22-30번은 3자리 숫자입력
      if (questionNum >= 1 && questionNum <= 21) {
        return "multiple-choice"
      }
      if (questionNum >= 22 && questionNum <= 30) {
        return "number-input"
      }
    } else {
      // 고3 (기존 로직): 1-15번, 23-28번은 5지선다, 16-22번, 29-30번은 3자리 숫자입력
      if ((questionNum >= 1 && questionNum <= 15) || (questionNum >= 23 && questionNum <= 28)) {
        return "multiple-choice"
      }
      if ((questionNum >= 16 && questionNum <= 22) || (questionNum >= 29 && questionNum <= 30)) {
        return "number-input"
      }
    }
    return "multiple-choice"
  }

  const questions = getQuestionsForSubject(selectedSubject)
  const answerOptions = [1, 2, 3, 4, 5]

  const handleAnswerSelect = (questionNum: number, answer: number) => {
    const key = `${selectedSubject}-${questionNum}`
    setAnswers((prev) => ({
      ...prev,
      [key]: answer,
    }))
  }

  const handleNumberInput = (questionNum: number, value: string) => {
    const key = `${selectedSubject}-${questionNum}`
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    // 로그인 확인
    if (!isLoggedIn || !studentId) {
      setSaveMessage({ type: 'error', text: '로그인이 필요합니다. 상단의 개발 로그인 배너에서 로그인해주세요.' })
      return
    }

    // 모의고사 ID 확인
    if (!mockExamId) {
      setSaveMessage({ type: 'error', text: '모의고사 정보를 찾을 수 없습니다.' })
      return
    }

    // 답안이 없으면
    if (Object.keys(answers).length === 0) {
      setSaveMessage({ type: 'error', text: '입력된 답안이 없습니다.' })
      return
    }

    setIsSaving(true)
    setSaveMessage(null)

    try {
      // 과목별로 답안 그룹화
      const answersBySubject: Record<string, { questionNumber: number; selectedAnswer: number }[]> = {}

      Object.entries(answers).forEach(([key, value]) => {
        const [subject, questionNumStr] = key.split('-')
        const questionNumber = parseInt(questionNumStr)
        const selectedAnswer = typeof value === 'string' ? parseInt(value) : value

        if (!answersBySubject[subject]) {
          answersBySubject[subject] = []
        }
        answersBySubject[subject].push({ questionNumber, selectedAnswer })
      })

      // 각 과목별로 API 호출
      for (const [subjectAreaName, subjectAnswers] of Object.entries(answersBySubject)) {
        // 탐구 과목 처리
        let actualSubjectName: string | undefined
        if (subjectAreaName === '탐구1') {
          actualSubjectName = inquiry1Subject
        } else if (subjectAreaName === '탐구2') {
          actualSubjectName = inquiry2Subject
        } else if (subjectAreaName === '제2외국어') {
          actualSubjectName = secondForeignLanguage
        }

        await api.post('/api/wrong-answers/grade', {
          studentId,
          mockExamId,
          subjectAreaName: subjectAreaName.replace('1', '').replace('2', ''), // 탐구1 -> 탐구
          subjectName: actualSubjectName,
          answers: subjectAnswers,
        })
      }

      setSaveMessage({ type: 'success', text: '답안이 저장되었습니다!' })

      // 3초 후 오답노트 페이지로 이동
      setTimeout(() => {
        router.push('/main/wrong-answers')
      }, 2000)
    } catch (error) {
      console.error('저장 실패:', error)
      setSaveMessage({ type: 'error', text: error instanceof Error ? error.message : '저장에 실패했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  const renderMathQuestion = (questionNum: number) => {
    const key = `${selectedSubject}-${questionNum}`
    const selectedAnswer = answers[key]
    const inputType = getMathInputType(questionNum)

    if (inputType === "number-input") {
      return (
        <div key={questionNum} className="flex items-center space-x-4 mb-4">
          <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
          <div className="flex space-x-2">
            <input
              type="text"
              maxLength={3}
              value={selectedAnswer || ""}
              onChange={(e) => handleNumberInput(questionNum, e.target.value)}
              className="w-16 h-10 border-2 border-gray-300 rounded text-center font-medium focus:border-[#7b1e7a] focus:outline-none"
              placeholder="000"
            />
          </div>
        </div>
      )
    }

    return (
      <div key={questionNum} className="flex items-center space-x-4 mb-4">
        <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
        <div className="flex space-x-2">
          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(questionNum, option)}
              className={`w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors ${
                selectedAnswer === option
                  ? "bg-[#7b1e7a] border-[#7b1e7a] text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#d4a5d3]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderRegularQuestion = (questionNum: number) => {
    const key = `${selectedSubject}-${questionNum}`
    const selectedAnswer = answers[key]

    return (
      <div key={questionNum} className="flex items-center space-x-4 mb-3">
        <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
        <div className="flex space-x-2">
          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(questionNum, option)}
              className={`w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors ${
                selectedAnswer === option
                  ? "bg-[#7b1e7a] border-[#7b1e7a] text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#d4a5d3]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderKoreanEnglishQuestions = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
      { start: 21, end: 30, title: "21-30번", color: "purple" },
      { start: 31, end: 40, title: "31-40번", color: "indigo" },
      { start: 41, end: 45, title: "41-45번", color: "pink" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderInquiryDropdown = (inquiryType: "탐구1" | "탐구2") => {
    const selectedSubject = inquiryType === "탐구1" ? inquiry1Subject : inquiry2Subject
    const setSelectedSubject = inquiryType === "탐구1" ? setInquiry1Subject : setInquiry2Subject

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a]"
          >
            <option value="">과목을 선택하세요</option>
            <optgroup label="사회탐구">
              {inquirySubjects.사회탐구.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </optgroup>
            <optgroup label="과학탐구">
              {inquirySubjects.과학탐구.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {selectedSubject && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{selectedSubject}</h4>
            {render20QuestionSubject()}
          </div>
        )}
      </div>
    )
  }

  const render20QuestionSubject = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const render30QuestionSubject = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
      { start: 21, end: 30, title: "21-30번", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSecondForeignLanguageDropdown = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
          <select
            value={secondForeignLanguage}
            onChange={(e) => setSecondForeignLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b1e7a] focus:border-[#7b1e7a]"
          >
            <option value="">과목을 선택하세요</option>
            {secondForeignLanguageSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {secondForeignLanguage && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{secondForeignLanguage}</h4>
            {render30QuestionSubject()}
          </div>
        )}
      </div>
    )
  }

  const renderGrade2MathQuestions = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번 (5지 선다)", color: "blue" },
      { start: 11, end: 21, title: "11-21번 (5지 선다)", color: "green" },
      { start: 22, end: 30, title: "22-30번 (3자리 숫자 입력)", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderMathQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderGrade3MathQuestions = () => {
    const sections = [
      { start: 1, end: 15, title: "1-15번 (5지 선다)", color: "pink" },
      { start: 16, end: 22, title: "16-22번 (3자리 숫자 입력)", color: "blue" },
      { start: 23, end: 28, title: "23-28번 (5지 선다)", color: "green" },
      { start: 29, end: 30, title: "29-30번 (3자리 숫자 입력)", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderMathQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderIntegratedSubject = (subjectName: string) => {
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{subjectName}</h4>
        {render20QuestionSubject()}
      </div>
    )
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">모의고사 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            {year && grade && month ? (
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                {year}년 {grade} {month} 모의고사
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                모의고사 정보를 선택해주세요
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">정보 필요</span>
              </h2>
            )}
          </div>

          <div className="flex">
            {/* Subject Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-4 py-3 mb-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSubject === subject
                        ? "bg-[#f3e8f3] text-[#7b1e7a] border border-[#d4a5d3]"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{selectedSubject}</h3>

                <div className="space-y-6">
                  {selectedSubject === "수학" ? (
                    grade === "고2" ? (
                      renderGrade2MathQuestions()
                    ) : (
                      renderGrade3MathQuestions()
                    )
                  ) : selectedSubject === "국어" || selectedSubject === "영어" ? (
                    renderKoreanEnglishQuestions()
                  ) : selectedSubject === "탐구1" ? (
                    renderInquiryDropdown("탐구1")
                  ) : selectedSubject === "탐구2" ? (
                    renderInquiryDropdown("탐구2")
                  ) : selectedSubject === "통합사회" ? (
                    renderIntegratedSubject("통합사회")
                  ) : selectedSubject === "통합과학" ? (
                    renderIntegratedSubject("통합과학")
                  ) : selectedSubject === "한국사" ? (
                    render20QuestionSubject()
                  ) : selectedSubject === "제2외국어" ? (
                    renderSecondForeignLanguageDropdown()
                  ) : (
                    <div className="space-y-3">{questions.map(renderRegularQuestion)}</div>
                  )}
                </div>

                {/* Save Button */}
                <div className="mt-8 space-y-4">
                  {/* 상태 메시지 */}
                  {saveMessage && (
                    <div className={`p-4 rounded-md ${
                      saveMessage.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {saveMessage.text}
                    </div>
                  )}

                  {/* 로그인 안내 */}
                  {!authLoading && !isLoggedIn && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md border border-yellow-300">
                      ⚠️ 답안을 저장하려면 상단의 노란색 배너에서 먼저 로그인해주세요.
                    </div>
                  )}

                  {/* 모의고사 정보 */}
                  {mockExamId && (
                    <div className="text-sm text-gray-500">
                      모의고사 ID: {mockExamId} | 학생 ID: {studentId || '미로그인'}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !isLoggedIn}
                      className={`px-8 py-3 rounded-md font-medium transition-colors ${
                        isSaving || !isLoggedIn
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#7b1e7a] hover:bg-[#5a165a] text-white'
                      }`}
                    >
                      {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
