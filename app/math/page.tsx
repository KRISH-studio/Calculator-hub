import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function MathCalculators() {
  const calculators = [
    {
      title: "Basic Calculator",
      description: "Perform basic arithmetic operations like addition, subtraction, multiplication, and division",
      href: "/math/basic",
    },
    {
      title: "Scientific Calculator",
      description: "Advanced calculator with trigonometric, logarithmic, and exponential functions",
      href: "/math/scientific",
    },
    {
      title: "Equation Solver",
      description: "Solve linear and quadratic equations with step-by-step solutions",
      href: "/math/equation-solver",
    },
    {
      title: "Expression Evaluator",
      description: "Evaluate complex mathematical expressions with variables",
      href: "/math/expression-evaluator",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Math & Scientific Calculators</h1>
        <p className="text-muted-foreground">Tools for solving mathematical problems and equations</p>
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
