"use client"
import { useRouter } from 'next/navigation'
import { ConnectWalletButton } from '@/app/components/ConnectWalletButton'

export default function ConnectWalletPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>Connect Wallet</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.description}>
          Use the button below to connect your wallet via the Mini App SDK.
        </p>

        <div style={styles.walletSection}>
          <div style={styles.walletButtonWrapper}>
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: 'white',
    padding: '20px',
  },

  /** HEADER BAR */
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '30px',
  },

  backButton: {
    backgroundColor: 'rgba(128,128,128,0.25)', // transparent grey
    color: '#333',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
  },

  title: {
    margin: 0,
    color: '#2d5016',
    fontSize: '24px',
    fontWeight: 'bold',
  },

  /** MAIN CONTENT */
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  description: {
    color: '#2d5016',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
    maxWidth: '260px',
  },

  walletSection: {
    padding: '16px',
    backgroundColor: '#e8f5e8',
    borderRadius: '12px',
  },

  /** Make wallet button smaller */
  walletButtonWrapper: {
    transform: 'scale(0.85)', // reduces size slightly
    transformOrigin: 'center',
  },
}
