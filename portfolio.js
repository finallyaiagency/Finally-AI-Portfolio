const dialog = document.querySelector('#video-dialog');
const video = dialog.querySelector('video');
const videoEmbed = dialog.querySelector('.video-embed');
const title = document.querySelector('#video-title');
const error = document.querySelector('#video-error');
let opener;

const keepMuted = () => {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
};

keepMuted();
video.addEventListener('volumechange', keepMuted);

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    const name = button.dataset.project;
    title.textContent = name;
    error.hidden = true;
    const source = button.dataset.video || `${encodeURIComponent(name)}.mp4`;
    const driveMatch = source.match(/drive\\.google\\.com\\/uc\\?[^#]*\\bid=([^&]+)/);
    const preview = button.querySelector('img');
    if (driveMatch) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.hidden = true;
      videoEmbed.hidden = false;
      videoEmbed.src = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      document.querySelector('#video-link').href = `https://drive.google.com/file/d/${driveMatch[1]}/view`;
    } else {
      videoEmbed.hidden = true;
      videoEmbed.removeAttribute('src');
      video.hidden = false;
      video.src = source;
      if (preview) video.poster = preview.currentSrc || preview.src;
      else video.removeAttribute('poster');
      video.setAttribute('aria-label', `${name} screen capture`);
      document.querySelector('#video-link').href = video.src;
    }
    keepMuted();
    dialog.showModal();
    if (!driveMatch) video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
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
  video.hidden = false;
  videoEmbed.removeAttribute('src');
  videoEmbed.hidden = true;
  opener?.focus();
});
video.addEventListener('error', () => { if (dialog.open && video.hasAttribute('src')) error.hidden = false; });
