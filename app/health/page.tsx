import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HealthCalculators() {
  const calculators = [
    {
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index based on height and weight",
      href: "/health/bmi",
    },
    {
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate to understand your calorie needs at rest",
      href: "/health/bmr",
    },
    {
      title: "Calorie Needs",
      description: "Calculate your daily calorie needs based on activity level",
      href: "/health/calories",
    },
    {
      title: "Ideal Weight",
      description: "Calculate your ideal weight based on height, age, and gender",
      href: "/health/ideal-weight",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Health Calculators</h1>
        <p className="text-muted-foreground">Tools to help you track and understand your health metrics</p>
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
