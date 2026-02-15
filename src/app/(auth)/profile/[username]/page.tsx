'use client';

import FrameworkUsage from '@/components/profile/framework-usgae';
import ProfileCard from '@/components/profile/profile-data';
import TagWiseSolved from '@/components/profile/tagwise';
import YearlyHeatmap from '@/components/profile/yearly-heatmap';
import DifficultySolved from '@/components/profile/difficulty-solved';
import { getProfile } from '@/components/profile/api';
import { motion, easeOut } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import Loader from '@/components/ui/Loader';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: clerkUser } = useUser();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !profileData) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  const { user, stats, tagData, frameworkData, heatmapData, submissions, solvedByDifficulty } = profileData;

  // Use Clerk user data if viewing own profile, otherwise use API data
  const isOwnProfile = clerkUser?.username === username;
  const displayName = isOwnProfile
    ? `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || user.username
    : user.username;
  const displayAvatar = isOwnProfile
    ? clerkUser?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;
  const displayTitle = isOwnProfile
    ? (clerkUser?.publicMetadata?.title as string) || 'Developer'
    : 'Developer';

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      <motion.main
        className="h-full w-full px-4 py-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* Left Column - Profile Card Only */}
          <motion.div variants={itemVariants} className="flex items-start justify-center lg:items-center">
            <ProfileCard
              name={displayName}
              title={displayTitle}
              avatar={displayAvatar}
              maxStreak={stats.maxStreak}
              profileViews={stats.profileViews}
              totalSubmissions={stats.totalSubmissions}
            />
          </motion.div>

          {/* Right Column - Charts and Stats */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 overflow-hidden">
            {/* Top Row - Difficulty, Tag-wise and Framework */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 flex-shrink-0">
              <DifficultySolved difficultyData={solvedByDifficulty} totalSolved={stats.totalSolved} />
              <TagWiseSolved tagData={tagData} />
              <FrameworkUsage frameworkData={frameworkData} />
            </div>
            {/* Bottom - Yearly Heatmap */}
            <div className="flex-1 min-h-0">
              <YearlyHeatmap heatmapData={heatmapData} submissions={submissions} />
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
