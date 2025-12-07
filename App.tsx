
import { AdBanner } from './AdBanner';
import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { SpeedTestPage } from './pages/SpeedTestPage';
import { IpScannerPage } from './pages/IpScannerPage';
import { PingMonitorPage } from './pages/PingMonitorPage';
import { PasswordGeneratorPage } from './pages/PasswordGeneratorPage';
import { QrCodePage } from './pages/QrCodePage';
import { DeviceInfoPage } from './pages/DeviceInfoPage';
import { SubnetPage } from './pages/SubnetPage';
import { FileTransferPage } from './pages/FileTransferPage';
import { DnsLookupPage } from './pages/DnsLookupPage';
import { MacLookupPage } from './pages/MacLookupPage';
import { JsonFormatterPage } from './pages/JsonFormatterPage';
import { PortTesterPage } from './pages/PortTesterPage';
import { WeatherPage } from './pages/WeatherPage';
import { PageRoute } from './types';
import { SeoHead } from './components/SeoHead';

const App: React.FC = () => {
  // Use internal state for navigation (Memory Router)
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Sync with URL hash for bookmarking and back button
  useEffect(() => {
    const handleHashCheck = () => {
        const hash = window.location.hash;
        if (hash.includes('internet-speed-test')) {
            setCurrentPage('speed-test');
        } else if (hash.includes('what-is-my-ip-address')) {
            setCurrentPage('ip-scanner');
        } else if (hash.includes('ping-jitter-packet-loss-test')) {
            setCurrentPage('ping-monitor');
        } else if (hash.includes('strong-random-password-generator')) {
            setCurrentPage('password-generator');
        } else if (hash.includes('free-offline-qr-code-generator')) {
            setCurrentPage('qr-code');
        } else if (hash.includes('browser-fingerprint-device-info')) {
            setCurrentPage('device-info');
        } else if (hash.includes('ipv4-subnet-mask-calculator')) {
            setCurrentPage('subnet-calc');
        } else if (hash.includes('file-transfer-time-bandwidth-calculator')) {
            setCurrentPage('file-transfer');
        } else if (hash.includes('dns-records-lookup-tool')) {
            setCurrentPage('dns-lookup');
        } else if (hash.includes('mac-address-vendor-lookup')) {
            setCurrentPage('mac-lookup');
        } else if (hash.includes('online-json-formatter-validator')) {
            setCurrentPage('json-format');
        } else if (hash.includes('open-port-checker-tool')) {
            setCurrentPage('port-test');
        } else if (hash.includes('local-weather-forecast-radar')) {
            setCurrentPage('weather');
        } else {
            setCurrentPage('home');
        }
    };
    
    // Check on load
    handleHashCheck();

    // Listen for manual back button presses
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleNavigate = (page: PageRoute) => {
    // 1. Update State immediately for instant feedback
    setCurrentPage(page);
    
    // 2. Map route to SEO-Optimized URL slug
    const routes: Record<PageRoute, string> = {
        'home': '/',
        'speed-test': '/internet-speed-test',
        'ip-scanner': '/what-is-my-ip-address',
        'ping-monitor': '/ping-jitter-packet-loss-test',
        'password-generator': '/strong-random-password-generator',
        'qr-code': '/free-offline-qr-code-generator',
        'device-info': '/browser-fingerprint-device-info',
        'subnet-calc': '/ipv4-subnet-mask-calculator',
        'file-transfer': '/file-transfer-time-bandwidth-calculator',
        'dns-lookup': '/dns-records-lookup-tool',
        'mac-lookup': '/mac-address-vendor-lookup',
        'json-format': '/online-json-formatter-validator',
        'port-test': '/open-port-checker-tool',
        'weather': '/local-weather-forecast-radar'
    };
    
    const slug = routes[page] || '/';
    
    // 3. Update URL hash safely
    if (window.location.hash !== `#${slug}`) {
        try {
            window.history.pushState(null, '', `#${slug}`);
        } catch (e) {
            console.warn("Navigation pushState failed (likely sandbox restriction)", e);
        }
    }
    
    // 4. Scroll to top safely
    try {
        window.scrollTo(0, 0);
    } catch (e) { /* ignore */ }
  };

  const renderPage = () => {
    switch (currentPage) {
        case 'speed-test': 
            return (
                <>
                    <SeoHead 
                        title="Internet Speed Test | Check Upload, Download & Ping | Guardrail64"
                        description="Accurate internet speed test by Guardrail64. Measure your bandwidth, latency, and jitter instantly. Optimized for Fiber, 5G, and Starlink connections."
                        keywords="internet speed test, speed test, bandwidth check, wifi test, ping test, upload speed, download speed, guardrail64"
                    />
                    <SpeedTestPage onNavigate={handleNavigate} />
                </>
            );
        case 'ip-scanner': 
            return (
                <>
                    <SeoHead 
                        title="What Is My IP Address? | IP Location & ISP Lookup | Guardrail64"
                        description="Find your public IP address, location, and ISP details instantly with Guardrail64. Check if your VPN is working and analyze your network identity."
                        keywords="what is my ip, ip lookup, my ip address, check isp, ip location finder, public ip"
                    />
                    <IpScannerPage onNavigate={handleNavigate} />
                </>
            );
        case 'ping-monitor': 
            return (
                <>
                    <SeoHead 
                        title="Ping Monitor & Packet Loss Test | Live Latency Graph | Guardrail64"
                        description="Real-time network latency monitor by Guardrail64. Test for packet loss, high jitter, and lag spikes. Essential tool for gamers and remote workers."
                        keywords="ping test, packet loss test, jitter test, network latency, lag test, gaming ping monitor"
                    />
                    <PingMonitorPage onNavigate={handleNavigate} />
                </>
            );
        case 'password-generator': 
            return (
                <>
                    <SeoHead 
                        title="Strong Password Generator | Secure & Random | Guardrail64"
                        description="Generate military-grade strong passwords instantly. 100% client-side security by Guardrail64. Create random passwords for superior account protection."
                        keywords="password generator, strong password, secure password, random password creator, password strength checker"
                    />
                    <PasswordGeneratorPage onNavigate={handleNavigate} />
                </>
            );
        case 'qr-code': 
            return (
                <>
                    <SeoHead 
                        title="Free QR Code Generator | No Tracking & Offline | Guardrail64"
                        description="Create free QR codes for URLs, text, and WiFi. Privacy-focused generator that runs offline in your browser. No sign-up required."
                        keywords="qr code generator, free qr code, create qr code, offline qr code, qr code maker"
                    />
                    <QrCodePage onNavigate={handleNavigate} />
                </>
            );
        case 'device-info': 
            return (
                <>
                    <SeoHead 
                        title="Device Fingerprint & Browser Info Checker | Guardrail64"
                        description="Analyze your digital fingerprint. See your screen resolution, user agent, battery status, and hardware concurrency details."
                        keywords="device info, browser fingerprint, screen resolution check, user agent checker, hardware info"
                    />
                    <DeviceInfoPage onNavigate={handleNavigate} />
                </>
            );
        case 'subnet-calc': 
            return (
                <>
                    <SeoHead 
                        title="IPv4 Subnet Calculator | CIDR & Netmask | Guardrail64"
                        description="Calculate network ranges, broadcast addresses, and usable hosts from IP and CIDR. Essential tool for network engineers."
                        keywords="subnet calculator, cidr calculator, ipv4 subnet, network mask, ip range calculator"
                    />
                    <SubnetPage onNavigate={handleNavigate} />
                </>
            );
        case 'file-transfer': 
            return (
                <>
                    <SeoHead 
                        title="File Transfer Time Calculator | Upload & Download Estimator | Guardrail64"
                        description="Calculate how long it takes to transfer files. Estimate upload and download times based on your internet speed and file size."
                        keywords="file transfer calculator, download time calculator, upload time estimator, bandwidth calculator"
                    />
                    <FileTransferPage onNavigate={handleNavigate} />
                </>
            );
        case 'dns-lookup': 
            return (
                <>
                    <SeoHead 
                        title="DNS Record Lookup | A, MX, CNAME, TXT | Guardrail64"
                        description="Check DNS propagation instantly. View A, MX, NS, CNAME, and TXT records for any domain using Google DNS."
                        keywords="dns lookup, check dns records, mx record checker, dns propagation, nslookup online"
                    />
                    <DnsLookupPage onNavigate={handleNavigate} />
                </>
            );
        case 'mac-lookup': 
            return (
                <>
                    <SeoHead 
                        title="MAC Address Lookup | OUI Vendor Check | Guardrail64"
                        description="Identify device manufacturers from MAC addresses. Check OUI vendors for Apple, Cisco, Samsung, and more."
                        keywords="mac address lookup, mac vendor check, oui lookup, mac address identifier"
                    />
                    <MacLookupPage onNavigate={handleNavigate} />
                </>
            );
        case 'json-format': 
            return (
                <>
                    <SeoHead 
                        title="JSON Formatter & Validator | Beautify & Minify | Guardrail64"
                        description="Free online JSON tool. Validate, format, beautify, and minify JSON data instantly. Secure client-side processing."
                        keywords="json formatter, json validator, beautify json, minify json, json viewer"
                    />
                    <JsonFormatterPage onNavigate={handleNavigate} />
                </>
            );
        case 'port-test': 
            return (
                <>
                    <SeoHead 
                        title="Open Port Tester | Check HTTP/HTTPS Accessibility | Guardrail64"
                        description="Test if common ports (80, 443, 8080) are open on a server. Simple browser-based availability check."
                        keywords="port tester, open port check, check ports, firewall tester"
                    />
                    <PortTesterPage onNavigate={handleNavigate} />
                </>
            );
        case 'weather': 
            return (
                <>
                    <SeoHead 
                        title="Live Weather App | 14-Day Forecast & Radar | Guardrail64"
                        description="Beautiful, privacy-focused weather dashboard. Check local temperature, 14-day forecast, hourly trends, and Air Quality without tracking."
                        keywords="weather app, local weather, 14 day forecast, weather dashboard, temperature check, air quality"
                    />
                    <WeatherPage onNavigate={handleNavigate} />
                </>
            );
        default: 
            return (
                <>
                    <SeoHead 
                        title="Guardrail64 | Free Network Tools & Speed Test"
                        description="Guardrail64 is a suite of high-performance web tools: Internet Speed Test, IP Lookup, Ping Monitor, Password Generator, and more. Fast, free, and privacy-focused."
                        keywords="web tools, developer tools, speed test, ip lookup, utility apps, browser tools, guardrail64"
                    />
                    <HomePage onNavigate={handleNavigate} />
                </>
            );
    }
   };

  return (
    <>
      {/* Global banner ad on all pages */}
      <AdBanner />

      {/* Actual page content */}
      {renderPage()}
    </>
  );
};

export default App;
