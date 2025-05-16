"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30)
  const [retirementAge, setRetirementAge] = useState<number>(65)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90)
  const [currentSavings, setCurrentSavings] = useState<number>(50000)
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500)
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(7)
  const [inflationRate, setInflationRate] = useState<number>(2.5)
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(60000)
  const [socialSecurityIncome, setSocialSecurityIncome] = useState<number>(24000)

  const [retirementSavings, setRetirementSavings] = useState<number | null>(null)
  const [incomeNeeded, setIncomeNeeded] = useState<number | null>(null)
  const [incomeCovered, setIncomeCovered] = useState<number | null>(null)
  const [shortfall, setShortfall] = useState<number | null>(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("calculator")

  useEffect(() => {
    calculateRetirement()
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturnRate,
    inflationRate,
    desiredAnnualIncome,
    socialSecurityIncome,
  ])

  const calculateRetirement = () => {
    // Years until retirement
    const yearsToRetirement = retirementAge - currentAge

    // Years in retirement
    const yearsInRetirement = lifeExpectancy - retirementAge

    // Calculate future value of current savings at retirement
    const realReturnRate = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1

    // Calculate retirement savings
    let savingsAtRetirement = currentSavings * Math.pow(1 + annualReturnRate / 100, yearsToRetirement)

    // Add future value of monthly contributions
    const monthlyRate = annualReturnRate / 100 / 12
    for (let i = 0; i < yearsToRetirement * 12; i++) {
      savingsAtRetirement += monthlyContribution * Math.pow(1 + monthlyRate, yearsToRetirement * 12 - i)
    }

    // Calculate income needed in retirement (adjusted for inflation)
    const inflationAdjustedIncome = desiredAnnualIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement)

    // Calculate income from social security (adjusted for inflation)
    const inflationAdjustedSocialSecurity = socialSecurityIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement)

    // Calculate annual shortfall
    const annualShortfall = inflationAdjustedIncome - inflationAdjustedSocialSecurity

    // Calculate total income needed for retirement
    // Using the present value of an annuity formula
    const withdrawalRate = 4 / 100 // 4% rule
    const incomeNeededValue = annualShortfall / withdrawalRate

    // Calculate income covered by savings
    const incomeCoveredValue = savingsAtRetirement * withdrawalRate

    // Calculate shortfall
    const shortfallValue = Math.max(0, annualShortfall - incomeCoveredValue)

    // Generate yearly breakdown
    const breakdown = []
    let currentValue = currentSavings

    for (let year = 1; year <= yearsToRetirement; year++) {
      // Add annual contributions
      currentValue += monthlyContribution * 12

      // Apply annual return
      currentValue *= 1 + annualReturnRate / 100

      breakdown.push({
        age: currentAge + year,
        year: year,
        savings: currentValue,
        contributions: monthlyContribution * 12 * year + currentSavings,
        returns: currentValue - (monthlyContribution * 12 * year + currentSavings),
      })
    }

    setRetirementSavings(savingsAtRetirement)
    setIncomeNeeded(inflationAdjustedIncome)
    setIncomeCovered(incomeCoveredValue + inflationAdjustedSocialSecurity)
    setShortfall(shortfallValue)
    setYearlyBreakdown(breakdown)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/finance"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Finance Calculators
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Retirement Calculator</CardTitle>
            <CardDescription>Plan for retirement by calculating future savings and income needs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="breakdown">Savings Projection</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current-age">Current Age: {currentAge}</Label>
                        <Slider
                          id="current-age"
                          min={18}
                          max={80}
                          step={1}
                          value={[currentAge]}
                          onValueChange={(value) => setCurrentAge(value[0])}
                          className="mb-2 mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="retirement-age">Retirement Age: {retirementAge}</Label>
                        <Slider
                          id="retirement-age"
                          min={Math.max(currentAge + 1, 50)}
                          max={85}
                          step={1}
                          value={[retirementAge]}
                          onValueChange={(value) => setRetirementAge(value[0])}
                          className="mb-2 mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="life-expectancy">Life Expectancy: {lifeExpectancy}</Label>
                      <Slider
                        id="life-expectancy"
                        min={Math.max(retirementAge + 1, 70)}
                        max={110}
                        step={1}
                        value={[lifeExpectancy]}
                        onValueChange={(value) => setLifeExpectancy(value[0])}
                        className="mb-2 mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="current-savings">Current Savings</Label>
                      <Input
                        id="current-savings"
                        type="number"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
                      <Input
                        id="monthly-contribution"
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="annual-return">Annual Return (%)</Label>
                        <Input
                          id="annual-return"
                          type="number"
                          value={annualReturnRate}
                          onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
                        <Input
                          id="inflation-rate"
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="desired-income">Desired Annual Income in Retirement</Label>
                      <Input
                        id="desired-income"
                        type="number"
                        value={desiredAnnualIncome}
                        onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="social-security">Expected Annual Social Security</Label>
                      <Input
                        id="social-security"
                        type="number"
                        value={socialSecurityIncome}
                        onChange={(e) => setSocialSecurityIncome(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {retirementSavings !== null && (
                      <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Projected Retirement Savings</h3>
                          <p className="text-3xl font-bold">{formatCurrency(retirementSavings)}</p>
                          <p className="text-sm text-muted-foreground mt-1">at age {retirementAge}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Annual Income Needed</h3>
                            <p className="text-xl font-semibold">{formatCurrency(incomeNeeded || 0)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Income Covered</h3>
                            <p className="text-xl font-semibold">{formatCurrency(incomeCovered || 0)}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            {shortfall && shortfall > 0 ? "Annual Shortfall" : "Annual Surplus"}
                          </h3>
                          <p
                            className={`text-xl font-semibold ${shortfall && shortfall > 0 ? "text-red-500" : "text-green-500"}`}
                          >
                            {shortfall && shortfall > 0
                              ? `-${formatCurrency(shortfall)}`
                              : `+${formatCurrency(Math.abs(shortfall || 0))}`}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                            <div
                              className={`h-2.5 rounded-full ${shortfall && shortfall > 0 ? "bg-amber-500" : "bg-green-500"}`}
                              style={{ width: `${Math.min(100, ((incomeCovered || 0) / (incomeNeeded || 1)) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Income Covered</span>
                            <span>{Math.round(((incomeCovered || 0) / (incomeNeeded || 1)) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breakdown">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Year</th>
                        <th className="text-left p-2">Age</th>
                        <th className="text-right p-2">Contributions</th>
                        <th className="text-right p-2">Returns</th>
                        <th className="text-right p-2">Total Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.year}</td>
                          <td className="p-2">{row.age}</td>
                          <td className="text-right p-2">{formatCurrency(row.contributions)}</td>
                          <td className="text-right p-2">{formatCurrency(row.returns)}</td>
                          <td className="text-right p-2">{formatCurrency(row.savings)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Note: This table shows yearly snapshots of your retirement savings growth.
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Retirement Planning Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Start saving early to take advantage of compound growth</li>
                <li>Maximize contributions to tax-advantaged retirement accounts like 401(k)s and IRAs</li>
                <li>Consider increasing your savings rate by 1% each year</li>
                <li>Diversify your investments to manage risk</li>
                <li>Review and adjust your retirement plan regularly</li>
              </ul>
              <h3 className="text-lg font-medium mt-4 mb-2">The 4% Rule</h3>
              <p className="text-muted-foreground">
                This calculator uses the 4% rule as a guideline, which suggests that retirees can withdraw 4% of their
                retirement savings in the first year of retirement, then adjust that amount for inflation each year,
                with a high probability that their savings will last for 30 years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
