// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatWon(amount) {
  if (isNaN(amount) || amount === null) return '0원'
  return Math.round(amount).toLocaleString('ko-KR') + '원'
}

export function formatNumber(n) {
  if (isNaN(n) || n === null) return '0'
  return Math.round(n).toLocaleString('ko-KR')
}

// ─── 1. 연봉 실수령액 ──────────────────────────────────────────────────────────

function calcIncomeTax(annualSalary, dependents) {
  // 근로소득공제
  let earnedDeduction
  if (annualSalary <= 5_000_000) earnedDeduction = annualSalary * 0.7
  else if (annualSalary <= 15_000_000) earnedDeduction = 3_500_000 + (annualSalary - 5_000_000) * 0.4
  else if (annualSalary <= 45_000_000) earnedDeduction = 7_500_000 + (annualSalary - 15_000_000) * 0.15
  else if (annualSalary <= 100_000_000) earnedDeduction = 12_000_000 + (annualSalary - 45_000_000) * 0.05
  else earnedDeduction = 14_750_000 + (annualSalary - 100_000_000) * 0.02
  earnedDeduction = Math.min(earnedDeduction, 20_000_000)

  // 인적공제 (본인 + 부양가족)
  const personalDeduction = 1_500_000 * (1 + Number(dependents))

  const taxableIncome = Math.max(0, annualSalary - earnedDeduction - personalDeduction)

  // 세율
  let tax = 0
  if (taxableIncome <= 14_000_000) tax = taxableIncome * 0.06
  else if (taxableIncome <= 50_000_000) tax = 840_000 + (taxableIncome - 14_000_000) * 0.15
  else if (taxableIncome <= 88_000_000) tax = 6_240_000 + (taxableIncome - 50_000_000) * 0.24
  else if (taxableIncome <= 150_000_000) tax = 15_360_000 + (taxableIncome - 88_000_000) * 0.35
  else if (taxableIncome <= 300_000_000) tax = 37_060_000 + (taxableIncome - 150_000_000) * 0.38
  else if (taxableIncome <= 500_000_000) tax = 94_060_000 + (taxableIncome - 300_000_000) * 0.40
  else if (taxableIncome <= 1_000_000_000) tax = 174_060_000 + (taxableIncome - 500_000_000) * 0.42
  else tax = 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45

  // 근로소득세액공제
  let taxCredit = tax <= 1_300_000 ? tax * 0.55 : 715_000 + (tax - 1_300_000) * 0.3
  taxCredit = Math.min(taxCredit, 740_000)

  return Math.max(0, tax - taxCredit)
}

export function calculateSalary(annualSalary, dependents) {
  const salary = Number(annualSalary)
  if (!salary || salary <= 0) return null

  const monthly = salary / 12
  // 국민연금: 4.5%, 상한 기준소득월액 617만원
  const pensionBase = Math.min(monthly, 6_170_000)
  const nationalPension = pensionBase * 0.045
  const healthInsurance = monthly * 0.03545
  const longTermCare = healthInsurance * 0.1295
  const employmentInsurance = monthly * 0.009

  const annualIncomeTax = calcIncomeTax(salary, dependents)
  const monthlyIncomeTax = annualIncomeTax / 12
  const localTax = monthlyIncomeTax * 0.1

  const totalDeduction = nationalPension + healthInsurance + longTermCare +
    employmentInsurance + monthlyIncomeTax + localTax
  const netSalary = monthly - totalDeduction

  return {
    monthly,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    monthlyIncomeTax,
    localTax,
    totalDeduction,
    netSalary,
  }
}

// ─── 2. 실업급여 ───────────────────────────────────────────────────────────────

const UNEMPLOYMENT_MIN_WAGE_2026 = 10_030
const UNEMPLOYMENT_UPPER = 66_000

function getBenefitDays(totalMonths, age) {
  const isOlder = age >= 50
  if (totalMonths < 12) return 120
  if (totalMonths < 36) return isOlder ? 180 : 150
  if (totalMonths < 60) return isOlder ? 210 : 180
  if (totalMonths < 120) return isOlder ? 240 : 210
  return isOlder ? 270 : 240
}

