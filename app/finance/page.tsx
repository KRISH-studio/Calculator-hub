import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function FinanceCalculators() {
  const calculators = [
    {
      title: "Loan Calculator",
      description: "Calculate monthly payments, total interest, and amortization schedule for loans",
      href: "/finance/loan",
    },
    {
      title: "EMI Calculator",
      description: "Calculate Equated Monthly Installments for loans and mortgages",
      href: "/finance/emi",
    },
    {
      title: "Investment Return Calculator",
      description: "Calculate potential returns on investments with compound interest",
      href: "/finance/investment",
    },
    {
      title: "Retirement Calculator",
      description: "Plan for retirement by calculating future savings and income needs",
      href: "/finance/retirement",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Finance Calculators</h1>
        <p className="text-muted-foreground">Tools to help you make informed financial decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calculator) => (
          <Link href={calculator.href} key={calculator.title}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{calculator.title}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
