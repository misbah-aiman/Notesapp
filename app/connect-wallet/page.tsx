"use client"
import { useRouter } from 'next/navigation'
import { ConnectWalletButton } from '@/app/components/ConnectWalletButton'

export default function ConnectWalletPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>Connect Wallet</h1>
      </div>

      <div style={styles.sidebar}>
        <p style={styles.description}>
          Use the button below to connect your wallet via the Mini App SDK.
        </p>

        <div style={styles.walletSection}>
          <ConnectWalletButton />
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
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(200, 200, 200, 0.3)', 
    padding: '15px 20px',
  },

  backButton: {
    background: 'rgba(150,150,150,0.2)',
    color: '#333',
    border: 'none',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '8px',
    fontWeight: 'bold',
  },

  title: {
    margin: 0,
    color: '#2d5016',
    fontSize: '22px',
    fontWeight: 'bold',
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
  },

  description: {
    color: '#2d5016',
    fontSize: '14px',
    textAlign: 'center',
    maxWidth: '220px',
    marginBottom: '20px',
  },

  walletSection: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '10px',
  },
}
