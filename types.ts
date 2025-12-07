export interface SpeedTestResult {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  ping: number; // ms
  jitter: number; // ms
  timestamp: number;
}

export interface SpeedPoint {
  time: number;
  speed: number;
}

export enum TestState {
  IDLE = 'IDLE',
  PING = 'PING',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface NetworkGrade {
  grade: string; // A+, A, B, C, D, F
  color: string;
  label: string;
  streaming: string; // 4K, 1080p, 720p
  gaming: string; // Excellent, Good, Poor
}

export type PageRoute = 
  | 'home' 
  | 'speed-test' 
  | 'ip-scanner' 
  | 'ping-monitor' 
  | 'password-generator' 
  | 'qr-code' 
  | 'device-info' 
  | 'subnet-calc' 
  | 'file-transfer' 
  | 'dns-lookup' 
  | 'mac-lookup' 
  | 'json-format' 
  | 'port-test' 
  | 'weather';
