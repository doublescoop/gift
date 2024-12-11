'use client';
import { useState, useEffect } from 'react';
import { MovingBorder } from "./moving-border";
import { searchTokens, TokenData } from '@/services/token-service';

interface CoinSelection {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  price: number;
}

export const GiftPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
      return acc + (parseFloat(coin.amount) || 0) * coin.price;
    }, 0);
    return total.toFixed(6);
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
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
          />
          
          {/* Dropdown for search results */}
          {searchQuery && (
            <div className="absolute bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto w-[calc(100%-3rem)]">
              {availableTokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => handleCoinSelect(token)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  {token.logo_url && (
                    <img 
                      src={token.logo_url} 
                      alt={token.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div className="flex-grow">
                    <div>{token.name} ({token.symbol})</div>
                    <div className="text-sm text-gray-500">
                      ${token.price_usd.toFixed(6)}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded" style={{
                    backgroundColor: token.source === 'uniswap' ? 'rgb(232, 0, 111, 0.1)' : 
                                   token.source === 'wow' ? 'rgba(130, 71, 229, 0.1)' : 
                                   'rgb(229, 71, 71, 0.1)',
                    color: token.source === 'uniswap' ? 'rgb(232, 0, 111)' : 
                           token.source === 'wow' ? 'rgb(130, 71, 229)' : 
                           'rgb(229, 71, 71)'
                  }}>
                    {token.source === 'uniswap' ? 'Uniswap' : 
                     token.source === 'wow' ? 'wow.xyz' : 
                     'Unlisted'}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="p-2 text-gray-500">
                  Loading...
                </div>
              )}
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
  );
};
