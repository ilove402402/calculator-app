import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Salary from './pages/Salary'
import Unemployment from './pages/Unemployment'
import Retirement from './pages/Retirement'
import CapitalGains from './pages/CapitalGains'
import Loan from './pages/Loan'
import MinimumWage from './pages/MinimumWage'
import Insurance from './pages/Insurance'
import YearEndTax from './pages/YearEndTax'
import BMI from './pages/BMI'
import DDay from './pages/DDay'
import RequestPage from './pages/RequestPage'
import AdminPage from './pages/AdminPage'
import DynamicCalculator from './pages/DynamicCalculator'
import WeeklyHolidayPay from './pages/WeeklyHolidayPay'
import VAT from './pages/VAT'
import AreaConvert from './pages/AreaConvert'
import AgeCalc from './pages/AgeCalc'
import DateCalc from './pages/DateCalc'
import Exchange from './pages/Exchange'
import RentConversion from './pages/RentConversion'
import Savings from './pages/Savings'
import CompoundInterest from './pages/CompoundInterest'
import BMR from './pages/BMR'
import BodyFat from './pages/BodyFat'
import Calorie from './pages/Calorie'
import Pregnancy from './pages/Pregnancy'
import MilitarySalary from './pages/MilitarySalary'
import ChildAllowance from './pages/ChildAllowance'
import AcquisitionTax from './pages/AcquisitionTax'
import GiftTax from './pages/GiftTax'
import RealEstateFee from './pages/RealEstateFee'
import ParentalLeave from './pages/ParentalLeave'
import BasicPension from './pages/BasicPension'
import NationalPension from './pages/NationalPension'
import Electricity from './pages/Electricity'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/salary" element={<Salary />} />
      <Route path="/unemployment" element={<Unemployment />} />
      <Route path="/retirement" element={<Retirement />} />
      <Route path="/capital-gains" element={<CapitalGains />} />
      <Route path="/loan" element={<Loan />} />
      <Route path="/minimum-wage" element={<MinimumWage />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/year-end-tax" element={<YearEndTax />} />
      <Route path="/bmi" element={<BMI />} />
      <Route path="/dday" element={<DDay />} />
      <Route path="/weekly-holiday-pay" element={<WeeklyHolidayPay />} />
      <Route path="/vat" element={<VAT />} />
      <Route path="/area-convert" element={<AreaConvert />} />
      <Route path="/age-calc" element={<AgeCalc />} />
      <Route path="/date-calc" element={<DateCalc />} />
      <Route path="/exchange" element={<Exchange />} />
      <Route path="/rent-conversion" element={<RentConversion />} />
      <Route path="/savings" element={<Savings />} />
      <Route path="/compound-interest" element={<CompoundInterest />} />
      <Route path="/bmr" element={<BMR />} />
      <Route path="/body-fat" element={<BodyFat />} />
      <Route path="/calorie" element={<Calorie />} />
      <Route path="/pregnancy" element={<Pregnancy />} />
      <Route path="/military-salary" element={<MilitarySalary />} />
      <Route path="/child-allowance" element={<ChildAllowance />} />
      <Route path="/acquisition-tax" element={<AcquisitionTax />} />
      <Route path="/gift-tax" element={<GiftTax />} />
      <Route path="/real-estate-fee" element={<RealEstateFee />} />
      <Route path="/parental-leave" element={<ParentalLeave />} />
      <Route path="/basic-pension" element={<BasicPension />} />
      <Route path="/national-pension" element={<NationalPension />} />
      <Route path="/electricity" element={<Electricity />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/request" element={<RequestPage />} />
      <Route path="/isansu-admin" element={<AdminPage />} />
      <Route path="/dynamic/:id" element={<DynamicCalculator />} />
    </Routes>
  )
}
