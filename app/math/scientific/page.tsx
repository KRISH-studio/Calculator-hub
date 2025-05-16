"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, RotateCcw, SkipBackIcon as Backspace } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState<string>("0")
  const [secondaryDisplay, setSecondaryDisplay] = useState<string>("")
  const [currentValue, setCurrentValue] = useState<string>("0")
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false)
  const [memory, setMemory] = useState<number>(0)
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")
  const [history, setHistory] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState<string>("basic")

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key)
      } else if (e.key === ".") {
        inputDecimal()
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        const opMap: Record<string, string> = {
          "+": "+",
          "-": "-",
          "*": "×",
          "/": "÷",
        }
        performOperation(opMap[e.key])
      } else if (e.key === "Enter" || e.key === "=") {
        calculateResult()
      } else if (e.key === "Escape") {
        clearAll()
      } else if (e.key === "Backspace") {
        handleBackspace()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentValue, previousValue, operation, waitingForOperand])

  const clearAll = () => {
    setDisplay("0")
    setSecondaryDisplay("")
    setCurrentValue("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay("0")
    setCurrentValue("0")
    setWaitingForOperand(false)
  }

  const handleBackspace = () => {
    if (waitingForOperand) return

    if (currentValue.length > 1) {
      setCurrentValue(currentValue.slice(0, -1))
      setDisplay(currentValue.slice(0, -1))
    } else {
      setCurrentValue("0")
      setDisplay("0")
    }
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setCurrentValue(digit)
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setCurrentValue(currentValue === "0" ? digit : currentValue + digit)
      setDisplay(currentValue === "0" ? digit : currentValue + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setCurrentValue("0.")
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (currentValue.indexOf(".") === -1) {
      setCurrentValue(currentValue + ".")
      setDisplay(currentValue + ".")
    }
  }

  const toggleSign = () => {
    const newValue = Number.parseFloat(currentValue) * -1
    setCurrentValue(newValue.toString())
    setDisplay(newValue.toString())
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(currentValue)

    if (previousValue === null) {
      setPreviousValue(currentValue)
      setSecondaryDisplay(`${currentValue} ${nextOperation}`)
    } else if (operation) {
      const currentValueNum = Number.parseFloat(currentValue)
      const previousValueNum = Number.parseFloat(previousValue)
      let newValue: number

      switch (operation) {
        case "+":
          newValue = previousValueNum + currentValueNum
          break
        case "-":
          newValue = previousValueNum - currentValueNum
          break
        case "×":
          newValue = previousValueNum * currentValueNum
          break
        case "÷":
          newValue = previousValueNum / currentValueNum
          break
        case "^":
          newValue = Math.pow(previousValueNum, currentValueNum)
          break
        default:
          newValue = currentValueNum
      }

      setPreviousValue(newValue.toString())
      setDisplay(newValue.toString())
      setSecondaryDisplay(`${newValue} ${nextOperation}`)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculateResult = () => {
    if (!previousValue || !operation) {
      return
    }

    const currentValueNum = Number.parseFloat(currentValue)
    const previousValueNum = Number.parseFloat(previousValue)
    let newValue: number

    switch (operation) {
      case "+":
        newValue = previousValueNum + currentValueNum
        break
      case "-":
        newValue = previousValueNum - currentValueNum
        break
      case "×":
        newValue = previousValueNum * currentValueNum
        break
      case "÷":
        newValue = previousValueNum / currentValueNum
        break
      case "^":
        newValue = Math.pow(previousValueNum, currentValueNum)
        break
      default:
        newValue = currentValueNum
    }

    // Add to history
    const calculation = `${previousValue} ${operation} ${currentValue} = ${newValue}`
    setHistory((prev) => [calculation, ...prev.slice(0, 9)])

    setCurrentValue(newValue.toString())
    setPreviousValue(null)
    setOperation(null)
    setDisplay(newValue.toString())
    setSecondaryDisplay(`${previousValue} ${operation} ${currentValue} =`)
    setWaitingForOperand(true)
  }

  const performUnaryOperation = (operation: string) => {
    const currentValueNum = Number.parseFloat(currentValue)
    let newValue: number
    let operationSymbol = ""

    switch (operation) {
      case "sqrt":
        newValue = Math.sqrt(currentValueNum)
        operationSymbol = "√"
        break
      case "square":
        newValue = Math.pow(currentValueNum, 2)
        operationSymbol = "^2"
        break
      case "cube":
        newValue = Math.pow(currentValueNum, 3)
        operationSymbol = "^3"
        break
      case "1/x":
        newValue = 1 / currentValueNum
        operationSymbol = "1/"
        break
      case "sin":
        newValue = angleMode === "deg" ? Math.sin((currentValueNum * Math.PI) / 180) : Math.sin(currentValueNum)
        operationSymbol = angleMode === "deg" ? "sin(deg)" : "sin(rad)"
        break
      case "cos":
        newValue = angleMode === "deg" ? Math.cos((currentValueNum * Math.PI) / 180) : Math.cos(currentValueNum)
        operationSymbol = angleMode === "deg" ? "cos(deg)" : "cos(rad)"
        break
      case "tan":
        newValue = angleMode === "deg" ? Math.tan((currentValueNum * Math.PI) / 180) : Math.tan(currentValueNum)
        operationSymbol = angleMode === "deg" ? "tan(deg)" : "tan(rad)"
        break
      case "log":
        newValue = Math.log10(currentValueNum)
        operationSymbol = "log"
        break
      case "ln":
        newValue = Math.log(currentValueNum)
        operationSymbol = "ln"
        break
      case "exp":
        newValue = Math.exp(currentValueNum)
        operationSymbol = "e^"
        break
      case "pi":
        newValue = Math.PI
        operationSymbol = "π"
        break
      case "e":
        newValue = Math.E
        operationSymbol = "e"
        break
      default:
        newValue = currentValueNum
        operationSymbol = ""
    }

    // Add to history
    if (operationSymbol) {
      const calculation = `${operationSymbol}(${currentValue}) = ${newValue}`
      setHistory((prev) => [calculation, ...prev.slice(0, 9)])
    }

    setCurrentValue(newValue.toString())
    setDisplay(newValue.toString())
    setSecondaryDisplay(`${operationSymbol}(${currentValue}) =`)
    setWaitingForOperand(true)
  }

  const memoryOperation = (operation: string) => {
    const currentValueNum = Number.parseFloat(currentValue)

    switch (operation) {
      case "MC":
        setMemory(0)
        break
      case "MR":
        setCurrentValue(memory.toString())
        setDisplay(memory.toString())
        setWaitingForOperand(true)
        break
      case "M+":
        setMemory(memory + currentValueNum)
        setWaitingForOperand(true)
        break
      case "M-":
        setMemory(memory - currentValueNum)
        setWaitingForOperand(true)
        break
      default:
        break
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/math" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Math Calculators
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl">Scientific Calculator</CardTitle>
            <CardDescription>Advanced calculator with scientific functions</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-muted p-4 rounded-md mb-4 relative">
              <div className="text-sm text-muted-foreground h-6 overflow-x-auto whitespace-nowrap text-right">
                {secondaryDisplay}
              </div>
              <div className="text-3xl font-mono h-10 overflow-x-auto whitespace-nowrap text-right">{display}</div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6 opacity-70 hover:opacity-100"
                onClick={copyToClipboard}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy</span>
              </Button>
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => memoryOperation("MC")}
                  className={cn(memory === 0 && "opacity-50")}
                >
                  MC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => memoryOperation("MR")}
                  className={cn(memory === 0 && "opacity-50")}
                >
                  MR
                </Button>
                <Button variant="outline" size="sm" onClick={() => memoryOperation("M+")}>
                  M+
                </Button>
                <Button variant="outline" size="sm" onClick={() => memoryOperation("M-")}>
                  M-
                </Button>
              </div>

              <div>
                <Button
                  variant={angleMode === "deg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode("deg")}
                  className="mr-2"
                >
                  DEG
                </Button>
                <Button
                  variant={angleMode === "rad" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode("rad")}
                >
                  RAD
                </Button>
              </div>
            </div>

            {history.length > 0 && (
              <div className="mb-4 p-2 bg-muted/50 rounded-md max-h-24 overflow-y-auto">
                <h4 className="text-xs font-medium mb-1 text-muted-foreground">History</h4>
                {history.map((item, index) => (
                  <div key={index} className="text-xs py-1 border-t border-border first:border-0">
                    {item}
                  </div>
                ))}
              </div>
            )}

            <Tabs defaultValue="basic" value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    C
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearEntry}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    CE
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleSign}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    ±
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("÷")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "÷" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    ÷
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("7")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    7
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("8")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    8
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("9")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    9
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("×")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "×" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    ×
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("4")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    4
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("5")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    5
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("6")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    6
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("-")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "-" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    -
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("1")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("2")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("3")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    3
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("+")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "+" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    +
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("0")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    onClick={inputDecimal}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    .
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackspace}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    <Backspace className="h-5 w-5" />
                  </Button>
                  <Button variant="default" onClick={calculateResult} className="text-lg font-medium">
                    =
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="scientific" className="mt-0">
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("sqrt")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    √
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("square")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    x²
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("cube")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    x³
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("^")}
                    className={cn(
                      "text-sm font-medium",
                      operation === "^" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    x^y
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("1/x")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    1/x
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("sin")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    sin
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("cos")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    cos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("tan")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    tan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("log")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    log
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("ln")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    ln
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("exp")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    e^x
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("pi")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    π
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performUnaryOperation("e")}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    e
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    C
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setHistory([])}
                    className="text-sm font-medium bg-muted/50 hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("7")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    7
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("8")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    8
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("9")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    9
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("÷")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "÷" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    ÷
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackspace}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    <Backspace className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("4")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    4
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("5")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    5
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("6")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    6
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("×")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "×" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    ×
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleSign}
                    className="text-lg font-medium bg-muted/50 hover:bg-muted"
                  >
                    ±
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("1")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("2")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => inputDigit("3")}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    3
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("-")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "-" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => performOperation("+")}
                    className={cn(
                      "text-lg font-medium",
                      operation === "+" && !waitingForOperand
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    +
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => inputDigit("0")}
                    className={cn("text-lg font-medium col-span-2 hover:bg-primary/10")}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    onClick={inputDecimal}
                    className={cn("text-lg font-medium hover:bg-primary/10")}
                  >
                    .
                  </Button>
                  <Button variant="default" onClick={calculateResult} className="text-lg font-medium col-span-2">
                    =
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>Keyboard shortcuts: Enter = Calculate, Esc = Clear, Backspace = Delete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
