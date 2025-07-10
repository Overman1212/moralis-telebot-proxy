export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        console.log("✅ Received POST data:", JSON.stringify(data));

        return new Response("✅ Webhook received successfully", {
          status: 200,
          headers: {
            "Content-Type": "text/plain"
          }
        });
      } catch (err) {
        console.error("❌ Failed to parse JSON", err);
        return new Response("❌ Invalid JSON", {
          status: 400,
          headers: {
            "Content-Type": "text/plain"
          }
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
