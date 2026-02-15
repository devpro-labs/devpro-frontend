'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

interface SubmissionStats {
  total: number;
  maxPerDay: number;
  dailyAverage: number;
}

interface YearlyHeatmapProps {
  heatmapData: Record<string, number>;
  submissions: SubmissionStats;
}

// Generate empty heatmap data for a specific year (all zeros)
const generateYearData = (year: number) => {
  const data: Record<string, number> = {};

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      data[dateStr] = 0;
    }
  }

  return data;
};

// Get color based on count (blue shades)
const getHeatmapColor = (count: number): string => {
  if (count === 0) return '#1e293b'; // slate-800
  if (count <= 2) return '#0369a1'; // sky-700
  if (count <= 4) return '#0284c7'; // sky-600
  if (count <= 6) return '#0ea5e9'; // sky-500
  if (count <= 8) return '#38bdf8'; // sky-400
  return '#7dd3fc'; // sky-300
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearlyHeatmap({ heatmapData: propData, submissions }: YearlyHeatmapProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Available years (current year and previous 2 years)
  const years = useMemo(() => {
    return [currentYear, currentYear - 1, currentYear - 2];
  }, [currentYear]);

  const heatmapData = useMemo(() => {
    // Start with empty data for selected year, then overlay API data
    const emptyData = generateYearData(selectedYear);
    // Filter propData to only include dates from selected year
    const filteredPropData: Record<string, number> = {};
    Object.entries(propData).forEach(([date, count]) => {
      if (date.startsWith(`${selectedYear}-`)) {
        filteredPropData[date] = count;
      }
    });
    return { ...emptyData, ...filteredPropData };
  }, [propData, selectedYear]);

  // Group data by week starting from Jan 1
  const { weeks, monthPositions } = useMemo(() => {
    const weeks: { week: number; days: { date: string; count: number; dayOfWeek: number }[] }[] = [];
    const monthPositions: { month: string; weekIndex: number }[] = [];

    const sortedDates = Object.entries(heatmapData).sort(([a], [b]) => a.localeCompare(b));

    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];
    let weekNum = 0;
    let lastMonth = -1;

    sortedDates.forEach(([date, count]) => {
      // Parse date string directly to avoid timezone issues
      const [year, monthStr, dayStr] = date.split('-').map(Number);
      const dateObj = new Date(year, monthStr - 1, dayStr);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday
      const month = monthStr - 1; // 0-indexed month

      // Track month positions
      if (month !== lastMonth) {
        monthPositions.push({ month: MONTHS[month], weekIndex: weekNum });
        lastMonth = month;
      }

      // For first week, pad with empty days if needed
      if (weekNum === 0 && currentWeek.length === 0 && dayOfWeek > 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', count: -1, dayOfWeek: i });
        }
      }

      currentWeek.push({ date, count, dayOfWeek });

      if (currentWeek.length === 7) {
        weeks.push({ week: weekNum++, days: currentWeek });
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push({ week: weekNum, days: currentWeek });
    }

    return { weeks, monthPositions };
  }, [heatmapData]);

  const stats = useMemo(() => {
    return {
      total: submissions.total,
      max: submissions.maxPerDay,
      avg: submissions.dailyAverage,
    };
  }, [submissions]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 text-card-foreground"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Yearly Activity Heatmap</h3>
        {/* Year Selector */}
        <div className="flex gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${selectedYear === year
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="text-muted-foreground">Less</span>
        <div className="flex gap-1">
          {[0, 2, 4, 6, 8, 10].map((value) => (
            <motion.div
              key={value}
              className="h-4 w-4 rounded border border-border"
              style={{ backgroundColor: getHeatmapColor(value) }}
              whileHover={{ scale: 1.2 }}
              title={`${value} submissions`}
            />
          ))}
        </div>
        <span className="text-muted-foreground">More</span>
      </div>

      {/* Heatmap Grid */}
      <motion.div
        className="mb-6 overflow-hidden rounded-lg bg-secondary/20 p-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Month Labels */}
        <div className="grid gap-[2px] mb-2" style={{ gridTemplateColumns: `24px repeat(${weeks.length}, 1fr)` }}>
          <div></div>
          {monthPositions.map((mp, idx) => {
            const nextPosition = monthPositions[idx + 1]?.weekIndex || weeks.length;
            const span = nextPosition - mp.weekIndex;
            return (
              <div
                key={`${mp.month}-${mp.weekIndex}`}
                className="text-xs font-medium text-muted-foreground truncate"
                style={{ gridColumn: `span ${span}` }}
              >
                {mp.month}
              </div>
            );
          })}
        </div>

        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `24px repeat(${weeks.length}, 1fr)` }}>
          {/* Day labels - spans all rows */}
          <div className="grid gap-[2px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {dayLabels.map((day, idx) => (
              <div
                key={day}
                className="flex items-center justify-center text-[10px] font-medium text-muted-foreground"
              >
                {idx % 2 === 1 ? day.charAt(0) : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div key={week.week} className="grid gap-[2px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
              {Array.from({ length: 7 }).map((_, dayIdx) => {
                const day = week.days.find(d => d.dayOfWeek === dayIdx);
                if (!day || day.count === -1) {
                  return (
                    <div
                      key={`${week.week}-empty-${dayIdx}`}
                      className="aspect-square w-full"
                    />
                  );
                }
                return (
                  <motion.div
                    key={`${week.week}-${dayIdx}`}
                    className="aspect-square w-full rounded-sm border border-border/50 transition-all hover:ring-1 hover:ring-primary"
                    style={{
                      backgroundColor: getHeatmapColor(day.count),
                    }}
                    title={`${day.date}: ${day.count} submissions`}
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: Math.min((weekIdx * 7 + dayIdx) * 0.001, 0.3) }}
                    viewport={{ once: true }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      
    </motion.div>
  );
}
