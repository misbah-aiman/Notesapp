"use client"
import { useRouter } from 'next/navigation'
import { ConnectWalletButton } from '@/app/components/ConnectWalletButton'

export default function ConnectWalletPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Connect Wallet</h1>
      </div>

      <div style={styles.sidebar}>
        <button
          onClick={() => router.back()}
          style={styles.button}
        >
          ← Back
        </button>

        <p style={styles.description}>Use the button below to connect your wallet via the Mini App SDK.</p>

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
  titleContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: '12px',
    padding: '15px 30px',
    margin: '20px',
    alignSelf: 'flex-start',
  },
  title: {
    margin: 0,
    color: '#2d5016',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  sidebar: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
    paddingLeft: '20px',
  },
  button: {
    backgroundColor: 'rgba(232, 245, 232, 0.8)',
    color: '#2d5016',
    border: 'none',
    padding: '12px 24px',
    margin: '10px 0',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    width: '160px',
    textAlign: 'center',
  },
  description: {
    color: '#2d5016',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px',
    maxWidth: '200px',
  },
  walletSection: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#e8f5e8',
    borderRadius: '12px',
  },
}
