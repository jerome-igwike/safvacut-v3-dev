function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <img src="/logo.png" alt="Safvacut Logo" className="w-24 h-24 rounded-full" />
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Safvacut V3
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl">
            Modern Web3 Wallet - React + TypeScript + Supabase
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-orange-500 text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold mb-2">Phase 1 Complete</h3>
              <p className="text-gray-400 text-sm">React + TypeScript stack initialized</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-orange-500 text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Dependencies Ready</h3>
              <p className="text-gray-400 text-sm">Tailwind, Supabase, Wagmi, RainbowKit</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-orange-500 text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Ready for Phase 2</h3>
              <p className="text-gray-400 text-sm">Next: Supabase setup & auth</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-900/30 border border-green-700 rounded-lg max-w-2xl">
            <p className="text-sm text-green-300">
              <strong>Phase 2 Setup Complete!</strong>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              ✓ Supabase migrations created<br/>
              ✓ Edge functions ready<br/>
              ✓ Dev server running on port 5000
            </p>
            <p className="text-xs text-orange-400 mt-2">
              Next: Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Replit Secrets
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
