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
    const side = isArabic ? 'left:34px;right:auto;' : 'right:34px;left:auto;';

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
#scroll-control-buttons{position:fixed;bottom:132px;${side}display:flex;flex-direction:column;gap:10px;z-index:99999}
#scroll-control-buttons button{border:0;border-radius:999px;background:#121826;color:#fff;padding:13px 18px;font-weight:900;font-family:inherit;box-shadow:0 12px 28px rgba(0,0,0,.28);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:16px;min-width:112px}
#scroll-control-buttons button:hover{transform:translateY(-1px)}
@media(max-width:560px){#scroll-control-buttons{bottom:84px;${side}}#scroll-control-buttons button{border:0;border-radius:999px;background:#121826;color:#fff;padding:13px 18px;font-weight:900;font-family:inherit;box-shadow:0 12px 28px rgba(0,0,0,.28);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:16px;min-width:112px}}
</style>
`;
      html = html.replace('</body>', buttons + '</body>');
    }

    return new Response(html, response);
  }
};
