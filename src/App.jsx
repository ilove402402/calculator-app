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
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/request" element={<RequestPage />} />
      <Route path="/isansu-admin" element={<AdminPage />} />
      <Route path="/dynamic/:id" element={<DynamicCalculator />} />
    </Routes>
  )
}
