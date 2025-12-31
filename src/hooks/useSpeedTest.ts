import { useState, useCallback, useRef } from 'react';

export interface SpeedDataPoint {
  time: number;
  download: number | null;
  upload: number | null;
}

export interface TestResults {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  duration: number;
}

type TestStatus = 'idle' | 'testing-download' | 'testing-upload' | 'completed';

export const useSpeedTest = () => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'download' | 'upload' | 'idle'>('idle');
  const [graphData, setGraphData] = useState<SpeedDataPoint[]>([]);
  const [results, setResults] = useState<TestResults | null>(null);
  const [liveMetrics, setLiveMetrics] = useState({ ping: 0, jitter: 0, duration: 0 });
  
  const abortRef = useRef(false);
  const startTimeRef = useRef(0);

  // Simulated speed test (browser-based estimation)
  const simulateSpeedTest = useCallback(async () => {
    abortRef.current = false;
    setStatus('testing-download');
    setCurrentPhase('download');
    setGraphData([]);
    setResults(null);
    startTimeRef.current = Date.now();

    // Simulate ping test
    const basePing = 15 + Math.random() * 35;
    const baseJitter = 1 + Math.random() * 8;
    setLiveMetrics({ ping: basePing, jitter: baseJitter, duration: 0 });

    // Simulate download test (8 seconds)
    const downloadSpeeds: number[] = [];
    const uploadSpeedsTemp: (number | null)[] = [];
    const baseDownload = 50 + Math.random() * 150; // 50-200 Mbps base
    
    for (let i = 0; i <= 80 && !abortRef.current; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const variation = (Math.random() - 0.5) * 20;
      const speed = Math.max(5, baseDownload + variation + (i < 20 ? i * 2 : 0));
      downloadSpeeds.push(speed);
      
      setCurrentSpeed(speed);
      // Use same time for both - upload will be null during download phase
      setGraphData(prev => [...prev, { time: i / 10, download: speed, upload: null }]);
      setLiveMetrics(prev => ({ 
        ...prev, 
        duration: (Date.now() - startTimeRef.current) / 1000,
        jitter: baseJitter + (Math.random() - 0.5) * 2
      }));
    }

    if (abortRef.current) return;

    // Simulate upload test (8 seconds) - starting from time 0 like download
    setStatus('testing-upload');
    setCurrentPhase('upload');
    
    const uploadSpeeds: number[] = [];
    const baseUpload = 20 + Math.random() * 80; // 20-100 Mbps base
    
    for (let i = 0; i <= 80 && !abortRef.current; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const variation = (Math.random() - 0.5) * 15;
      const speed = Math.max(2, baseUpload + variation + (i < 20 ? i * 1.5 : 0));
      uploadSpeeds.push(speed);
      
      setCurrentSpeed(speed);
      // Start upload from time 0 as well, showing parallel with download data
      setGraphData(prev => [...prev, { time: i / 10, download: null, upload: speed }]);
      setLiveMetrics(prev => ({ 
        ...prev, 
        duration: (Date.now() - startTimeRef.current) / 1000,
        jitter: baseJitter + (Math.random() - 0.5) * 2
      }));
    }

    if (abortRef.current) return;

    // Calculate final results
    const avgDownload = downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length;
    const avgUpload = uploadSpeeds.reduce((a, b) => a + b, 0) / uploadSpeeds.length;
    const finalDuration = (Date.now() - startTimeRef.current) / 1000;

    setStatus('completed');
    setCurrentPhase('idle');
    setCurrentSpeed(0);
    setResults({
      download: avgDownload,
      upload: avgUpload,
      ping: basePing,
      jitter: baseJitter,
      duration: finalDuration,
    });
    setLiveMetrics(prev => ({ ...prev, duration: finalDuration }));
  }, []);

  const startTest = useCallback(() => {
    simulateSpeedTest();
  }, [simulateSpeedTest]);

  const stopTest = useCallback(() => {
    abortRef.current = true;
    setStatus('completed');
    setCurrentPhase('idle');
    setCurrentSpeed(0);
  }, []);

  const restartTest = useCallback(() => {
    setStatus('idle');
    setCurrentSpeed(0);
    setCurrentPhase('idle');
    setGraphData([]);
    setResults(null);
    setLiveMetrics({ ping: 0, jitter: 0, duration: 0 });
  }, []);

  const calculateScore = useCallback((): number => {
    if (!results) return 0;
    
    // Score based on download (40%), upload (25%), ping (20%), jitter (15%)
    const downloadScore = Math.min(results.download / 100 * 4, 4);
    const uploadScore = Math.min(results.upload / 50 * 2.5, 2.5);
    const pingScore = Math.max(0, 2 - results.ping / 50);
    const jitterScore = Math.max(0, 1.5 - results.jitter / 10);
    
    return Math.min(10, downloadScore + uploadScore + pingScore + jitterScore);
  }, [results]);

  const calculateStability = useCallback((): 'stable' | 'moderate' | 'unstable' => {
    if (!results) return 'stable';
    
    // Based on jitter and variance
    if (results.jitter < 5) return 'stable';
    if (results.jitter < 15) return 'moderate';
    return 'unstable';
  }, [results]);

  return {
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
  };
};
