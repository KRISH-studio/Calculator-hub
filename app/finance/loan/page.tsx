"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(100000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [loanTerm, setLoanTerm] = useState<number>(30)
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("calculator")

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, interestRate, loanTerm])

  const calculateLoan = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12

    // Total number of payments
    const payments = loanTerm * 12

    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, payments)
    const monthly = (loanAmount * x * monthlyRate) / (x - 1)

    setMonthlyPayment(monthly)
    setTotalPayment(monthly * payments)
    setTotalInterest(monthly * payments - loanAmount)

    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyRate, monthly, payments)
  }

  const generateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    totalPayments: number,
  ) => {
    let balance = principal
    let totalInterest = 0
    const schedule = []

    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment

      totalInterest += interestPayment
      balance -= principalPayment

      // Only add yearly entries to keep the table manageable
      if (i % 12 === 0 || i === 1 || i === totalPayments) {
        schedule.push({
          payment: i,
          year: Math.ceil(i / 12),
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          totalInterest: totalInterest,
          balance: balance > 0 ? balance : 0,
        })
      }
    }

    setAmortizationSchedule(schedule)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
            <CardTitle className="text-2xl">Loan Calculator</CardTitle>
            <CardDescription>
              Calculate monthly payments, total interest, and view amortization schedule for loans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="amortization">Amortization Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="loan-amount">Loan Amount: {formatCurrency(loanAmount)}</Label>
                      </div>
                      <Slider
                        id="loan-amount"
                        min={1000}
                        max={1000000}
                        step={1000}
                        value={[loanAmount]}
                        onValueChange={(value) => setLoanAmount(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="interest-rate">Interest Rate: {interestRate}%</Label>
                      </div>
                      <Slider
                        id="interest-rate"
                        min={0.1}
                        max={20}
                        step={0.1}
                        value={[interestRate]}
                        onValueChange={(value) => setInterestRate(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="loan-term">Loan Term: {loanTerm} years</Label>
                      </div>
                      <Slider
                        id="loan-term"
                        min={1}
                        max={40}
                        step={1}
                        value={[loanTerm]}
                        onValueChange={(value) => setLoanTerm(value[0])}
                        className="mb-2"
                      />
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    {monthlyPayment !== null && (
                      <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Monthly Payment</h3>
                          <p className="text-3xl font-bold">{formatCurrency(monthlyPayment)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Total Principal</h3>
                            <p className="text-xl font-semibold">{formatCurrency(loanAmount)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Total Interest</h3>
                            <p className="text-xl font-semibold">{formatCurrency(totalInterest || 0)}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-medium text-muted-foreground">Total Payment</h3>
                          <p className="text-xl font-semibold">{formatCurrency(totalPayment || 0)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amortization">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Payment #</th>
                        <th className="text-left p-2">Year</th>
                        <th className="text-right p-2">Principal</th>
                        <th className="text-right p-2">Interest</th>
                        <th className="text-right p-2">Total Interest</th>
                        <th className="text-right p-2">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.payment}</td>
                          <td className="p-2">{row.year}</td>
                          <td className="text-right p-2">{formatCurrency(row.principalPayment)}</td>
                          <td className="text-right p-2">{formatCurrency(row.interestPayment)}</td>
                          <td className="text-right p-2">{formatCurrency(row.totalInterest)}</td>
                          <td className="text-right p-2">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Note: This table shows yearly snapshots of your loan amortization.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
