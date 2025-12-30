import { useState } from 'react';
import { Play, Square, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpeedGauge } from '@/components/SpeedGauge';
import { SpeedGraph } from '@/components/SpeedGraph';
import { MetricCard } from '@/components/MetricCard';
import { NetworkRating } from '@/components/NetworkRating';
import { Recommendations } from '@/components/Recommendations';
import { ResultsSummary } from '@/components/ResultsSummary';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    status,
    currentSpeed,
    currentPhase,
    graphData,
    results,
    liveMetrics,
    startTest,
    stopTest,
    restartTest,
    calculateScore,
    calculateStability,
  } = useSpeedTest();

  const [showDownload, setShowDownload] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [copied, setCopied] = useState(false);

  const isRunning = status === 'testing-download' || status === 'testing-upload';
  const isCompleted = status === 'completed' && results !== null;

  const getGaugeLabel = () => {
    if (status === 'testing-download') return 'Testing Download';
    if (status === 'testing-upload') return 'Testing Upload';
    if (isCompleted) return 'Test Complete';
    return 'Ready to Test';
  };

  const handleCopyResults = () => {
    if (!results) return;
    
    const text = `Internet Speed Test Results
━━━━━━━━━━━━━━━━━━━━━━
Download: ${results.download.toFixed(1)} Mbps
Upload: ${results.upload.toFixed(1)} Mbps
Ping: ${results.ping.toFixed(0)} ms
Jitter: ${results.jitter.toFixed(1)} ms
Duration: ${results.duration.toFixed(0)}s
Score: ${calculateScore().toFixed(1)}/10
Stability: ${calculateStability()}
━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Results copied",
      description: "Speed test results have been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Internet Speed Test
          </h1>
          <p className="text-muted-foreground">
            Browser-based network performance analysis
          </p>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Control Area */}
        <section className="flex justify-center">
          {status === 'idle' ? (
            <Button variant="start" size="xl" onClick={startTest}>
              <Play className="w-5 h-5" />
              Start Test
            </Button>
          ) : isRunning ? (
            <Button variant="stop" size="xl" onClick={stopTest}>
              <Square className="w-5 h-5" />
              Stop
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button variant="start" size="lg" onClick={restartTest}>
                <RotateCcw className="w-4 h-4" />
                Restart Test
              </Button>
              <Button variant="action" size="lg" onClick={handleCopyResults}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Results'}
              </Button>
            </div>
          )}
        </section>

        {/* Advertisement Slot */}
        <section className="flex justify-center">
          <div className="w-full max-w-[728px] h-[90px] md:h-[90px] rounded-lg border border-dashed border-border/50 flex items-center justify-center bg-muted/20">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Advertisement
            </span>
          </div>
        </section>

        {/* Speed Gauge */}
        <section className="flex justify-center py-4">
          <SpeedGauge
            speed={isRunning ? currentSpeed : (results?.download || 0)}
            maxSpeed={300}
            type={currentPhase}
            label={getGaugeLabel()}
          />
        </section>

        {/* Live Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Download"
            value={isRunning && currentPhase === 'download' ? currentSpeed : (results?.download || 0)}
            unit="Mbps"
            variant="download"
          />
          <MetricCard
            label="Upload"
            value={isRunning && currentPhase === 'upload' ? currentSpeed : (results?.upload || 0)}
            unit="Mbps"
            variant="upload"
          />
          <MetricCard
            label="Ping"
            value={liveMetrics.ping || results?.ping || 0}
            unit="ms"
          />
          <MetricCard
            label="Jitter"
            value={liveMetrics.jitter || results?.jitter || 0}
            unit="ms"
          />
        </section>

        {/* Speed Graph */}
        {(isRunning || graphData.length > 0) && (
          <section className="animate-fade-in">
            <SpeedGraph
              data={graphData}
              showDownload={showDownload}
              showUpload={showUpload}
              onToggleDownload={() => setShowDownload(!showDownload)}
              onToggleUpload={() => setShowUpload(!showUpload)}
            />
          </section>
        )}

        {/* Results Section (After Completion) */}
        {isCompleted && results && (
          <section className="space-y-6 animate-fade-in">
            {/* Results Summary */}
            <ResultsSummary
              download={results.download}
              upload={results.upload}
              ping={results.ping}
              jitter={results.jitter}
              duration={results.duration}
            />

            {/* Network Rating */}
            <NetworkRating
              score={calculateScore()}
              stability={calculateStability()}
            />

            {/* Recommendations */}
            <Recommendations
              download={results.download}
              upload={results.upload}
              ping={results.ping}
            />
          </section>
        )}

        {/* Test Duration (During Test) */}
        {isRunning && (
          <section className="flex justify-center animate-fade-in">
            <div className="card-glass px-6 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Test Duration:</span>
              <span className="font-mono text-foreground">
                {liveMetrics.duration.toFixed(1)}s
              </span>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            Browser-based estimation. Results may vary from ISP measurements.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
