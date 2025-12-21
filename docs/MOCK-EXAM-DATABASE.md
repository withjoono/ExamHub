# 모의고사 분석 서비스 데이터베이스 스키마

## 📋 개요

이 문서는 `모의고사 디비 폼.xlsx` 파일을 분석하여 작성된 데이터베이스 스키마입니다.

**분석된 엑셀 시트 (15개):**
| # | 시트명 | 데이터 수 | 설명 |
|---|--------|----------|------|
| 1 | 인적사항 | 9행 | 학생 기본 정보 |
| 2 | 결과 | 5행 | 성취/미션 결과 기록 |
| 3 | 과목목차코드 | 318행 | 과목별 목차 코드 |
| 4 | 교과코드 | 47행 | 교과 코드 매핑 |
| 5 | H32211 | 856행 | 모의고사 문제 데이터 (예시) |
| 6 | 모의고사명 | 45행 | 모의고사 코드-이름 매핑 |
| 7 | 멘토링 | 2행 | 수업/멘토링 정보 |
| 8 | 학생기록 | 2행 | 학생별 모의고사 성적 |
| 9 | 클래스 | 2행 | 목표대학 매핑 |
| 10 | 표점변환 | 16행 | 표준점수 변환표 |
| 11 | 원점변환 | 4행 | 원점수 변환표 |
| 12 | 입결(원점수) | 1행 | 대학별 입결(원점수) |
| 13 | 입결(표준점수) | 1행 | 대학별 입결(표준점수) |
| 14 | 입결(누백) | 1행 | 대학별 입결(누적백분위) |
| 15 | 대학학과코드 | 4,193행 | 대학/학과 상세 정보 |

---

## 🗄️ ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    students     │       │   mock_exams    │       │  universities   │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ student_id      │◄──┐   │ code            │       │ code            │
│ year            │   │   │ name            │       │ name            │
│ school_level    │   │   │ grade           │       │ region          │
│ school_name     │   │   │ year            │       │ short_name      │
│ grade           │   │   │ month           │       │ total_score     │
│ name            │   │   │ type            │       │ conversion_rate │
│ school_type     │   │   └────────┬────────┘       │ status          │
│ phone           │   │            │                └────────┬────────┘
│ parent_phone    │   │            │                         │
│ email           │   │            ▼                         ▼
│ parent_email    │   │   ┌─────────────────┐       ┌─────────────────┐
└────────┬────────┘   │   │ exam_questions  │       │  departments    │
         │            │   │─────────────────│       │─────────────────│
         │            │   │ id (PK)         │       │ id (PK)         │
         │            │   │ mock_exam_id(FK)│       │ university_id   │
         │            │   │ subject_area_id │       │ code            │
         │            │   │ subject_code_id │       │ name            │
         │            │   │ question_number │       │ admission_type  │
         │            │   │ score           │       │ admission_group │
         │            │   │ answer          │       │ category        │
         │            │   │ choice_ratio_1~5│       │ sub_category    │
         │            │   └─────────────────┘       │ quota           │
         │            │                             │ ...반영비율...   │
         ▼            │                             └────────┬────────┘
┌─────────────────┐   │                                      │
│ student_scores  │   │                                      │
│─────────────────│   │                                      ▼
│ id (PK)         │   │                             ┌─────────────────┐
│ student_id (FK) │───┘                             │admission_cutoffs│
│ mock_exam_id(FK)│                                 │─────────────────│
│ korean_type     │                                 │ id (PK)         │
│ korean_raw      │                                 │ department_id   │
│ korean_std      │                                 │ mock_exam_id    │
│ korean_percent  │                                 │ year            │
│ korean_grade    │                                 │ score_type      │
│ english_raw     │                                 │ first_cut_score │
│ english_grade   │                                 │ first_cut_pct   │
│ math_type       │                                 │ final_cut_score │
│ math_raw        │                                 │ final_cut_pct   │
│ math_std        │                                 │ competition_rate│
│ math_percent    │                                 │ additional_rate │
│ math_grade      │                                 └─────────────────┘
│ inquiry1_type   │
│ inquiry1_raw    │   ┌─────────────────┐       ┌─────────────────┐
│ inquiry1_std    │   │  subject_areas  │       │  subject_codes  │
│ inquiry1_percent│   │─────────────────│       │─────────────────│
│ inquiry1_grade  │   │ id (PK)         │       │ id (PK)         │
│ inquiry2_*      │   │ code            │◄──────│ subject_area_id │
│ history_raw     │   │ name            │       │ code            │
│ history_grade   │   └─────────────────┘       │ name            │
│ foreign_type    │                             └─────────────────┘
│ foreign_raw     │
│ foreign_grade   │   ┌─────────────────┐       ┌─────────────────┐
│ total_std_sum   │   │subject_chapters │       │   mentoring     │
│ total_pct_sum   │   │─────────────────│       │─────────────────│
│ top_cumulative  │   │ id (PK)         │       │ id (PK)         │
└─────────────────┘   │ subject_code_id │       │ class_id        │
                      │ chapter_code    │       │ grade           │
                      │ chapter_name    │       │ subject         │