export function calculateUnemployment(monthlyPay, workYears, workMonths, age) {
  const pay = Number(monthlyPay)
  if (!pay || pay <= 0) return null

  const totalMonths = Number(workYears) * 12 + Number(workMonths)
  if (totalMonths < 6) return { error: '고용보험 가입기간이 6개월 미만입니다.' }

  const dailyWage = (pay * 3) / 91
  const rawDaily = dailyWage * 0.6
  const lowerLimit = UNEMPLOYMENT_MIN_WAGE_2026 * 0.8 * 8
  const dailyBenefit = Math.min(Math.max(rawDaily, lowerLimit), UNEMPLOYMENT_UPPER)
  const benefitDays = getBenefitDays(totalMonths, Number(age))
  const totalBenefit = dailyBenefit * benefitDays

  return { dailyBenefit, benefitDays, totalBenefit, lowerLimit }
}

// ─── 3. 퇴직금 ────────────────────────────────────────────────────────────────

function calcRetirementTax(amount, workYears) {
  // 근속공제
  let deduction = 0
  const y = Math.floor(workYears)
  if (y <= 5) deduction = 300_000 * y
  else if (y <= 10) deduction = 1_500_000 + 500_000 * (y - 5)
  else if (y <= 20) deduction = 4_000_000 + 800_000 * (y - 10)
  else deduction = 12_000_000 + 1_200_000 * (y - 20)

  const taxableIncome = Math.max(0, (amount - deduction) / 2)
  let tax = 0
  if (taxableIncome <= 14_000_000) tax = taxableIncome * 0.06
  else if (taxableIncome <= 50_000_000) tax = 840_000 + (taxableIncome - 14_000_000) * 0.15
  else if (taxableIncome <= 88_000_000) tax = 6_240_000 + (taxableIncome - 50_000_000) * 0.24
  else tax = 15_360_000 + (taxableIncome - 88_000_000) * 0.35

  return Math.max(0, tax * 1.1) // 지방소득세 포함
}

export function calculateRetirement(startDate, endDate, avgMonthlyPay) {
  if (!startDate || !endDate || !avgMonthlyPay) return null

  const start = new Date(startDate)
  const end = new Date(endDate)
  const workDays = Math.floor((end - start) / (1000 * 60 * 60 * 24))
  const workYears = workDays / 365

  if (workYears < 1) return { error: '퇴직금은 1년 이상 근무해야 발생합니다.' }

  const dailyAvg = (Number(avgMonthlyPay) * 3) / 91
  const retirementPay = dailyAvg * 30 * workYears
  const tax = calcRetirementTax(retirementPay, workYears)
  const afterTaxPay = retirementPay - tax

  return { workDays, workYears, retirementPay, tax, afterTaxPay }
}

// ─── 4. 양도소득세 ─────────────────────────────────────────────────────────────

export function calculateCapitalGains(acquisitionPrice, transferPrice, holdingYears, isOneHousehold) {
  const acq = Number(acquisitionPrice)
  const trans = Number(transferPrice)
  const years = Number(holdingYears)
  if (!acq || !trans) return null

  const transferGain = trans - acq
  if (transferGain <= 0) return { transferGain, deduction: 0, taxableGain: 0, taxAmount: 0 }

  // 1가구1주택 비과세 (12억 이하, 2년 이상 보유)
  if (isOneHousehold && years >= 2 && trans <= 1_200_000_000) {
    return { transferGain, deduction: transferGain, taxableGain: 0, taxAmount: 0, exempt: true }
  }

  // 장기보유특별공제
  let longTermDeductionRate = 0
  if (isOneHousehold) {
    if (years >= 10) longTermDeductionRate = 0.80
    else if (years >= 3) longTermDeductionRate = Math.min(0.80, (years - 2) * 0.08)
  } else {
    if (years >= 15) longTermDeductionRate = 0.30
    else if (years >= 3) longTermDeductionRate = (years - 2) * 0.02
  }

  const longTermDeduction = transferGain * longTermDeductionRate
  // 기본공제 250만원
  const basicDeduction = 2_500_000
  const taxableGain = Math.max(0, transferGain - longTermDeduction - basicDeduction)

  // 세율 (보유기간별)
  let rate
  if (years < 1) rate = 0.70
  else if (years < 2) rate = 0.60
  else rate = taxableGain <= 14_000_000 ? 0.06
    : taxableGain <= 50_000_000 ? 0.15
    : taxableGain <= 88_000_000 ? 0.24
    : taxableGain <= 150_000_000 ? 0.35
    : taxableGain <= 300_000_000 ? 0.38
    : 0.40

  const taxAmount = taxableGain * rate * 1.1 // 지방소득세 포함

  return {
    transferGain,
    longTermDeduction,
    basicDeduction,
    taxableGain,
    taxAmount,
    longTermDeductionRate,
  }
}

