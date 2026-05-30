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

  return new Response(body, response);
}
