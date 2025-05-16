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

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<string>("male")
  const [heightCm, setHeightCm] = useState<number>(170)
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(7)
  const [activeTab, setActiveTab] = useState<string>("metric")
  const [idealWeights, setIdealWeights] = useState<{
    devine: number | null
    robinson: number | null
    miller: number | null
    hamwi: number | null
    bmi: { min: number | null; max: number | null }
  }>({
    devine: null,
    robinson: null,
    miller: null,
    hamwi: null,
    bmi: { min: null, max: null },
  })

  useEffect(() => {
    calculateIdealWeight()
  }, [gender, heightCm, heightFt, heightIn, activeTab])

  const calculateIdealWeight = () => {
    let heightInCm: number
    let heightInInches: number

    if (activeTab === "metric") {
      heightInCm = heightCm
      heightInInches = heightInCm / 2.54
    } else {
      heightInInches = heightFt * 12 + heightIn
      heightInCm = heightInInches * 2.54
    }

    // Only calculate if height is valid
    if (heightInCm < 100 || heightInCm > 250) return

    // Calculate ideal weight using different formulas
    let devine: number
    let robinson: number
    let miller: number
    let hamwi: number

    // Height in inches over 5 feet
    const inchesOver5Feet = Math.max(0, heightInInches - 60)

    if (gender === "male") {
      // Devine formula
      devine = 50 + 2.3 * inchesOver5Feet

      // Robinson formula
      robinson = 52 + 1.9 * inchesOver5Feet

      // Miller formula
      miller = 56.2 + 1.41 * inchesOver5Feet

      // Hamwi formula
      hamwi = 48 + 2.7 * inchesOver5Feet
    } else {
      // Devine formula
      devine = 45.5 + 2.3 * inchesOver5Feet

      // Robinson formula
      robinson = 49 + 1.7 * inchesOver5Feet

      // Miller formula
      miller = 53.1 + 1.36 * inchesOver5Feet

      // Hamwi formula
      hamwi = 45.5 + 2.2 * inchesOver5Feet
    }

    // Calculate BMI range (18.5 - 24.9 is considered healthy)
    const heightInMeters = heightInCm / 100
    const minWeight = 18.5 * heightInMeters * heightInMeters
    const maxWeight = 24.9 * heightInMeters * heightInMeters

    setIdealWeights({
      devine,
      robinson,
      miller,
      hamwi,
      bmi: { min: minWeight, max: maxWeight },
    })
  }

  const getAverageIdealWeight = (): number => {
    const { devine, robinson, miller, hamwi } = idealWeights
    if (devine && robinson && miller && hamwi) {
      return (devine + robinson + miller + hamwi) / 4
    }
    return 0
  }

  const formatWeight = (weight: number | null, isMetric: boolean): string => {
    if (weight === null) return "-"
    if (isMetric) {
      return `${weight.toFixed(1)} kg`
    } else {
      const weightInLbs = weight * 2.205
      return `${weightInLbs.toFixed(1)} lbs`
    }
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
            <CardTitle className="text-2xl">Ideal Weight Calculator</CardTitle>
            <CardDescription>
              Calculate your ideal weight based on height and gender using different formulas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <Label className="mb-2 block">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male-gender" />
                    <Label htmlFor="male-gender">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female-gender" />
                    <Label htmlFor="female-gender">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <TabsContent value="metric" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="imperial" className="space-y-6">
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
              </TabsContent>

              {idealWeights.devine !== null && (
                <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4 text-center">Your Ideal Weight Results</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Devine Formula:</span>
                      <span className="font-semibold">{formatWeight(idealWeights.devine, activeTab === "metric")}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Robinson Formula:</span>
                      <span className="font-semibold">
                        {formatWeight(idealWeights.robinson, activeTab === "metric")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Miller Formula:</span>
                      <span className="font-semibold">{formatWeight(idealWeights.miller, activeTab === "metric")}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Hamwi Formula:</span>
                      <span className="font-semibold">{formatWeight(idealWeights.hamwi, activeTab === "metric")}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Healthy BMI Range (18.5-24.9):</span>
                      <span className="font-semibold">
                        {formatWeight(idealWeights.bmi.min, activeTab === "metric")} -{" "}
                        {formatWeight(idealWeights.bmi.max, activeTab === "metric")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium">Average Ideal Weight:</span>
                      <span className="font-semibold text-lg">
                        {formatWeight(getAverageIdealWeight(), activeTab === "metric")}
                      </span>
                    </div>

                    <div className="pt-4 text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">About the Formulas:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Devine (1974):</strong> Commonly used in clinical settings to calculate medication
                          dosages.
                        </li>
                        <li>
                          <strong>Robinson (1983):</strong> A modification of the Devine formula with slightly different
                          parameters.
                        </li>
                        <li>
                          <strong>Miller (1983):</strong> Another variation that tends to give higher ideal weights.
                        </li>
                        <li>
                          <strong>Hamwi (1964):</strong> One of the earliest formulas developed for estimating ideal
                          body weight.
                        </li>
                        <li>
                          <strong>BMI Method:</strong> Based on a healthy Body Mass Index range of 18.5-24.9.
                        </li>
                      </ul>
                      <p className="mt-2">
                        <strong>Note:</strong> These are estimates. Individual ideal weight may vary based on body
                        composition, muscle mass, age, and other factors.
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
