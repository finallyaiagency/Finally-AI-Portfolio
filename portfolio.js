const dialog = document.querySelector('#video-dialog');
const video = dialog.querySelector('video');
const title = document.querySelector('#video-title');
const error = document.querySelector('#video-error');
let opener;

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    const name = button.dataset.project;
    title.textContent = name;
    error.hidden = true;
    video.src = button.dataset.video || `${encodeURIComponent(name)}.mp4`;
    video.poster = button.querySelector('img').src;
    video.setAttribute('aria-label', `${name} screen capture`);
    document.querySelector('#video-link').href = video.src;
    dialog.showModal();
    video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  });
});

dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  opener?.focus();
});
video.addEventListener('error', () => { if (dialog.open && video.hasAttribute('src')) error.hidden = false; });
