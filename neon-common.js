/* Cancer Hub 공통 네온 레이어: 상단 흐르는 선, 허브 복귀 버튼, 어두운 페이지 감지 */
(function(){
  function lum(c){
    var m = (c||'').match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/);
    if(!m) return null;
    if(m[4] !== undefined && parseFloat(m[4]) === 0) return null;
    return (0.2126*m[1] + 0.7152*m[2] + 0.0722*m[3]) / 255;
  }
  function init(){
    var inFrame = false; try { inFrame = window.self !== window.top; } catch(e){ inFrame = true; }
    var l = lum(getComputedStyle(document.body).backgroundColor);
    if(l === null) l = lum(getComputedStyle(document.documentElement).backgroundColor);
    if(l !== null && l < 0.35) document.documentElement.classList.add('nc-dark');
    var line = document.createElement('div'); line.className = 'nc-topline'; document.body.appendChild(line);
    if(!inFrame){
      var a = document.createElement('a'); a.className = 'nc-home'; a.href = 'index.html'; a.textContent = '← Cancer Hub';
      document.body.appendChild(a);
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
