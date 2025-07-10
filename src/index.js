export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const body = await request.json();
      return new Response("✅ Webhook received", { status: 200 });
    }

    return new Response("❌ Method Not Allowed", { status: 405 });
  }
};
