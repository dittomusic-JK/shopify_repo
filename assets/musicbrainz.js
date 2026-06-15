/**
 * MusicBrainz API Integration
 * Fetches artist metadata and enriches JSON-LD schema
 * Respects MusicBrainz rate limits via sessionStorage caching
 */

(function() {
  'use strict';

  const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2';
  const CACHE_KEY = 'musicbrainz_artist_data';
  const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

  /**
   * Get MusicBrainz ID from window object
   */
  function getMusicBrainzId() {
    return window.musicianTheme?.musicbrainzId || null;
  }

  /**
   * Get cached artist data from sessionStorage
   */
  function getCachedData(artistId) {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}_${artistId}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age < CACHE_DURATION) {
        return data;
      }

      sessionStorage.removeItem(`${CACHE_KEY}_${artistId}`);
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cache artist data in sessionStorage
   */
  function setCachedData(artistId, data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`${CACHE_KEY}_${artistId}`, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('MusicBrainz: Failed to cache data', error);
    }
  }

  /**
   * Fetch artist data from MusicBrainz API
   */
  async function fetchArtistData(artistId) {
    const url = `${MUSICBRAINZ_API}/artist/${artistId}?fmt=json&inc=url-rels+genres`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MusicianShopifyTheme/1.0.0 ( https://github.com/musician-theme )'
        }
      });

      if (!response.ok) {
        throw new Error(`MusicBrainz API returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('MusicBrainz: API request failed', error);
      return null;
    }
  }

  /**
   * Extract relevant URLs from MusicBrainz relations
   */
  function extractUrls(relations) {
    if (!relations || !Array.isArray(relations)) return [];

    const urlTypes = [
      'streaming',
      'free streaming',
      'download for free',
      'social network',
      'official homepage',
      'bandcamp',
      'soundcloud',
      'youtube',
      'discogs',
      'allmusic',
      'wikidata',
      'wikipedia'
    ];

    return relations
      .filter(rel => rel.type && urlTypes.includes(rel.type.toLowerCase()) && rel.url?.resource)
      .map(rel => rel.url.resource);
  }

  /**
   * Extract genres from MusicBrainz data
   */
  function extractGenres(data) {
    const genres = [];

    if (data.genres && Array.isArray(data.genres)) {
      genres.push(...data.genres.map(g => g.name));
    }

    if (data.tags && Array.isArray(data.tags)) {
      genres.push(...data.tags.filter(t => t.count > 0).map(t => t.name));
    }

    return [...new Set(genres)].slice(0, 5);
  }

  /**
   * Find and update the JSON-LD MusicGroup schema
   */
  function enrichJsonLdSchema(artistData) {
    requestAnimationFrame(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      
      for (const script of scripts) {
        try {
          const schema = JSON.parse(script.textContent);
          
          if (schema['@type'] === 'MusicGroup') {
            let updated = false;

            const genres = extractGenres(artistData);
            if (genres.length > 0 && !schema.genre) {
              schema.genre = genres;
              updated = true;
            }

            const urls = extractUrls(artistData.relations);
            if (urls.length > 0) {
              const existingSameAs = Array.isArray(schema.sameAs) ? schema.sameAs : [];
              const allUrls = [...new Set([...existingSameAs, ...urls])];
              schema.sameAs = allUrls;
              updated = true;
            }

            if (artistData.disambiguation && !schema.description) {
              schema.description = artistData.disambiguation;
              updated = true;
            }

            if (updated) {
              script.textContent = JSON.stringify(schema, null, 2);
            }

            break;
          }
        } catch (error) {
          console.warn('MusicBrainz: Failed to parse or update JSON-LD schema', error);
        }
      }
    });
  }

  /**
   * Initialize MusicBrainz enrichment
   */
  async function init() {
    const artistId = getMusicBrainzId();
    
    if (!artistId) {
      return;
    }

    const cachedData = getCachedData(artistId);
    
    if (cachedData) {
      enrichJsonLdSchema(cachedData);
      return;
    }

    const artistData = await fetchArtistData(artistId);
    
    if (artistData) {
      setCachedData(artistId, artistData);
      enrichJsonLdSchema(artistData);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
