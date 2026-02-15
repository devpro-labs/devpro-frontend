'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FrameworkItem {
  name: string;
  usage: number;
  percentage: number;
}

interface FrameworkUsageProps {
  frameworkData: FrameworkItem[];
}

export default function FrameworkUsage({ frameworkData }: FrameworkUsageProps) {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 text-card-foreground"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="mb-3 text-lg font-bold">Framework Usage</h3>

      {/* Compact Chart */}
      <div className="mb-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={frameworkData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
            />
            <Bar dataKey="usage" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Framework List */}
      <div className="space-y-2">
        {frameworkData.slice(0, 3).map((framework, idx) => (
          <motion.div
            key={framework.name}
            className="space-y-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {framework.name}
              </span>
              <span className="font-bold text-accent">{framework.percentage}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary/50">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                initial={{ width: 0 }}
                whileInView={{ width: `${framework.percentage}%` }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