// ─── 5. 대출이자 ───────────────────────────────────────────────────────────────

export function calculateLoan(loanAmount, annualRate, termMonths, repaymentType) {
  const P = Number(loanAmount)
  const n = Number(termMonths)
  const r = Number(annualRate) / 100 / 12
  if (!P || !n || !annualRate) return null

  const schedule = []

  if (repaymentType === 'equal-payment') {
    // 원리금균등
    const M = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    let balance = P
    let totalInterest = 0
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r
      const principalPart = M - interestPart
      balance -= principalPart
      totalInterest += interestPart
      if (i <= 3 || i === n) schedule.push({ month: i, payment: M, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) })
    }
    return { monthlyPayment: M, totalInterest, totalPayment: M * n, schedule, type: 'equal-payment' }
  } else {
    // 원금균등
    const principalPart = P / n
    let balance = P
    let totalInterest = 0
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r
      const payment = principalPart + interestPart
      balance -= principalPart
      totalInterest += interestPart
      if (i <= 3 || i === n) schedule.push({ month: i, payment, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) })
    }
    const firstMonthPayment = principalPart + P * r
    return { monthlyPayment: firstMonthPayment, totalInterest, totalPayment: P + totalInterest, schedule, type: 'equal-principal' }
  }
}

// ─── 6. 최저시급/알바 ─────────────────────────────────────────────────────────

export const MIN_WAGE_2026 = 10_030

export function calculateMinimumWage(hourlyWage, hoursPerDay, daysPerWeek) {
  const wage = Number(hourlyWage) || MIN_WAGE_2026
  const hours = Number(hoursPerDay)
  const days = Number(daysPerWeek)
  if (!hours || !days) return null

  const dailyPay = wage * hours
  const weeklyHours = hours * days
  // 주휴수당: 주 15시간 이상 시 1일분 지급
  const weeklyHolidayPay = weeklyHours >= 15 ? wage * (weeklyHours / days) : 0
  const weeklyPay = dailyPay * days + weeklyHolidayPay
  // 월 소정근로시간: (주간소정근로시간 + 주휴시간) × 4.345주
  const monthlyHours = (weeklyHours + (weeklyHours >= 15 ? weeklyHours / days : 0)) * (365 / 7 / 12)
  const monthlyPay = wage * monthlyHours

  return { dailyPay, weeklyPay, weeklyHolidayPay, monthlyPay, monthlyHours }
}

// ─── 7. 4대보험 ───────────────────────────────────────────────────────────────

export function calculateInsurance(monthlySalary) {
  const salary = Number(monthlySalary)
  if (!salary || salary <= 0) return null

  const pensionBase = Math.min(salary, 6_170_000)
  const empNationalPension = pensionBase * 0.045
  const emplNationalPension = pensionBase * 0.045

  const empHealth = salary * 0.03545
  const emplHealth = salary * 0.03545
  const empLongTerm = empHealth * 0.1295
  const emplLongTerm = emplHealth * 0.1295

  const empEmployment = salary * 0.009
  const emplEmployment = salary * 0.009 // 150인 미만 기준

  return {
    employee: {
      nationalPension: empNationalPension,
      health: empHealth,
      longTerm: empLongTerm,
      employment: empEmployment,
      total: empNationalPension + empHealth + empLongTerm + empEmployment,
    },
    employer: {
      nationalPension: emplNationalPension,
      health: emplHealth,
      longTerm: emplLongTerm,
      employment: emplEmployment,
      total: emplNationalPension + emplHealth + emplLongTerm + emplEmployment,
    },
  }
}

// ─── 8. 연말정산 ───────────────────────────────────────────────────────────────

