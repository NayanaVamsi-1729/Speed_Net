import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SpeedDataPoint {
  time: number;
  download: number | null;
  upload: number | null;
}

interface SpeedGraphProps {
  data: SpeedDataPoint[];
  showDownload: boolean;
  showUpload: boolean;
  onToggleDownload: () => void;
  onToggleUpload: () => void;
}

export const SpeedGraph = ({ 
  data, 
  showDownload, 
  showUpload,
  onToggleDownload,
  onToggleUpload 
}: SpeedGraphProps) => {
  const formatTime = (seconds: number) => `${seconds}s`;

  return (
    <div className="card-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Speed Over Time
        </h3>
        <div className="flex gap-4">
          <button
            onClick={onToggleDownload}
            className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-opacity ${
              showDownload ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-download" />
            <span className="text-download">Download</span>
          </button>
          <button
            onClick={onToggleUpload}
            className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-opacity ${
              showUpload ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-upload" />
            <span className="text-upload">Upload</span>
          </button>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="hsl(217, 32%, 30%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(217, 32%, 30%)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(217, 32%, 20%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(label) => `${label}s`}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)} Mbps`,
                name === 'download' ? 'Download' : 'Upload'
              ]}
            />
            {showDownload && (
              <Line
                type="monotone"
                dataKey="download"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            )}
            {showUpload && (
              <Line
                type="monotone"
                dataKey="upload"
                stroke="hsl(24, 95%, 53%)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
