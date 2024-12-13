import { NextResponse } from 'next/server';

if (!process.env.GRAPH_API_KEY) {
  throw new Error('GRAPH_API_KEY environment variable is not set');
}

const GRAPH_API_URL = 'https://gateway.thegraph.com/api/' + process.env.GRAPH_API_KEY + '/subgraphs/id/D31gzGUtVNhHNdnxeELUBdch5rzDRm5cddvae9GzhCLu';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  try {
    console.log('Using Graph API URL:', GRAPH_API_URL);
    
    const response = await fetch(GRAPH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            uniswapFactories(first: 1) {
              totalVolumeUSD
            }
            tokens(
              first: 10,
              where: {
                or: [
                  { name_contains_nocase: "${query}" },
                  { symbol_contains_nocase: "${query}" }
                ]
              }
            ) {
              id
              name
              symbol
              decimals
              totalSupply
            }
          }
        `
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Graph API Response Error:', errorText);
      return NextResponse.json({ error: 'Graph API request failed' }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Graph API Data Errors:', data.errors);
      return NextResponse.json({ error: data.errors[0].message }, { status: 500 });
    }

    const totalVolumeUSD = parseFloat(data.data.uniswapFactories[0]?.totalVolumeUSD || '0');
    
    const tokens = data.data.tokens.map((token: any) => {
      // Calculate a rough estimate of token value based on total supply and volume
      const totalSupply = parseFloat(token.totalSupply || '0');
      const estimatedValue = totalSupply > 0 ? (totalVolumeUSD / totalSupply) : 0;
      
      return {
        address: token.id,
        name: token.name,
        symbol: token.symbol,
        decimals: parseInt(token.decimals),
        price_usd: estimatedValue,
        source: 'uniswap'
      };
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens: ' + (error instanceof Error ? error.message : 'Unknown error') }, 
      { status: 500 }
    );
  }
}
