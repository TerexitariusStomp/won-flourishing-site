import { LiFiWidget, type WidgetConfig } from "@lifi/widget";
import { useMemo } from "react";
import { Link } from "wouter";
import { chainByKey, supportedChains } from "@/lib/layerzeroChains";
import "./bridge.css";

export default function Buy() {
  const wonSymbol = chainByKey.ethereum.tokenSymbol || "WON";
  const toTokens = useMemo(
    () =>
      supportedChains.map((chain) => ({
        address: chain.oftAddress,
        chainId: chain.chainId
      })),
    []
  );

  const config: WidgetConfig = {
    integrator: "WON",
    variant: "wide",
    appearance: "light",
    toChain: chainByKey.ethereum.chainId,
    toToken: chainByKey.ethereum.oftAddress,
    chains: { allow: supportedChains.map((c) => c.chainId) },
    tokens: {
      include: toTokens.map((token) => ({
        address: token.address,
        chainId: token.chainId,
        decimals: 18,
        symbol: wonSymbol,
        name: wonSymbol,
        priceUSD: "0"
      }))
    }
  };

  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaMTBq3xaZqxW63ynsoA9mCbYWKuRx9S7SXnE4uwVMB2v"
                alt="We Won Logo"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl">We Won</span>
            </div>
            <p className="bridge-eyebrow">Acquire WON</p>
            <h1 className="bridge-title">Buy WON across chains</h1>
            <p className="bridge-subhead">
              Use LiFi to bridge and swap into WON on Ethereum, L2s, and alt L1s with one flow.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              ← Back home
            </Link>
            <Link href="/bridge" className="bridge-nav-link">
              Bridge
            </Link>
          </div>
        </div>

        <div className="bridge-card" style={{ padding: "0", overflow: "hidden" }}>
          <LiFiWidget {...config} />
        </div>
      </div>
    </div>
  );
}
