"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InvestmentReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500)
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(8)
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10)
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("annually")
  const [futureValue, setFutureValue] = useState<number | null>(null)
  const [totalContributions, setTotalContributions] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("calculator")

  useEffect(() => {
    calculateInvestment()
  }, [initialInvestment, monthlyContribution, annualInterestRate, investmentPeriod, compoundingFrequency])

  const calculateInvestment = () => {
    // Determine number of compounds per year
    let compoundsPerYear = 1
    switch (compoundingFrequency) {
      case "monthly":
        compoundsPerYear = 12
        break
      case "quarterly":
        compoundsPerYear = 4
        break
      case "semi-annually":
        compoundsPerYear = 2
        break
      case "annually":
        compoundsPerYear = 1
        break
      default:
        compoundsPerYear = 1
    }

    // Calculate rate per period
    const ratePerPeriod = annualInterestRate / 100 / compoundsPerYear

    // Total number of periods
    const totalPeriods = investmentPeriod * compoundsPerYear

    // Calculate future value with monthly contributions
    const futureVal = initialInvestment
    const monthlyRate = ratePerPeriod
    const periodsPerMonth = compoundsPerYear / 12

    // Generate yearly breakdown
    const breakdown = []
    let runningContributions = initialInvestment
    let currentValue = initialInvestment

    for (let year = 1; year <= investmentPeriod; year++) {
      for (let period = 1; period <= compoundsPerYear; period++) {
        // Add monthly contributions for this period
        for (let month = 1; month <= 12 / compoundsPerYear; month++) {
          currentValue += monthlyContribution
          runningContributions += monthlyContribution
        }

        // Apply interest for this period
        currentValue *= 1 + ratePerPeriod
      }

      breakdown.push({
        year,
        value: currentValue,
        contributions: runningContributions,
        interest: currentValue - runningContributions,
      })
    }

    setYearlyBreakdown(breakdown)
    setFutureValue(currentValue)
    setTotalContributions(runningContributions)
    setTotalInterest(currentValue - runningContributions)
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
            <CardTitle className="text-2xl">Investment Return Calculator</CardTitle>
            <CardDescription>Calculate potential returns on investments with compound interest</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="breakdown">Yearly Breakdown</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="initial-investment">
                          Initial Investment: {formatCurrency(initialInvestment)}
                        </Label>
                      </div>
                      <Slider
                        id="initial-investment"
                        min={0}
                        max={100000}
                        step={1000}
                        value={[initialInvestment]}
                        onValueChange={(value) => setInitialInvestment(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="monthly-contribution">
                          Monthly Contribution: {formatCurrency(monthlyContribution)}
                        </Label>
                      </div>
                      <Slider
                        id="monthly-contribution"
                        min={0}
                        max={5000}
                        step={50}
                        value={[monthlyContribution]}
                        onValueChange={(value) => setMonthlyContribution(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="annual-interest-rate">Annual Interest Rate: {annualInterestRate}%</Label>
                      </div>
                      <Slider
                        id="annual-interest-rate"
                        min={0.1}
                        max={20}
                        step={0.1}
                        value={[annualInterestRate]}
                        onValueChange={(value) => setAnnualInterestRate(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={annualInterestRate}
                        onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="investment-period">Investment Period: {investmentPeriod} years</Label>
                      </div>
                      <Slider
                        id="investment-period"
                        min={1}
                        max={40}
                        step={1}
                        value={[investmentPeriod]}
                        onValueChange={(value) => setInvestmentPeriod(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={investmentPeriod}
                        onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div className="mt-4">
                      <Label className="mb-2 block">Compounding Frequency</Label>
                      <RadioGroup
                        value={compoundingFrequency}
                        onValueChange={setCompoundingFrequency}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="quarterly" id="quarterly" />
                          <Label htmlFor="quarterly">Quarterly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="semi-annually" id="semi-annually" />
                          <Label htmlFor="semi-annually">Semi-Annually</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="annually" id="annually" />
                          <Label htmlFor="annually">Annually</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {futureValue !== null && (
                      <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Future Value</h3>
                          <p className="text-3xl font-bold">{formatCurrency(futureValue)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Total Contributions</h3>
                            <p className="text-xl font-semibold">{formatCurrency(totalContributions || 0)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Total Interest</h3>
                            <p className="text-xl font-semibold">{formatCurrency(totalInterest || 0)}</p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${((totalContributions || 0) / (futureValue || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Contributions</span>
                            <span>Interest</span>
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
                        <th className="text-right p-2">Contributions</th>
                        <th className="text-right p-2">Interest</th>
                        <th className="text-right p-2">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.year}</td>
                          <td className="text-right p-2">{formatCurrency(row.contributions)}</td>
                          <td className="text-right p-2">{formatCurrency(row.interest)}</td>
                          <td className="text-right p-2">{formatCurrency(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Note: This table shows yearly snapshots of your investment growth.
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">About Compound Interest</h3>
              <p className="text-muted-foreground">
                Compound interest is the addition of interest to the principal sum of a loan or deposit, or in other
                words, interest on interest. It is the result of reinvesting interest, rather than paying it out, so
                that interest in the next period is earned on the principal sum plus previously accumulated interest.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">The Power of Compounding</h3>
              <p className="text-muted-foreground">
                The power of compounding is particularly noticeable over long investment periods. Even small increases
                in the interest rate can make a significant difference to the final amount due to the exponential nature
                of compound growth.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
