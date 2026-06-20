export const calculators = [
  { id: 'salary',       name: '연봉 실수령액',   icon: '💰', description: '2026년 세율 기준 월 실수령액 및 4대보험 계산', path: '/salary',       categorySlug: 'salary-labor',  rank: 1 },
  { id: 'unemployment', name: '실업급여',        icon: '📋', description: '퇴직 후 받을 수 있는 실업급여 총액 계산',     path: '/unemployment', categorySlug: 'salary-labor',  rank: 2 },
  { id: 'retirement',   name: '퇴직금',          icon: '🏦', description: '근속기간과 평균월급으로 퇴직금 계산',          path: '/retirement',   categorySlug: 'salary-labor',  rank: 3 },
  { id: 'capital-gains',name: '양도소득세',      icon: '🏠', description: '부동산 매도 시 납부할 양도소득세 계산',       path: '/capital-gains',categorySlug: 'real-estate',   rank: 4 },
  { id: 'loan',         name: '대출 이자',       icon: '🏧', description: '원금균등/원리금균등 방식 대출이자 계산',       path: '/loan',         categorySlug: 'finance',       rank: 5 },
  { id: 'minimum-wage', name: '최저시급/알바',   icon: '⏰', description: '2026년 최저시급 기준 일급·주급·월급 계산',    path: '/minimum-wage', categorySlug: 'salary-labor',  rank: 6 },
  { id: 'insurance',    name: '4대보험',         icon: '🛡️', description: '근로자·사업주 부담 4대보험료 상세 계산',      path: '/insurance',    categorySlug: 'salary-labor',  rank: 7 },
  { id: 'year-end-tax', name: '연말정산',        icon: '📄', description: '예상 환급액 또는 추가납부액 미리 계산',        path: '/year-end-tax', categorySlug: 'salary-labor',  rank: 8 },
  { id: 'bmi',          name: 'BMI 체질량지수',  icon: '⚖️', description: '키와 몸무게로 비만도 판정 및 정상체중 범위',  path: '/bmi',          categorySlug: 'health',        rank: 9 },
  { id: 'dday',         name: 'D-day 카운터',   icon: '📅', description: '목표일까지 실시간 카운트다운, 여러 개 저장',  path: '/dday',         categorySlug: 'convenience',   rank: 10 },
]
