'use client';
import { useState } from 'react';
import { MovingBorder } from "./moving-border";

interface CoinSelection {
  name: string;
  amount: string;
}

export const GiftPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoins, setSelectedCoins] = useState<CoinSelection[]>([]);
  const [receiverAddress, setReceiverAddress] = useState('');

  // Mock data - to be replaced with actual database
  const mockCoins = [
    'PEPE',
    'WOJAK',
    'DOGE',
    'SHIB',
    'FLOKI'
  ];

  const filteredCoins = mockCoins.filter(coin => 
    coin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCoinSelect = (coinName: string) => {
    if (!selectedCoins.find(coin => coin.name === coinName)) {
      setSelectedCoins([...selectedCoins, { name: coinName, amount: '' }]);
    }
    setSearchQuery('');
  };

  const handleAmountChange = (index: number, amount: string) => {
    const newSelectedCoins = [...selectedCoins];
    newSelectedCoins[index].amount = amount;
    setSelectedCoins(newSelectedCoins);
  };

  const removeCoin = (index: number) => {
    setSelectedCoins(selectedCoins.filter((_, i) => i !== index));
  };

  // Mock total calculation - to be replaced with actual conversion
  const calculateTotal = () => {
    const total = selectedCoins.reduce((acc, coin) => {
      return acc + (parseFloat(coin.amount) || 0);
    }, 0);
    return (total * 0.0001).toFixed(6); // Mock conversion to ETH
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative border-2 border-primary-red">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search memecoin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
          />
          
          {/* Dropdown for search results */}
          {searchQuery && (
            <div className="absolute bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto w-[calc(100%-3rem)]">
              {filteredCoins.map((coin) => (
                <div
                  key={coin}
                  onClick={() => handleCoinSelect(coin)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {coin}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Coins List */}
        <div className="mb-6 max-h-48 overflow-y-auto">
          {selectedCoins.map((coin, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <span className="font-medium">{coin.name}</span>
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

        {/* Total in ETH */}
        <div className="mb-6">
          <p className="text-lg font-medium">
            Total: {calculateTotal()} ETH
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
          Gift Meme!
        </MovingBorder>
      </div>
    </div>
  );
};
