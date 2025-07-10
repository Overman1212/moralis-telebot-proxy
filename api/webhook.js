export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const body = req.body;
  const tx = body?.txs?.[0];

  try {
    if (!tx || tx.receiptStatus !== "1") {
      return res.status(200).json({ message: "No successful tx to forward" });
    }

    let payload;

    if (body?.erc20Transfers?.length > 0) {
      const tokenTx = body.erc20Transfers[0];
      const decimals = tokenTx.decimals || 6; // USDT usually has 6 decimals

      // Convert from raw value to actual decimal format
      const amount = (Number(tokenTx.value) / 10 ** decimals).toString();

      payload = {
        fromAddress: tokenTx.fromAddress,
        toAddress: tokenTx.toAddress,
        hash: tx.hash,
        amount,
      };
    } else {
      // Native transfer fallback
      const amount = (Number(tx.value) / 1e18).toString();

      payload = {
        fromAddress: tx.fromAddress,
        toAddress: tx.toAddress,
        hash: tx.hash,
        amount,
      };
    }

    const forward = await fetch(
      "https://api.telebotcreator.com/new-webhook?data=gAAAAABob2_layjtJ56eqWuJ2RvojvRyzrFjf8iVHORWxLLsIckjUpHz3FjBwr_3ol-gHWtV7fOnUu1KcML_-mmZ-jTPXIS-N8nQzfDDljwCCPLYjzwa_6Fmt0etzcdwxRakg3yUsxkkIb3Ph6U3UFv7hg9wzJPl91HCtLtJYFM2s6N6fX5PUcmn6y_CHGW2gG-zB19rhc_ehy6Nlz0g80pOQYcxtqGK7w%3D%3D",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await forward.json();

    return res.status(200).json({
      success: true,
      forwarded: payload,
      response: result,
    });
  } catch (error) {
    console.error("Forwarding failed:", error);
    return res.status(500).json({ error: "Error processing webhook" });
  }
}
