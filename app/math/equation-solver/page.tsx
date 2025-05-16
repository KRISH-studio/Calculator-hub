"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"

export default function EquationSolver() {
  const [linearEquation, setLinearEquation] = useState<string>("2x + 5 = 13")
  const [linearSolution, setLinearSolution] = useState<string | null>(null)
  const [linearSteps, setLinearSteps] = useState<string[]>([])

  const [quadA, setQuadA] = useState<number>(1)
  const [quadB, setQuadB] = useState<number>(3)
  const [quadC, setQuadC] = useState<number>(-4)
  const [quadraticSolution, setQuadraticSolution] = useState<string | null>(null)
  const [quadraticSteps, setQuadraticSteps] = useState<string[]>([])

  const solveLinearEquation = () => {
    try {
      // This is a simple parser for equations like "ax + b = c"
      const steps: string[] = []
      steps.push(`Original equation: ${linearEquation}`)

      // Remove spaces
      const equation = linearEquation.replace(/\s+/g, "")

      // Split by equals sign
      const parts = equation.split("=")
      if (parts.length !== 2) {
        throw new Error("Equation must contain exactly one equals sign")
      }

      const leftSide = parts[0]
      let rightSide = parts[1]

      // Find coefficient of x
      let coefficient = 1
      let constant = 0

      // Check if x is on the left side
      if (leftSide.includes("x")) {
        // Parse the coefficient of x
        const xIndex = leftSide.indexOf("x")
        if (xIndex > 0) {
          const coeffStr = leftSide.substring(0, xIndex).replace(/\+/g, "")
          coefficient = coeffStr === "-" ? -1 : Number.parseFloat(coeffStr) || 1
        } else if (xIndex === 0) {
          coefficient = 1
        }

        // Parse the constant term
        const constantPart = leftSide.replace(/[+-]?\d*x/g, "")
        if (constantPart) {
          constant = Number.parseFloat(constantPart) || 0
        }

        // Move constant to the right side
        if (constant !== 0) {
          rightSide = `${Number.parseFloat(rightSide) - constant}`
          steps.push(`Move constant to the right side: ${coefficient}x = ${rightSide}`)
        } else {
          steps.push(`Simplify: ${coefficient}x = ${rightSide}`)
        }

        // Divide both sides by coefficient
        const solution = Number.parseFloat(rightSide) / coefficient
        steps.push(`Divide both sides by ${coefficient}: x = ${solution}`)

        setLinearSolution(`x = ${solution}`)
        setLinearSteps(steps)
      } else {
        throw new Error("Equation must contain the variable x")
      }
    } catch (error) {
      setLinearSolution(`Error: ${(error as Error).message}`)
      setLinearSteps([])
    }
  }

  const solveQuadraticEquation = () => {
    try {
      const steps: string[] = []
      steps.push(`Original equation: ${quadA}x² + ${quadB}x + ${quadC} = 0`)

      // Calculate discriminant
      const discriminant = quadB * quadB - 4 * quadA * quadC
      steps.push(`Calculate the discriminant: b² - 4ac = ${quadB}² - 4 × ${quadA} × ${quadC} = ${discriminant}`)

      if (discriminant < 0) {
        steps.push(`The discriminant is negative, so there are no real solutions.`)
        steps.push(`The equation has two complex solutions.`)

        const realPart = -quadB / (2 * quadA)
        const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * quadA)

        const solution = `x = ${realPart.toFixed(2)} ± ${imaginaryPart.toFixed(2)}i`
        setQuadraticSolution(solution)
      } else if (discriminant === 0) {
        steps.push(`The discriminant is zero, so there is exactly one solution.`)

        const solution = -quadB / (2 * quadA)
        steps.push(`x = -b / (2a) = -${quadB} / (2 × ${quadA}) = ${solution}`)

        setQuadraticSolution(`x = ${solution}`)
      } else {
        steps.push(`The discriminant is positive, so there are two real solutions.`)

        const x1 = (-quadB + Math.sqrt(discriminant)) / (2 * quadA)
        const x2 = (-quadB - Math.sqrt(discriminant)) / (2 * quadA)

        steps.push(
          `x₁ = (-b + √(b² - 4ac)) / (2a) = (-${quadB} + √${discriminant}) / (2 × ${quadA}) = ${x1.toFixed(4)}`,
        )
        steps.push(
          `x₂ = (-b - √(b² - 4ac)) / (2a) = (-${quadB} - √${discriminant}) / (2 × ${quadA}) = ${x2.toFixed(4)}`,
        )

        setQuadraticSolution(`x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`)
      }

      setQuadraticSteps(steps)
    } catch (error) {
      setQuadraticSolution(`Error: ${(error as Error).message}`)
      setQuadraticSteps([])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/math" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Math Calculators
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Equation Solver</CardTitle>
            <CardDescription>Solve linear and quadratic equations with step-by-step solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="linear">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="linear">Linear Equations</TabsTrigger>
                <TabsTrigger value="quadratic">Quadratic Equations</TabsTrigger>
              </TabsList>

              <TabsContent value="linear" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="linear-equation" className="text-base">
                      Enter a linear equation (e.g., 2x + 5 = 13)
                    </Label>
                    <div className="flex mt-2">
                      <Input
                        id="linear-equation"
                        value={linearEquation}
                        onChange={(e) => setLinearEquation(e.target.value)}
                        placeholder="e.g., 2x + 5 = 13"
                        className="flex-1"
                      />
                      <Button onClick={solveLinearEquation} className="ml-2">
                        Solve
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: ax + b = c (where a, b, and c are numbers)
                    </p>
                  </div>

                  {linearSolution && (
                    <div className="p-4 border rounded-md bg-muted/30 relative">
                      <h3 className="font-medium mb-2">Solution:</h3>
                      <p className="text-xl font-semibold">{linearSolution}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={() => copyToClipboard(linearSolution)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  )}

                  {linearSteps.length > 0 && (
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Step-by-step solution:</h3>
                      <ol className="space-y-2 list-decimal list-inside">
                        {linearSteps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="p-4 border rounded-md bg-muted/10">
                    <h3 className="font-medium mb-2">Examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setLinearEquation("2x + 5 = 13")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        2x + 5 = 13
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setLinearEquation("3x - 7 = 8")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        3x - 7 = 8
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setLinearEquation("-4x = 12")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        -4x = 12
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setLinearEquation("x/2 + 3 = 7")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        x/2 + 3 = 7
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quadratic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Enter coefficients for ax² + bx + c = 0</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="quad-a" className="text-sm">
                          a
                        </Label>
                        <Input
                          id="quad-a"
                          type="number"
                          value={quadA}
                          onChange={(e) => setQuadA(Number.parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quad-b" className="text-sm">
                          b
                        </Label>
                        <Input
                          id="quad-b"
                          type="number"
                          value={quadB}
                          onChange={(e) => setQuadB(Number.parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quad-c" className="text-sm">
                          c
                        </Label>
                        <Input
                          id="quad-c"
                          type="number"
                          value={quadC}
                          onChange={(e) => setQuadC(Number.parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-medium">
                        {quadA}x² {quadB >= 0 ? "+" : ""} {quadB}x {quadC >= 0 ? "+" : ""} {quadC} = 0
                      </p>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button onClick={solveQuadraticEquation}>Solve Equation</Button>
                    </div>
                  </div>

                  {quadraticSolution && (
                    <div className="p-4 border rounded-md bg-muted/30 relative">
                      <h3 className="font-medium mb-2">Solution:</h3>
                      <p className="text-xl font-semibold">{quadraticSolution}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={() => copyToClipboard(quadraticSolution)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  )}

                  {quadraticSteps.length > 0 && (
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Step-by-step solution:</h3>
                      <ol className="space-y-2 list-decimal list-inside">
                        {quadraticSteps.map((step, index) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="p-4 border rounded-md bg-muted/10">
                    <h3 className="font-medium mb-2">Examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuadA(1)
                          setQuadB(3)
                          setQuadC(-4)
                        }}
                        className="justify-start h-auto py-2 px-3"
                      >
                        x² + 3x - 4 = 0
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuadA(1)
                          setQuadB(-2)
                          setQuadC(1)
                        }}
                        className="justify-start h-auto py-2 px-3"
                      >
                        x² - 2x + 1 = 0
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuadA(2)
                          setQuadB(4)
                          setQuadC(2)
                        }}
                        className="justify-start h-auto py-2 px-3"
                      >
                        2x² + 4x + 2 = 0
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuadA(1)
                          setQuadB(0)
                          setQuadC(-9)
                        }}
                        className="justify-start h-auto py-2 px-3"
                      >
                        x² - 9 = 0
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
