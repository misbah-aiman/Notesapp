'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { ConnectWalletButton } from '@/app/components/ConnectWalletButton'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await sdk.actions.ready()
        console.log('Notes app is ready!')
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initializeApp()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Notes App</h1>
      </div>
  
      <div style={styles.sidebar}>
        <button style={styles.button} onClick={() => router.push('/new')}>+ NEW</button>
        <button style={styles.button} onClick={() => router.push('/mynotes')}>MY NOTES</button>
        <button style={styles.button} onClick={() => router.push('/bin')}>BIN</button>
  <button
          style={styles.button}
          onClick={() => router.push('/connect-wallet')}
        >
          Connect Wallet
        </button>
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
}