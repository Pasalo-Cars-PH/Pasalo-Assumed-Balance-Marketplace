/* ============================================================================
   PASALO CARS PH - MAIN APPLICATION SCRIPT
   ============================================================================ */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mainNav = document.querySelector('#main-nav');

  // Toggle mobile menu
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
    });

    // Close menu when link clicked
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = mobileNav && mobileNav.contains(event.target);
    const isClickInsideToggle = menuToggle && menuToggle.contains(event.target);
    const isMenuOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';

    if (!isClickInsideMenu && !isClickInsideToggle && isMenuOpen) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Form submission handling
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.addEventListener('submit', function(e) {
      // Let form submit naturally to listings.html
      // This event handler can be extended for client-side filtering if needed
    });
  }

  // Populate featured listings (demo data)
  populateFeaturedListings();

  // Performance: Log when page is loaded
  console.log('✅ Pasalo Cars PH loaded successfully');
});

/**
 * Populate Featured Listings Section
 * Replace with actual API call in production
 */
function populateFeaturedListings() {
  const featuredList = document.querySelector('#featured-list');
  if (!featuredList) return;

  // Sample vehicle data (replace with actual API data)
  const vehicles = [
    {
      id: 1,
      title: 'Toyota Zenix Q Hybrid 2026',
      image: 'https://via.placeholder.com/400x225?text=Toyota+Zenix',
      cashOut: '₱350,000',
      monthly: '₱42,338 / month',
      location: 'Toyota Abad Santos',
      financing: 'Toyota Financial Services (TFS)',
      postedDaysAgo: 2,
      status: 'To confirm'
    },
    {
      id: 2,
      title: 'Nissan Terra VE 4x2 Automatic 2026',
      image: 'https://via.placeholder.com/400x225?text=Nissan+Terra',
      cashOut: '₱300,000',
      monthly: '₱40,700 / month',
      location: 'Nissan Dealer',
      financing: 'To confirm',
      postedDaysAgo: 2,
      status: 'Mandainyong'
    },
    {
      id: 3,
      title: 'Toyota Corolla Cross HEV CVT 2026',
      image: 'https://via.placeholder.com/400x225?text=Toyota+Corolla',
      cashOut: '₱245,000',
      monthly: '₱36,000 / month',
      location: 'Toyota Financial Services (TFS)',
      financing: 'Toyota Financial Services (TFS)',
      postedDaysAgo: 5,
      status: 'Listed 5 days ago'
    }
  ];

  // Render vehicles
  featuredList.innerHTML = vehicles.map(vehicle => `
    <article class="vehicle-card">
      <img src="${vehicle.image}" alt="${vehicle.title}" class="vehicle-image">
      <div class="vehicle-info">
        <h3 class="vehicle-title">${vehicle.title}</h3>
        
        <div>
          <div class="vehicle-price-label">CASH-OUT</div>
          <div class="vehicle-price">${vehicle.cashOut}</div>
          <div class="vehicle-monthly">${vehicle.monthly}</div>
        </div>

        <div class="vehicle-details">
          <div class="vehicle-detail-item">
            <span>📍 ${vehicle.location}</span>
          </div>
          <div class="vehicle-detail-item">
            <span>🏦 ${vehicle.financing}</span>
          </div>
          <div class="vehicle-detail-item">
            <span>⏱️ ${vehicle.status}</span>
          </div>
        </div>

        <div class="vehicle-actions">
          <a href="listing-details.html?id=${vehicle.id}" class="btn btn-secondary">View Details</a>
          <button type="button" class="btn btn-primary" data-vehicle-id="${vehicle.id}">Inquire</button>
        </div>
      </div>
    </article>
  `).join('');

  // Add event listeners to inquire buttons
  document.querySelectorAll('[data-vehicle-id]').forEach(button => {
    button.addEventListener('click', function() {
      const vehicleId = this.getAttribute('data-vehicle-id');
      handleInquire(vehicleId);
    });
  });
}

/**
 * Handle Vehicle Inquiry
 * @param {number} vehicleId - The vehicle ID
 */
function handleInquire(vehicleId) {
  console.log(`Inquiry for vehicle ${vehicleId}`);
  // Redirect to inquiry form or open modal
  window.location.href = `inquire.html?vehicle=${vehicleId}`;
}

/**
 * Debounce function for search input
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Handle real-time search (optional enhancement)
 */
function initializeSearch() {
  const searchInput = document.querySelector('.search-box input[type="search"]');
  if (!searchInput) return;

  const handleSearch = debounce(function(e) {
    const query = e.target.value.trim();
    if (query.length >= 2) {
      // Perform search - can be replaced with API call
      console.log('Searching for:', query);
    }
  }, 300);

  searchInput.addEventListener('input', handleSearch);
}

/**
 * Intersection Observer for lazy loading and animations
 */
function initializeObserver() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.vehicle-card, .category-card').forEach(card => {
    observer.observe(card);
  });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  initializeObserver();
});

/**
 * Utility: Get URL parameter
 * @param {string} param - Parameter name
 */
function getUrlParameter(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

/**
 * Utility: Track user actions (analytics)
 * @param {string} action - Action name
 * @param {object} data - Additional data
 */
function trackEvent(action, data = {}) {
  console.log(`📊 Event: ${action}`, data);
  // Replace with actual analytics tracking (GA, Mixpanel, etc.)
}
