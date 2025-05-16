"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(100000)
  const [interestRate, setInterestRate] = useState<number>(10)
  const [loanTerm, setLoanTerm] = useState<number>(12)
  const [emi, setEmi] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)

  useEffect(() => {
    calculateEMI()
  }, [loanAmount, interestRate, loanTerm])

  const calculateEMI = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12

    // Calculate EMI
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)

    setEmi(emiValue)
    setTotalPayment(emiValue * loanTerm)
    setTotalInterest(emiValue * loanTerm - loanAmount)
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
            <CardTitle className="text-2xl">EMI Calculator</CardTitle>
            <CardDescription>Calculate your Equated Monthly Installment (EMI) for loans and mortgages</CardDescription>
          </CardHeader>
          <CardContent>
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
                    min={1}
                    max={30}
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
                    <Label htmlFor="loan-term">Loan Term: {loanTerm} months</Label>
                  </div>
                  <Slider
                    id="loan-term"
                    min={3}
                    max={360}
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

                <Button onClick={calculateEMI} className="w-full mt-4">
                  Calculate EMI
                </Button>
              </div>

              <div className="flex flex-col justify-center">
                {emi !== null && (
                  <div className="p-6 border rounded-lg bg-muted/30 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Monthly EMI</h3>
                      <p className="text-3xl font-bold">{formatCurrency(emi)}</p>
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

                    <div className="pt-4 mt-4 border-t">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(loanAmount / (totalPayment || loanAmount)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Principal</span>
                        <span>Interest</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">What is EMI?</h3>
              <p className="text-muted-foreground">
                Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a
                specified date each calendar month. EMIs are used to pay off both interest and principal each month so
                that over a specified number of years, the loan is paid off in full.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">EMI Formula</h3>
              <p className="text-muted-foreground">
                EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is the loan amount, R is the interest rate per month, and N
                is the number of monthly installments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
