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
      {/* Top */}
      <div style={styles.header}>
        <h1 style={styles.title}>Notes</h1>
        <p style={styles.subtitle}>Private thoughts, just for you</p>
      </div>

      {/* Center Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Start writing</h2>
        <p style={styles.cardText}>Your thoughts stay yours.</p>

        <div style={{ marginTop: '20px', width: '100%' }}>
          <ConnectWalletButton />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <button style={styles.navItem} onClick={() => router.push('/bin')}>
          🗑️
          <span>Bin</span>
        </button>

        <button style={styles.navItem} onClick={() => router.push('/mynotes')}>
          📝
          <span>Notes</span>
        </button>

        <button style={styles.navItemCenter} onClick={() => router.push('/new')}>
          ＋
        </button>

        <button style={styles.navItem} onClick={() => router.push('/todo')}>
          ✅
          <span>To-Do</span>
        </button>

        <button style={styles.navItem} onClick={() => router.push('/profile')}>
          👤
          <span>Profile</span>
        </button>
      </div>
    </div>
  )
}
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    backgroundColor: '#faf7f2', // soft plain color
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '80px', // space for bottom nav
  },

  header: {
    marginTop: '40px',
    textAlign: 'center',
  },

  title: {
    fontSize: '28px',
    margin: 0,
    color: '#4b3f35',
  },

  subtitle: {
    fontSize: '14px',
    color: '#8a7f75',
    marginTop: '6px',
  },

  card: {
    marginTop: '60px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '30px',
    width: '90%',
    maxWidth: '360px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },

  cardTitle: {
    fontSize: '22px',
    marginBottom: '8px',
    color: '#4b3f35',
  },

  cardText: {
    fontSize: '14px',
    color: '#8a7f75',
  },

  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '70px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -5px 20px rgba(0,0,0,0.08)',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  },

  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    color: '#6b5f55',
    cursor: 'pointer',
  },

  navItemCenter: {
    backgroundColor: '#c0895e',
    border: 'none',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '28px',
    cursor: 'pointer',
    marginTop: '-30px',
    boxShadow: '0 8px 20px rgba(192,137,94,0.4)',
  },
}
