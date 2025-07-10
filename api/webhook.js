export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const body = req.body;

  try {
    // Send raw data to your endpoint
    const forward = await fetch(
      "https://api.telebotcreator.com/new-webhook?data=gAAAAABob2_layjtJ56eqWuJ2RvojvRyzrFjf8iVHORWxLLsIckjUpHz3FjBwr_3ol-gHWtV7fOnUu1KcML_-mmZ-jTPXIS-N8nQzfDDljwCCPLYjzwa_6Fmt0etzcdwxRakg3yUsxkkIb3Ph6U3UFv7hg9wzJPl91HCtLtJYFM2s6N6fX5PUcmn6y_CHGW2gG-zB19rhc_ehy6Nlz0g80pOQYcxtqGK7w%3D%3D",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // 👈 send everything
      }
    );

    const result = await forward.text(); // .json() will fail if it's not JSON

    return res.status(200).json({
      success: true,
      message: "Raw data forwarded for debugging",
      result,
    });

  } catch (error) {
    console.error("Error forwarding raw data:", error);
    return res.status(500).json({ error: "Failed to send debug payload" });
  }
}
