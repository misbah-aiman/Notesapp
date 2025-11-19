"use client"
import { useRouter } from 'next/navigation'
import { ConnectWalletButton } from '@/app/components/ConnectWalletButton'

export default function ConnectWalletPage() {
  const router = useRouter()

  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={() => router.back()}
        style={{ marginBottom: 16, padding: '8px 12px' }}
      >
        ← Back
      </button>

      <h2>Connect Wallet</h2>
      <p>Use the button below to connect your wallet via the Mini App SDK.</p>

      <div style={{ marginTop: 16 }}>
        <ConnectWalletButton />
      </div>
    </div>
  )
}
