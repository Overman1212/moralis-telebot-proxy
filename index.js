export default {
  async fetch(request) {
    // Only allow POST requests from Moralis
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad Request: Invalid JSON", { status: 400 });
    }

    // Respond 200 OK to Moralis immediately
    const moralisResponse = new Response("OK", { status: 200 });

    // Your TelebotCreator webhook URL (from your message)
    const telebotWebhookUrl = "https://api.telebotcreator.com/new-webhook?data=gAAAAABobt0Uo6T0vfz2ST_WswyzKUni3jVN675G_eq4DP2sbuM8zL_2Gln3BlL5Njnb5jvMuj46GhU4DkorPra1FiHvoGsAJHB--RU6irmP-rhb1DRBlnkJBL8_yS96ZnvP6GW-Zmss7q_kWQONvpslvx5vAdThzGiMacV9jImquCPHjFr0H2VqIGHvCu2lRtXqI3Owl0CWWN-qGuTF1P7j4GVdFU27XA%3D%3D";

    // Forward the Moralis JSON payload to your Telebot webhook
    fetch(telebotWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((err) => {
      // Optional: Log errors somewhere or ignore
      console.error("Error forwarding to Telebot webhook:", err);
    });

    // Return response to Moralis
    return moralisResponse;
  },
};
