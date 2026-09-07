document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Filtro de categorias do cardápio ---------- */
  const tabs = document.querySelectorAll('.tab');
  const menuItems = document.querySelectorAll('.menu-item');

  function filterByCategory(category) {
    menuItems.forEach((item) => {
      item.classList.toggle('is-hidden', item.dataset.category !== category);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      filterByCategory(tab.dataset.category);
    });
  });

  // Aplica o filtro da categoria já marcada como ativa no HTML
  const initialTab = document.querySelector('.tab.is-active');
  if (initialTab) filterByCategory(initialTab.dataset.category);

  /* ---------- Horário de funcionamento ---------- */
  // Chaves seguem o padrão de Date.getDay(): 0 = domingo ... 6 = sábado.
  // "close: 24" representa funcionamento até a meia-noite.
  const schedule = {
    0: { open: 12, close: 22 },
    1: null,
    2: { open: 11, close: 23 },
    3: { open: 11, close: 23 },
    4: { open: 11, close: 23 },
    5: { open: 11, close: 23 },
    6: { open: 11, close: 24 },
  };

  const dayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function formatHour(h) {
    return h === 24 ? 'meia-noite' : `${h}h`;
  }

  function updateStatus() {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;

    const now = new Date();
    const day = now.getDay();
    const hourDecimal = now.getHours() + now.getMinutes() / 60;
    const today = schedule[day];

    if (today && hourDecimal >= today.open && hourDecimal < today.close) {
      badge.textContent = `Aberto agora, até ${formatHour(today.close)}`;
      badge.classList.add('is-open');
      badge.classList.remove('is-closed');
    } else {
      let nextDay = day;
      let nextInfo = null;
      for (let i = 1; i <= 7; i += 1) {
        nextDay = (day + i) % 7;
        if (schedule[nextDay]) {
          nextInfo = schedule[nextDay];
          break;
        }
      }
      badge.textContent = nextInfo
        ? `Fechado agora. Abrimos ${dayNames[nextDay]} às ${formatHour(nextInfo.open)}`
        : 'Fechado agora';
      badge.classList.add('is-closed');
      badge.classList.remove('is-open');
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);

  // Destaca o dia atual na lista de horários
  const todayRow = document.querySelector(`.hours-list li[data-day="${new Date().getDay()}"]`);
  if (todayRow) todayRow.classList.add('is-today');

  /* ---------- Ano no rodapé ---------- */
  const anoAtual = document.getElementById('anoAtual');
  if (anoAtual) anoAtual.textContent = new Date().getFullYear();

});
