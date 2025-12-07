

export interface IpData {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

// Helper to map DB-IP response to our schema
const mapDbIp = (data: any): IpData => ({
    ip: data.ipAddress,
    network: '',
    version: 'IPv4',
    city: data.city,
    region: data.stateProv,
    region_code: '',
    country: data.countryName,
    country_name: data.countryName,
    country_code: data.countryCode,
    country_code_iso3: data.countryCode,
    country_capital: '',
    country_tld: '',
    continent_code: data.continentCode,
    in_eu: false,
    postal: '',
    latitude: 0,
    longitude: 0,
    timezone: '',
    utc_offset: '',
    country_calling_code: '',
    currency: data.currencyCode,
    currency_name: '',
    languages: '',
    country_area: 0,
    country_population: 0,
    asn: '',
    org: 'Unknown (Fallback)'
});

export const fetchIpData = async (): Promise<IpData> => {
  // Strategy: Try 3 different free APIs in sequence.
  
  // 1. Try ipapi.co (Best data, but often blocked by adblockers)
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Primary API failed');
    return await response.json();
  } catch (error) {
    console.warn("Primary IP API failed, switching to fallback 1...");
  }

  // 2. Try ipwho.is (Reliable, often bypasses blocks)
  try {
    const response = await fetch('https://ipwho.is/');
    if (!response.ok) throw new Error('Fallback 1 network failed');
    
    const data = await response.json();
    if (!data.success) throw new Error('Fallback 1 returned error');

    return {
        ip: data.ip,
        network: data.connection?.domain || '',
        version: data.type,
        city: data.city,
        region: data.region,
        region_code: data.region_code,
        country: data.country,
        country_name: data.country,
        country_code: data.country_code,
        country_code_iso3: data.country_code, 
        country_capital: data.capital,
        country_tld: '',
        continent_code: data.continent_code,
        in_eu: data.is_eu,
        postal: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone?.id,
        utc_offset: data.timezone?.utc,
        country_calling_code: data.calling_code,
        currency: data.currency?.code || '',
        currency_name: data.currency?.name || '',
        languages: '',
        country_area: 0,
        country_population: 0,
        asn: data.connection?.asn?.toString() || '',
        org: data.connection?.org || data.connection?.isp || 'Unknown ISP'
    };
  } catch (error) {
     console.warn("Fallback 1 failed, switching to fallback 2...");
  }

  // 3. Try db-ip.com (Last resort, basic data, usually unblocked)
  try {
    const response = await fetch('https://api.db-ip.com/v2/free/self');
    if (!response.ok) throw new Error('Fallback 2 failed');
    const data = await response.json();
    return mapDbIp(data);
  } catch (error) {
    console.error("All IP providers failed");
    throw new Error('Could not detect IP address. Your network may be blocking all location services.');
  }
};
