"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BMRCalculator() {
  const [age, setAge] = useState<number>(30)
  const [gender, setGender] = useState<string>("male")
  const [heightCm, setHeightCm] = useState<number>(170)
  const [weightKg, setWeightKg] = useState<number>(70)
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(7)
  const [weightLbs, setWeightLbs] = useState<number>(154)
  const [bmr, setBmr] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string>("metric")
  const [activityLevel, setActivityLevel] = useState<string>("sedentary")

  const calculateBMR = () => {
    let calculatedBMR: number
    let heightInCm: number
    let weightInKg: number

    if (activeTab === "metric") {
      heightInCm = heightCm
      weightInKg = weightKg
    } else {
      // Convert imperial to metric
      heightInCm = (heightFt * 12 + heightIn) * 2.54
      weightInKg = weightLbs / 2.205
    }

    // Mifflin-St Jeor Equation
    if (gender === "male") {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
    } else {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161
    }

    setBmr(calculatedBMR)
  }

  const getActivityMultiplier = () => {
    switch (activityLevel) {
      case "sedentary":
        return 1.2
      case "light":
        return 1.375
      case "moderate":
        return 1.55
      case "active":
        return 1.725
      case "very-active":
        return 1.9
      default:
        return 1.2
    }
  }

  const getTDEE = () => {
    if (bmr === null) return null
    return Math.round(bmr * getActivityMultiplier())
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
            <CardTitle className="text-2xl">BMR Calculator</CardTitle>
            <CardDescription>
              Calculate your Basal Metabolic Rate (BMR) to understand your calorie needs at rest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <Label htmlFor="age" className="mb-2 block">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min={15}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>

              <div className="mb-6">
                <Label className="mb-2 block">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <TabsContent value="metric" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height-cm" className="mb-2 block">
                      Height (cm)
                    </Label>
                    <Input
                      id="height-cm"
                      type="number"
                      min={100}
                      max={250}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight-kg" className="mb-2 block">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight-kg"
                      type="number"
                      min={30}
                      max={200}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="imperial" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height-ft" className="mb-2 block">
                        Height (ft)
                      </Label>
                      <Input
                        id="height-ft"
                        type="number"
                        min={1}
                        max={8}
                        value={heightFt}
                        onChange={(e) => setHeightFt(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height-in" className="mb-2 block">
                        Height (in)
                      </Label>
                      <Input
                        id="height-in"
                        type="number"
                        min={0}
                        max={11}
                        value={heightIn}
                        onChange={(e) => setHeightIn(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="weight-lbs" className="mb-2 block">
                      Weight (lbs)
                    </Label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      min={50}
                      max={500}
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 mb-6">
                <Label className="mb-2 block">Activity Level</Label>
                <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary">Sedentary (little or no exercise)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light (exercise 1-3 days/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (exercise 3-5 days/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active">Active (exercise 6-7 days/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-active" id="very-active" />
                    <Label htmlFor="very-active">Very Active (hard exercise daily)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={calculateBMR} className="w-full mt-6">
                Calculate BMR
              </Button>

              {bmr !== null && (
                <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4 text-center">Your Results</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Basal Metabolic Rate (BMR):</span>
                      <span className="font-semibold">{Math.round(bmr)} calories/day</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Total Daily Energy Expenditure (TDEE):</span>
                      <span className="font-semibold">{getTDEE()} calories/day</span>
                    </div>

                    <div className="pt-2 text-sm text-muted-foreground">
                      <p className="mb-2">
                        <strong>BMR</strong> is the number of calories your body needs at complete rest.
                      </p>
                      <p>
                        <strong>TDEE</strong> is your estimated daily calorie needs based on your activity level.
                      </p>
                    </div>
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