export function calculateYearEndTax(annualSalary, dependents, creditCard, medicalExpense, educationExpense) {
  const salary = Number(annualSalary)
  if (!salary || salary <= 0) return null

  // 이미 납부한 세액 (원천징수)
  const paidTax = calcIncomeTax(salary, 0) // 기본 원천징수 (부양가족 미반영)

  // 추가 공제 반영한 결정세액
  const dep = Number(dependents)
  let taxableBase = salary
  // 근로소득공제
  let earnedDeduction
  if (salary <= 5_000_000) earnedDeduction = salary * 0.7
  else if (salary <= 15_000_000) earnedDeduction = 3_500_000 + (salary - 5_000_000) * 0.4
  else if (salary <= 45_000_000) earnedDeduction = 7_500_000 + (salary - 15_000_000) * 0.15
  else if (salary <= 100_000_000) earnedDeduction = 12_000_000 + (salary - 45_000_000) * 0.05
  else earnedDeduction = 14_750_000 + (salary - 100_000_000) * 0.02
  earnedDeduction = Math.min(earnedDeduction, 20_000_000)

  const personalDeduction = 1_500_000 * (1 + dep)

  // 신용카드 소득공제 (총급여의 25% 초과분의 15~30%)
  const ccThreshold = salary * 0.25
  const ccAmount = Number(creditCard)
  const ccDeduction = ccAmount > ccThreshold ? Math.min((ccAmount - ccThreshold) * 0.15, 3_000_000) : 0

  // 의료비 세액공제 (총급여의 3% 초과분의 15%)
  const medThreshold = salary * 0.03
  const medAmount = Number(medicalExpense)
  const medCredit = medAmount > medThreshold ? Math.min((medAmount - medThreshold) * 0.15, 7_000_000) : 0

  // 교육비 세액공제 (15%)
  const eduCredit = Math.min(Number(educationExpense) * 0.15, 2_700_000)

  const taxableIncome = Math.max(0, salary - earnedDeduction - personalDeduction - ccDeduction)

  let finalTax = 0
  if (taxableIncome <= 14_000_000) finalTax = taxableIncome * 0.06
  else if (taxableIncome <= 50_000_000) finalTax = 840_000 + (taxableIncome - 14_000_000) * 0.15
  else if (taxableIncome <= 88_000_000) finalTax = 6_240_000 + (taxableIncome - 50_000_000) * 0.24
  else if (taxableIncome <= 150_000_000) finalTax = 15_360_000 + (taxableIncome - 88_000_000) * 0.35
  else finalTax = 37_060_000 + (taxableIncome - 150_000_000) * 0.38

  // 세액공제 적용
  let taxCredit = finalTax <= 1_300_000 ? finalTax * 0.55 : 715_000 + (finalTax - 1_300_000) * 0.3
  taxCredit = Math.min(taxCredit, 740_000)
  finalTax = Math.max(0, finalTax - taxCredit - medCredit - eduCredit)

  const refund = paidTax - finalTax

  return {
    paidTax,
    finalTax,
    refund,
    ccDeduction,
    medCredit,
    eduCredit,
  }
}

// ─── 10. 주휴수당 ─────────────────────────────────────────────────────────────

export function calculateWeeklyHoliday(hourlyWage, hoursPerDay, daysPerWeek) {
  const wage = Number(hourlyWage)
  const h = Number(hoursPerDay)
  const d = Number(daysPerWeek)
  if (!wage || !h || !d) return null
  const weeklyHours = h * d
  if (weeklyHours < 15) return { eligible: false, weeklyHours }
  const weeklyHolidayPay = wage * (weeklyHours / 5)
  const weeklyTotalPay = wage * weeklyHours + weeklyHolidayPay
  const monthlyPay = weeklyTotalPay * (365 / 7 / 12)
  return { eligible: true, weeklyHours, weeklyHolidayPay, weeklyTotalPay, monthlyPay }
}

// ─── 11. 취득세 ───────────────────────────────────────────────────────────────

