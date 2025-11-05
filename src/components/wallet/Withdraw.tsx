import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { useUser } from '../../hooks/useUser'
import { useBalances } from '../../hooks/useBalances'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { SUPPORTED_TOKENS, type SupportedToken } from '../../types/database'

const RATE_LIMIT_SECONDS = 30

export function Withdraw() {
  const { user } = useUser()
  const { balances } = useBalances(user?.id)
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('BTC')
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    checkRateLimit()
    const interval = setInterval(checkRateLimit, 1000)
    return () => clearInterval(interval)
  }, [])

  const checkRateLimit = () => {
    const lastWithdrawalTime = localStorage.getItem(`lastWithdrawal_${user?.id}`)
    if (lastWithdrawalTime) {
      const elapsed = Date.now() - parseInt(lastWithdrawalTime)
      const remaining = Math.max(0, RATE_LIMIT_SECONDS - Math.floor(elapsed / 1000))
      setTimeRemaining(remaining)
    } else {
      setTimeRemaining(0)
    }
  }

  const getBalance = (token: string) => {
    const balance = balances.find((b) => b.token === token)
    return balance ? parseFloat(balance.amount) : 0
  }

  const currentBalance = getBalance(selectedToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast.error('You must be logged in')
      return
    }

    if (timeRemaining > 0) {
      toast.error(`Please wait ${timeRemaining} seconds before making another withdrawal`)
      return
    }

    const numAmount = parseFloat(amount)
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Invalid amount')
      return
    }

    if (numAmount > currentBalance) {
      toast.error('Insufficient balance')
      return
    }

    if (!toAddress) {
      toast.error('Please enter a withdrawal address')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          token: selectedToken,
          amount: numAmount.toString(),
          to_address: toAddress,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      localStorage.setItem(`lastWithdrawal_${user.id}`, Date.now().toString())
      setTimeRemaining(RATE_LIMIT_SECONDS)
      toast.success('Withdrawal request submitted! An admin will process it shortly.')
      setToAddress('')
      setAmount('')
    } catch (error: any) {
      console.error('Withdrawal error:', error)
      toast.error(error.message || 'Failed to submit withdrawal request')
    } finally {
      setLoading(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(currentBalance.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Withdraw Crypto</h1>
          <p className="text-gray-400 mt-2">
            Send crypto from your wallet to an external address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium mb-3">Select Token</label>
            <div className="grid grid-cols-4 gap-3">
              {SUPPORTED_TOKENS.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setSelectedToken(token)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    selectedToken === token
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Available: {currentBalance.toFixed(8)} {selectedToken}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium mb-3">Withdrawal Address</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder={`Enter ${selectedToken} address`}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Amount</label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-sm text-orange-500 hover:text-orange-400 font-semibold"
              >
                MAX
              </button>
            </div>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-sm text-orange-400">
              ⚠️ Withdrawal requests are manually reviewed by admins. Processing may take a few minutes to several hours.
            </p>
          </div>

          {timeRemaining > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="w-5 h-5" />
                <p className="text-sm font-medium">
                  Rate limit: Please wait {timeRemaining} seconds before making another withdrawal
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || currentBalance === 0 || timeRemaining > 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : timeRemaining > 0 ? `Wait ${timeRemaining}s` : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
