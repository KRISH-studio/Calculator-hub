"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CalorieNeedsCalculator() {
  const [age, setAge] = useState<number>(30)
  const [gender, setGender] = useState<string>("male")
  const [heightCm, setHeightCm] = useState<number>(170)
  const [weightKg, setWeightKg] = useState<number>(70)
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(7)
  const [weightLbs, setWeightLbs] = useState<number>(154)
  const [activityLevel, setActivityLevel] = useState<string>("moderate")
  const [goal, setGoal] = useState<string>("maintain")
  const [bmr, setBmr] = useState<number | null>(null)
  const [tdee, setTdee] = useState<number | null>(null)
  const [goalCalories, setGoalCalories] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string>("metric")

  useEffect(() => {
    calculateCalories()
  }, [age, gender, heightCm, weightKg, heightFt, heightIn, weightLbs, activityLevel, goal, activeTab])

  const calculateCalories = () => {
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

    // Calculate BMR using Mifflin-St Jeor Equation
    let calculatedBMR: number
    if (gender === "male") {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
    } else {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161
    }

    // Calculate TDEE based on activity level
    const activityMultiplier = getActivityMultiplier(activityLevel)
    const calculatedTDEE = calculatedBMR * activityMultiplier

    // Calculate goal calories
    let calculatedGoalCalories: number
    switch (goal) {
      case "lose":
        calculatedGoalCalories = calculatedTDEE - 500 // 500 calorie deficit for weight loss
        break
      case "gain":
        calculatedGoalCalories = calculatedTDEE + 500 // 500 calorie surplus for weight gain
        break
      default:
        calculatedGoalCalories = calculatedTDEE // Maintain weight
    }

    setBmr(calculatedBMR)
    setTdee(calculatedTDEE)
    setGoalCalories(calculatedGoalCalories)
  }

  const getActivityMultiplier = (activity: string): number => {
    switch (activity) {
      case "sedentary":
        return 1.2 // Little or no exercise
      case "light":
        return 1.375 // Light exercise 1-3 days/week
      case "moderate":
        return 1.55 // Moderate exercise 3-5 days/week
      case "active":
        return 1.725 // Hard exercise 6-7 days/week
      case "very-active":
        return 1.9 // Very hard exercise & physical job or 2x training
      default:
        return 1.55 // Default to moderate
    }
  }

  const getGoalDescription = (goalType: string): string => {
    switch (goalType) {
      case "lose":
        return "Weight Loss (500 calorie deficit)"
      case "maintain":
        return "Maintain Weight"
      case "gain":
        return "Weight Gain (500 calorie surplus)"
      default:
        return "Maintain Weight"
    }
  }

  const getMacroBreakdown = (calories: number): { protein: number; carbs: number; fat: number } => {
    // Standard macro breakdown: 30% protein, 40% carbs, 30% fat
    const protein = Math.round((calories * 0.3) / 4) // 4 calories per gram of protein
    const carbs = Math.round((calories * 0.4) / 4) // 4 calories per gram of carbs
    const fat = Math.round((calories * 0.3) / 9) // 9 calories per gram of fat

    return { protein, carbs, fat }
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

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Daily Calorie Needs Calculator</CardTitle>
            <CardDescription>
              Calculate your daily calorie needs based on your age, gender, height, weight, and activity level.
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
                  Age: {age} years
                </Label>
                <Slider
                  id="age"
                  min={15}
                  max={80}
                  step={1}
                  value={[age]}
                  onValueChange={(value) => setAge(value[0])}
                  className="mb-2"
                />
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={15}
                  max={80}
                  className="mt-2"
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
                      Height: {heightCm} cm
                    </Label>
                    <Slider
                      id="height-cm"
                      min={100}
                      max={220}
                      step={1}
                      value={[heightCm]}
                      onValueChange={(value) => setHeightCm(value[0])}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      min={100}
                      max={220}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight-kg" className="mb-2 block">
                      Weight: {weightKg} kg
                    </Label>
                    <Slider
                      id="weight-kg"
                      min={30}
                      max={200}
                      step={1}
                      value={[weightKg]}
                      onValueChange={(value) => setWeightKg(value[0])}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      min={30}
                      max={200}
                      className="mt-2"
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
                        min={3}
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
                      min={66}
                      max={440}
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
                    <Label htmlFor="very-active">Very Active (hard exercise daily or physical job)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-6 mb-6">
                <Label className="mb-2 block">Goal</Label>
                <RadioGroup value={goal} onValueChange={setGoal} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose" id="lose" />
                    <Label htmlFor="lose">Lose Weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain">Maintain Weight</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain" id="gain" />
                    <Label htmlFor="gain">Gain Weight</Label>
                  </div>
                </RadioGroup>
              </div>

              {bmr !== null && tdee !== null && goalCalories !== null && (
                <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4 text-center">Your Calorie Needs</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Basal Metabolic Rate (BMR):</span>
                      <span className="font-semibold">{Math.round(bmr)} calories/day</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Total Daily Energy Expenditure (TDEE):</span>
                      <span className="font-semibold">{Math.round(tdee)} calories/day</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Calories for {getGoalDescription(goal)}:</span>
                      <span className="font-semibold text-lg">{Math.round(goalCalories)} calories/day</span>
                    </div>

                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Recommended Macronutrient Breakdown:</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {(() => {
                          const macros = getMacroBreakdown(goalCalories)
                          return (
                            <>
                              <div className="p-3 bg-primary/10 rounded-md">
                                <div className="text-lg font-semibold">{macros.protein}g</div>
                                <div className="text-sm text-muted-foreground">Protein</div>
                              </div>
                              <div className="p-3 bg-primary/10 rounded-md">
                                <div className="text-lg font-semibold">{macros.carbs}g</div>
                                <div className="text-sm text-muted-foreground">Carbs</div>
                              </div>
                              <div className="p-3 bg-primary/10 rounded-md">
                                <div className="text-lg font-semibold">{macros.fat}g</div>
                                <div className="text-sm text-muted-foreground">Fat</div>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="pt-2 text-sm text-muted-foreground">
                      <p className="mb-2">
                        <strong>BMR</strong> is the number of calories your body needs at complete rest.
                      </p>
                      <p className="mb-2">
                        <strong>TDEE</strong> is your estimated daily calorie needs based on your activity level.
                      </p>
                      <p>
                        <strong>Note:</strong> These are estimates. Individual needs may vary based on genetics, body
                        composition, and other factors.
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
