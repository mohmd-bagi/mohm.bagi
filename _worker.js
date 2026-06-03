export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';

    if (!type.includes('text/html')) {
      return response;
    }

    const url = new URL(request.url);
    const isArabic = url.pathname.startsWith('/ar');
    const topText = isArabic ? '\u0644\u0644\u0623\u0639\u0644\u0649' : 'Top';
    const bottomText = isArabic ? '\u0644\u0644\u0623\u0633\u0641\u0644' : 'Bottom';

    const desktopSide = isArabic ? 'left:var(--float-line-x, calc(100vw - 120px));right:auto;transform:translateX(-50%);' : 'right:44px;left:auto;';
    const mobileSide = isArabic ? 'left:2px;right:auto;' : 'right:2px;left:auto;';

    let html = await response.text();

    html = html.replaceAll(
      'onsubmit="showSuccessMessage(); this.reset();"',
      'onsubmit="showSuccessMessage();"'
    );

    if (!html.includes('scroll-control-buttons')) {
      const buttons = `
<div id="scroll-control-buttons">
  <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">▲ <span>${topText}</span></button>
  <button type="button" onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})">▼ <span>${bottomText}</span></button>
</div>
<style>
#scroll-control-buttons{position:fixed;bottom:126px;${desktopSide}display:flex;flex-direction:column;gap:10px;z-index:99999}
#scroll-control-buttons button{border:0;border-radius:999px;background:#121826;color:#fff;padding:12px 16px;font-weight:900;font-family:inherit;box-shadow:0 12px 28px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;min-width:104px}
#scroll-control-buttons button:hover{transform:translateY(-1px)}
@media(max-width:560px){
  #scroll-control-buttons{position:fixed!important;bottom:112px!important;${mobileSide}display:flex!important;flex-direction:column!important;gap:5px!important;z-index:99999!important}
  #scroll-control-buttons button{width:30px!important;height:30px!important;min-width:30px!important;max-width:30px!important;padding:0!important;border-radius:50%!important;font-size:11px!important;line-height:1!important;gap:0!important;box-shadow:0 6px 14px rgba(0,0,0,.20)!important}
  #scroll-control-buttons button span{display:none!important}
}
</style>
`;
      html = html.replace('</body>', buttons + '</body>');
    }

    return new Response(html, response);
  }
};
