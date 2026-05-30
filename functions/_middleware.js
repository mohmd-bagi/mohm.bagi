export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  let body = await response.text();

  body = body.replaceAll(
    'onsubmit="showSuccessMessage(); this.reset();"',
    'onsubmit="showSuccessMessage();"'
  );

  if (!body.includes('id="scroll-control-buttons"')) {
    const url = new URL(context.request.url);
    const isArabic = url.pathname.startsWith('/ar');

    const topText = isArabic ? 'للأعلى' : 'Top';
    const bottomText = isArabic ? 'للأسفل' : 'Bottom';
    const sideStyle = isArabic ? 'left:20px;right:auto;' : 'right:20px;left:auto;';

    const buttons = `
<div id="scroll-control-buttons" class="scroll-control-buttons">
  <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">▲ <span>${topText}</span></button>
  <button type="button" onclick="window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})">▼ <span>${bottomText}</span></button>
</div>
<style>
.scroll-control-buttons{position:fixed;bottom:96px;${sideStyle}display:flex;flex-direction:column;gap:8px;z-index:9998}
.scroll-control-buttons button{border:0;border-radius:999px;background:#121826;color:#fff;padding:10px 14px;font-weight:900;font-family:inherit;box-shadow:0 10px 25px rgba(0,0,0,.22);cursor:pointer;display:flex;align-items:center;gap:7px}
.scroll-control-buttons button:hover{transform:translateY(-1px)}
@media(max-width:560px){.scroll-control-buttons{bottom:84px;${sideStyle}.scroll-control-buttons button{padding:9px 12px;font-size:13px}}
</style>
`;

    body = body.replace('</body>', buttons + '</body>');
  }

  return new Response(body, response);
}
