"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Plus, Trash } from "lucide-react"
import Link from "next/link"

export default function ExpressionEvaluator() {
  const [expression, setExpression] = useState<string>("2 * (3 + 4) / 2")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([])

  const [variables, setVariables] = useState<{ name: string; value: string }[]>([
    { name: "x", value: "5" },
    { name: "y", value: "10" },
  ])
  const [variableExpression, setVariableExpression] = useState<string>("2 * x + y")
  const [variableResult, setVariableResult] = useState<string | null>(null)
  const [variableError, setVariableError] = useState<string | null>(null)

  const evaluateExpression = () => {
    try {
      setError(null)
      // Using Function constructor to evaluate the expression
      // This is generally safe for a calculator app where the user is evaluating their own expressions
      const calculatedResult = Function(`"use strict"; return (${expression});`)()
      setResult(calculatedResult.toString())

      // Add to history
      setHistory((prev) => [{ expression, result: calculatedResult.toString() }, ...prev.slice(0, 9)])
    } catch (err) {
      setError(`Invalid expression: ${(err as Error).message}`)
      setResult(null)
    }
  }

  const evaluateVariableExpression = () => {
    try {
      setVariableError(null)

      // Create a function with the variables as parameters
      let functionBody = `"use strict";`

      // Add variable declarations
      variables.forEach((variable) => {
        functionBody += `const ${variable.name} = ${variable.value};`
      })

      // Return the evaluated expression
      functionBody += `return (${variableExpression});`

      const calculatedResult = Function(functionBody)()
      setVariableResult(calculatedResult.toString())
    } catch (err) {
      setVariableError(`Invalid expression: ${(err as Error).message}`)
      setVariableResult(null)
    }
  }

  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }])
  }

  const updateVariable = (index: number, field: "name" | "value", value: string) => {
    const newVariables = [...variables]
    newVariables[index][field] = value
    setVariables(newVariables)
  }

  const removeVariable = (index: number) => {
    const newVariables = [...variables]
    newVariables.splice(index, 1)
    setVariables(newVariables)
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
            <CardTitle className="text-2xl">Expression Evaluator</CardTitle>
            <CardDescription>Evaluate mathematical expressions with and without variables</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="simple">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="simple">Simple Expressions</TabsTrigger>
                <TabsTrigger value="variables">Expressions with Variables</TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expression" className="text-base">
                      Enter a mathematical expression
                    </Label>
                    <div className="flex mt-2">
                      <Input
                        id="expression"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        placeholder="e.g., 2 * (3 + 4) / 2"
                        className="flex-1"
                      />
                      <Button onClick={evaluateExpression} className="ml-2">
                        Evaluate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports: +, -, *, /, %, **, (), Math functions (sin, cos, etc.)
                    </p>
                  </div>

                  {result && (
                    <div className="p-4 border rounded-md bg-muted/30 relative">
                      <h3 className="font-medium mb-2">Result:</h3>
                      <p className="text-xl font-semibold">{result}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={() => copyToClipboard(result)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {history.length > 0 && (
                    <div className="p-4 border rounded-md bg-muted/10">
                      <h3 className="font-medium mb-2">History:</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {history.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm py-1 border-t border-border first:border-0 flex justify-between"
                          >
                            <span>{item.expression} = </span>
                            <span className="font-medium">{item.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 border rounded-md bg-muted/10">
                    <h3 className="font-medium mb-2">Examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setExpression("2 * (3 + 4) / 2")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        2 * (3 + 4) / 2
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setExpression("Math.sin(Math.PI / 2)")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        Math.sin(Math.PI / 2)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setExpression("2 ** 3 + 4 ** 2")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        2 ** 3 + 4 ** 2
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setExpression("Math.sqrt(16) + Math.cbrt(8)")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        Math.sqrt(16) + Math.cbrt(8)
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variables" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Define Variables</Label>
                    <div className="space-y-2 mt-2">
                      {variables.map((variable, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={variable.name}
                            onChange={(e) => updateVariable(index, "name", e.target.value)}
                            placeholder="Variable name"
                            className="w-1/3"
                          />
                          <span className="text-muted-foreground">=</span>
                          <Input
                            value={variable.value}
                            onChange={(e) => updateVariable(index, "value", e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeVariable(index)} className="h-8 w-8">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addVariable} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Variable
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="variable-expression" className="text-base">
                      Enter an expression with variables
                    </Label>
                    <div className="flex mt-2">
                      <Input
                        id="variable-expression"
                        value={variableExpression}
                        onChange={(e) => setVariableExpression(e.target.value)}
                        placeholder="e.g., 2 * x + y"
                        className="flex-1"
                      />
                      <Button onClick={evaluateVariableExpression} className="ml-2">
                        Evaluate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use the variable names defined above in your expression
                    </p>
                  </div>

                  {variableResult && (
                    <div className="p-4 border rounded-md bg-muted/30 relative">
                      <h3 className="font-medium mb-2">Result:</h3>
                      <p className="text-xl font-semibold">{variableResult}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={() => copyToClipboard(variableResult)}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  )}

                  {variableError && (
                    <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10">
                      <p className="text-sm text-destructive">{variableError}</p>
                    </div>
                  )}

                  <div className="p-4 border rounded-md bg-muted/10">
                    <h3 className="font-medium mb-2">Examples:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setVariableExpression("2 * x + y")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        2 * x + y
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVariableExpression("Math.pow(x, 2) + Math.pow(y, 2)")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        Math.pow(x, 2) + Math.pow(y, 2)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVariableExpression("(x + y) / 2")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        (x + y) / 2
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setVariableExpression("Math.sqrt(x * y)")}
                        className="justify-start h-auto py-2 px-3"
                      >
                        Math.sqrt(x * y)
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
