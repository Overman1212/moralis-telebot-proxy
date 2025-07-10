export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const body = req.body;
  const tx = body?.txs?.[0];
  const confirmed = body?.confirmed === true;
  const erc20Transfers = body?.erc20Transfers || [];

  try {
    if (!confirmed || !tx || tx.receiptStatus !== "1") {
      return res.status(200).json({ message: "Not confirmed or failed tx" });
    }

    const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";

    // ✅ Find USDT transfer (any direction)
    const usdtTx = erc20Transfers.find(t =>
      t.contract?.toLowerCase() === USDT_CONTRACT.toLowerCase()
    );

    if (!usdtTx) {
      return res.status(200).json({ message: "No USDT transfer found" });
    }

    const amount = usdtTx.valueWithDecimals || (
      Number(usdtTx.value) / 10 ** (Number(usdtTx.tokenDecimals) || 18)
    ).toString();

    const payload = {
      fromAddress: usdtTx.from,
      toAddress: usdtTx.to,
      hash: usdtTx.transactionHash || tx.hash,
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

    const result = await forward.text();

    return res.status(200).json({
      success: true,
      forwarded: payload,
      response: result,
    });

  } catch (err) {
    console.error("Error forwarding USDT transfer:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
