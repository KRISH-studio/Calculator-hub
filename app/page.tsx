import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calculator, Heart, DollarSign, PieChart } from "lucide-react"

export default function Home() {
  const categories = [
    {
      title: "Health Calculators",
      description: "BMI, BMR, Calorie needs, and Ideal Weight calculators",
      icon: Heart,
      href: "/health",
      color: "bg-pink-100 dark:bg-pink-950",
      textColor: "text-pink-500 dark:text-pink-300",
    },
    {
      title: "Math & Scientific",
      description: "Basic arithmetic, scientific calculations, and equation solvers",
      icon: Calculator,
      href: "/math",
      color: "bg-blue-100 dark:bg-blue-950",
      textColor: "text-blue-500 dark:text-blue-300",
    },
    {
      title: "Currency Converter",
      description: "Real-time currency conversion for major world currencies",
      icon: DollarSign,
      href: "/currency",
      color: "bg-green-100 dark:bg-green-950",
      textColor: "text-green-500 dark:text-green-300",
    },
    {
      title: "Finance Calculators",
      description: "Loan, EMI, and investment return calculators",
      icon: PieChart,
      href: "/finance",
      color: "bg-purple-100 dark:bg-purple-950",
      textColor: "text-purple-500 dark:text-purple-300",
    },
  ]
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Calculator Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of useful calculators for health, mathematics, currency conversion, and financial planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={category.href} key={category.title}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${category.color}`}>
                  <category.icon className={`h-6 w-6 ${category.textColor}`} />
                </div>
                <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                <p className="text-muted-foreground text-sm">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Use Calculator Hub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Accurate Results</h3>
            <p className="text-muted-foreground text-sm">
              All calculators are built with precision and accuracy in mind.
            </p>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Easy to Use</h3>
            <p className="text-muted-foreground text-sm">Intuitive interface designed for the best user experience.</p>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">All in One Place</h3>
            <p className="text-muted-foreground text-sm">
              Access all the calculators you need from a single application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
