function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      autoDisplay: false
    }, 'google_translate_element');
    setTimeout(triggerTranslation, 1000);
  }
  
  function triggerTranslation() {
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return setTimeout(triggerTranslation, 500);
  
    const saved = localStorage.getItem('selectedLanguage');
    combo.value = saved || (['es','en','fr','pt','de'].includes(navigator.language.slice(0,2))
      ? navigator.language.slice(0,2)
      : 'en');
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('custom_translate');
    const saved = localStorage.getItem('selectedLanguage');
    if (saved) select.value = saved;
  
    select.addEventListener('change', function () {
      localStorage.setItem('selectedLanguage', this.value);
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = this.value;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
  