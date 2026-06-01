const rpcUrl = "https://soroban-testnet.stellar.org";
const contractId = "CAXKDACN2ZVY7KEBYNM7UNOH7YF3P4HGO737PPJPJ2EQQZJGKPJSMVK3";

async function run() {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getLedgerEntries",
      params: [
        [{
          "contract": {
            "contractId": contractId
          }
        }]
      ]
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
