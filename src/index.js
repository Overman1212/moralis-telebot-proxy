export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const data = await request.json();
      console.log("Received:", data);
      return new Response("✅ Webhook received", { status: 200 });
    }

    return new Response("❌ Method Not Allowed", { status: 405 });
  }
};
