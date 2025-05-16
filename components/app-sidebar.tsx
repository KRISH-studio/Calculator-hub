"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Calculator, Heart, DollarSign, PieChart, Home, Menu, X, ChevronRight, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const categories = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      description: "Dashboard",
    },
    {
      name: "Health",
      href: "/health",
      icon: Heart,
      description: "Health calculators",
      subcategories: [
        { name: "BMI Calculator", href: "/health/bmi" },
        { name: "BMR Calculator", href: "/health/bmr" },
        { name: "Calorie Needs", href: "/health/calories" },
        { name: "Ideal Weight", href: "/health/ideal-weight" },
      ],
    },
    {
      name: "Mathematics",
      href: "/math",
      icon: Calculator,
      description: "Math & scientific calculators",
      subcategories: [
        { name: "Basic Calculator", href: "/math/basic" },
        { name: "Scientific Calculator", href: "/math/scientific" },
        { name: "Equation Solver", href: "/math/equation-solver" },
        { name: "Expression Evaluator", href: "/math/expression-evaluator" },
      ],
    },
    {
      name: "Currency",
      href: "/currency",
      icon: DollarSign,
      description: "Currency converter",
    },
    {
      name: "Finance",
      href: "/finance",
      icon: PieChart,
      description: "Financial calculators",
      subcategories: [
        { name: "Loan Calculator", href: "/finance/loan" },
        { name: "EMI Calculator", href: "/finance/emi" },
        { name: "Investment Return", href: "/finance/investment" },
        { name: "Retirement Calculator", href: "/finance/retirement" },
      ],
    },
  ]

  // Mobile navigation
  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold">Calculator Hub</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {categories.map((category) => {
                const isActive = category.href === "/" ? pathname === "/" : pathname.startsWith(category.href)

                return (
                  <div key={category.name} className="space-y-1">
                    <Link
                      href={category.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>

                    {isActive && category.subcategories && (
                      <div className="ml-6 space-y-1 border-l pl-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                              pathname === sub.href
                                ? "bg-muted font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
          <div className="border-t p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-between"
            >
              <span>Toggle Theme</span>
              <span className="relative">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonStar className="absolute top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop navigation
  return (
    <>
      {/* Top navigation bar for mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 md:hidden">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold">Calculator Hub</span>
            </Link>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full w-[240px] flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold">Calculator Hub</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {categories.map((category) => {
                const isActive = category.href === "/" ? pathname === "/" : pathname.startsWith(category.href)

                return (
                  <div key={category.name} className="space-y-1">
                    <Link
                      href={category.href}
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                      {category.subcategories && (
                        <ChevronRight className={cn("h-4 w-4 transition-transform", isActive && "rotate-90")} />
                      )}
                    </Link>

                    {isActive && category.subcategories && (
                      <div className="ml-6 space-y-1 border-l pl-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                              pathname === sub.href
                                ? "bg-muted font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
          <div className="border-t p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-between"
            >
              <span>Toggle Theme</span>
              <span className="relative">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonStar className="absolute top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
