(() => {
  'use strict';

  const API_URL = 'https://' +
    'sudhakar-portfolio-challenge' +
    '.onteddusudhakarreddy20' +
    '.workers.dev/verify';

  const normalise = (text) => String(text).trim().toLowerCase();

  const requestVerification = async (text) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag: normalise(text) })
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Invalid server response');
    }

    if (!response.ok || !data.success) return null;
    return data;
  };

  const verify = async (text) => {
    try {
      const data = await requestVerification(text);
      return !!data?.success;
    } catch {
      return false;
    }
  };

  const revealPhone = async (text) => {
    try {
      const data = await requestVerification(text);
      return data?.success && typeof data.phone === 'string'
        ? data.phone
        : null;
    } catch {
      return null;
    }
  };

  window.Challenge = { verify, normalise, revealPhone };

  const form = document.getElementById('flag-form');
  if (!form) return;

  const input = document.getElementById('flag-input');
  const msg = document.getElementById('flag-msg');
  const reveal = document.getElementById('phone-reveal');
  const link = document.getElementById('phone-link');
  const copy = document.getElementById('phone-copy');

  if (!input || !msg || !reveal || !link || !copy) return;

  const setMsg = (text, kind) => {
    msg.textContent = text;
    msg.className = 'flag-msg' + (kind ? ' is-' + kind : '');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!input.value.trim()) {
      setMsg('Enter the flag first.', 'error');
      return;
    }

    setMsg('Checking...', '');

    const number = await revealPhone(input.value);

    if (!number) {
      setMsg('Incorrect flag, or the verification server is unavailable. Please try again.', 'error');
      return;
    }

    link.textContent = number;
    link.href = 'tel:' + number.replace(/[^\d+]/g, '');
    copy.dataset.copy = number;
    reveal.hidden = false;
    form.hidden = true;

    setMsg('Flag accepted. Here is my number.', 'ok');
  });
})();
