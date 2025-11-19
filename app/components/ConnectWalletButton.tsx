'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Request wallet connection via the miniapp SDK
      const result = await sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts',
      });

      if (result && result.length > 0) {
        const address = result[0];
        setWalletAddress(address);
        setIsConnected(true);
        console.log('✅ Connected wallet:', address);
      } else {
        setError('No wallet account returned. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Error connecting wallet:', err);
      // Provide more specific error messages
      if (err?.code === 'ECONNREFUSED' || err?.message?.includes('refused')) {
        setError('Wallet connection refused. Please check your wallet.');
      } else if (err?.message?.includes('not found')) {
        setError('Wallet provider not found. Make sure your wallet is installed.');
      } else {
        setError(`Failed to connect wallet: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setError('');
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const accounts = await sdk.wallet.ethProvider.request({
          method: 'eth_accounts',
        });
        
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          console.log('✅ Wallet already connected:', accounts[0]);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        // Silently fail for checks, only show errors on user action
      }
    };

    checkConnection();
  }, []);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2d5016',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          >
            ✅ Connected: {shortenAddress(walletAddress)}
          </div>
          <button
            onClick={disconnectWallet}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              color: '#dc2626',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Disconnect
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '200px',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Provide a default export as some imports/build environments expect it
export default ConnectWalletButton