'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TagItem {
  name: string;
  value: number;
  color: string;
}

interface TagWiseSolvedProps {
  tagData: TagItem[];
}

export default function TagWiseSolved({ tagData }: TagWiseSolvedProps) {
  const chartData = tagData.map(item => ({ ...item, fill: item.color }));

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 text-card-foreground"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="mb-3 text-lg font-bold">Tag-Wise Solved</h3>

      {/* Compact Chart */}
      <motion.div className="flex items-center justify-center mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
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
        </div>
      </motion.div>

      {/* Compact Tag List */}
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {tagData.slice(0, 4).map((tag, idx) => (
          <motion.div
            key={tag.name}
            className="flex items-center justify-between text-xs"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-foreground">{tag.name}</span>
            </div>
            <span className="font-semibold text-primary">{tag.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
