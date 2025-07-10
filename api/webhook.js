export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const body = req.body;
  const tx = body?.txs?.[0];
  const erc20Transfers = body?.erc20Transfers || [];

  try {
    if (!tx || tx.receiptStatus !== "1") {
      return res.status(200).json({ message: "No successful transaction" });
    }

    const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";

    // Filter only USDT deposit transfer
    const deposit = erc20Transfers.find(t =>
      t.contract?.toLowerCase() === USDT_CONTRACT.toLowerCase() &&
      t.to?.toLowerCase() === tx.toAddress?.toLowerCase() // deposit TO watched wallet
    );

    if (!deposit) {
      return res.status(200).json({ message: "No USDT deposit detected" });
    }

    const amount = deposit.valueWithDecimals || (
      Number(deposit.value) / 10 ** (Number(deposit.tokenDecimals) || 18)
    ).toString();

    const payload = {
      fromAddress: deposit.from,
      toAddress: deposit.to,
      hash: deposit.transactionHash || tx.hash,
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

    const result = await forward.text(); // in case it's not JSON

    return res.status(200).json({
      success: true,
      forwarded: payload,
      response: result,
    });

  } catch (err) {
    console.error("Error forwarding USDT deposit:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
