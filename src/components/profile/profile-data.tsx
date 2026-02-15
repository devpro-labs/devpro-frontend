'use client';

import { motion } from 'framer-motion';
import { Eye, Send, Target } from 'lucide-react';
import Image from 'next/image';

interface ProfileCardProps {
  name: string;
  title: string;
  avatar: string;
  maxStreak: number;
  profileViews: number;
  totalSubmissions: number;
}

export default function ProfileCard({ name, title, avatar, maxStreak, profileViews, totalSubmissions }: ProfileCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      className="col-span-1 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-card-foreground"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div>
        {/* Profile Image */}
        <motion.div
          className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-primary"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={avatar}
            alt="Profile"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Profile Info */}
        <h2 className="text-center text-lg font-bold">{name}</h2>
        <p className="text-center text-xs text-muted-foreground">{title}</p>
      </motion.div>
      <motion.div
        className="col-span-1 flex flex-col items-center justify-center rounded-xl  bg-card p-6 text-card-foreground"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Target className="mb-3 h-6 w-6 text-green-400" />
        <p className="text-center text-xs text-muted-foreground">Max Streak</p>
        <p className="text-center text-2xl font-bold">{maxStreak} days</p>
      </motion.div>
      <motion.div
        className="col-span-1 flex flex-col items-center justify-center rounded-lg bg-card p-6 text-card-foreground"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Send className="mb-3 h-6 w-6 text-purple-400" />
        <p className="text-center text-xs text-muted-foreground">Submissions</p>
        <p className="text-center text-2xl font-bold">{formatNumber(totalSubmissions)}</p>
      </motion.div>
      <motion.div
        className="col-span-1 flex flex-col items-center justify-center rounded-xl bg-card p-6 text-card-foreground"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Eye className="mb-3 h-6 w-6 text-blue-400" />
        <p className="text-center text-xs text-muted-foreground">Profile Views</p>
        <p className="text-center text-2xl font-bold">{formatNumber(profileViews)}</p>
      </motion.div>
    </motion.div>
  );
}