export function calculateAcquisitionTax(price, ownedCount, isAdjusted, propertyType, areaM2) {
  const p = Number(price)
  if (!p) return null
  const count = Number(ownedCount) // 취득 후 보유 주택 수
  const area = Number(areaM2) || 0

  let taxRate = 0
  if (propertyType === 'non-house') {
    taxRate = 0.04
  } else if (propertyType === 'land') {
    taxRate = 0.03
  } else {
    // 주택: 취득 후 보유 수 기준
    if (count <= 1) {
      if (p <= 600_000_000) taxRate = 0.01
      else if (p <= 900_000_000) taxRate = ((p - 600_000_000) / 300_000_000) * 0.02 + 0.01
      else taxRate = 0.03
    } else if (count === 2) {
      taxRate = isAdjusted ? 0.08 : (p <= 600_000_000 ? 0.01 : p <= 900_000_000 ? ((p - 600_000_000) / 300_000_000) * 0.02 + 0.01 : 0.03)
    } else {
      taxRate = isAdjusted ? 0.12 : 0.08
    }
  }

  const baseTax = p * taxRate
  // 지방교육세 (취득세율 기준, 주택)
  const eduTaxRate = propertyType === 'house' && taxRate <= 0.01 ? 0.001
    : taxRate <= 0.03 ? taxRate * 0.2 : taxRate * 0.2
  const eduTax = p * eduTaxRate
  // 농어촌특별세 (85㎡ 이하 주택 면제, 취득세율 1% 이하 면제)
  let ruralTax = 0
  if (propertyType === 'house' && taxRate > 0.01 && !(area > 0 && area <= 85)) {
    ruralTax = baseTax * 0.1
  } else if (propertyType === 'non-house') {
    ruralTax = baseTax * 0.2
  }

  return { taxRate, baseTax, eduTax, ruralTax, total: baseTax + eduTax + ruralTax }
}

// ─── 12. 증여세 ───────────────────────────────────────────────────────────────

export function calculateGiftTax(giftAmount, relationship) {
  const amount = Number(giftAmount)
  if (!amount) return null

  // 증여재산공제 (10년 합산)
  const deductionMap = {
    spouse: 600_000_000,
    lineal_minor: 20_000_000,
    lineal_adult: 50_000_000,
    other_relative: 10_000_000,
    non_relative: 0,
  }
  const deduction = deductionMap[relationship] || 0
  const taxableBase = Math.max(0, amount - deduction)
  if (taxableBase === 0) return { deduction, taxableBase: 0, taxBeforeCredit: 0, reportCredit: 0, finalTax: 0 }

  // 누진세율
  let tax = 0
  if (taxableBase <= 100_000_000) tax = taxableBase * 0.10
  else if (taxableBase <= 500_000_000) tax = 10_000_000 + (taxableBase - 100_000_000) * 0.20
  else if (taxableBase <= 1_000_000_000) tax = 90_000_000 + (taxableBase - 500_000_000) * 0.30
  else if (taxableBase <= 3_000_000_000) tax = 240_000_000 + (taxableBase - 1_000_000_000) * 0.40
  else tax = 1_040_000_000 + (taxableBase - 3_000_000_000) * 0.50

  const reportCredit = tax * 0.03 // 신고세액공제 3%
  const finalTax = Math.max(0, tax - reportCredit)

  return { deduction, taxableBase, taxBeforeCredit: tax, reportCredit, finalTax }
}

// ─── 13. 부동산 중개수수료 ────────────────────────────────────────────────────

export function calculateRealEstateFee(transactionType, price, monthlyRent, deposit) {
  let base = Number(price)

  // 월세의 경우 환산금액 = 보증금 + 월세×100 (단, 5천만원 미만이면 월세×70)
  if (transactionType === 'monthly') {
    const dep = Number(deposit) || 0
    const rent = Number(monthlyRent) || 0
    const converted = dep + rent * 100
    base = converted
  }

  if (!base || base <= 0) return null

  const isSale = transactionType === 'sale'
  let rate = 0
  let limit = Infinity

  if (isSale) {
    if (base < 50_000_000)        { rate = 0.006; limit = 250_000 }
    else if (base < 200_000_000)  { rate = 0.005; limit = 800_000 }
    else if (base < 900_000_000)  { rate = 0.004 }
    else if (base < 1_200_000_000){ rate = 0.005 }
    else if (base < 1_500_000_000){ rate = 0.006 }
    else                           { rate = 0.007 }
  } else {
    if (base < 50_000_000)        { rate = 0.005; limit = 200_000 }
    else if (base < 100_000_000)  { rate = 0.004; limit = 300_000 }
    else if (base < 600_000_000)  { rate = 0.003 }
    else if (base < 1_200_000_000){ rate = 0.004 }
    else if (base < 1_500_000_000){ rate = 0.005 }
    else                           { rate = 0.006 }
  }

  const raw = base * rate
  const fee = Math.min(raw, limit)
  const vat = fee * 0.1

  return { base, rate, fee, vat, total: fee + vat }
}

