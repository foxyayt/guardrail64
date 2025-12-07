
// Real Speed Test Engine using Cloudflare's Edge Network
// Using standard HTTP endpoints designed for network testing

import { SpeedPoint } from "../types";

const CF_ENDPOINT_DOWN = 'https://speed.cloudflare.com/__down';
const CF_ENDPOINT_UP = 'https://speed.cloudflare.com/__up';

export class SpeedTestEngine {
  private isRunning = false;
  private onProgress: (speed: number, progress: number, points: SpeedPoint[]) => void;

  constructor(onProgress: (speed: number, progress: number, points: SpeedPoint[]) => void) {
    this.onProgress = onProgress;
  }

  abort() {
    this.isRunning = false;
  }

  /**
   * Measure Latency (Ping) and Jitter
   */
  async measurePing(): Promise<{ ping: number; jitter: number }> {
    this.isRunning = true;
    const pings: number[] = [];
    const iterations = 8; 

    for (let i = 0; i < iterations; i++) {
      if (!this.isRunning) throw new Error("Aborted");
      
      const start = performance.now();
      try {
        const res = await fetch(`${CF_ENDPOINT_DOWN}?bytes=0&t=${Date.now()}`, { 
          cache: 'no-store',
        });
        if (!res.ok) throw new Error("Ping failed");
        
        const end = performance.now();
        pings.push(end - start);
        
        // Report progress
        this.onProgress(0, (i / iterations) * 100, []);
      } catch (e) {
        console.warn("Ping failed", e);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    if (pings.length === 0) throw new Error("Network connection unavailable");

    const minPing = Math.min(...pings);
    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
    
    // Calculate Jitter (Standard Deviation of the sample)
    const variance = pings.reduce((total, val) => total + Math.pow(val - avgPing, 2), 0) / pings.length;
    const jitter = Math.sqrt(variance);

    return { ping: minPing, jitter };
  }

  /**
   * Measure Download Speed
   */
  async measureDownload(): Promise<number> {
    this.isRunning = true;
    const startTime = performance.now();
    const duration = 8000; // 8 seconds
    const points: SpeedPoint[] = [];
    
    let totalBytesLoaded = 0;
    const threadCount = 4; // Safe number for most browsers
    const activeThreads: Promise<void>[] = [];

    // Progress tracking loop
    const trackProgress = () => {
      if (!this.isRunning) return;
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      if (elapsed <= 0) return;

      const bitsLoaded = totalBytesLoaded * 8;
      const mbps = (bitsLoaded / elapsed) / 1_000_000;
      
      const progress = Math.min((now - startTime) / duration, 1);
      
      points.push({ time: now - startTime, speed: mbps });
      this.onProgress(mbps, progress * 100, points);
      
      if (now - startTime < duration) {
        requestAnimationFrame(trackProgress);
      }
    };
    
    requestAnimationFrame(trackProgress);

    // Worker function
    const downloadThread = async () => {
      while (this.isRunning && (performance.now() - startTime) < duration) {
        try {
          // Request 25MB chunks
          const response = await fetch(`${CF_ENDPOINT_DOWN}?bytes=25000000&t=${Date.now()}-${Math.random()}`);
          if (!response.body) break;

          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done || !this.isRunning) break;
            if (value) {
              totalBytesLoaded += value.byteLength;
            }
          }
        } catch (e) {
          break; 
        }
      }
    };

    for (let i = 0; i < threadCount; i++) {
      activeThreads.push(downloadThread());
    }

    await Promise.all(activeThreads);

    const totalTime = (performance.now() - startTime) / 1000;
    if (totalTime === 0) return 0;
    
    const finalSpeed = ((totalBytesLoaded * 8) / totalTime) / 1_000_000;
    return finalSpeed;
  }

  /**
   * Measure Upload Speed
   */
  async measureUpload(): Promise<number> {
    this.isRunning = true;
    const startTime = performance.now();
    const duration = 10000; // 10 seconds
    const points: SpeedPoint[] = [];
    let totalBytesUploaded = 0;
    
    // CRITICAL FIX: Use 'text/plain' and a Blob.
    // This creates a "Simple Request" in CORS terms, preventing the browser
    // from sending an OPTIONS (Preflight) request which often fails on strict firewalls.
    const chunkSize = 1024 * 1024; // 1MB
    // Create a large string of random characters
    const randomChar = 'A';
    const randomString = randomChar.repeat(chunkSize);
    const payload = new Blob([randomString], { type: 'text/plain' });

    // Use fewer threads for upload to avoid choking upstream
    const threadCount = 4; 
    const activeThreads: Promise<void>[] = [];

    const trackProgress = () => {
        if (!this.isRunning) return;
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;
        
        if (elapsed <= 0.1) {
             requestAnimationFrame(trackProgress);
             return;
        }
  
        const bitsLoaded = totalBytesUploaded * 8;
        const mbps = (bitsLoaded / elapsed) / 1_000_000;
        const progress = Math.min((now - startTime) / duration, 1);
        
        points.push({ time: now - startTime, speed: mbps });
        this.onProgress(mbps, progress * 100, points);
        
        if (now - startTime < duration) {
          requestAnimationFrame(trackProgress);
        }
    };
    requestAnimationFrame(trackProgress);

    const uploadThread = async () => {
        while (this.isRunning && (performance.now() - startTime) < duration) {
            try {
                // Perform upload
                // Important: Do NOT set custom headers here, or it triggers a preflight.
                await fetch(`${CF_ENDPOINT_UP}?t=${Date.now()}-${Math.random()}`, {
                    method: 'POST',
                    body: payload,
                    // text/plain is safe.
                });
                
                if (this.isRunning) {
                    totalBytesUploaded += chunkSize;
                }

            } catch (e) {
                // If a chunk fails, just continue. 
                // We don't want to stop the whole test for one dropped packet.
                await new Promise(r => setTimeout(r, 200));
            }
        }
    };

    for (let i = 0; i < threadCount; i++) {
        activeThreads.push(uploadThread());
    }

    await Promise.all(activeThreads);

    const totalTime = (performance.now() - startTime) / 1000;
    
    // Fallback: If 0 bytes uploaded (likely blocked environment), return 0 without erroring whole app
    if (totalTime === 0 || totalBytesUploaded === 0) return 0;

    const finalSpeed = ((totalBytesUploaded * 8) / totalTime) / 1_000_000;
    return finalSpeed;
  }
}
