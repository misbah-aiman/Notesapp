'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the SDK
    const load = async () => {
      await sdk.actions.ready();
    };
    load();
  }, []);

  return <>{children}</>;
}