// ─── 14. 적금 이자 ────────────────────────────────────────────────────────────

export function calculateSavings(monthlyDeposit, annualRate, termMonths) {
  const pmt = Number(monthlyDeposit)
  const r = Number(annualRate) / 100 / 12
  const n = Number(termMonths)
  if (!pmt || !n || annualRate === undefined) return null

  const totalPrincipal = pmt * n
  let totalInterest = 0

  if (r === 0) {
    totalInterest = 0
  } else {
    // 매월 납입, 만기 일시지급
    // 이자 = Σ (pmt × r × 잔여개월수) for 1~n
    // = pmt × r × n(n+1)/2
    totalInterest = pmt * r * (n * (n + 1)) / 2
  }

  const taxRate = 0.154
  const taxAmount = totalInterest * taxRate
  const netInterest = totalInterest - taxAmount
  const maturityAmount = totalPrincipal + netInterest

  return { totalPrincipal, totalInterest, taxAmount, netInterest, maturityAmount }
}

// ─── 15. 복리 계산 ────────────────────────────────────────────────────────────

export function calculateCompoundInterest(principal, annualRate, years, additionalMonthly, frequency) {
  const pv = Number(principal)
  const rate = Number(annualRate) / 100
  const n = Number(years)
  const add = Number(additionalMonthly) || 0
  if (!pv || !rate || !n) return null

  // frequency: 'year' or 'month'
  const periodsPerYear = frequency === 'month' ? 12 : 1
  const rPerPeriod = rate / periodsPerYear
  const totalPeriods = n * periodsPerYear

  const fvPrincipal = pv * Math.pow(1 + rPerPeriod, totalPeriods)
  let fvAdditional = 0
  if (add > 0 && frequency === 'month') {
    fvAdditional = add * ((Math.pow(1 + rPerPeriod, totalPeriods) - 1) / rPerPeriod)
  }
  const totalFV = fvPrincipal + fvAdditional
  const totalPrincipal = pv + add * (frequency === 'month' ? n * 12 : 0)
  const totalInterest = totalFV - totalPrincipal

  return { totalFV, totalPrincipal, totalInterest, fvPrincipal }
}

// ─── 16. 육아휴직급여 (2024년 개정) ───────────────────────────────────────────

export function calculateParentalLeave(monthlyWage, months) {
  const wage = Number(monthlyWage)
  const m = Number(months)
  if (!wage || !m || m < 1 || m > 12) return null

  const schedule = []
  let total = 0
  for (let i = 1; i <= m; i++) {
    let rate, cap
    if (i <= 3) { rate = 1.0; cap = 2_000_000 }
    else if (i <= 6) { rate = 0.80; cap = 1_500_000 }
    else { rate = 0.50; cap = 1_200_000 }
    const raw = wage * rate
    const amount = Math.max(700_000, Math.min(raw, cap))
    schedule.push({ month: i, rate, raw, amount })
    total += amount
  }

  return { schedule, total, averageMonthly: total / m }
}

// ─── 17. 기초연금 추정 ────────────────────────────────────────────────────────

export function calculateBasicPension(monthlyIncome, assets, isCouple) {
  // 2025년 기준 (2026년 소폭 인상 가정)
  const MAX_SINGLE = 342_510
  const MAX_COUPLE_EACH = 274_010
  const threshold = isCouple ? 3_408_000 : 2_130_000

  const income = Number(monthlyIncome) || 0
  // 재산 소득환산액 (일반재산): (재산 - 기본공제액) × 환산율 / 12
  // 기본공제: 지역별 다르나 1억 3,500만원으로 가정 (중소도시)
  const assetVal = Number(assets) || 0
  const basicExemption = 135_000_000
  const incomeFromAsset = Math.max(0, (assetVal - basicExemption) * 0.04 / 12)
  const recognizedIncome = income + incomeFromAsset

  const maxPension = isCouple ? MAX_COUPLE_EACH : MAX_SINGLE
  if (recognizedIncome >= threshold) {
    return { recognizedIncome, eligible: false, monthly: 0, isCouple }
  }
  // 소득역전방지: 기초연금액 + 소득인정액 ≤ 선정기준액
  const raw = maxPension - (recognizedIncome - (threshold - maxPension))
  const monthly = Math.max(0, Math.min(maxPension, raw))

  return { recognizedIncome, eligible: true, monthly, isCouple, annualTotal: monthly * 12 }
}

