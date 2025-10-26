// Mobile nav toggle with a11y
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('open');
      });
    }