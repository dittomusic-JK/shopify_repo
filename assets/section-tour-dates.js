/**
 * Bandsintown API Integration for Tour Dates
 * Fetches upcoming events and renders them in our custom styled table
 */

(function() {
  'use strict';

  const CACHE_KEY = 'bandsintown_tour_dates';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  const API_BASE = 'https://rest.bandsintown.com/artists';
  const APP_ID = 'riffride';

  function initBandsintownDates() {
    const section = document.querySelector('.tour-dates');
    if (!section) return;

    const useBandsintown = section.dataset.useBandsintown;
    const artistName = section.dataset.bandsintownArtist;

    if (useBandsintown !== 'true') return;
    if (!artistName || artistName.trim() === '') return;

    const loadingEl = document.getElementById('tourDatesLoading');
    const tableEl = document.getElementById('tourDatesTable');
    const tbodyEl = document.getElementById('tourDatesBody');

    if (!loadingEl || !tableEl || !tbodyEl) return;

    fetchTourDates(artistName)
      .then(events => {
        if (events && events.length > 0) {
          renderEvents(events, tbodyEl);
          loadingEl.style.display = 'none';
          tableEl.style.display = 'table';
        } else {
          showEmptyState(loadingEl);
        }
      })
      .catch(error => {
        console.error('Bandsintown API error:', error);
        showEmptyState(loadingEl);
      });
  }

  function fetchTourDates(artistName) {
    const cached = getCachedData();
    if (cached) {
      return Promise.resolve(cached);
    }

    const encodedArtist = encodeURIComponent(artistName);
    const url = `${API_BASE}/${encodedArtist}/events?app_id=${APP_ID}&date=upcoming`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        return response.json();
      })
      .then(events => {
        setCachedData(events);
        return events;
      });
  }

  function renderEvents(events, tbody) {
    tbody.innerHTML = '';

    events.forEach(event => {
      const row = document.createElement('tr');
      row.className = 'tour-dates__row';

      const dateCell = document.createElement('td');
      dateCell.className = 'tour-dates__date';
      dateCell.setAttribute('data-label', 'Date');
      dateCell.textContent = formatDate(event.datetime);
      row.appendChild(dateCell);

      const cityCell = document.createElement('td');
      cityCell.className = 'tour-dates__city';
      cityCell.setAttribute('data-label', 'City');
      cityCell.textContent = `${event.venue.city}, ${event.venue.country}`;
      row.appendChild(cityCell);

      const venueCell = document.createElement('td');
      venueCell.className = 'tour-dates__venue';
      venueCell.setAttribute('data-label', 'Venue');
      venueCell.textContent = event.venue.name;
      row.appendChild(venueCell);

      const ticketsCell = document.createElement('td');
      ticketsCell.className = 'tour-dates__tickets';
      ticketsCell.setAttribute('data-label', '');

      if (event.offers && event.offers.length > 0) {
        const ticketLink = document.createElement('a');
        ticketLink.href = event.offers[0].url;
        ticketLink.className = 'tour-dates__tickets-link';
        ticketLink.textContent = 'Tickets';
        ticketLink.target = '_blank';
        ticketLink.rel = 'noopener noreferrer';
        ticketsCell.appendChild(ticketLink);
      } else {
        const soldOut = document.createElement('span');
        soldOut.className = 'tour-dates__sold-out';
        soldOut.textContent = 'Sold out';
        ticketsCell.appendChild(soldOut);
      }

      row.appendChild(ticketsCell);
      tbody.appendChild(row);
    });
  }

  function formatDate(datetime) {
    const date = new Date(datetime);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day < 10 ? '0' + day : day}, ${year}`;
  }

  function showEmptyState(loadingEl) {
    loadingEl.innerHTML = '<p class="tour-dates__empty">No upcoming shows</p>';
  }

  function getCachedData() {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < CACHE_DURATION) {
        return data;
      }

      sessionStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      return null;
    }
  }

  function setCachedData(data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to cache tour dates:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBandsintownDates);
  } else {
    initBandsintownDates();
  }
})();
