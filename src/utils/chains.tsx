
import { mainnet, arbitrum, optimism, base, scroll, polygon, linea } from 'viem/chains';
import { Chain } from 'viem';

// Define supported chains as a readonly tuple
export const supportedChains = [
  mainnet,
  arbitrum,
  optimism,
  base,
  scroll,
  polygon,
  linea,
] as const; // 'as const' makes it a readonly tuple

// Export a type for chain IDs (optional, for type safety)
export type SupportedChainId = typeof supportedChains[number]['id'];