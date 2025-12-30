interface NetworkRatingProps {
  score: number;
  stability: 'stable' | 'moderate' | 'unstable';
}

export const NetworkRating = ({ score, stability }: NetworkRatingProps) => {
  const getScoreColor = () => {
    if (score >= 8) return 'text-success';
    if (score >= 5) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBg = () => {
    if (score >= 8) return 'bg-success/10 border-success/30';
    if (score >= 5) return 'bg-warning/10 border-warning/30';
    return 'bg-danger/10 border-danger/30';
  };

  const getStabilityColor = () => {
    if (stability === 'stable') return 'text-success';
    if (stability === 'moderate') return 'text-warning';
    return 'text-danger';
  };

  const getStabilityBg = () => {
    if (stability === 'stable') return 'bg-success/10';
    if (stability === 'moderate') return 'bg-warning/10';
    return 'bg-danger/10';
  };

  return (
    <div className="card-glass p-6">
      <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Network Analysis
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Overall Score */}
        <div className={`rounded-lg border p-4 ${getScoreBg()}`}>
          <span className="metric-label">Overall Score</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`font-mono text-4xl font-bold ${getScoreColor()}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">/10</span>
          </div>
        </div>

        {/* Stability */}
        <div className={`rounded-lg p-4 ${getStabilityBg()}`}>
          <span className="metric-label">Stability</span>
          <div className="mt-2">
            <span className={`font-mono text-xl font-semibold capitalize ${getStabilityColor()}`}>
              {stability}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
