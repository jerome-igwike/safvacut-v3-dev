import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useUser } from '../../hooks/useUser'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { TableSkeleton } from '../ui/SkeletonLoader'
import type { Transaction } from '../../types/database'

export function TransactionHistory() {
  const { user } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    loadTransactions()

    const channel = supabase
      .channel('user_transactions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        loadTransactions()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  async function loadTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setTransactions(data || [])
    } catch (error: any) {
      console.error('Error loading transactions:', error)
      toast.error('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />
      case 'withdraw':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />
      default:
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-gray-400 mt-2">View all your deposits and withdrawals</p>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : transactions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
            <p className="text-gray-400 mb-6">Your transaction history will appear here</p>
            <Link
              to="/deposit"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Make your first deposit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-700 rounded-full p-3">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold capitalize">{tx.type}</h3>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {tx.tx_hash && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      <span className={tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                        {tx.type === 'deposit' ? '+' : '-'}
                        {parseFloat(tx.amount).toFixed(8)}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">{tx.token}</span>
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-1">{tx.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
