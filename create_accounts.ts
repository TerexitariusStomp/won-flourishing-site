import "dotenv/config";
import { Api, JsonRpc, RpcError } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js";
import fetch from "node-fetch";

// Populate these via environment variables or a non-committed .env file.
const PRIVATE_KEY = process.env.PROTON_CREATOR_PRIVATE_KEY ?? "";
const CREATOR = process.env.PROTON_CREATOR_ACCOUNT ?? "";
const OWNER_KEY = process.env.PROTON_OWNER_PUBKEY ?? "";
const ACTIVE_KEY = process.env.PROTON_ACTIVE_PUBKEY ?? "";
const ENDPOINT = process.env.PROTON_ENDPOINT ?? "https://proton.greymass.com";

// Default region vault account names (update as needed).
const ACCOUNTS = [
  "wonlatamv1",
  "wonafrica1",
  "wonapacv1",
  "wonmenav1",
  "woneurov1",
  "wonnav11"
];

if (!PRIVATE_KEY || !CREATOR || !OWNER_KEY || !ACTIVE_KEY) {
  throw new Error(
    "Missing required environment variables (PROTON_CREATOR_PRIVATE_KEY, PROTON_CREATOR_ACCOUNT, PROTON_OWNER_PUBKEY, PROTON_ACTIVE_PUBKEY)."
  );
}

async function main() {
  const signatureProvider = new JsSignatureProvider([PRIVATE_KEY]);
  const rpc = new JsonRpc(ENDPOINT, { fetch });
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  const creatorInfo = await rpc.get_account(CREATOR);
  console.log("Creator account info:", JSON.stringify(creatorInfo, null, 2));

  const balances = await rpc.get_table_rows({
    json: true,
    code: "eosio.token",
    scope: CREATOR,
    table: "accounts",
    limit: 100
  });
  console.log("Balances:", JSON.stringify(balances, null, 2));

  for (const account of ACCOUNTS) {
    try {
      const actions = [
        {
          account: "eosio",
          name: "newaccount",
          authorization: [
            {
              actor: CREATOR,
              permission: "active"
            }
          ],
          data: {
            creator: CREATOR,
            name: account,
            owner: {
              threshold: 1,
              keys: [{ key: OWNER_KEY, weight: 1 }],
              accounts: [],
              waits: []
            },
            active: {
              threshold: 1,
              keys: [{ key: ACTIVE_KEY, weight: 1 }],
              accounts: [],
              waits: []
            }
          }
        },
        {
          account: "eosio",
          name: "buyrambytes",
          authorization: [
            {
              actor: CREATOR,
              permission: "active"
            }
          ],
          data: {
            payer: CREATOR,
            receiver: account,
            bytes: 8192
          }
        }
      ];

      const result = await api.transact(
        { actions },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
      console.log(`Successfully created and funded ${account}:`, result.processed.id);
    } catch (error: any) {
      console.error(`Failed to process ${account}:`, error?.message ?? error);
      if (error instanceof RpcError) {
        console.error("RPC Error:", error);
      }
    }
  }
}

main().catch(console.error);
