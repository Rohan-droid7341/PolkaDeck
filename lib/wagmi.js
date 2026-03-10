
import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem'; 
import { WagmiProvider, cookieStorage, createStorage } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const polkadotHubTestnet = defineChain({
  id: 420420417,
  name: 'Polkadot Hub TestNet',
  nativeCurrency: { name: 'Polkadot Hub TestNet', symbol: 'PAS', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_POLKADOT_HUB_TESTNET_RPC || 'https://eth-rpc-testnet.polkadot.io/'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout-testnet.polkadot.io/' },
  },
  testnet: true,
});

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) { console.error("ERROR: NEXT_PUBLIC_PROJECT_ID environment variable is not set!"); }

export const wagmiConfig = createConfig({
  chains: [polkadotHubTestnet],
  projectId: projectId || 'fallback_project_id',
  transports: {
    [polkadotHubTestnet.id]: http(process.env.NEXT_PUBLIC_POLKADOT_HUB_TESTNET_RPC || 'https://eth-rpc-testnet.polkadot.io/'),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

const queryClient = new QueryClient();

// Provider component
export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}