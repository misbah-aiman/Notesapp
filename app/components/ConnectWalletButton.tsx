'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Request wallet connection from MiniKit
      const result = await sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts',
      });

      if (result && result.length > 0) {
        const address = result[0];
        setWalletAddress(address);
        setIsConnected(true);
        console.log('Connected wallet:', address);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setError('');
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const accounts = await sdk.wallet.ethProvider.request({
          method: 'eth_accounts',
        });
        
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };

    checkConnection();
  }, []);

  // Helper function to shorten wallet address for display
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
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
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
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}