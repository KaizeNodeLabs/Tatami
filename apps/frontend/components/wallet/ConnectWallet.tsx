"use client";

import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ControllerConnector from '@cartridge/connector/controller';

interface ConnectWalletProps {
  className?: string;
  children?: React.ReactNode;
}

export function ConnectWallet({ className, children }: ConnectWalletProps) {
  const { connect, connectors } = useConnect();
  const { account, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Debug: Log available connectors
  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
  }, [connectors]);

  // Redirect to app when connected
  useEffect(() => {
    if (isConnected && account) {
      router.push('/app');
    }
  }, [isConnected, account, router]);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      // Find the Cartridge connector
      const cartridgeConnector = connectors.find(
        (connector) => connector.id === 'controller'
      );
      
      if (cartridgeConnector) {
        console.log('Connecting with Cartridge connector...');
        
        // If this is a retry, disconnect first to reset the state
        if (retryCount > 0) {
          console.log('Retrying connection, disconnecting first...');
          await disconnect();
          // Small delay to ensure disconnect completes
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await connect({ connector: cartridgeConnector });
        setRetryCount(0); // Reset retry count on success
      } else {
        console.error('Cartridge connector not found');
        console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
        alert('Cartridge wallet not available. Please install Cartridge.');
      }
    } catch (error: any) {
      console.error('Failed to connect:', error);
      
      // Handle specific WebAuthn errors
      if (error?.message?.includes('WebAuthn') || error?.message?.includes('NotAllowedError')) {
        console.log('WebAuthn error detected, this might be due to TLS certificate issues in development');
        setRetryCount(prev => prev + 1);
        
        if (retryCount < 2) {
          alert('Authentication error. Please try again. (This is normal in development environments)');
        } else {
          alert('Authentication failed. Please ensure you\'re using HTTPS or try refreshing the page.');
        }
      } else {
        // Show user-friendly error message
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      className={className}
      disabled={isConnected || isConnecting}
    >
      {isConnected 
        ? 'Connected' 
        : isConnecting 
          ? 'Connecting...' 
          : retryCount > 0 
            ? `${children || 'Connect'} (Retry ${retryCount})`
            : children || 'Connect'
      }
    </button>
  );
} 