┌─────────────────┐   └─────────────────┘       │ start_date      │
│student_targets  │                             │ class_name      │
│─────────────────│   ┌─────────────────┐       │ teacher_name    │
│ id (PK)         │   │score_conversion │       │ weekly_count    │
│ student_id (FK) │   │    _standard    │       │ duration        │
│ department_id   │   │─────────────────│       │ schedule_*      │
└─────────────────┘   │ id (PK)         │       │ fee             │
                      │ mock_exam_id    │       │ fee_type        │
┌─────────────────┐   │ subject         │       └─────────────────┘
│achievement      │   │ std_score       │
│   _results      │   │ percentile      │       ┌─────────────────┐
│─────────────────│   │ grade           │       │ score_conversion│
│ id (PK)         │   │ cumulative_pct  │       │     _raw        │
│ student_id (FK) │   └─────────────────┘       │─────────────────│
│ mission_id      │                             │ id (PK)         │
│ date            │                             │ mock_exam_id    │
│ start_time      │                             │ subject         │
│ end_time        │                             │ subject_type    │
│ category        │                             │ common_score    │
│ subject         │                             │ selection_score │
│ sub_category    │                             │ std_score       │
│ content         │                             └─────────────────┘
│ amount          │
│ achievement_rate│
│ correct_count   │
│ total_count     │
│ score           │
│ focus_level     │
└─────────────────┘
```

---

## 📊 테이블 상세 스키마

### 1. students (학생 정보)

> 출처: `인적사항` 시트

```sql
CREATE TABLE students (
    id              SERIAL PRIMARY KEY,
    student_id      VARCHAR(20) NOT NULL UNIQUE,  -- 예: ST25000001
    year            INTEGER NOT NULL,              -- 예: 2025
    school_level    VARCHAR(10),                   -- 초/중/고
    school_name     VARCHAR(100),                  -- 학교명
    grade           VARCHAR(10),                   -- 학년 (H1, H2, H3)
    name            VARCHAR(50) NOT NULL,          -- 학생명
    school_type     VARCHAR(20),                   -- 학교타입 (일반고, 특목고 등)
    phone           VARCHAR(20),                   -- 학생 연락처
    parent_phone    VARCHAR(20),                   -- 학부모 연락처
    email           VARCHAR(100),                  -- 학생 이메일
    parent_email    VARCHAR(100),                  -- 학부모 이메일
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_year_grade ON students(year, grade);
```

---

### 2. mock_exams (모의고사)

> 출처: `모의고사명` 시트

```sql
CREATE TABLE mock_exams (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(20) NOT NULL UNIQUE,   -- 예: H32403
    name            VARCHAR(100) NOT NULL,          -- 예: 고3 24년 3월 교육청 모의
    grade           VARCHAR(10),                    -- H1, H2, H3
    year            INTEGER,                        -- 2024
    month           INTEGER,                        -- 3, 6, 9, 10, 11
    type            VARCHAR(20),                    -- 교육청, 평가원, 수능
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 코드 파싱 규칙: H[학년][연도2자리][월2자리]
-- H32403 = H3(고3) + 24(2024년) + 03(3월)
CREATE INDEX idx_mock_exams_code ON mock_exams(code);
CREATE INDEX idx_mock_exams_grade_year ON mock_exams(grade, year, month);
```

---

### 3. subject_areas (교과 영역)

> 출처: `교과코드` 시트

```sql
CREATE TABLE subject_areas (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(10) NOT NULL UNIQUE,   -- S10, S20, S30, ...
    name            VARCHAR(50) NOT NULL           -- 국어, 수학, 영어, 사탐, 과탐, 한국사, 제2외국어
);

-- 초기 데이터
INSERT INTO subject_areas (code, name) VALUES
    ('S10', '국어'),
    ('S20', '수학'),
    ('S30', '영어'),
    ('S40', '사탐'),
    ('S50', '과탐'),
    ('S60', '한국사'),
    ('S70', '제2외국어');
```

---

### 4. subject_codes (세부 교과)

> 출처: `교과코드` 시트

```sql
CREATE TABLE subject_codes (
    id              SERIAL PRIMARY KEY,
    subject_area_id INTEGER REFERENCES subject_areas(id),
    code            VARCHAR(10) NOT NULL UNIQUE,   -- S10, S11, S12, ...
    name            VARCHAR(50) NOT NULL           -- 고1 국어, 고2 국어, 화법과 작문 등
);

CREATE INDEX idx_subject_codes_area ON subject_codes(subject_area_id);
```

---

### 5. subject_chapters (과목 목차)

> 출처: `과목목차코드` 시트

```sql
CREATE TABLE subject_chapters (
    id              SERIAL PRIMARY KEY,
    subject_area_code VARCHAR(10),                  -- subjectArea (10, 20, ...)
    subject_code    VARCHAR(10),                    -- subjectCode (11, 12, ...)
    major_name      VARCHAR(100),                   -- 생활과 윤리, 윤리와 사상 등
    major_code      VARCHAR(10),                    -- major code
    minor_name      VARCHAR(200),                   -- 01. 실천 윤리와 윤리 문제에 대한 탐구
    minor_code      VARCHAR(10)                     -- minor code
);

CREATE INDEX idx_subject_chapters_area ON subject_chapters(subject_area_code, subject_code);
```

---

### 6. exam_questions (모의고사 문제)

> 출처: `H32211` 시트 (각 모의고사별 문제 데이터)

```sql
CREATE TABLE exam_questions (
    id              SERIAL PRIMARY KEY,
    mock_exam_id    INTEGER REFERENCES mock_exams(id),
    subject_area_code VARCHAR(10),                  -- 교과 코드 (60=국어)
    subject_area_name VARCHAR(50),                  -- 국어, 수학, 영어 등
    subject_code    VARCHAR(10),                    -- 세부교과 코드 (63=화법과작문)
    subject_name    VARCHAR(50),                    -- 화법과 작문, 언어와 매체 등
    question_number INTEGER NOT NULL,               -- 문제 번호
    score           INTEGER NOT NULL,               -- 배점
    answer          INTEGER NOT NULL,               -- 정답 (1~5)
    choice_ratio_1  DECIMAL(5,2),                   -- 1번 선택 비율
    choice_ratio_2  DECIMAL(5,2),                   -- 2번 선택 비율
    choice_ratio_3  DECIMAL(5,2),                   -- 3번 선택 비율
    choice_ratio_4  DECIMAL(5,2),                   -- 4번 선택 비율
    choice_ratio_5  DECIMAL(5,2)                    -- 5번 선택 비율
);

CREATE INDEX idx_exam_questions_mock ON exam_questions(mock_exam_id);
CREATE INDEX idx_exam_questions_subject ON exam_questions(subject_area_code, subject_code);
```

---

### 7. student_scores (학생 모의고사 성적)

> 출처: `학생기록` 시트

```sql
CREATE TABLE student_scores (
    id                  SERIAL PRIMARY KEY,
    student_id          INTEGER REFERENCES students(id),
    mock_exam_id        INTEGER REFERENCES mock_exams(id),
    
    -- 국어
    korean_selection    VARCHAR(20),                -- 선택과목 (화작/언매)
    korean_raw          INTEGER,                    -- 원점수
    korean_standard     INTEGER,                    -- 표준점수
    korean_percentile   DECIMAL(5,2),               -- 백분위
    korean_grade        INTEGER,                    -- 등급 (1~9)
    
    -- 영어 (등급제)
    english_raw         INTEGER,
    english_grade       INTEGER,
    
    -- 수학
    math_selection      VARCHAR(20),                -- 선택과목 (확통/미적/기하)
    math_raw            INTEGER,
    math_standard       INTEGER,
    math_percentile     DECIMAL(5,2),
    math_grade          INTEGER,
    
    -- 탐구1
    inquiry1_selection  VARCHAR(50),                -- 선택과목명
    inquiry1_raw        INTEGER,
    inquiry1_standard   INTEGER,
    inquiry1_percentile DECIMAL(5,2),
    inquiry1_grade      INTEGER,
    
    -- 탐구2
    inquiry2_selection  VARCHAR(50),
    inquiry2_raw        INTEGER,
    inquiry2_standard   INTEGER,
    inquiry2_percentile DECIMAL(5,2),
    inquiry2_grade      INTEGER,
    
    -- 한국사
    history_raw         INTEGER,
    history_grade       INTEGER,
    
    -- 제2외국어
    foreign_selection   VARCHAR(50),
    foreign_raw         INTEGER,
    foreign_grade       INTEGER,
    
    -- 합산 점수
    total_standard_sum      INTEGER,                -- 국수탐 표준점수 합
    total_percentile_sum    DECIMAL(6,2),           -- 국수탐 백분위 합
    top_cumulative_std      DECIMAL(6,2),           -- 국영수탐 상위누백(표점)
    top_cumulative_raw      DECIMAL(6,2),           -- 국영수탐 상위누백(원점)
    
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(student_id, mock_exam_id)
);

CREATE INDEX idx_student_scores_student ON student_scores(student_id);
CREATE INDEX idx_student_scores_mock ON student_scores(mock_exam_id);
```

---

### 8. student_targets (학생 목표대학)

> 출처: `클래스` 시트

```sql
CREATE TABLE student_targets (
    id              SERIAL PRIMARY KEY,
    student_id      INTEGER REFERENCES students(id),
    department_code VARCHAR(20),                    -- 대학학과코드 (예: U230)
    priority        INTEGER DEFAULT 1,              -- 우선순위
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_student_targets_student ON student_targets(student_id);
```

---

### 9. universities (대학)

> 출처: `대학학과코드` 시트

```sql
CREATE TABLE universities (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(10) NOT NULL UNIQUE,   -- U001, U002, ...
    name            VARCHAR(100) NOT NULL,          -- 대학명
    short_name      VARCHAR(50),                    -- 약칭 (디지스트, 지스트 등)
    region          VARCHAR(50),                    -- 지역 (서울, 경기, 대구 등)
    total_score     DECIMAL(10,2),                  -- 환산점수 총점
    conversion_rate DECIMAL(10,6),                  -- 1000점 통일 환산율
    status          VARCHAR(20) DEFAULT '존립'      -- 존립, 폐과, 생성, 변경
);

CREATE INDEX idx_universities_code ON universities(code);
CREATE INDEX idx_universities_region ON universities(region);
```

---

### 10. departments (학과)

> 출처: `대학학과코드` 시트

```sql
CREATE TABLE departments (
    id                  SERIAL PRIMARY KEY,
    code                VARCHAR(20) NOT NULL UNIQUE,-- 대학학과코드 (U0011)
    university_id       INTEGER REFERENCES universities(id),
    department_code     VARCHAR(10),                -- 학과코드 (1, 2, ...)
    name                VARCHAR(100) NOT NULL,      -- 모집단위명
    
    -- 기본 정보
    admission_type      VARCHAR(20),                -- 전형유형 (N, ...)
    admission_group     VARCHAR(10),                -- 모집군 (가, 나, 다, 라)
    category            VARCHAR(20),                -- 계열 (자연, 인문, 통합)
    sub_category        VARCHAR(50),                -- 상세계열
    quota               INTEGER,                    -- 모집인원
    selection_method    VARCHAR(20),                -- 선발방식
    
    -- 수능 요소
    score_elements      VARCHAR(50),                -- 수능요소 (표점+변표 등)
    score_combination   VARCHAR(50),                -- 수능조합 (국수영탐(2) 등)
    required_subjects   VARCHAR(100),               -- 필수
    optional_subjects   VARCHAR(100),               -- 선택
    inquiry_count       INTEGER,                    -- 탐구과목수
    
    -- 반영비율
    korean_ratio        VARCHAR(20),                -- 국어 반영비율
    math_ratio          VARCHAR(20),                -- 수학 반영비율
    english_ratio       VARCHAR(20),                -- 영어 반영비율
    inquiry_ratio       VARCHAR(20),                -- 탐구 반영비율
    history_ratio       VARCHAR(20),                -- 한국사 반영비율
    foreign_ratio       VARCHAR(20),                -- 제2외국어 반영비율
    
    -- 선택과목
    korean_selection    VARCHAR(50),                -- 국어 선택과목
    math_selection      VARCHAR(50),                -- 수학 선택과목
    
    -- 가산점
    prob_bonus          DECIMAL(5,2),               -- 확률과 통계 가산점
    calc_bonus          DECIMAL(5,2),               -- 미적분 가산점
    geometry_bonus      DECIMAL(5,2),               -- 기하 가산점
    inquiry_type        VARCHAR(20),                -- 탐구 유형
    social_bonus        DECIMAL(5,2),               -- 사회탐구 가산점
    science_bonus       DECIMAL(5,2),               -- 과학탐구 가산점
    math_science_req    VARCHAR(50),                -- 수탐선택 (미적기하+과탐 필수 등)
    
    -- 영어 등급별 점수 (JSON으로 저장 권장)
    english_score_type  VARCHAR(20),                -- 적용기준
    english_grade_1     DECIMAL(6,2),
    english_grade_2     DECIMAL(6,2),
    english_grade_3     DECIMAL(6,2),
    english_grade_4     DECIMAL(6,2),
    english_grade_5     DECIMAL(6,2),
    english_grade_6     DECIMAL(6,2),
    english_grade_7     DECIMAL(6,2),
    english_grade_8     DECIMAL(6,2),
    english_grade_9     DECIMAL(6,2),
    
    -- 한국사 등급별 점수
    history_score_type  VARCHAR(20),
    history_grade_1     DECIMAL(6,2),
    history_grade_2     DECIMAL(6,2),
    history_grade_3     DECIMAL(6,2),
    history_grade_4     DECIMAL(6,2),
    history_grade_5     DECIMAL(6,2),
    history_grade_6     DECIMAL(6,2),
    history_grade_7     DECIMAL(6,2),
    history_grade_8     DECIMAL(6,2),
    history_grade_9     DECIMAL(6,2),
    history_min_req     VARCHAR(50),                -- 최저기준
    
    status              VARCHAR(20) DEFAULT '존립',
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_departments_university ON departments(university_id);
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_category ON departments(category, sub_category);
```

---

### 11. admission_cutoffs (입결 데이터)

> 출처: `입결(원점수)`, `입결(표준점수)`, `입결(누백)` 시트, `대학학과코드` 시트의 입결 컬럼

```sql
CREATE TABLE admission_cutoffs (
    id                  SERIAL PRIMARY KEY,
    department_id       INTEGER REFERENCES departments(id),
    mock_exam_id        INTEGER REFERENCES mock_exams(id),
    year                INTEGER,                    -- 입결 년도 (22, 23, 24)
    score_type          VARCHAR(20),                -- 'raw', 'standard', 'percentile'
    
    -- 최초컷
    first_cut_score     DECIMAL(10,4),              -- 점수
    first_cut_percentile DECIMAL(10,6),             -- 누백
    
    -- 추합컷
    final_cut_score     DECIMAL(10,4),
    final_cut_percentile DECIMAL(10,6),
    
    -- 위험도별 점수 (모의고사 기준)
    risk_plus_5         DECIMAL(10,6),              -- +5 위험도
    risk_plus_4         DECIMAL(10,6),
    risk_plus_3         DECIMAL(10,6),
    risk_plus_2         DECIMAL(10,6),
    risk_plus_1         DECIMAL(10,6),
    risk_minus_1        DECIMAL(10,6),
    risk_minus_2        DECIMAL(10,6),
    risk_minus_3        DECIMAL(10,6),
    risk_minus_4        DECIMAL(10,6),
    risk_minus_5        DECIMAL(10,6),
    
    -- 경쟁률/충원율
    competition_rate    DECIMAL(6,2),
    additional_rate     DECIMAL(6,2),               -- 충원율
    
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cutoffs_department ON admission_cutoffs(department_id);
CREATE INDEX idx_cutoffs_year ON admission_cutoffs(year);
CREATE INDEX idx_cutoffs_mock ON admission_cutoffs(mock_exam_id);
```

---

### 12. score_conversion_standard (표준점수 변환표)

> 출처: `표점변환` 시트

```sql
CREATE TABLE score_conversion_standard (
    id              SERIAL PRIMARY KEY,
    mock_exam_id    INTEGER REFERENCES mock_exams(id),
    subject         VARCHAR(50) NOT NULL,           -- 국어, 수학(이과), 수학(문과) 등
    standard_score  INTEGER NOT NULL,               -- 표준점수
    percentile      DECIMAL(6,2),                   -- 백분위
    grade           INTEGER,                        -- 등급 (1~9)
    cumulative_pct  DECIMAL(10,6)                   -- 상위누적
);

CREATE INDEX idx_std_conv_mock ON score_conversion_standard(mock_exam_id);
CREATE INDEX idx_std_conv_subject ON score_conversion_standard(subject, standard_score);
```

---

### 13. score_conversion_raw (원점수 변환표)

> 출처: `원점변환` 시트

```sql
CREATE TABLE score_conversion_raw (
    id              SERIAL PRIMARY KEY,
    mock_exam_id    INTEGER REFERENCES mock_exams(id),
    subject         VARCHAR(50) NOT NULL,           -- 국어, 수학, 영어 등
    subject_type    VARCHAR(50),                    -- 선택과목 (언매, 화작 등)
    common_score    INTEGER,                        -- 공통 점수
    selection_score INTEGER,                        -- 선택 점수
    standard_score  INTEGER                         -- 변환된 표준점수
);

CREATE INDEX idx_raw_conv_mock ON score_conversion_raw(mock_exam_id);
CREATE INDEX idx_raw_conv_subject ON score_conversion_raw(subject, subject_type);
```

---

### 14. mentoring (멘토링/수업)

> 출처: `멘토링` 시트

```sql
CREATE TABLE mentoring (
    id              SERIAL PRIMARY KEY,
    class_id        VARCHAR(30) NOT NULL UNIQUE,    -- 예: MK10S0125011601
    grade           VARCHAR(10),                    -- K10, K00 등
    subject         VARCHAR(10),                    -- S01, S02 등
    start_date      DATE,                           -- 수업시작날짜
    class_name      VARCHAR(100),                   -- 수업명
    teacher_name    VARCHAR(50),                    -- 선생님명
    weekly_count    INTEGER,                        -- 주당수업회수
    duration        VARCHAR(10),                    -- 1회 수업시간 (3H 등)
    
    -- 일정1
    day_1           VARCHAR(10),                    -- 요일
    start_time_1    TIME,                           -- 시작시간
    end_time_1      TIME,                           -- 끝시간
    
    -- 일정2
    day_2           VARCHAR(10),
    start_time_2    TIME,
    end_time_2      TIME,
    
    fee             INTEGER,                        -- 수업료
    fee_type        VARCHAR(20),                    -- 수업료기준 (월간, 회당)
    
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mentoring_grade ON mentoring(grade);
CREATE INDEX idx_mentoring_teacher ON mentoring(teacher_name);
```

---

### 15. achievement_results (성취 결과)

> 출처: `결과` 시트

```sql
CREATE TABLE achievement_results (
    id                  SERIAL PRIMARY KEY,
    result_id           VARCHAR(30) NOT NULL UNIQUE,-- 성취결과 ID
    student_id          INTEGER REFERENCES students(id),
    mission_id          VARCHAR(30),                -- 미션 ID
    date                DATE,                       -- 날짜
    start_time          TIME,                       -- 시작시간
    end_time            TIME,                       -- 끝시간
    category            VARCHAR(20),                -- 분류 (학습, 테스트 등)
    subject             VARCHAR(20),                -- 과목
    sub_category        VARCHAR(20),                -- 분류 (수업, 과제 등)
    content             VARCHAR(100),               -- 내용
    amount              INTEGER,                    -- 분량
    achievement_rate    DECIMAL(5,2),               -- 성취율
    correct_count       INTEGER,                    -- 맞은문항수
    total_count         INTEGER,                    -- 전체문항수
    score               INTEGER,                    -- 점수
    focus_level         DECIMAL(5,2),               -- 몰입도
    
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievement_student ON achievement_results(student_id);
CREATE INDEX idx_achievement_date ON achievement_results(date);
```

---

## 📝 TypeORM Entity 예시

### Student Entity

```typescript
// src/entities/student.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StudentScore } from './student-score.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id', length: 20, unique: true })
  studentId: string;

  @Column()
  year: number;

  @Column({ name: 'school_level', length: 10, nullable: true })
  schoolLevel: string;

  @Column({ name: 'school_name', length: 100, nullable: true })
  schoolName: string;

  @Column({ length: 10, nullable: true })
  grade: string;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'school_type', length: 20, nullable: true })
  schoolType: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'parent_phone', length: 20, nullable: true })
  parentPhone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'parent_email', length: 100, nullable: true })
  parentEmail: string;

  @OneToMany(() => StudentScore, (score) => score.student)
  scores: StudentScore[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### MockExam Entity

```typescript
// src/entities/mock-exam.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ExamQuestion } from './exam-question.entity';

@Entity('mock_exams')
export class MockExam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10, nullable: true })
  grade: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  month: number;

  @Column({ length: 20, nullable: true })
  type: string;

  @OneToMany(() => ExamQuestion, (question) => question.mockExam)
  questions: ExamQuestion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Department Entity

```typescript
// src/entities/department.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { University } from './university.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  code: string;

  @ManyToOne(() => University)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column({ name: 'department_code', length: 10, nullable: true })
  departmentCode: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'admission_type', length: 20, nullable: true })
  admissionType: string;

  @Column({ name: 'admission_group', length: 10, nullable: true })
  admissionGroup: string;

  @Column({ length: 20, nullable: true })
  category: string;

  @Column({ name: 'sub_category', length: 50, nullable: true })
  subCategory: string;

  @Column({ nullable: true })
  quota: number;

  // ... 나머지 컬럼들

  @Column({ length: 20, default: '존립' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 🔄 데이터 마이그레이션 스크립트

엑셀 데이터를 데이터베이스로 마이그레이션하기 위한 Python 스크립트 예시:

```python
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

def import_universities(excel_file, conn):
    """대학학과코드 시트에서 대학 정보 추출 및 저장"""
    df = pd.read_excel(excel_file, sheet_name='대학학과코드', skiprows=1)
    
    # 대학 정보 추출 (중복 제거)
    universities = df[['대학명', '지역', '대학코드']].drop_duplicates(subset=['대학코드'])
    
    with conn.cursor() as cur:
        for _, row in universities.iterrows():
            cur.execute("""
                INSERT INTO universities (code, name, region)
                VALUES (%s, %s, %s)
                ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
            """, (row['대학코드'], row['대학명'], row['지역']))
    
    conn.commit()

def import_mock_exams(excel_file, conn):
    """모의고사명 시트 데이터 저장"""
    df = pd.read_excel(excel_file, sheet_name='모의고사명')
    
    with conn.cursor() as cur:
        for _, row in df.iterrows():
            code = row['모의고사 코드']
            name = row['모의고사 명']
            
            # 코드 파싱: H32403 -> grade=H3, year=24, month=03
            grade = code[:2]  # H3
            year = 2000 + int(code[2:4])  # 2024
            month = int(code[4:6])  # 3
            
            cur.execute("""
                INSERT INTO mock_exams (code, name, grade, year, month)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (code) DO NOTHING
            """, (code, name, grade, year, month))
    
    conn.commit()

# 사용 예시
if __name__ == '__main__':
    conn = psycopg2.connect(
        host='localhost',
        database='geobuk_mock',
        user='postgres',
        password='password'
    )
    
    excel_file = 'Uploads/모의고사 디비 폼.xlsx'
    
    import_universities(excel_file, conn)
    import_mock_exams(excel_file, conn)
    
    conn.close()
```

---

## 📌 참고 사항

### 코드 체계

1. **학생 ID**: `ST` + 연도(2자리) + 일련번호(6자리)
   - 예: `ST25000001` = 2025년 학생 #1

2. **모의고사 코드**: `H` + 학년(1자리) + 연도(2자리) + 월(2자리)
   - 예: `H32403` = 고3, 2024년, 3월
   - 예: `H12406` = 고1, 2024년, 6월

3. **대학학과코드**: `U` + 대학코드(3자리) + 학과번호
   - 예: `U0011` = 대구경북과학기술원 반도체공학과
   - 예: `U2301` = 서울대 xxx학과

4. **멘토링 ID**: `M` + 학년코드 + 과목코드 + 날짜 + 번호
   - 예: `MK10S0125011601`

### 향후 확장

- [ ] 문제별 분석 데이터 (오답률, 변별력 등)
- [ ] 학생별 취약점 분석 테이블
- [ ] 성적 추이 분석 뷰
- [ ] 대학 합격 예측 모델 데이터