// ─── 18. 국민연금 예상 수령액 ─────────────────────────────────────────────────

export function calculateNationalPension(avgMonthlyIncome, joinMonths) {
  const B = Number(avgMonthlyIncome) || 0
  const n = Number(joinMonths) || 0
  if (!B || !n) return null

  // 2026년 A값 (전체 가입자 3년 평균소득월액)
  const A = 3_089_062
  // 소득대체율 2026: 42%
  const incomeReplaceRate = 0.42
  // 기본연금액 = 1.2 × (A+B)/2 × (n/240) × 소득대체율/0.5
  // 단순화: 완전노령연금(20년=240개월) 기준 소득대체율 적용
  const monthlyPension = 1.2 * (A + B) / 2 * (n / 240) * (incomeReplaceRate / 0.5) * 0.5
  const fullPension = 1.2 * (A + B) / 2 * (incomeReplaceRate / 0.5) * 0.5

  return {
    A, B, n,
    monthlyPension: Math.round(monthlyPension),
    fullPension: Math.round(fullPension),
    eligibleAge: 63, // 2026 기준
    yearlyPension: Math.round(monthlyPension * 12),
  }
}

// ─── 19. 전기요금 (한전 2024 주택용 저압) ────────────────────────────────────

export function calculateElectricity(kwh, month) {
  const usage = Number(kwh)
  if (!usage || usage <= 0) return null
  const m = Number(month) || new Date().getMonth() + 1

  // 하계(7~8월), 동계(12~2월), 기타
  const isSummer = m >= 7 && m <= 8
  const isWinter = m === 12 || m <= 2

  let basicFee = 0, energyFee = 0

  if (isSummer || isWinter) {
    // 하계/동계 누진 3단계
    if (usage <= 300) {
      basicFee = isSummer ? 910 : 1_600
    } else if (usage <= 450) {
      basicFee = isSummer ? 1_600 : 7_300
    } else {
      basicFee = 7_300
    }
    const rates = isSummer
      ? [88.3, 182.9, 275.6]
      : [88.3, 182.9, 275.6]
    if (usage <= 300) energyFee = usage * rates[0]
    else if (usage <= 450) energyFee = 300 * rates[0] + (usage - 300) * rates[1]
    else energyFee = 300 * rates[0] + 150 * rates[1] + (usage - 450) * rates[2]
  } else {
    // 기타 (3단계 누진)
    if (usage <= 200) basicFee = 910
    else if (usage <= 400) basicFee = 1_600
    else basicFee = 7_300
    if (usage <= 200) energyFee = usage * 88.3
    else if (usage <= 400) energyFee = 200 * 88.3 + (usage - 200) * 182.9
    else energyFee = 200 * 88.3 + 200 * 182.9 + (usage - 400) * 275.6
  }

  const subtotal = basicFee + energyFee
  const vat = Math.round(subtotal * 0.1)
  const fund = Math.round(subtotal * 0.037)
  const total = Math.round(subtotal + vat + fund)

  return { basicFee, energyFee: Math.round(energyFee), vat, fund, total, subtotal: Math.round(subtotal) }
}

// ─── 9. BMI ────────────────────────────────────────────────────────────────────

export function calculateBMI(height, weight) {
  const h = Number(height)
  const w = Number(weight)
  if (!h || !w || h <= 0 || w <= 0) return null

  const bmi = w / Math.pow(h / 100, 2)
  let classification, color
  if (bmi < 18.5) { classification = '저체중'; color = 'text-blue-500' }
  else if (bmi < 23) { classification = '정상'; color = 'text-green-500' }
  else if (bmi < 25) { classification = '과체중'; color = 'text-yellow-500' }
  else if (bmi < 30) { classification = '비만'; color = 'text-orange-500' }
  else { classification = '고도비만'; color = 'text-red-500' }

  const normalWeightMin = 18.5 * Math.pow(h / 100, 2)
  const normalWeightMax = 22.9 * Math.pow(h / 100, 2)

  // 게이지 위치 (0~100%)
  const gaugeMin = 10, gaugeMax = 40
  const gaugePos = Math.min(100, Math.max(0, ((bmi - gaugeMin) / (gaugeMax - gaugeMin)) * 100))

  return { bmi, classification, color, normalWeightMin, normalWeightMax, gaugePos }
}
