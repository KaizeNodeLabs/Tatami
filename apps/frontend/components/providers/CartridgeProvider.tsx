"use client";

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { ReactNode, useEffect } from 'react';

// Initialize the connector outside of React components
const connector = new ControllerConnector();

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' };
      case sepolia:
      default:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' };
    }
  },
});

interface CartridgeProviderProps {
  children: ReactNode;
}

export function CartridgeProvider({ children }: CartridgeProviderProps) {
  // Handle development environment warnings
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      console.warn(
        '⚠️ Cartridge WebAuthn may not work properly on HTTP in development. ' +
        'Consider using HTTPS or localhost for better compatibility.'
      );
    }
  }, []);

  return (
    <StarknetConfig
      autoConnect={false} // Disable autoConnect to prevent WebAuthn issues on page load
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[connector]}
      explorer={starkscan}
    >
      {children}
    </StarknetConfig>
  );
} 