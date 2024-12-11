import axios from 'axios';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/D31gzGUtVNhHNdnxeELUBdch5rzDRm5cddvae9GzhCLu`;
const BASE_RPC_URL = 'https://mainnet.base.org';

// wow.xyz contract on Base
const WOW_FACTORY = '0xeC7136a7F7A699659E1666ECc0F65956aCd35B4C';

// Basic ERC20 interface
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

// wow.xyz factory ABI - only what we need
const WOW_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "tokenCreator", "type": "address"},
      {"indexed": false, "name": "tokenAddress", "type": "address"},
      {"indexed": false, "name": "name", "type": "string"},
      {"indexed": false, "name": "symbol", "type": "string"}
    ],
    "name": "WowTokenCreated",
    "type": "event"
  }
];

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price_usd: number;
  logo_url?: string;
  source: 'uniswap' | 'wow' | 'unlisted';
}

async function getEthPrice(): Promise<number> {
  try {
    const response = await axios.post(
      GRAPH_API_URL,
      {
        query: `
          query {
            bundle(id: "1") {
              ethPriceUSD
            }
          }
        `
      }
    );
    return parseFloat(response.data.data.bundle.ethPriceUSD);
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return 0;
  }
}

async function searchUniswapTokens(searchQuery: string): Promise<TokenData[]> {
  try {
    const query = `
      query SearchTokens($searchQuery: String!) {
        tokens(
          first: 10,
          where: {
            or: [
              { name_contains_nocase: $searchQuery },
              { symbol_contains_nocase: $searchQuery }
            ]
          }
        ) {
          id
          name
          symbol
          decimals
          derivedETH
        }
      }
    `;

    const [response, ethPriceUSD] = await Promise.all([
      axios.post(GRAPH_API_URL, {
        query,
        variables: { searchQuery }
      }),
      getEthPrice()
    ]);

    if (response.data.errors) {
      throw new Error(`Graph API error: ${JSON.stringify(response.data.errors)}`);
    }
    

    return response.data.data.tokens.map((token: any) => ({
      address: token.id,
      name: token.name,
      symbol: token.symbol,
      decimals: parseInt(token.decimals),
      price_usd: parseFloat(token.derivedETH) * ethPriceUSD,
      logo_url: `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/base/assets/${token.id}/logo.png`,
      source: 'uniswap'
    }));
  } catch (error) {
    console.log('api:',process.env.GRAPH_API_KEY)
    console.log('Environment Variables:', process.env)
    console.error('Error fetching Uniswap tokens:', error);
    return [];
  }
}

async function searchWowTokens(
  provider: ethers.JsonRpcProvider,
  searchQuery: string
): Promise<TokenData[]> {
  try {
    // Check if the search query looks like an address
    const isAddress = searchQuery.startsWith('0x') && searchQuery.length === 42;
    
    if (isAddress) {
      console.log('Searching for specific token address:', searchQuery);
      try {
        const tokenContract = new ethers.Contract(searchQuery, ERC20_ABI, provider);
        const [name, symbol, decimals] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals()
        ]);
        
        return [{
          address: searchQuery,
          name,
          symbol,
          decimals,
          price_usd: 0, // Price calculation to be implemented
          source: 'wow'
        }];
      } catch (error) {
        console.error('Error fetching token details:', error);
        return [];
      }
    }
    
    // If not searching by address, search by name/symbol (keeping the existing logic)
    console.log('Attempting to connect to wow.xyz factory...');
    const factoryContract = new ethers.Contract(WOW_FACTORY, WOW_FACTORY_ABI, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    // Look back approximately 1 week of blocks (assuming 2s block time)
    const fromBlock = latestBlock - 302400;
    
    console.log('Fetching WowTokenCreated events...');
    const filter = factoryContract.filters.WowTokenCreated();
    const events = await factoryContract.queryFilter(filter, fromBlock, latestBlock);
    
    const tokens = new Map<string, TokenData>();
    const searchQueryLower = searchQuery.toLowerCase();
    
    for (const event of events) {
      const { tokenAddress, name, symbol } = event.args;
      
      // Skip if we already processed this token
      if (tokens.has(tokenAddress.toLowerCase())) continue;
      
      // Check if token matches search query
      if (name.toLowerCase().includes(searchQueryLower) ||
          symbol.toLowerCase().includes(searchQueryLower)) {
        try {
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          const decimals = await tokenContract.decimals();
          
          tokens.set(tokenAddress.toLowerCase(), {
            address: tokenAddress,
            name,
            symbol,
            decimals,
            price_usd: 0, // Price calculation to be implemented
            source: 'wow'
          });
        } catch (error) {
          console.error(`Error processing token ${tokenAddress}:`, error);
        }
      }
    }
    
    return Array.from(tokens.values());
  } catch (error) {
    console.error('Error searching wow.xyz tokens:', error);
    // Return empty array but don't fail the whole search
    return [];
  }
}

export const searchTokens = async (searchQuery: string): Promise<TokenData[]> => {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    // Search both sources in parallel
    const [uniswapTokens, wowTokens] = await Promise.all([
      searchUniswapTokens(searchQuery),
      searchWowTokens(provider, searchQuery)
    ]);

    // Combine results, prioritizing Uniswap prices if available
    const tokenMap = new Map<string, TokenData>();
    
    // Add Uniswap tokens first
    uniswapTokens.forEach(token => {
      tokenMap.set(token.address.toLowerCase(), token);
    });
    
    // Add wow.xyz tokens if not already in Uniswap
    wowTokens.forEach(token => {
      const address = token.address.toLowerCase();
      if (!tokenMap.has(address)) {
        tokenMap.set(address, token);
      }
    });

    return Array.from(tokenMap.values());
  } catch (error) {
    console.error('Error searching tokens:', error);
    return [];
  }
};
