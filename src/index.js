export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        console.log("✅ Received POST body:", data);

        return new Response("✅ Webhook received", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      } catch (e) {
        console.error("❌ Invalid JSON:", e);
        return new Response("❌ Bad Request", {
          status: 400,
          headers: { "Content-Type": "text/plain" }
        });
      }
    }

    return new Response("❌ Method Not Allowed", {
      status: 405,
      headers: {
        "Allow": "POST",
        "Content-Type": "text/plain"
      }
    });
  }
};
