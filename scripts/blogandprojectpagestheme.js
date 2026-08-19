const iconMap = {
  'light-button': { 
    light: '../../images/icons/sun_icon.png',
    dark: '../../images/icons/darkmode/sun_icon.png' 
    },
  'dark-button': { 
    light: '../../images/icons/moon_icon.png',
    dark: '../../images/icons/darkmode/moon_icon.png' 
    },
  'system-button': { 
    light: './images/icons/computer_icon.png', 
    dark: './images/icons/darkmode/computer_icon.png' 
    },
};

const socialIconMap = {
  'github': {
    light: './images/icons/github_icon.png',
    dark: './images/icons/darkmode/github_icon.png' 
    },
  'email':  {
    light: '../../images/icons/email_icon.png',
    dark: '../../images/icons/darkmode/email_icon.png'
  },
};

function applyTheme(theme) {
  localStorage.setItem('theme', theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Swap stylesheet
  document.getElementById('mainstyle').href = isDark ? '../../darkmodestyle.css' : '../../lightmodestyle.css';

  // Swap theme switcher icons
  document.querySelectorAll('.theme-button').forEach(btn => {
    const icons = iconMap[btn.id];
    btn.querySelector('.theme-icon').src = isDark ? icons.dark : icons.light;
  });

  // Swap social icons
  document.querySelectorAll('.socialicon[data-icon]').forEach(img => {
    const icons = socialIconMap[img.dataset.icon];
    if (icons) img.src = isDark ? icons.dark : icons.light;
  });
}
document.querySelectorAll('.theme-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyTheme(btn.id.replace('-button', ''));
  });
});

const savedTheme = localStorage.getItem('theme') || 'system';
document.getElementById(`${savedTheme}-button`).classList.add('active');
applyTheme(savedTheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('theme') || 'system') === 'system') applyTheme('system');
});
