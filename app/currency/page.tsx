"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Currency data with symbols and names
const currencyData = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CHF: { name: "Swiss Franc", symbol: "Fr" },
  CNY: { name: "Chinese Yuan", symbol: "¥" },
  INR: { name: "Indian Rupee", symbol: "₹" },
  BRL: { name: "Brazilian Real", symbol: "R$" },
  ZAR: { name: "South African Rand", symbol: "R" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
  MXN: { name: "Mexican Peso", symbol: "Mex$" },
  SEK: { name: "Swedish Krona", symbol: "kr" },
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [popularRates, setPopularRates] = useState<{ from: string; to: string; rate: number }[]>([])

  const currencies = Object.keys(currencyData)

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Using ExchangeRate-API's free endpoint
      const response = await fetch("https://open.er-api.com/v6/latest/USD")

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates")
      }

      const data = await response.json()

      if (data.result === "success") {
        setExchangeRates(data.rates)

        // Set popular rates
        const popularCurrencies = ["EUR", "GBP", "JPY", "CAD"]
        const newPopularRates = popularCurrencies.map((currency) => ({
          from: "USD",
          to: currency,
          rate: data.rates[currency],
        }))
        setPopularRates(newPopularRates)

        // Set last updated time
        const now = new Date()
        setLastUpdated(now.toLocaleString())

        // Convert with new rates
        convertCurrency(amount, fromCurrency, toCurrency, data.rates)
      } else {
        throw new Error("Invalid response from exchange rate API")
      }
    } catch (err) {
      setError(`Failed to fetch exchange rates: ${(err as Error).message}`)
      console.error("Error fetching exchange rates:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchExchangeRates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Convert when amount, currencies change and we have rates
  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      convertCurrency(amount, fromCurrency, toCurrency, exchangeRates)
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates])

  const convertCurrency = (value: number, from: string, to: string, rates: Record<string, number>) => {
    if (!value || !rates || Object.keys(rates).length === 0) {
      setConvertedAmount(null)
      return
    }

    try {
      // Convert to USD first (base currency), then to target currency
      const valueInUSD = from === "USD" ? value : value / rates[from]
      const result = to === "USD" ? valueInUSD : valueInUSD * rates[to]
      setConvertedAmount(result)
    } catch (err) {
      console.error("Error converting currency:", err)
      setConvertedAmount(null)
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleRefresh = () => {
    fetchExchangeRates()
  }

  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const getExchangeRate = (from: string, to: string) => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) return null

    // Calculate the exchange rate between the two currencies
    if (from === "USD") return exchangeRates[to]
    if (to === "USD") return 1 / exchangeRates[from]
    return exchangeRates[to] / exchangeRates[from]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Currency Converter</h1>
        <p className="text-muted-foreground">Convert between major world currencies with real-time exchange rates</p>
      </div>

      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Currency Converter</CardTitle>
                <CardDescription>Live exchange rates for {currencies.length} currencies</CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className={isLoading ? "animate-spin" : ""}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
                <div>
                  <Label htmlFor="from-currency">From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={isLoading}>
                    <SelectTrigger id="from-currency" className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currencyData[currency as keyof typeof currencyData].symbol} {currency} -{" "}
                          {currencyData[currency as keyof typeof currencyData].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapCurrencies}
                  className="mb-1"
                  disabled={isLoading}
                >
                  <ArrowDown className="h-4 w-4 rotate-90" />
                </Button>

                <div>
                  <Label htmlFor="to-currency">To</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency} disabled={isLoading}>
                    <SelectTrigger id="to-currency" className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currencyData[currency as keyof typeof currencyData].symbol} {currency} -{" "}
                          {currencyData[currency as keyof typeof currencyData].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {convertedAmount !== null && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    {amount} {fromCurrency} =
                  </div>
                  <div className="text-3xl font-bold mb-1">{formatCurrency(convertedAmount, toCurrency)}</div>
                  <div className="text-xs text-muted-foreground">
                    1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency)?.toFixed(4)} {toCurrency}
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground flex justify-between items-center">
              <span>Data provided by Exchange Rates API</span>
              <span>Last updated: {lastUpdated}</span>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Popular Conversions</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {popularRates.map((rate, index) => (
                  <div key={index} className="flex justify-between">
                    <span>1 {rate.from} = </span>
                    <span className="font-medium">
                      {rate.rate.toFixed(2)} {rate.to}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
