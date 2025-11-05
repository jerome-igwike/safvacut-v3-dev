import { Link } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { useBalances } from '../../hooks/useBalances'
import { usePrices } from '../../hooks/usePrices'
import { SUPPORTED_TOKENS } from '../../types/database'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, RefreshCw, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function Dashboard() {
  const { user, profile, isAdmin } = useUser()
  const { balances, loading: balancesLoading } = useBalances(user?.id)
  const { prices, loading: pricesLoading } = usePrices()

  const getBalance = (token: string) => {
    const balance = balances.find((b) => b.token === token)
    return balance ? parseFloat(balance.amount) : 0
  }

  const getUsdValue = (token: string, amount: number) => {
    const price = prices[token]?.usd || 0
    return amount * price
  }

  const totalUsd = SUPPORTED_TOKENS.reduce((sum, token) => {
    const amount = getBalance(token)
    return sum + getUsdValue(token, amount)
  }, 0)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Safvacut" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">Safvacut V3</h1>
              <p className="text-sm text-gray-400">{profile?.uid || 'Loading...'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {isAdmin && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
            <p className="text-orange-400 font-semibold">🔑 Admin Panel Access</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 mb-6 shadow-xl">
          <p className="text-orange-100 text-sm mb-2">Total Portfolio Value</p>
          {balancesLoading || pricesLoading ? (
            <div className="h-10 w-48 bg-orange-400/30 rounded animate-pulse"></div>
          ) : (
            <motion.h2
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={totalUsd}
            >
              ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.h2>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/deposit"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors flex flex-col items-center gap-3"
          >
            <div className="bg-green-500/20 p-3 rounded-full">
              <ArrowDownLeft className="w-6 h-6 text-green-500" />
            </div>
            <span className="font-semibold">Deposit</span>
          </Link>

          <Link
            to="/withdraw"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 transition-colors flex flex-col items-center gap-3"
          >
            <div className="bg-red-500/20 p-3 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-red-500" />
            </div>
            <span className="font-semibold">Withdraw</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assets</h3>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-3">
            {SUPPORTED_TOKENS.map((token) => {
              const amount = getBalance(token)
              const usdValue = getUsdValue(token, amount)
              const price = prices[token]?.usd || 0

              return (
                <div
                  key={token}
                  className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                      {token.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{token}</p>
                      {pricesLoading ? (
                        <div className="h-4 w-16 bg-gray-700 rounded animate-pulse mt-1"></div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {balancesLoading ? (
                      <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      <>
                        <motion.p
                          className="font-semibold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={amount}
                        >
                          {amount.toFixed(8)} {token}
                        </motion.p>
                        <p className="text-sm text-gray-400">
                          ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
