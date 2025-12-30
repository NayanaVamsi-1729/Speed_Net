import { useState } from 'react';
import { Play, Square, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpeedGauge } from '@/components/SpeedGauge';
import { SpeedGraph } from '@/components/SpeedGraph';
import { MetricCard } from '@/components/MetricCard';
import { NetworkRating } from '@/components/NetworkRating';
import { Recommendations } from '@/components/Recommendations';
import { ResultsSummary } from '@/components/ResultsSummary';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { useLanguage } from '@/contexts/LanguageContext';
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

  const { t } = useLanguage();

  const [showDownload, setShowDownload] = useState(true);
  const [showUpload, setShowUpload] = useState(true);
  const [copied, setCopied] = useState(false);

  const isRunning = status === 'testing-download' || status === 'testing-upload';
  const isCompleted = status === 'completed' && results !== null;

  const getGaugeLabel = () => {
    if (status === 'testing-download') return t('testingDownload');
    if (status === 'testing-upload') return t('testingUpload');
    if (isCompleted) return t('testComplete');
    return t('readyToTest');
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
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {t('title')}
              </h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <SettingsDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Control Area */}
        <section className="flex justify-center">
          {status === 'idle' ? (
            <Button variant="start" size="xl" onClick={startTest}>
              <Play className="w-5 h-5" />
              {t('startTest')}
            </Button>
          ) : isRunning ? (
            <Button variant="stop" size="xl" onClick={stopTest}>
              <Square className="w-5 h-5" />
              {t('stop')}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button variant="start" size="lg" onClick={restartTest}>
                <RotateCcw className="w-4 h-4" />
                {t('restartTest')}
              </Button>
              <Button variant="action" size="lg" onClick={handleCopyResults}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? t('copied') : t('copyResults')}
              </Button>
            </div>
          )}
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
            label={t('download')}
            value={isRunning && currentPhase === 'download' ? currentSpeed : (results?.download || 0)}
            unit="Mbps"
            variant="download"
          />
          <MetricCard
            label={t('upload')}
            value={isRunning && currentPhase === 'upload' ? currentSpeed : (results?.upload || 0)}
            unit="Mbps"
            variant="upload"
          />
          <MetricCard
            label={t('ping')}
            value={liveMetrics.ping || results?.ping || 0}
            unit="ms"
          />
          <MetricCard
            label={t('jitter')}
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

        {/* Advertisement Slot - Below Speed Graph */}
        {(isRunning || graphData.length > 0) && (
          <section className="flex justify-center animate-fade-in">
            <div className="w-full max-w-[728px] h-[90px] md:h-[90px] rounded-lg border border-dashed border-border/50 flex items-center justify-center bg-muted/20">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                {t('advertisement')}
              </span>
            </div>
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
              <span className="text-sm text-muted-foreground">{t('testDuration')}:</span>
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
            {t('footer')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
