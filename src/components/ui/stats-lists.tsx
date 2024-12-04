import { motion } from 'framer-motion';

// Mock data for the lists
const mockData = {
  mostGiven: [
    { name: 'PEPE', amount: '1.2M' },
    { name: 'DOGE', amount: '850K' },
    { name: 'SHIB', amount: '620K' },
    { name: 'WOJAK', amount: '450K' },
    { name: 'BONK', amount: '380K' },
  ],
  mostExpensive: [
    { name: 'DOGE', value: '$0.15' },
    { name: 'SHIB', value: '$0.000008' },
    { name: 'PEPE', value: '$0.000003' },
    { name: 'FLOKI', value: '$0.000002' },
    { name: 'WOJAK', value: '$0.000001' },
  ],
  mostWished: [
    { name: 'PEPE', wishes: '2.5M' },
    { name: 'DOGE', wishes: '2.1M' },
    { name: 'SHIB', wishes: '1.8M' },
    { name: 'BONK', wishes: '1.2M' },
    { name: 'FLOKI', wishes: '900K' },
  ],
};

interface StatsListProps {
  className?: string;
}

export function StatsLists({ className = '' }: StatsListProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {/* Most Given List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-800">Most Given</h3>
        <ul className="space-y-2">
          {mockData.mostGiven.map((item, index) => (
            <li key={`given-${index}`} className="flex justify-between items-center py-2 border-b border-primary-red/20 last:border-0">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-500">{item.amount}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Most Expensive List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-800">Most Expensive</h3>
        <ul className="space-y-2">
          {mockData.mostExpensive.map((item, index) => (
            <li key={`expensive-${index}`} className="flex justify-between items-center py-2 border-b border-primary-red/20 last:border-0">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-500">{item.value}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Most Wished List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-800">Most Wished</h3>
        <ul className="space-y-2">
          {mockData.mostWished.map((item, index) => (
            <li key={`wished-${index}`} className="flex justify-between items-center py-2 border-b border-primary-red/20 last:border-0">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-500">{item.wishes}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
