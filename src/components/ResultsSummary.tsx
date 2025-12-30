import { Download, Upload, Activity, Zap, Clock } from 'lucide-react';

interface ResultsSummaryProps {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  duration: number;
}

export const ResultsSummary = ({ download, upload, ping, jitter, duration }: ResultsSummaryProps) => {
  const metrics = [
    { icon: <Download className="w-5 h-5" />, label: 'Download', value: download.toFixed(1), unit: 'Mbps', variant: 'download' },
    { icon: <Upload className="w-5 h-5" />, label: 'Upload', value: upload.toFixed(1), unit: 'Mbps', variant: 'upload' },
    { icon: <Activity className="w-5 h-5" />, label: 'Ping', value: ping.toFixed(0), unit: 'ms', variant: 'neutral' },
    { icon: <Zap className="w-5 h-5" />, label: 'Jitter', value: jitter.toFixed(1), unit: 'ms', variant: 'neutral' },
    { icon: <Clock className="w-5 h-5" />, label: 'Duration', value: duration.toFixed(0), unit: 's', variant: 'neutral' },
  ];

  return (
    <div className="card-glass p-6">
      <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Test Results
      </h3>
      
      <div className="grid grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <span className={`mb-2 ${
              metric.variant === 'download' ? 'text-download' :
              metric.variant === 'upload' ? 'text-upload' :
              'text-muted-foreground'
            }`}>
              {metric.icon}
            </span>
            <span className="metric-label mb-1">{metric.label}</span>
            <div className="flex items-baseline gap-1">
              <span className={`font-mono text-xl font-semibold ${
                metric.variant === 'download' ? 'text-download' :
                metric.variant === 'upload' ? 'text-upload' :
                'text-foreground'
              }`}>
                {metric.value}
              </span>
              <span className="text-xs text-muted-foreground">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
