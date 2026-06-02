export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    const type = response.headers.get(content-type) || 

    if (!type.includes(text/html)) {
      return response
    }

    const url = new URL(request.url)
    const isArabic = url.pathname.startsWith(/ar)
    const topText = isArabic  \u0644\u0644\u0623\u0639\u0644\u0649 : Top
    const bottomText = isArabic  \u0644\u0644\u0623\u0633\u0641\u0644 : Bottom

    const desktopSide = isArabic  left:44pxright:auto : right:44pxleft:auto
    const mobileSide = isArabic  left:6pxright:auto : right:6pxleft:auto

    let html = await response.text()

    html = html.replaceAll(
      onsubmit="showSuccessMessage() this.reset()",
      onsubmit="showSuccessMessage()"
    )

    if (!html.includes(scroll-control-buttons)) {
      const buttons = 
<div id="scroll-control-buttons">
  <button type="button" onclick="window.scrollTo({top:0,behavior:smooth})"> <span></span></button>
  <button type="button" onclick="window.scrollTo({top:document.body.scrollHeight,behavior:smooth})"> <span></span></button>
</div>
<style>
#scroll-control-buttons{position:fixedbottom:126pxdisplay:flexflex-direction:columngap:10pxz-index:99999}
#scroll-control-buttons button{border:0border-radius:999pxbackground:#121826color:#fffpadding:12px 16pxfont-weight:900font-family:inheritbox-shadow:0 12px 28px rgba(0,0,0,.25)cursor:pointerdisplay:flexalign-items:centerjustify-content:centergap:8pxfont-size:15pxmin-width:104px}
#scroll-control-buttons button:hover{transform:translateY(-1px)}
@media(max-width:560px){
  #scroll-control-buttons{bottom:112pxgap:6px}
  #scroll-control-buttons button{width:36pxheight:36pxmin-width:36pxpadding:0border-radius:50%font-size:13pxgap:0box-shadow:0 8px 18px rgba(0,0,0,.22)}
  #scroll-control-buttons button span{display:none}
}
</style>

      html = html.replace(</body>, buttons + </body>)
    }

    return new Response(html, response)
  }
}
