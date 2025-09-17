import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { db, Job, Candidate } from '@/lib/database';
import { useAuth } from '@/lib/auth';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  newApplications: number;
  hiredCandidates: number;
  rejectedCandidates: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    newApplications: 0,
    hiredCandidates: 0,
    rejectedCandidates: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const jobs = await db.jobs.toArray();
      const candidates = await db.candidates.toArray();
      
      const activeJobs = jobs.filter(job => job.status === 'active');
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newApplications = candidates.filter(c => c.appliedAt > weekAgo);
      
      setStats({
        totalJobs: jobs.length,
        activeJobs: activeJobs.length,
        totalCandidates: candidates.length,
        newApplications: newApplications.length,
        hiredCandidates: candidates.filter(c => c.stage === 'hired').length,
        rejectedCandidates: candidates.filter(c => c.stage === 'rejected').length,
      });

      // Load recent data
      const recentJobsData = await db.jobs
        .orderBy('createdAt')
        .reverse()
        .limit(5)
        .toArray();
      
      const recentCandidatesData = await db.candidates
        .orderBy('appliedAt')
        .reverse()
        .limit(5)
        .toArray();

      setRecentJobs(recentJobsData);
      setRecentCandidates(recentCandidatesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      subtitle: `${stats.activeJobs} active`,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      subtitle: `${stats.newApplications} this week`,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Hired',
      value: stats.hiredCandidates,
      subtitle: 'Successful placements',
      icon: CheckCircle,
      color: 'text-status-active',
      bgColor: 'bg-status-active/10',
    },
    {
      title: 'In Progress',
      value: stats.totalCandidates - stats.hiredCandidates - stats.rejectedCandidates,
      subtitle: 'Active applications',
      icon: Clock,
      color: 'text-status-pending',
      bgColor: 'bg-status-pending/10',
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'hired': return 'bg-status-active text-white';
      case 'rejected': return 'bg-status-rejected text-white';
      case 'offer': return 'bg-accent text-accent-foreground';
      case 'tech': return 'bg-primary text-primary-foreground';
      case 'screen': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your talent pipeline today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recent Jobs
              </CardTitle>
              <CardDescription>
                Latest job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                  <Badge 
                    variant={job.status === 'active' ? 'default' : 'secondary'}
                    className={job.status === 'active' ? 'bg-status-active text-white' : ''}
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Applications
              </CardTitle>
              <CardDescription>
                Latest candidate applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <Badge className={getStageColor(candidate.stage)}>
                    {candidate.stage}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}