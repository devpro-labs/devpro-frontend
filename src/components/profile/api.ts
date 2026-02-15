import backendRoute, { API_URL } from '@/lib/const/backend_route';

// API Response types
export interface ProfileApiResponse {
  DATA: {
    user: {
      id: string;
      username: string;
      email: string;
    };
    profile: {
      userId: string;
      totalSubmissions: number;
      totalSolved: number;
      casualSolved: number;
      proSolved: number;
      engineeringSolved: number;
      pro_maxSolved: number;
      tagStats: Record<string, number>;
      frameworkStats: Record<string, number>;
      mostUsedFramework: string;
      yearlyActivity: Record<string, number>;
      badges: string[];
      profileViews: number;
      currentStreak: number;
      maxStreak: number;
      lastSubmissionAt: string;
      updatedAt: string;
    };
  };
  MESSAGE: string;
  STATUS: number;
  ERROR: string | null;
}

// Tag colors for visualization
const TAG_COLORS: Record<string, string> = {
  'crud': '#fbbf24',
  'rest-api': '#3b82f6',
  'backend': '#10b981',
  'frontend': '#06b6d4',
  'database': '#8b5cf6',
  'auth': '#f43f5e',
  'testing': '#14b8a6',
  'devops': '#f97316',
};

const FRAMEWORK_COLORS: Record<string, string> = {
  'js-express': '#fbbf24',
  'ts-express': '#3b82f6',
  'py-fastapi': '#10b981',
  'py-flask': '#06b6d4',
  'go-fiber': '#8b5cf6',
  'java-spring': '#f43f5e',
};

// Transformed data types for components
export interface TransformedProfileData {
  user: {
    id: string;
    username: string;
    email: string;
  };
  stats: {
    profileViews: number;
    maxStreak: number;
    currentStreak: number;
    totalSubmissions: number;
    totalSolved: number;
  };
  tagData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  frameworkData: Array<{
    name: string;
    usage: number;
    percentage: number;
  }>;
  heatmapData: Record<string, number>;
  submissions: {
    total: number;
    maxPerDay: number;
    dailyAverage: number;
  };
  solvedByDifficulty: {
    casual: number;
    pro: number;
    engineering: number;
    proMax: number;
  };
}

function getDefaultColor(index: number): string {
  const colors = ['#fbbf24', '#3b82f6', '#10b981', '#06b6d4', '#8b5cf6', '#f43f5e', '#14b8a6', '#f97316'];
  return colors[index % colors.length];
}

function transformProfileData(response: ProfileApiResponse): TransformedProfileData {
  const { user, profile } = response.DATA;

  // Transform tagStats to array format
  const tagData = Object.entries(profile.tagStats).map(([name, value], index) => ({
    name,
    value,
    color: TAG_COLORS[name] || getDefaultColor(index),
  }));

  // Transform frameworkStats to array format with percentages
  const totalFrameworkUsage = Object.values(profile.frameworkStats).reduce((a, b) => a + b, 0);
  const frameworkData = Object.entries(profile.frameworkStats).map(([name, usage]) => ({
    name,
    usage,
    percentage: totalFrameworkUsage > 0 ? Math.round((usage / totalFrameworkUsage) * 100) : 0,
  }));

  // Calculate max submissions per day from yearly activity
  const activityValues = Object.values(profile.yearlyActivity);
  const maxPerDay = activityValues.length > 0 ? Math.max(...activityValues) : 0;
  const totalActivity = activityValues.reduce((a, b) => a + b, 0);
  const dailyAverage = activityValues.length > 0 ? Math.round(totalActivity / activityValues.length) : 0;

  return {
    user,
    stats: {
      profileViews: profile.profileViews,
      maxStreak: profile.maxStreak,
      currentStreak: profile.currentStreak,
      totalSubmissions: profile.totalSubmissions,
      totalSolved: profile.totalSolved,
    },
    tagData,
    frameworkData,
    heatmapData: profile.yearlyActivity,
    submissions: {
      total: profile.totalSubmissions,
      maxPerDay,
      dailyAverage,
    },
    solvedByDifficulty: {
      casual: profile.casualSolved,
      pro: profile.proSolved,
      engineering: profile.engineeringSolved,
      proMax: profile.pro_maxSolved,
    },
  };
}

export async function getProfile(username: string): Promise<TransformedProfileData> {
  const response = await fetch(`${API_URL}${backendRoute.profile.getProfile(username)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const data: ProfileApiResponse = await response.json();

  if (data.ERROR) {
    throw new Error(data.ERROR);
  }

  return transformProfileData(data);
}
