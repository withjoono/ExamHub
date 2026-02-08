"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api/client"
import { getUser, type User } from "@/lib/auth/user"

export default function ScoreInputPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"raw" | "standard">("raw")
  const [user, setUser] = useState<User | null>(null)
  const [mockExamId, setMockExamId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [grade1StandardScores, setGrade1StandardScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
    koreanGrade: "",
    koreanPercentile: "",
    mathGrade: "",
    mathPercentile: "",
    englishGrade: "",
    koreanHistoryGrade: "",
    integratedScienceGrade: "",
    integratedSciencePercentile: "",
    integratedSocialGrade: "",
    integratedSocialPercentile: "",
  })

  const [grade2RawScores, setGrade2RawScores] = useState({
    korean: { raw: "", grade: "", percentile: "" },
    math: { raw: "", grade: "", percentile: "" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    inquiry1: { subject: "", raw: "", grade: "", percentile: "" },
    inquiry2: { subject: "", raw: "", grade: "", percentile: "" },
  })

  const [grade2StandardScores, setGrade2StandardScores] = useState({
    korean: { raw: "" },
    math: { raw: "" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    inquiry1: { subject: "", raw: "" },
    inquiry2: { subject: "", raw: "" },
  })

  const [grade1Scores, setGrade1Scores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const [rawScores, setRawScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const [standardScores, setStandardScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const year = searchParams.get("year") || ""
  const grade = searchParams.get("grade") || ""
  const month = searchParams.get("month") || ""

  // 초기 데이터 로드 (사용자 & 모의고사 ID 검사)
  useEffect(() => {
    async function init() {
      // 1. 사용자 정보
      const userData = await getUser()
      setUser(userData)

      // 2. 모의고사 ID 확인 및 성적 조회
      if (year && grade && month) {
        try {
          const res = await api.get<any>(
            `/api/mock-exams/check?year=${year}&grade=${grade}&month=${month}`
          )
          if (res && res.exists && res.mockExam) {
            const mId = res.mockExam.id
            setMockExamId(mId)
            console.log("Mock Exam Found:", mId)

            // 기존 성적 조회
            if (userData) {
              try {
                const scoreRes = await api.get<any>(`/api/scores/student/${userData.id}/exam/${mId}`)
                if (scoreRes && scoreRes.data) {
                  const s = scoreRes.data
                  console.log("Found existing score:", s)

                  if (grade === "고1") {
                    setGrade1Scores({
                      korean: s.koreanRaw?.toString() || "",
                      math: s.mathRaw?.toString() || "",
                      english: s.englishRaw?.toString() || "",
                      koreanHistory: s.historyRaw?.toString() || "",
                      integratedScience: s.inquiry1Raw?.toString() || "",
                      integratedSocial: s.inquiry2Raw?.toString() || "",
                    })
                    setGrade1StandardScores({
                      korean: s.koreanStandard?.toString() || "",
                      koreanGrade: s.koreanGrade?.toString() || "",
                      koreanPercentile: s.koreanPercentile?.toString() || "",
                      math: s.mathStandard?.toString() || "",
                      mathGrade: s.mathGrade?.toString() || "",
                      mathPercentile: s.mathPercentile?.toString() || "",
                      english: "",
                      englishGrade: s.englishGrade?.toString() || "",
                      koreanHistory: "",
                      koreanHistoryGrade: s.historyGrade?.toString() || "",
                      integratedScience: "",
                      integratedScienceGrade: s.inquiry1Grade?.toString() || "",
                      integratedSciencePercentile: s.inquiry1Percentile?.toString() || "",
                      integratedSocial: "",
                      integratedSocialGrade: s.inquiry2Grade?.toString() || "",
                      integratedSocialPercentile: s.inquiry2Percentile?.toString() || "",
                    })
                  } else if (grade === "고2") {
                    setGrade2RawScores({
                      korean: { raw: s.koreanRaw?.toString() || "", grade: s.koreanGrade?.toString() || "", percentile: s.koreanPercentile?.toString() || "" },
                      math: { raw: s.mathRaw?.toString() || "", grade: s.mathGrade?.toString() || "", percentile: s.mathPercentile?.toString() || "" },
                      english: { grade: s.englishGrade?.toString() || "" },
                      koreanHistory: { grade: s.historyGrade?.toString() || "" },
                      inquiry1: { subject: s.inquiry1Selection || "", raw: s.inquiry1Raw?.toString() || "", grade: s.inquiry1Grade?.toString() || "", percentile: s.inquiry1Percentile?.toString() || "" },
                      inquiry2: { subject: s.inquiry2Selection || "", raw: s.inquiry2Raw?.toString() || "", grade: s.inquiry2Grade?.toString() || "", percentile: s.inquiry2Percentile?.toString() || "" },
                    })
                    setGrade2StandardScores({
                      korean: { raw: s.koreanStandard?.toString() || "" },
                      math: { raw: s.mathStandard?.toString() || "" },
                      english: { raw: s.englishRaw?.toString() || "" }, // Note: Grade 2 Standard State usually only has raw field in this UI
                      koreanHistory: { raw: s.historyRaw?.toString() || "" },
                      inquiry1: { subject: s.inquiry1Selection || "", raw: s.inquiry1Standard?.toString() || "" },
                      inquiry2: { subject: s.inquiry2Selection || "", raw: s.inquiry2Standard?.toString() || "" },
                    })
                  }
                }
              } catch (err) {
                console.log("No existing score found or error:", err)
              }
            }

          } else {
            console.warn("Mock Exam not found for:", { year, grade, month })
          }
        } catch (e) {
          console.error("Failed to check mock exam:", e)
        }
      }
    }
    init()
  }, [year, grade, month])

  const handleGrade1ScoreChange = (subject: string, value: string) => {
    setGrade1Scores((prev) => ({
      ...prev,
      [subject]: value,
    }))
  }

  const handleGrade1StandardScoreChange = (field: string, value: string) => {
    setGrade1StandardScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStandardScoreChange = (subject: string, field: string, value: string) => {
    setStandardScores((prev) => {
      const currentSubject = prev[subject as keyof typeof prev]
      return {
        ...prev,
        [subject]: {
          ...(typeof currentSubject === 'object' ? currentSubject : {}),
          [field]: value,
        },
      }
    })
  }

  const handleRawScoreChange = (subject: string, field: string, value: string) => {
    setRawScores((prev) => {
      const currentSubject = prev[subject as keyof typeof prev]
      return {
        ...prev,
        [subject]: {
          ...(typeof currentSubject === 'object' ? currentSubject : {}),
          [field]: value,
        },
      }
    })
  }

  const handleGrade2RawScoreChange = (subject: string, field: string, value: string) => {
    setGrade2RawScores((prev) => {
      const currentSubject = prev[subject as keyof typeof prev]
      return {
        ...prev,
        [subject]: {
          ...(typeof currentSubject === 'object' ? currentSubject : {}),
          [field]: value,
        },
      }
    })
  }

  const handleGrade2StandardScoreChange = (subject: string, field: string, value: string) => {
    setGrade2StandardScores((prev) => {
      const currentSubject = prev[subject as keyof typeof prev]
      return {
        ...prev,
        [subject]: {
          ...(typeof currentSubject === 'object' ? currentSubject : {}),
          [field]: value,
        },
      }
    })
  }

  // 성적 제출 헬퍼 함수
  const submitScore = async (payload: any) => {
    if (!mockExamId) {
      alert("모의고사 정보를 찾을 수 없어 저장할 수 없습니다.\n올바른 경로로 접근했는지 확인해주세요.")
      return
    }
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      setIsLoading(true)
      const data = {
        studentId: user.id,
        mockExamId: mockExamId,
        ...payload
      }
      console.log("Sending score payload:", data)
      await api.post('/api/scores', data)
      alert("성적이 성공적으로 저장되었습니다.")
    } catch (e) {
      console.error("Score save failed:", e)
      alert("성적 저장에 실패했습니다. " + (e instanceof Error ? e.message : ""))
    } finally {
      setIsLoading(false)
    }
  }

  // Legacy handleSubmit removed


  const Grade2RawScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-[#7b1e7a]">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.korean.raw}
                onChange={(e) => handleGrade2RawScoreChange("korean", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.korean.grade}
                onChange={(e) => handleGrade2RawScoreChange("korean", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.korean.percentile}
                onChange={(e) => handleGrade2RawScoreChange("korean", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.math.raw}
                onChange={(e) => handleGrade2RawScoreChange("math", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.math.grade}
                onChange={(e) => handleGrade2RawScoreChange("math", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.math.percentile}
                onChange={(e) => handleGrade2RawScoreChange("math", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade2RawScores.english.grade}
              onChange={(e) => handleGrade2RawScoreChange("english", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1 text-green-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade2RawScores.koreanHistory.grade}
              onChange={(e) => handleGrade2RawScoreChange("koreanHistory", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2RawScores.inquiry1.subject}
              onValueChange={(value) => handleGrade2RawScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.inquiry1.raw}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.inquiry1.grade}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.inquiry1.percentile}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2RawScores.inquiry2.subject}
              onValueChange={(value) => handleGrade2RawScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.inquiry2.raw}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.inquiry2.grade}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.inquiry2.percentile}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-8">
        <Button
          onClick={() => {
            submitScore({
              koreanRaw: Number(grade2RawScores.korean.raw) || 0,
              koreanGrade: Number(grade2RawScores.korean.grade) || 0,
              koreanPercentile: Number(grade2RawScores.korean.percentile) || 0,
              mathRaw: Number(grade2RawScores.math.raw) || 0,
              mathGrade: Number(grade2RawScores.math.grade) || 0,
              mathPercentile: Number(grade2RawScores.math.percentile) || 0,
              englishGrade: Number(grade2RawScores.english.grade) || 0,
              historyGrade: Number(grade2RawScores.koreanHistory.grade) || 0,
              inquiry1Selection: grade2RawScores.inquiry1.subject || undefined,
              inquiry1Raw: Number(grade2RawScores.inquiry1.raw) || 0,
              inquiry1Grade: Number(grade2RawScores.inquiry1.grade) || 0,
              inquiry1Percentile: Number(grade2RawScores.inquiry1.percentile) || 0,
              inquiry2Selection: grade2RawScores.inquiry2.subject || undefined,
              inquiry2Raw: Number(grade2RawScores.inquiry2.raw) || 0,
              inquiry2Grade: Number(grade2RawScores.inquiry2.grade) || 0,
              inquiry2Percentile: Number(grade2RawScores.inquiry2.percentile) || 0,
            })
          }}
          className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-6 py-2"
        >
          저장
        </Button>
        <Button
          onClick={() => {
            console.log("고2 원점수 입력 수정 모드 활성화")
            alert("수정 모드가 활성화되었습니다.")
          }}
          variant="outline"
          className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-6 py-2"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade2StandardScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-[#7b1e7a]">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.korean.raw}
              onChange={(e) => handleGrade2StandardScoreChange("korean", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.math.raw}
              onChange={(e) => handleGrade2StandardScoreChange("math", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.english.raw}
              onChange={(e) => handleGrade2StandardScoreChange("english", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.koreanHistory.raw}
              onChange={(e) => handleGrade2StandardScoreChange("koreanHistory", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2StandardScores.inquiry1.subject}
              onValueChange={(value) => handleGrade2StandardScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.inquiry1.raw}
              onChange={(e) => handleGrade2StandardScoreChange("inquiry1", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2StandardScores.inquiry2.subject}
              onValueChange={(value) => handleGrade2StandardScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.inquiry2.raw}
              onChange={(e) => handleGrade2StandardScoreChange("inquiry2", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-8">
        <Button
          onClick={() => {
            submitScore({
              koreanRaw: Number(grade2StandardScores.korean.raw) || 0,
              mathRaw: Number(grade2StandardScores.math.raw) || 0,
              englishRaw: Number(grade2StandardScores.english.raw) || 0,
              historyRaw: Number(grade2StandardScores.koreanHistory.raw) || 0,
              inquiry1Selection: grade2StandardScores.inquiry1.subject || undefined,
              inquiry1Raw: Number(grade2StandardScores.inquiry1.raw) || 0,
              inquiry2Selection: grade2StandardScores.inquiry2.subject || undefined,
              inquiry2Raw: Number(grade2StandardScores.inquiry2.raw) || 0,
            })
          }}
          className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-6 py-2"
        >
          저장
        </Button>
        <Button
          onClick={() => {
            console.log("고2 표준점수 입력 수정 모드 활성화")
            alert("수정 모드가 활성화되었습니다.")
          }}
          variant="outline"
          className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-6 py-2"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade1ScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-[#7b1e7a]">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.korean}
              onChange={(e) => handleGrade1ScoreChange("korean", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.math}
              onChange={(e) => handleGrade1ScoreChange("math", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.english}
              onChange={(e) => handleGrade1ScoreChange("english", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.koreanHistory}
              onChange={(e) => handleGrade1ScoreChange("koreanHistory", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합과학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 통합과학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.integratedScience}
              onChange={(e) => handleGrade1ScoreChange("integratedScience", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합사회 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-500">🏛️</span> 통합사회
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-purple-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.integratedSocial}
              onChange={(e) => handleGrade1ScoreChange("integratedSocial", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center pt-6">
        <Button
          onClick={() => {
            submitScore({
              koreanRaw: Number(grade1Scores.korean) || 0,
              mathRaw: Number(grade1Scores.math) || 0,
              englishRaw: Number(grade1Scores.english) || 0,
              historyRaw: Number(grade1Scores.koreanHistory) || 0,
              inquiry1Selection: "통합과학",
              inquiry1Raw: Number(grade1Scores.integratedScience) || 0,
              inquiry2Selection: "통합사회",
              inquiry2Raw: Number(grade1Scores.integratedSocial) || 0,
            })
          }}
          className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-8"
        >
          저장
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("[v0] Editing Grade 1 raw scores")
            alert("점수를 수정할 수 있습니다.")
          }}
          className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-8"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade1StandardScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-[#7b1e7a]">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.korean}
                onChange={(e) => handleGrade1StandardScoreChange("korean", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.koreanGrade}
                onChange={(e) => handleGrade1StandardScoreChange("koreanGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#7b1e7a]">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.koreanPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("koreanPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.math}
                onChange={(e) => handleGrade1StandardScoreChange("math", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.mathGrade}
                onChange={(e) => handleGrade1StandardScoreChange("mathGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.mathPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("mathPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade1StandardScores.englishGrade}
              onChange={(e) => handleGrade1StandardScoreChange("englishGrade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🏛️</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade1StandardScores.koreanHistoryGrade}
              onChange={(e) => handleGrade1StandardScoreChange("koreanHistoryGrade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합과학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-500">🔬</span> 통합과학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.integratedScience}
                onChange={(e) => handleGrade1StandardScoreChange("integratedScience", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.integratedScienceGrade}
                onChange={(e) => handleGrade1StandardScoreChange("integratedScienceGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.integratedSciencePercentile}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSciencePercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통합사회 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-teal-500">🌍</span> 통합사회
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.integratedSocial}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocial", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.integratedSocialGrade}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocialGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.integratedSocialPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocialPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center pt-6">
        <Button
          onClick={() => {
            submitScore({
              koreanStandard: Number(grade1StandardScores.korean) || 0,
              koreanGrade: Number(grade1StandardScores.koreanGrade) || 0,
              koreanPercentile: Number(grade1StandardScores.koreanPercentile) || 0,
              mathStandard: Number(grade1StandardScores.math) || 0,
              mathGrade: Number(grade1StandardScores.mathGrade) || 0,
              mathPercentile: Number(grade1StandardScores.mathPercentile) || 0,
              englishGrade: Number(grade1StandardScores.englishGrade) || 0,
              historyGrade: Number(grade1StandardScores.koreanHistoryGrade) || 0,
              inquiry1Selection: "통합과학",
              inquiry1Grade: Number(grade1StandardScores.integratedScienceGrade) || 0,
              inquiry1Percentile: Number(grade1StandardScores.integratedSciencePercentile) || 0,
              inquiry2Selection: "통합사회",
              inquiry2Grade: Number(grade1StandardScores.integratedSocialGrade) || 0,
              inquiry2Percentile: Number(grade1StandardScores.integratedSocialPercentile) || 0,
            })
          }}
          className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-8"
        >
          저장
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("[v0] Editing Grade 1 standard scores")
            alert("점수를 수정할 수 있습니다.")
          }}
          className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-8"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const inquirySubjects = [
    "물리학I",
    "화학I",
    "생명과학I",
    "지구과학I",
    "물리학II",
    "화학II",
    "생명과학II",
    "지구과학II",
    "한국지리",
    "세계지리",
    "동아시아사",
    "세계사",
    "경제",
    "정치와법",
    "사회·문화",
  ]

  const secondLanguageSubjects = [
    "독일어I",
    "프랑스어I",
    "스페인어I",
    "중국어I",
    "일본어I",
    "러시아어I",
    "아랍어I",
    "베트남어I",
    "한문I",
  ]

  const Grade3StandardScoreInput = () => {
    const [standardScores, setStandardScores] = useState({
      korean: { standard: "", grade: "", percentile: "" },
      math: { standard: "", grade: "", percentile: "" },
      english: { grade: "" },
      koreanHistory: { grade: "" },
      inquiry1: { subject: "", standard: "", grade: "", percentile: "" },
      inquiry2: { subject: "", standard: "", grade: "", percentile: "" },
      secondLanguage: {
        category: "",
        subject1: "",
      },
    })

    // Load detailed scores for Grade 3 Standard
    useEffect(() => {
      if (user && mockExamId) {
        api.get<any>(`/api/scores/student/${user.id}/exam/${mockExamId}`)
          .then(res => {
            if (res && res.data) {
              const s = res.data
              setStandardScores({
                korean: { standard: s.koreanStandard?.toString() || "", grade: s.koreanGrade?.toString() || "", percentile: s.koreanPercentile?.toString() || "" },
                math: { standard: s.mathStandard?.toString() || "", grade: s.mathGrade?.toString() || "", percentile: s.mathPercentile?.toString() || "" },
                english: { grade: s.englishGrade?.toString() || "" },
                koreanHistory: { grade: s.historyGrade?.toString() || "" },
                inquiry1: { subject: s.inquiry1Selection || "", standard: s.inquiry1Standard?.toString() || "", grade: s.inquiry1Grade?.toString() || "", percentile: s.inquiry1Percentile?.toString() || "" },
                inquiry2: { subject: s.inquiry2Selection || "", standard: s.inquiry2Standard?.toString() || "", grade: s.inquiry2Grade?.toString() || "", percentile: s.inquiry2Percentile?.toString() || "" },
                secondLanguage: { category: s.foreignSelection || "", subject1: s.foreignGrade?.toString() || "" },
              })
            }
          })
          .catch(e => console.log("G3 Std fetch error (ignored)", e))
      }
    }, [user, mockExamId])

    const inquirySubjects = [
      "물리학I",
      "화학I",
      "생명과학I",
      "지구과학I",
      "물리학II",
      "화학II",
      "생명과학II",
      "지구과학II",
      "한국지리",
      "세계지리",
      "동아시아사",
      "세계사",
      "경제",
      "정치와법",
      "사회·문화",
    ]

    const secondLanguageSubjects = [
      "독일어I",
      "프랑스어I",
      "스페인어I",
      "중국어I",
      "일본어I",
      "러시아어I",
      "아랍어I",
      "베트남어I",
      "한문I",
    ]

    const handleStandardScoreChange = (subject: string, field: string, value: string) => {
      setStandardScores((prev) => ({
        ...prev,
        [subject]: {
          ...prev[subject as keyof typeof prev],
          [field]: value,
        },
      }))
    }

    return (
      <div className="space-y-6">
        {/* 국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📝</span> 국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
                화법과 작문
              </Button>
              <Button size="sm" variant="outline">
                언어
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.korean.standard}
                  onChange={(e) => handleStandardScoreChange("korean", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.korean.grade}
                  onChange={(e) => handleStandardScoreChange("korean", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.korean.percentile}
                  onChange={(e) => handleStandardScoreChange("korean", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수학 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📊</span> 수학
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
                확률과 통계
              </Button>
              <Button size="sm" variant="outline">
                기하
              </Button>
              <Button size="sm" variant="outline">
                미적분
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.math.standard}
                  onChange={(e) => handleStandardScoreChange("math", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.math.grade}
                  onChange={(e) => handleStandardScoreChange("math", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.math.percentile}
                  onChange={(e) => handleStandardScoreChange("math", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 영어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌐</span> 영어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.english.grade}
                onChange={(e) => handleStandardScoreChange("english", "grade", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 한국사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📚</span> 한국사
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.koreanHistory.grade}
                onChange={(e) => handleStandardScoreChange("koreanHistory", "grade", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 1
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={standardScores.inquiry1.subject}
                onValueChange={(value) => handleStandardScoreChange("inquiry1", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.inquiry1.standard}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.inquiry1.grade}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.inquiry1.percentile}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탐구 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 2
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={standardScores.inquiry2.subject}
                onValueChange={(value) => handleStandardScoreChange("inquiry2", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.inquiry2.standard}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.inquiry2.grade}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.inquiry2.percentile}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 제2외국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌍</span> 제2외국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {secondLanguageSubjects.map((subject) => (
                <Button
                  key={subject}
                  size="sm"
                  variant="outline"
                  className={
                    standardScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleStandardScoreChange("secondLanguage", "category", subject)}
                >
                  {subject}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className={
                  standardScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""
                }
                onClick={() => handleStandardScoreChange("secondLanguage", "category", "기타")}
              >
                기타
              </Button>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.secondLanguage.subject1}
                onChange={(e) => handleStandardScoreChange("secondLanguage", "subject1", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => {
              submitScore({
                koreanStandard: Number(standardScores.korean.standard) || 0,
                koreanGrade: Number(standardScores.korean.grade) || 0,
                koreanPercentile: Number(standardScores.korean.percentile) || 0,
                mathStandard: Number(standardScores.math.standard) || 0,
                mathGrade: Number(standardScores.math.grade) || 0,
                mathPercentile: Number(standardScores.math.percentile) || 0,
                englishGrade: Number(standardScores.english.grade) || 0,
                historyGrade: Number(standardScores.koreanHistory.grade) || 0,
                inquiry1Selection: standardScores.inquiry1.subject || undefined,
                inquiry1Standard: Number(standardScores.inquiry1.standard) || 0,
                inquiry1Grade: Number(standardScores.inquiry1.grade) || 0,
                inquiry1Percentile: Number(standardScores.inquiry1.percentile) || 0,
                inquiry2Selection: standardScores.inquiry2.subject || undefined,
                inquiry2Standard: Number(standardScores.inquiry2.standard) || 0,
                inquiry2Grade: Number(standardScores.inquiry2.grade) || 0,
                inquiry2Percentile: Number(standardScores.inquiry2.percentile) || 0,
                foreignSelection: standardScores.secondLanguage.category === "기타" ? "기타" : standardScores.secondLanguage.category || undefined,
                foreignGrade: Number(standardScores.secondLanguage.subject1) || 0,
              })
            }}
            className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-6 py-2"
          >
            저장
          </Button>
          <Button
            onClick={() => {
              console.log("고3 표준점수 입력 수정 모드 활성화")
              alert("수정 모드가 활성화되었습니다.")
            }}
            variant="outline"
            className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-6 py-2"
          >
            수정
          </Button>
        </div>
      </div>
    )
  }

  const Grade3RawScoreInput = () => {
    const [rawScores, setRawScores] = useState({
      korean: { raw: "", selectedSubject: "화법과 작문" },
      math: { raw: "", selectedSubject: "확률과 통계" },
      english: { raw: "" },
      koreanHistory: { raw: "" },
      inquiry1: { subject: "", raw: "" },
      inquiry2: { subject: "", raw: "" },
      secondLanguage: {
        category: "",
      },
    })

    // Load detailed scores for Grade 3 Raw
    useEffect(() => {
      if (user && mockExamId) {
        api.get<any>(`/api/scores/student/${user.id}/exam/${mockExamId}`)
          .then(res => {
            if (res && res.data) {
              const s = res.data
              setRawScores({
                korean: { raw: s.koreanRaw?.toString() || "", selectedSubject: s.koreanSelection || "화법과 작문" },
                math: { raw: s.mathRaw?.toString() || "", selectedSubject: s.mathSelection || "확률과 통계" },
                english: { raw: s.englishRaw?.toString() || "" },
                koreanHistory: { raw: s.historyRaw?.toString() || "" },
                inquiry1: { subject: s.inquiry1Selection || "", raw: s.inquiry1Raw?.toString() || "" },
                inquiry2: { subject: s.inquiry2Selection || "", raw: s.inquiry2Raw?.toString() || "" },
                secondLanguage: { category: s.foreignSelection || "" },
              })
            }
          })
          .catch(e => console.log("G3 Raw fetch error (ignored)", e))
      }
    }, [user, mockExamId])

    const inquirySubjects = [
      "물리학I",
      "화학I",
      "생명과학I",
      "지구과학I",
      "물리학II",
      "화학II",
      "생명과학II",
      "지구과학II",
      "한국지리",
      "세계지리",
      "동아시아사",
      "세계사",
      "경제",
      "정치와법",
      "사회·문화",
    ]

    const secondLanguageSubjects = [
      "독일어I",
      "프랑스어I",
      "스페인어I",
      "중국어I",
      "일본어I",
      "러시아어I",
      "아랍어I",
      "베트남어I",
      "한문I",
    ]

    const handleRawScoreChange = (subject: string, field: string, value: string) => {
      setRawScores((prev) => ({
        ...prev,
        [subject]: {
          ...prev[subject as keyof typeof prev],
          [field]: value,
        },
      }))
    }

    return (
      <div className="space-y-6">
        {/* 국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📝</span> 국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={rawScores.korean.selectedSubject === "화법" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("korean", "selectedSubject", "화법")}
              >
                화법
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.korean.selectedSubject === "언어" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("korean", "selectedSubject", "언어")}
              >
                언어
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">원점수 (0~76)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="76"
                  value={rawScores.korean.raw}
                  onChange={(e) => handleRawScoreChange("korean", "raw", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">선택과목 (0~24)</label>
                <Input type="number" placeholder="0" min="0" max="24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수학 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📊</span> 수학
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "확률" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "확률")}
              >
                확률
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "기하" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "기하")}
              >
                기하
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "미분" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "미분")}
              >
                미분
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">원점수 (0~74)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="74"
                  value={rawScores.math.raw}
                  onChange={(e) => handleRawScoreChange("math", "raw", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">선택과목 (0~26)</label>
                <Input type="number" placeholder="0" min="0" max="26" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 영어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌐</span> 영어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={rawScores.english.raw}
                onChange={(e) => handleRawScoreChange("english", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 한국사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📚</span> 한국사
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.koreanHistory.raw}
                onChange={(e) => handleRawScoreChange("koreanHistory", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 1
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={rawScores.inquiry1.subject}
                onValueChange={(value) => handleRawScoreChange("inquiry1", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.inquiry1.raw}
                onChange={(e) => handleRawScoreChange("inquiry1", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 2
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={rawScores.inquiry2.subject}
                onValueChange={(value) => handleRawScoreChange("inquiry2", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.inquiry2.raw}
                onChange={(e) => handleRawScoreChange("inquiry2", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 제2외국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌍</span> 제2외국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {secondLanguageSubjects.map((subject) => (
                <Button
                  key={subject}
                  size="sm"
                  variant="outline"
                  className={
                    rawScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleRawScoreChange("secondLanguage", "category", subject)}
                >
                  {subject}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className={rawScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("secondLanguage", "category", "기타")}
              >
                기타
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => {
              submitScore({
                koreanRaw: Number(rawScores.korean.raw) || 0,
                koreanSelection: rawScores.korean.selectedSubject || undefined,
                mathRaw: Number(rawScores.math.raw) || 0,
                mathSelection: rawScores.math.selectedSubject || undefined,
                englishRaw: Number(rawScores.english.raw) || 0,
                historyRaw: Number(rawScores.koreanHistory.raw) || 0,
                inquiry1Selection: rawScores.inquiry1.subject || undefined,
                inquiry1Raw: Number(rawScores.inquiry1.raw) || 0,
                inquiry2Selection: rawScores.inquiry2.subject || undefined,
                inquiry2Raw: Number(rawScores.inquiry2.raw) || 0,
                foreignSelection: rawScores.secondLanguage.category || undefined,
                // foreignRaw logic missing in state, skipping
              })
            }}
            className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-6 py-2"
          >
            저장
          </Button>
          <Button
            onClick={() => {
              console.log("고3 원점수 입력 수정 모드 활성화")
              alert("수정 모드가 활성화되었습니다.")
            }}
            variant="outline"
            className="border-[#7b1e7a] text-[#7b1e7a] hover:bg-[#faf5fa] px-6 py-2"
          >
            수정
          </Button>
        </div>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">성적 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Exam Info */}
          <div className="mb-8">
            {year && grade && month ? (
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                {year}년 {grade} {month} 모의고사
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
              </h2>
            ) : (
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                모의고사 정보를 선택해주세요
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">정보 필요</span>
              </h2>
            )}
          </div>

          {grade === "고1" ? (
            <>
              {/* Tab Selection */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={activeTab === "raw" ? "default" : "outline"}
                    className={activeTab === "raw" ? "bg-[#7b1e7a] hover:bg-[#5a1559] text-white" : ""}
                    onClick={() => setActiveTab("raw")}
                  >
                    원점수 입력
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === "standard" ? "default" : "outline"}
                    className={activeTab === "standard" ? "bg-[#7b1e7a] hover:bg-[#5a1559] text-white" : ""}
                    onClick={() => setActiveTab("standard")}
                  >
                    표준점수 입력
                  </Button>
                </div>
              </div>

              {activeTab === "raw" ? <Grade1ScoreInput /> : <Grade1StandardScoreInput />}
            </>
          ) : grade === "고2" ? (
            <>
              {/* Grade 2 Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "raw" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  원점수 입력
                </button>
                <button
                  onClick={() => setActiveTab("standard")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "standard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  표준점수 입력
                </button>
              </div>

              {activeTab === "raw" ? <Grade2StandardScoreInput /> : <Grade2RawScoreInput />}
            </>
          ) : grade === "고3" ? (
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={activeTab === "raw" ? "default" : "outline"}
                      className={activeTab === "raw" ? "bg-[#7b1e7a] hover:bg-[#5a1559] text-white" : ""}
                      onClick={() => setActiveTab("raw")}
                    >
                      원점수 입력
                    </Button>
                    <Button
                      size="sm"
                      variant={activeTab === "standard" ? "default" : "outline"}
                      className={activeTab === "standard" ? "bg-[#7b1e7a] hover:bg-[#5a1559] text-white" : ""}
                      onClick={() => setActiveTab("standard")}
                    >
                      표준점수 입력
                    </Button>
                  </div>
                </div>

                {activeTab === "standard" ? <Grade3StandardScoreInput /> : <Grade3RawScoreInput />}

                {/* Submit Button */}
                {/* <div className="mt-8 text-center">
                  <Button onClick={handleSubmit} className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white px-8 py-2">
                    입력완료
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">학생 성적의 수집 및 활용에 동의합니다.</div> */}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-[#7b1e7a] hover:bg-[#5a1559] text-white"
                  onClick={() => setActiveTab("raw")}
                >
                  원점수 입력
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
