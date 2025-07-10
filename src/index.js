export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const body = await request.json(); // Optional: parse incoming JSON
      console.log('Received POST data:', body);

      // Return 200 OK immediately
      return new Response('✅ Webhook received successfully.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    return new Response('❌ Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }
};
