import { useState } from 'react';
import { Play, Square, RotateCcw, Copy, Check, Zap } from 'lucide-react';
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
      <header className="border-b border-border/50 py-4 sm:py-6">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">SpeedNet</span>
            </div>
            
            {/* Title - Center (desktop only) */}
            <div className="hidden lg:block text-center flex-1 px-4">
              <h1 className="text-xl xl:text-2xl font-bold tracking-tight text-foreground">
                {t('title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
            
            {/* Settings - Right */}
            <div className="shrink-0">
              <SettingsDropdown />
            </div>
          </div>
          
          {/* Mobile/Tablet title - Below header row */}
          <div className="lg:hidden text-center mt-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t('title')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Control Area */}
        <section className="flex justify-center">
          {status === 'idle' ? (
            <Button variant="start" size="xl" onClick={startTest} className="w-full sm:w-auto max-w-xs">
              <Play className="w-5 h-5" />
              {t('startTest')}
            </Button>
          ) : isRunning ? (
            <Button variant="stop" size="xl" onClick={stopTest} className="w-full sm:w-auto max-w-xs">
              <Square className="w-5 h-5" />
              {t('stop')}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="start" size="lg" onClick={restartTest} className="w-full sm:w-auto">
                <RotateCcw className="w-4 h-4" />
                {t('restartTest')}
              </Button>
              <Button variant="action" size="lg" onClick={handleCopyResults} className="w-full sm:w-auto">
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
          <section className="flex justify-center animate-fade-in px-2">
            <div className="w-full max-w-[320px] sm:max-w-[728px] h-[100px] sm:h-[90px] rounded-lg border border-dashed border-border/50 flex items-center justify-center bg-muted/20">
              <span className="text-xs text-muted-foreground uppercase tracking-widest text-center">
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
