const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const board = $('.nav-board');
const boardToggle = $('.board-toggle');
const boardBackdrop = board?.querySelector('[data-close-board]');
const boardClose = $('.board-close', board);
const boardPanel = $('.board-panel', board);
const boardLinks = $$('.board-card', board);
const firstBoardLink = boardLinks[0];
let boardScrollLockY = 0;

const lockPageScroll = () => {
  boardScrollLockY = window.scrollY || document.documentElement.scrollTop;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${boardScrollLockY}px`;
  document.body.style.width = '100%';
};

const unlockPageScroll = () => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, boardScrollLockY);
};

const setBoardState = (open) => {
  if (!board || !boardToggle) return;
  board.classList.toggle('open', open);
  board.setAttribute('aria-hidden', open ? 'false' : 'true');
  boardToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.classList.toggle('board-open', open);
  if (open) {
    lockPageScroll();
    board.scrollTop = 0;
    if (boardPanel) {
      boardPanel.scrollTop = 0;
    }
    requestAnimationFrame(() => firstBoardLink?.focus());
  } else {
    unlockPageScroll();
    boardToggle?.focus({ preventScroll: true });
  }
};

if (board && boardToggle) {
  boardToggle.addEventListener('click', () => {
    const isOpen = board.classList.contains('open');
    setBoardState(!isOpen);
  });

  boardBackdrop?.addEventListener('click', () => setBoardState(false));
  boardClose?.addEventListener('click', () => setBoardState(false));
  boardLinks.forEach((link) => link.addEventListener('click', () => setTimeout(() => setBoardState(false), 120)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && board.classList.contains('open')) {
      setBoardState(false);
    }
  });
}

const revealEls = $$('.reveal');
const onScroll = () => {
  const threshold = window.innerHeight * 0.9;
  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < threshold) {
      el.classList.add('visible');
    }
  });
};

document.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

$$('.btn').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.inset = '0';
    ripple.style.borderRadius = 'inherit';
    ripple.style.background = `radial-gradient(220px 220px at ${event.offsetX}px ${event.offsetY}px, rgba(255,255,255,.25), transparent 40%)`;
    ripple.style.pointerEvents = 'none';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 350);
  });
});

const donateForm = $('.donate-form');
if (donateForm) {
  const amountInput = $('#donate-amount', donateForm);
  const chips = $$('.chip', donateForm);
  const note = $('.donate-note', donateForm);

  const activateChip = (chip) => {
    chips.forEach((c) => c.classList.toggle('active', c === chip));
    const value = chip.dataset.amount;
    if (amountInput) {
      amountInput.value = value || '';
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => activateChip(chip));
  });

  amountInput?.addEventListener('input', () => {
    if (amountInput.value) {
      chips.forEach((chip) => chip.classList.remove('active'));
    }
  });

  donateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const activeChip = chips.find((chip) => chip.classList.contains('active'));
    const amount = amountInput?.value || activeChip?.dataset.amount;
    if (!amount) {
      if (note) {
        note.textContent = 'Select or enter an amount to continue.';
      }
      return;
    }
    if (note) {
      note.textContent = `Thanks! We will reach out with next steps to complete your $${amount} gift.`;
    }
  });
}
