export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const body = req.body;
  const tx = body?.txs?.[0];

  try {
    if (!tx || tx.receiptStatus !== "1") {
      return res.status(200).json({ message: "No successful tx to process" });
    }

    const tokenTransfers = body?.erc20Transfers || [];
    const USDT_BEP20_ADDRESS = "0x55d398326f99059ff775485246999027b3197955".toLowerCase();

    // ✅ Filter: Only USDT (BEP20) deposit transfers
    const deposit = tokenTransfers.find(t =>
      t.tokenAddress?.toLowerCase() === USDT_BEP20_ADDRESS &&
      t.fromAddress?.toLowerCase() !== t.toAddress?.toLowerCase() // must be an actual transfer
    );

    if (!deposit) {
      return res.status(200).json({ message: "No USDT deposit found" });
    }

    const decimals = deposit.decimals || 6;
    const amount = (Number(deposit.value) / 10 ** decimals).toString();

    const payload = {
      fromAddress: deposit.fromAddress,
      toAddress: deposit.toAddress,
      hash: tx.hash,
      amount,
    };

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
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
