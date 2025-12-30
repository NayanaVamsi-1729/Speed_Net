import { useMemo } from 'react';

interface SpeedGaugeProps {
  speed: number;
  maxSpeed: number;
  type: 'download' | 'upload' | 'idle';
  label: string;
}

export const SpeedGauge = ({ speed, maxSpeed, type, label }: SpeedGaugeProps) => {
  const percentage = useMemo(() => {
    return Math.min((speed / maxSpeed) * 100, 100);
  }, [speed, maxSpeed]);

  const strokeDashoffset = useMemo(() => {
    const circumference = 283; // 2 * PI * 45 (radius)
    return circumference - (percentage / 100) * circumference * 0.75; // 75% arc
  }, [percentage]);

  const getColor = () => {
    if (type === 'download') return 'hsl(217, 91%, 60%)';
    if (type === 'upload') return 'hsl(24, 95%, 53%)';
    return 'hsl(217, 32%, 30%)';
  };

  const getGlowClass = () => {
    if (type === 'download') return 'download-glow';
    if (type === 'upload') return 'upload-glow';
    return '';
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        className={`w-64 h-40 ${getGlowClass()}`}
        viewBox="0 0 100 60"
      >
        {/* Background arc */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="hsl(217, 32%, 15%)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="126"
          strokeDashoffset={126 - (percentage / 100) * 126}
          style={{
            transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease',
          }}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick, i) => {
          const angle = -180 + (tick / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + 35 * Math.cos(rad);
          const y1 = 55 + 35 * Math.sin(rad);
          const x2 = 50 + 40 * Math.cos(rad);
          const y2 = 55 + 40 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(217, 32%, 30%)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Speed value */}
      <div className="absolute top-16 flex flex-col items-center">
        <span className="font-mono text-5xl font-bold tracking-tight text-foreground">
          {speed.toFixed(1)}
        </span>
        <span className="text-sm font-medium text-muted-foreground mt-1">Mbps</span>
      </div>

      {/* Label */}
      <div className="mt-4">
        <span className={`text-xs font-medium uppercase tracking-widest ${
          type === 'download' ? 'text-download' : 
          type === 'upload' ? 'text-upload' : 
          'text-muted-foreground'
        }`}>
          {label}
        </span>
      </div>
    </div>
  );
};
