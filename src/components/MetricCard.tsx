interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  variant?: 'download' | 'upload' | 'neutral';
  size?: 'sm' | 'lg';
}

export const MetricCard = ({ 
  label, 
  value, 
  unit, 
  variant = 'neutral',
  size = 'sm' 
}: MetricCardProps) => {
  const getValueClass = () => {
    if (variant === 'download') return 'text-download';
    if (variant === 'upload') return 'text-upload';
    return 'text-foreground';
  };

  return (
    <div className="card-glass p-4 flex flex-col">
      <span className="metric-label mb-2">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono font-semibold tracking-tight ${getValueClass()} ${
          size === 'lg' ? 'text-3xl' : 'text-2xl'
        }`}>
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};
