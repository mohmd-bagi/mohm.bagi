export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;

    let html = await response.text();
    html = html.replaceAll('onsubmit="showSuccessMessage(); this.reset();"', 'onsubmit="showSuccessMessage();"');

    return new Response(html, response);
  }
};
