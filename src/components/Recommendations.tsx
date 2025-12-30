import { Globe, Tv, Video, Gamepad2 } from 'lucide-react';

interface RecommendationsProps {
  download: number;
  upload: number;
  ping: number;
}

type Rating = 'excellent' | 'good' | 'limited' | 'not-recommended';

interface UseCase {
  icon: React.ReactNode;
  label: string;
  rating: Rating;
}

export const Recommendations = ({ download, upload, ping }: RecommendationsProps) => {
  const getWebBrowsingRating = (): Rating => {
    if (download >= 5) return 'excellent';
    if (download >= 2) return 'good';
    if (download >= 0.5) return 'limited';
    return 'not-recommended';
  };

  const getStreamingRating = (): Rating => {
    if (download >= 25) return 'excellent';
    if (download >= 10) return 'good';
    if (download >= 5) return 'limited';
    return 'not-recommended';
  };

  const getVideoCallsRating = (): Rating => {
    if (download >= 10 && upload >= 5 && ping < 100) return 'excellent';
    if (download >= 5 && upload >= 2 && ping < 150) return 'good';
    if (download >= 2 && upload >= 1) return 'limited';
    return 'not-recommended';
  };

  const getGamingRating = (): Rating => {
    if (download >= 25 && ping < 30) return 'excellent';
    if (download >= 10 && ping < 60) return 'good';
    if (download >= 5 && ping < 100) return 'limited';
    return 'not-recommended';
  };

  const useCases: UseCase[] = [
    { icon: <Globe className="w-5 h-5" />, label: 'Web Browsing', rating: getWebBrowsingRating() },
    { icon: <Tv className="w-5 h-5" />, label: 'HD / 4K Streaming', rating: getStreamingRating() },
    { icon: <Video className="w-5 h-5" />, label: 'Video Calls', rating: getVideoCallsRating() },
    { icon: <Gamepad2 className="w-5 h-5" />, label: 'Online Gaming', rating: getGamingRating() },
  ];

  const getRatingStyle = (rating: Rating) => {
    switch (rating) {
      case 'excellent':
        return 'bg-success/10 text-success border-success/30';
      case 'good':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'limited':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'not-recommended':
        return 'bg-danger/10 text-danger border-danger/30';
    }
  };

  const getRatingLabel = (rating: Rating) => {
    switch (rating) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'limited': return 'Limited';
      case 'not-recommended': return 'Not Recommended';
    }
  };

  return (
    <div className="card-glass p-6">
      <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Usage Recommendations
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{useCase.icon}</span>
              <span className="text-sm font-medium">{useCase.label}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getRatingStyle(useCase.rating)}`}>
              {getRatingLabel(useCase.rating)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
