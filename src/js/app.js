// import $ from 'jquery'; // ← jQuery使いたい場合は
// $('body').append('jQueryテスト');
import onLoadAddClass from '@src/js/_modules/onload-addclass.js';

import '@src/stylus/app.styl';

// onload-addclass.js settings
// ===============================================================
const loadclassSelector = {
  //classname: selectors
  loadClassNameForBody: document.querySelectorAll('body'),
  loadClassNameForHeader: document.querySelectorAll('header') //etc...
};
onLoadAddClass(loadclassSelector);