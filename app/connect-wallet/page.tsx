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

      <div style={styles.content}>
        <p style={styles.description}>
          Use the button below to connect your wallet.
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
    backgroundColor: 'rgba(45, 80, 22, 0.1)',
    padding: '6px 14px',
    borderRadius: '8px',
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',  
    paddingLeft: '20px',
    paddingTop: '30px',
  },

  description: {
    color: '#2d5016',
    fontSize: '14px',
    marginBottom: '15px',
  },

  walletSection: {
    marginTop: '10px',
    padding: '10px 0',
  },
}
