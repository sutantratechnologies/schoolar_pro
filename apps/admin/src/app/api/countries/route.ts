import { NextResponse } from 'next/server';
import { FALLBACK_COUNTRIES, Country } from '@/lib/countries';

let serverCachedCountries: Country[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function GET() {
  const now = Date.now();
  if (serverCachedCountries && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json(
      { success: true, count: serverCachedCountries.length, countries: serverCachedCountries, source: 'cache' },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      }
    );
  }

  try {
    // Free Public Countries API (countriesnow.space)
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/unicode', {
      next: { revalidate: 86400 },
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        const seenCodes = new Set<string>();
        const mapped: Country[] = [];
        for (const c of data.data) {
          const code = (c.iso2 || '').toUpperCase().trim();
          if (!code || seenCodes.has(code)) continue;
          seenCodes.add(code);
          let name = c.name;
          if (code === 'VA') name = 'Vatican City';
          if (code === 'CC') name = 'Cocos (Keeling) Islands';
          mapped.push({
            name,
            code,
            flag: c.unicodeFlag || '🌐',
          });
        }
        mapped.sort((a, b) => a.name.localeCompare(b.name));
        serverCachedCountries = mapped;
        lastFetchTime = now;

        return NextResponse.json(
          { success: true, count: mapped.length, countries: mapped, source: 'live_api' },
          {
            headers: {
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
          }
        );
      }
    }
  } catch (error) {
    console.warn('[countries-api] External API unreachable, serving bundled ISO fallback', error);
  }

  // Resilient fallback with all 250 countries and unicode flags
  return NextResponse.json(
    { success: true, count: FALLBACK_COUNTRIES.length, countries: FALLBACK_COUNTRIES, source: 'fallback' },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    }
  );
}
