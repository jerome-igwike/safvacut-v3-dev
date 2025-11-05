import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { useUser } from '../../hooks/useUser'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { SUPPORTED_TOKENS, type SupportedToken } from '../../types/database'

export function Deposit() {
  const { user } = useUser()
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('BTC')
  const [depositAddress, setDepositAddress] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchDepositAddress = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('deposit_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', selectedToken)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching deposit address:', error)
        toast.error('Failed to load deposit address')
      } else if (data) {
        setDepositAddress(data.address)
      } else {
        const newAddress = generateMockAddress(selectedToken)
        
        const { error: insertError } = await supabase
          .from('deposit_addresses')
          .insert({
            user_id: user.id,
            token: selectedToken,
            address: newAddress,
          })

        if (insertError) {
          console.error('Error creating deposit address:', insertError)
          toast.error('Failed to create deposit address')
        } else {
          setDepositAddress(newAddress)
        }
      }
      setLoading(false)
    }

    fetchDepositAddress()
  }, [user?.id, selectedToken])

  const generateMockAddress = (token: SupportedToken): string => {
    const prefixes: Record<SupportedToken, string> = {
      BTC: '1',
      ETH: '0x',
      USDT: '0x',
      USDC: '0x',
    }
    
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = token === 'BTC' ? 34 : 40
    let address = prefixes[token]
    
    for (let i = 0; i < length; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    
    return address
  }

  const handleCopy = async () => {
    if (!depositAddress) return
    
    await navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    toast.success('Address copied to clipboard')
    
    setTimeout(() => setCopied(false), 2000)
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
          <h1 className="text-3xl font-bold">Deposit Crypto</h1>
          <p className="text-gray-400 mt-2">
            Send crypto to your deposit address
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-3">Select Token</label>
          <div className="grid grid-cols-4 gap-3">
            {SUPPORTED_TOKENS.map((token) => (
              <button
                key={token}
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
        </div>

        {loading ? (
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-700 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-6">
                <QRCodeSVG value={depositAddress} size={256} />
              </div>

              <p className="text-sm text-gray-400 mb-2">Your {selectedToken} Deposit Address:</p>
              
              <div className="bg-gray-900 rounded-lg p-4 w-full flex items-center justify-between">
                <code className="text-sm text-orange-400 break-all">{depositAddress}</code>
                <button
                  onClick={handleCopy}
                  className="ml-4 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 w-full">
                <p className="text-sm text-orange-400">
                  ⚠️ Only send {selectedToken} to this address. Sending other tokens may result in permanent loss.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
