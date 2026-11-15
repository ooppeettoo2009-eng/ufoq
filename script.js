(() => {
  const body = document.body;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#site-search');
  const resultsMessage = document.querySelector('#results-message');
  const emptyState = document.querySelector('#empty-state');
  const articlesGrid = document.querySelector('#articles-grid');
  const searchableItems = [...document.querySelectorAll('.searchable')];

  const savedTheme = localStorage.getItem('ufoq-theme');
  if (savedTheme === 'light') body.classList.add('light');
  updateThemeButton();

  function updateThemeButton() {
    const light = body.classList.contains('light');
    themeButton.setAttribute('aria-label', light ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح');
    themeButton.title = light ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح';
  }

  themeButton.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('ufoq-theme', body.classList.contains('light') ? 'light' : 'dark');
    updateThemeButton();
  });

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'فتح القائمة' : 'إغلاق القائمة');
    nav.classList.toggle('open', !isOpen);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'فتح القائمة');
  }));

  function normalize(value) {
    return value.trim().toLocaleLowerCase('ar')
      .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  }

  function runSearch(rawQuery, shouldScroll = true) {
    const query = normalize(rawQuery);
    let count = 0;
    searchableItems.forEach(item => {
      const matches = !query || normalize(`${item.dataset.search || ''} ${item.textContent}`).includes(query);
      item.hidden = !matches;
      if (matches) count++;
    });
    const isSearching = Boolean(query);
    resultsMessage.textContent = isSearching ? (count ? `عُثر على ${count} نتيجة تطابق «${rawQuery.trim()}».` : `لا توجد نتائج تطابق «${rawQuery.trim()}».`) : '';
    emptyState.hidden = !isSearching || count > 0;
    articlesGrid.hidden = isSearching && ![...articlesGrid.querySelectorAll('.article-card')].some(item => !item.hidden);
    if (shouldScroll) document.querySelector('#latest').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    runSearch(searchInput.value);
  });
  document.querySelectorAll('.search-suggestion').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.query;
    runSearch(button.dataset.query);
  }));
  document.querySelector('#clear-search').addEventListener('click', () => {
    searchInput.value = '';
    runSearch('', false);
    searchInput.focus();
  });

  document.querySelector('#newsletter-form').addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#email');
    const status = document.querySelector('#newsletter-status');
    if (!email.reportValidity()) return;
    status.textContent = 'تم تسجيل بريدك بنجاح. نراك في الرسالة القادمة!';
    status.style.color = 'var(--cyan)';
    email.value = '';
  });
})();
