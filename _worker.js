export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';

    if (!type.includes('text/html')) {
      return response;
    }

    const url = new URL(request.url);
    const isArabic = url.pathname.startsWith('/ar');
    const topText = isArabic ? 'للأعلى' : 'Top';
    const bottomText = isArabic ? 'للأسفل' : 'Bottom';
    const side = isArabic ? 'left:16px;right:auto;' : 'right:16px;left:auto;';

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
#scroll-control-buttons{position:fixed;bottom:96px;${side}display:flex;flex-direction:column;gap:8px;z-index:99999}
#scroll-control-buttons button{border:0;border-radius:999px;background:#121826;color:#fff;padding:10px 14px;font-weight:900;font-family:inherit;box-shadow:0 10px 25px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;gap:7px}
#scroll-control-buttons button:hover{transform:translateY(-1px)}
@media(max-width:560px){#scroll-control-buttons{bottom:84px;${side}}#scroll-control-buttons button{padding:9px 12px;font-size:13px}}
</style>
`;
      html = html.replace('</body>', buttons + '</body>');
    }

    return new Response(html, response);
  }
};
