'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DifficultyData {
  casual: number;
  pro: number;
  engineering: number;
  proMax: number;
}

interface DifficultySolvedProps {
  difficultyData: DifficultyData;
  totalSolved: number;
}

const DIFFICULTY_CONFIG = [
  { key: 'casual', name: 'Casual', color: '#10b981' },
  { key: 'pro', name: 'Pro', color: '#f59e0b' },
  { key: 'engineering', name: 'Engineer', color: '#ef4444' },
  { key: 'proMax', name: 'Pro Max', color: '#8b5cf6' },
] as const;

export default function DifficultySolved({ difficultyData, totalSolved }: DifficultySolvedProps) {
  const chartData = DIFFICULTY_CONFIG.map(({ key, name, color }) => ({
    name,
    value: difficultyData[key],
    color,
  })).filter(item => item.value > 0);

  // If no data, show empty state with all difficulties at 0
  const displayData = chartData.length > 0 ? chartData : DIFFICULTY_CONFIG.map(({ name, color }) => ({
    name,
    value: 0,
    color,
  }));

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 text-card-foreground h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="mb-3 text-lg font-bold">Difficulty Solved</h3>

      <div className="flex items-center gap-4">
        {/* Pie Chart */}
        <motion.div
          className="relative h-32 w-32 flex-shrink-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{totalSolved}</span>
            <span className="text-[10px] text-muted-foreground">Solved</span>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {DIFFICULTY_CONFIG.map(({ key, name, color }, idx) => (
            <motion.div
              key={key}
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-foreground">{name}</span>
              </div>
              <span className="font-semibold" style={{ color }}>
                {difficultyData[key]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
