import { useState, useEffect } from 'react'
import type { CoinPrice } from '../types/database'

const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
}

export function usePrices() {
  const [prices, setPrices] = useState<CoinPrice>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = Object.values(COIN_IDS).join(',')
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        )
        const data = await response.json()
        
        const priceMap: CoinPrice = {}
        Object.entries(COIN_IDS).forEach(([token, coinId]) => {
          if (data[coinId]) {
            priceMap[token] = { usd: data[coinId].usd }
          }
        })
        
        setPrices(priceMap)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch prices:', error)
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)

    return () => clearInterval(interval)
  }, [])

  return { prices, loading }
}
