"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BMICalculator() {
  const [heightCm, setHeightCm] = useState<number>(170)
  const [weightKg, setWeightKg] = useState<number>(70)
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(7)
  const [weightLbs, setWeightLbs] = useState<number>(154)
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("metric")

  const calculateBMI = () => {
    let calculatedBMI: number

    if (activeTab === "metric") {
      // Metric calculation: weight (kg) / height (m)²
      calculatedBMI = weightKg / Math.pow(heightCm / 100, 2)
    } else {
      // Imperial calculation: (weight (lbs) * 703) / height (in)²
      const totalInches = heightFt * 12 + heightIn
      calculatedBMI = (weightLbs * 703) / Math.pow(totalInches, 2)
    }

    setBmi(calculatedBMI)

    // Determine BMI category
    if (calculatedBMI < 18.5) {
      setBmiCategory("Underweight")
    } else if (calculatedBMI < 25) {
      setBmiCategory("Normal weight")
    } else if (calculatedBMI < 30) {
      setBmiCategory("Overweight")
    } else {
      setBmiCategory("Obesity")
    }
  }

  const getBmiColor = () => {
    if (!bmi) return "text-foreground"
    if (bmi < 18.5) return "text-blue-500"
    if (bmi < 25) return "text-green-500"
    if (bmi < 30) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/health"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Health Calculators
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">BMI Calculator</CardTitle>
            <CardDescription>
              Calculate your Body Mass Index (BMI) to determine if you have a healthy body weight for your height.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>

              <TabsContent value="metric" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="height-cm">Height (cm): {heightCm}</Label>
                    </div>
                    <Slider
                      id="height-cm"
                      min={100}
                      max={250}
                      step={1}
                      value={[heightCm]}
                      onValueChange={(value) => setHeightCm(value[0])}
                      className="mb-6"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="weight-kg">Weight (kg): {weightKg}</Label>
                    </div>
                    <Slider
                      id="weight-kg"
                      min={30}
                      max={200}
                      step={1}
                      value={[weightKg]}
                      onValueChange={(value) => setWeightKg(value[0])}
                      className="mb-6"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="imperial" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height-ft">Height (ft)</Label>
                      <Input
                        id="height-ft"
                        type="number"
                        min={1}
                        max={8}
                        value={heightFt}
                        onChange={(e) => setHeightFt(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height-in">Height (in)</Label>
                      <Input
                        id="height-in"
                        type="number"
                        min={0}
                        max={11}
                        value={heightIn}
                        onChange={(e) => setHeightIn(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      min={50}
                      max={500}
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <Button onClick={calculateBMI} className="w-full mt-6">
                Calculate BMI
              </Button>

              {bmi !== null && (
                <div className="mt-8 p-6 border rounded-lg bg-muted/30 text-center">
                  <h3 className="text-lg font-medium mb-2">Your BMI Result</h3>
                  <p className={`text-3xl font-bold mb-2 ${getBmiColor()}`}>{bmi.toFixed(1)}</p>
                  <p className={`text-lg font-medium ${getBmiColor()}`}>{bmiCategory}</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>BMI Categories:</p>
                    <ul className="mt-2 space-y-1">
                      <li>Underweight: &lt; 18.5</li>
                      <li>Normal weight: 18.5 - 24.9</li>
                      <li>Overweight: 25 - 29.9</li>
                      <li>Obesity: ≥ 30</li>
                    </ul>
                  </div>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
