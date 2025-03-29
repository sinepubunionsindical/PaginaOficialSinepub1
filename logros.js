document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
  });

  window.addEventListener('beforeunload', () => {
    document.body.classList.add('fade-out');
  });

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !link.hasAttribute('target')) {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 600); // Tiempo de fade-out antes de cambiar
      }
    });
  });