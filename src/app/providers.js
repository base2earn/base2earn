"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  trustWallet,
  coinbaseWallet,
  rabbyWallet,
  metaMaskWallet,
  safeWallet,
  walletConnectWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { CHAIN_ID } from "../statics/addresses";

const baseChain = {
  id: 8453,
  name: "Base",
  network: "Base Mainnet",
  iconUrl: "https://basescan.org/images/logo-symbol.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.base.org"],
    },
    default: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://basescan.org" },
    etherscan: { name: "BaseScan", url: "https://basescan.org" },
  },
  testnet: false,
};

export const shib = {
  id: 109,
  name: 'Shibarium',
  network: 'Shibarium',
  iconUrl:
    'https://uploads-ssl.webflow.com/64a576093dd515c9042b0db7/64a576093dd515c9042b0e15_Shibariumtech.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Bone',
    symbol: 'BONE',
  },
  rpcUrls: {
    public: {
      http: ['https://www.shibrpc.com/'],
    },
    default: {
      http: ['https://www.shibrpc.com/'],
    },
  },
  blockExplorers: {
    default: { name: 'ShibariumScan', url: 'https://www.shibariumscan.io/' },
    etherscan: { name: 'ShibariumScan', url: 'https://www.shibariumscan.io/' },
  },
  testnet: false,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [shib],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const projectId = process.env.NEXT_PUBLIC_APP_ID
  ? process.env.NEXT_PUBLIC_APP_ID
  : "";

const demoAppInfo = {
  appName: "BASE2EARN",
};

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rabbyWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName: "BASE2EARN", chains }),
      safeWallet({ chains }),
    ],
  },
  {
    groupName: "Other",
    wallets: [
      walletConnectWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
