const RELATIVE_TIME_SOURCES = ['data/vehicles.json', 'data/vehicles-extra.json'];

const relativeTime = (value) => {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return 'Listed recently';

  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Listed just now';
  if (minutes < 60) return `Listed ${minutes} min ago`;
  if (hours < 24) return `Listed ${hours} hr ago`;
  return `Listed ${days} day${days === 1 ? '' : 's'} ago`;
};

(async () => {
  try {
    const responses = await Promise.all(
      RELATIVE_TIME_SOURCES.map((source) => fetch(source).then((r) => r.ok ? r.json() : { vehicles: [] }))
    );
    const vehicles = responses.flatMap((data) => data.vehicles || []);
    const listedAtById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.listedAt]));

    const update = () => {
      document.querySelectorAll('a[href*="vehicle.html?id="]').forEach((link) => {
        const card = link.closest('.vehicle-card');
        if (!card) return;
        const id = decodeURIComponent((link.getAttribute('href').split('id=')[1] || '').split('&')[0]);
        const listedAt = listedAtById.get(id);
        if (!listedAt) return;
        const meta = card.querySelector('.vehicle-meta');
        const spans = meta ? meta.querySelectorAll('span') : [];
        if (spans.length >= 3) spans[spans.length - 1].textContent = relativeTime(listedAt);
      });
    };

    update();
    setInterval(update, 60000);
  } catch (error) {
    console.error('Relative time update failed:', error);
  }
})();
