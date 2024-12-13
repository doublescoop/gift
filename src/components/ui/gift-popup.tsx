'use client';
import { useState, useEffect } from 'react';
import { MovingBorder } from "./moving-border";
import { searchTokens, TokenData } from '@/services/token-service';
import { useAccount, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

interface CoinSelection {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  price: number;
}

const popularTokens = [
  { address: '0x123...', name: 'PEPE', symbol: 'PEPE', price: 0.000001 },
  { address: '0x456...', name: 'DEGEN', symbol: 'DEGEN', price: 0.05 },
  { address: '0x789...', name: 'WOJAK', symbol: 'WOJAK', price: 0.002 },
];

export const GiftPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({
    address: address,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoins, setSelectedCoins] = useState<CoinSelection[]>([]);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [availableTokens, setAvailableTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        const tokens = await searchTokens(searchQuery);
        setAvailableTokens(tokens);
        setIsLoading(false);
      } else {
        setAvailableTokens([]);
      }
    };

    const debounceTimeout = setTimeout(fetchTokens, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleCoinSelect = (token: TokenData) => {
    if (!selectedCoins.find(coin => coin.address === token.address)) {
      setSelectedCoins([...selectedCoins, {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        amount: '',
        price: token.price_usd
      }]);
    }
    setSearchQuery('');
    setAvailableTokens([]);
  };

  const handleAmountChange = (index: number, amount: string) => {
    const newSelectedCoins = [...selectedCoins];
    newSelectedCoins[index].amount = amount;
    setSelectedCoins(newSelectedCoins);
  };

  const removeCoin = (index: number) => {
    setSelectedCoins(selectedCoins.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const total = selectedCoins.reduce((acc, coin) => {
      const amount = parseFloat(coin.amount) || 0;
      const price = coin.price || 0;
      const value = amount * price;
      console.log(`Calculating for ${coin.symbol}: Amount=${amount}, Price=${price}, Value=${value}`);
      return acc + value;
    }, 0);
    return total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative border-2 border-primary-red">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-primary-red text-xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <div className="space-y-6">
          {/* Section 1: Gift what you have */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Gift what you have</h3>
            {!isConnected ? (
              <button
                onClick={() => open()}
                className="w-full py-2 px-4 bg-primary-red text-white rounded-lg hover:bg-red-600"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-2">
                {ethBalance && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>ETH</span>
                    <span>{parseFloat(ethBalance.formatted).toFixed(4)} ETH</span>
                  </div>
                )}
                {/* Add other token balances here */}
              </div>
            )}
          </div>

          {/* Section 2: Popular Meme Tokens */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Choose Popular Memes</h3>
            <div className="grid grid-cols-2 gap-2">
              {popularTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleCoinSelect(token)}
                  className="p-2 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-500">${token.price.toFixed(6)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Search Bar */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Search Tokens</h3>
            <input
              type="text"
              placeholder="Search token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
            
            {/* Dropdown for search results */}
            {searchQuery && availableTokens.length > 0 && (
              <div className="absolute bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto w-[calc(100%-3rem)]">
                {availableTokens.map((token) => (
                  <div
                    key={token.address}
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCoinSelect(token)}
                  >
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-500">${token.price_usd.toFixed(6)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Coins List */}
          <div className="mb-6 max-h-48 overflow-y-auto">
            {selectedCoins.map((coin, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <span className="font-medium">{coin.name} ({coin.symbol})</span>
                <input
                  type="number"
                  placeholder="Amount"
                  value={coin.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                />
                <button
                  onClick={() => removeCoin(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mb-6">
            <p className="text-lg font-medium">
              Total: {calculateTotal()}
            </p>
          </div>

          {/* Receiver Address */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Receiver's Address"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
          </div>

          {/* Gift Button */}
          <MovingBorder
            duration={2000}
            containerClassName="w-full"
            borderClassName="bg-gradient-to-r from-primary-red/50 to-primary-red/20"
            className="w-full bg-off-white text-gray-800 hover:text-primary-red/80"
          >
            Gift Token!
          </MovingBorder>
        </div>
      </div>
    </div>
  );
};
