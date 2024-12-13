import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet } from 'viem/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const metadata = {
  name: 'Gift Meme',
  description: 'Gift tokens to anyone',
  url: 'https://giftmeme.xyz', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet]
export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })
