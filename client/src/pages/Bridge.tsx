import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ConnectButton,
  RainbowKitProvider,
  getDefaultConfig,
  useConnectModal
} from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import {
  WagmiProvider,
  http,
  useAccount,
  useConfig,
  useSwitchChain,
  useWriteContract
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  Options,
  addressToBytes32
} from "@layerzerolabs/lz-v2-utilities";
import {
  bytesToHex,
  createPublicClient,
  formatUnits,
  http as viemHttp,
  isAddress,
  parseUnits,
  type Chain
} from "viem";
import {
  chainByKey,
  supportedChains,
  type ChainKey
} from "@/lib/layerzeroChains";
import { erc20Abi, oftAbi } from "@/lib/layerzeroAbi";
import "@rainbow-me/rainbowkit/styles.css";
import "./bridge.css";

type MessagingFee = { nativeFee: bigint; lzTokenFee: bigint };

const walletConnectProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
  "403f10c4cf2104d36c5bbb71b261d44a";

const wagmiConfig = getDefaultConfig({
  appName: "Won LayerZero Bridge",
  projectId: walletConnectProjectId,
  chains: supportedChains.map((c) => c.viemChain) as [Chain, ...Chain[]],
  transports: Object.fromEntries(
    supportedChains.map((c) => [c.chainId, http(c.rpcUrls[0])])
  ) as Record<number, ReturnType<typeof http>>,
  ssr: false
});

const defaultGasLimit = 200_000;

function BridgeForm() {
  const { address, chainId, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const wagmi = useConfig();

  const [fromKey, setFromKey] = useState<ChainKey>("ethereum");
  const [toKey, setToKey] = useState<ChainKey>("arbitrum");
  const [amount, setAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [gasLimit, setGasLimit] = useState<number>(defaultGasLimit);
  const [destination, setDestination] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);

  const sourceChain = chainByKey[fromKey];
  const chainById = useMemo(
    () => Object.fromEntries(supportedChains.map((c) => [c.chainId, c])),
    []
  );
  const activeChain = chainId ? chainById[chainId] : null;
  const destinationChain = chainByKey[toKey];
  const tokenSymbol = sourceChain.tokenSymbol || "WON";

  useEffect(() => {
    if (fromKey === toKey) {
      const fallback = supportedChains.find((c) => c.key !== fromKey);
      if (fallback) setToKey(fallback.key);
    }
  }, [fromKey, toKey]);

  useEffect(() => {
    if (address && !destination) setDestination(address);
  }, [address, destination]);

  const decimalsQuery = useQuery({
    queryKey: ["lz-decimals", sourceChain.key],
    queryFn: async () => {
      const client = createPublicClient({
        chain: sourceChain.viemChain,
        transport: viemHttp(sourceChain.rpcUrls[0])
      });
      return client.readContract({
        address: sourceChain.oftAddress,
        abi: erc20Abi,
        functionName: "decimals"
      }) as Promise<number>;
    }
  });

  const balanceQuery = useQuery({
    queryKey: ["lz-balance", sourceChain.key, address],
    enabled: Boolean(address),
    queryFn: async () => {
      if (!address) return 0n;
      const client = createPublicClient({
        chain: sourceChain.viemChain,
        transport: viemHttp(sourceChain.rpcUrls[0])
      });
      return client.readContract({
        address: sourceChain.oftAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address]
      }) as Promise<bigint>;
    }
  });

  const decimals = decimalsQuery.data ?? 18;

  const parsedAmount = useMemo(() => {
    if (!amount) return null;
    try {
      return parseUnits(amount, decimals);
    } catch {
      return null;
    }
  }, [amount, decimals]);

  const targetAddress = useMemo(() => {
    if (destination && isAddress(destination)) return destination;
    if (address && isAddress(address)) return address;
    return null;
  }, [destination, address]);

  const minAmountLD = useMemo(() => {
    if (!parsedAmount) return null;
    const slippageBps = Math.min(Math.max(slippage, 0), 99.99);
    const bps = BigInt(Math.round(slippageBps * 100));
    return (parsedAmount * (10_000n - bps)) / 10_000n;
  }, [parsedAmount, slippage]);

  const extraOptions = useMemo(
    () =>
      Options.newOptions()
        .addExecutorLzReceiveOption(BigInt(gasLimit))
        .toHex() as `0x${string}`,
    [gasLimit]
  );

  const sendParam = useMemo(() => {
    if (!parsedAmount || !minAmountLD || !destinationChain || !targetAddress)
      return null;

    return {
      dstEid: destinationChain.lzEid,
      to: bytesToHex(addressToBytes32(targetAddress)),
      amountLD: parsedAmount,
      minAmountLD,
      extraOptions,
      composeMsg: "0x" as `0x${string}`,
      oftCmd: "0x" as `0x${string}`
    };
  }, [destinationChain, minAmountLD, parsedAmount, targetAddress, extraOptions]);

  const quoteQuery = useQuery({
    queryKey: [
      "lz-quote",
      fromKey,
      toKey,
      amount,
      slippage,
      gasLimit,
      destination
    ],
    enabled: Boolean(sendParam),
    refetchInterval: 12_000,
    queryFn: async () => {
      if (!sendParam) throw new Error("Missing params");
      const client = createPublicClient({
        chain: sourceChain.viemChain,
        transport: viemHttp(sourceChain.rpcUrls[0])
      });
      return client.readContract({
        address: sourceChain.oftAddress,
        abi: oftAbi,
        functionName: "quoteSend",
        args: [sendParam, false]
      }) as Promise<MessagingFee>;
    }
  });

  const canBridge =
    Boolean(sendParam) &&
    Boolean(parsedAmount && parsedAmount > 0n) &&
    Boolean(targetAddress) &&
    !quoteQuery.isFetching &&
    !decimalsQuery.isFetching;

  const handleBridge = async () => {
    try {
      setError(null);
      setStatus(null);
      setLastTx(null);

      if (!isConnected) {
        openConnectModal?.();
        return;
      }

      if (!sourceChain || !sendParam || !quoteQuery.data || !targetAddress) {
        throw new Error("Fill out the form to bridge.");
      }

      if (chainId !== sourceChain.chainId) {
        setStatus(`Switching to ${sourceChain.displayName}...`);
        await switchChainAsync({ chainId: sourceChain.chainId });
      }

      const publicClient = createPublicClient({
        chain: sourceChain.viemChain,
        transport: viemHttp(sourceChain.rpcUrls[0])
      });

      setStatus("Checking allowance...");
      const allowance = await publicClient.readContract({
        address: sourceChain.oftAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, sourceChain.oftAddress]
      });

      if (allowance < sendParam.amountLD) {
        setStatus("Approving token spend...");
        const approveHash = await writeContractAsync({
          address: sourceChain.oftAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [sourceChain.oftAddress, sendParam.amountLD],
          chainId: sourceChain.chainId
        });

        await waitForTransactionReceipt(wagmi, { hash: approveHash });
      }

      setStatus("Sending over LayerZero...");
      const txHash = await writeContractAsync({
        address: sourceChain.oftAddress,
        abi: oftAbi,
        functionName: "send",
        args: [
          sendParam,
          {
            nativeFee: quoteQuery.data.nativeFee,
            lzTokenFee: quoteQuery.data.lzTokenFee
          },
          address!
        ],
        value: quoteQuery.data.nativeFee,
        chainId: sourceChain.chainId
      });

      await waitForTransactionReceipt(wagmi, { hash: txHash });
      setLastTx(txHash);
      setStatus("Bridge submitted!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStatus(null);
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
            <p className="bridge-eyebrow">LayerZero OFT Bridge</p>
            <h1 className="bridge-title">Move liquidity anywhere.</h1>
            <p className="bridge-subhead">
              Bridge the OFT across Ethereum, L2s, and alternative L1s with
              LayerZero v2.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <div className="flex items-center gap-2">
              <ConnectButton />
              {activeChain && (
                <button
                  type="button"
                  className="bridge-nav-link"
                  onClick={async () => {
                    if (!(window as any).ethereum) return;
                    try {
                      await (window as any).ethereum.request({
                        method: "wallet_watchAsset",
                        params: {
                          type: "ERC20",
                          options: {
                            address: activeChain.oftAddress,
                            symbol: activeChain.tokenSymbol || "WON",
                            decimals: 18
                          }
                        }
                      });
                    } catch (err) {
                      console.error("wallet_watchAsset failed", err);
                    }
                  }}
                >
                  Add WON to wallet
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bridge-card">
          <div className="bridge-grid">
            <div>
              <label className="bridge-label">From chain</label>
              <select
                className="bridge-select"
                value={fromKey}
                onChange={(e) => setFromKey(e.target.value as ChainKey)}
              >
                {supportedChains.map((chain) => (
                  <option key={chain.key} value={chain.key}>
                    {chain.displayName}
                  </option>
                ))}
              </select>
              <p className="bridge-muted">
                Balance:{" "}
                {balanceQuery.data !== undefined
                  ? formatUnits(balanceQuery.data, decimals)
                  : address
                  ? "..."
                  : "Connect wallet"}{" "}
                {tokenSymbol}
              </p>
            </div>
            <div>
              <label className="bridge-label">To chain</label>
              <select
                className="bridge-select"
                value={toKey}
                onChange={(e) => setToKey(e.target.value as ChainKey)}
              >
                {supportedChains
                  .filter((c) => c.key !== fromKey)
                  .map((chain) => (
                    <option key={chain.key} value={chain.key}>
                      {chain.displayName}
                    </option>
                  ))}
              </select>
              <p className="bridge-muted">
                LayerZero EID: {destinationChain.lzEid}
              </p>
            </div>
          </div>

          <div className="bridge-input-row">
            <div className="bridge-field">
              <label className="bridge-label">Amount</label>
              <div className="bridge-input-shell">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.0"
                  className="bridge-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  type="button"
                  className="bridge-ghost"
                  onClick={() => {
                    if (balanceQuery.data !== undefined) {
                      setAmount(formatUnits(balanceQuery.data, decimals));
                    }
                  }}
                >
                  Max
                </button>
              </div>
            </div>
            <div className="bridge-field">
              <label className="bridge-label">Slippage (%)</label>
              <input
                type="number"
                min="0"
                max="99"
                step="0.1"
                className="bridge-input"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="bridge-input-row">
            <div className="bridge-field">
              <label className="bridge-label">Destination address</label>
              <input
                type="text"
                className="bridge-input"
                value={destination}
                placeholder="0x..."
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="bridge-field">
              <label className="bridge-label">Gas limit (dst)</label>
              <input
                type="number"
                min="100000"
                step="1000"
                className="bridge-input"
                value={gasLimit}
                onChange={(e) => setGasLimit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="bridge-pill-grid">
            <div>
              <p className="bridge-muted">Expected receive</p>
              <strong>
                {minAmountLD
                  ? `${formatUnits(minAmountLD, decimals)} ${tokenSymbol}`
                  : "..."}
              </strong>
            </div>
            <div>
              <p className="bridge-muted">Messaging fee</p>
              <strong>
                {quoteQuery.data
                  ? `${formatUnits(
                      quoteQuery.data.nativeFee,
                      sourceChain.nativeCurrency.decimals
                    )} ${sourceChain.nativeCurrency.symbol}`
                  : quoteQuery.isFetching
                  ? "Quoting..."
                  : "..."}
              </strong>
            </div>
            <div>
              <p className="bridge-muted">LayerZero EIDs</p>
              <strong>
                {sourceChain.lzEid} {"->"} {destinationChain.lzEid}
              </strong>
            </div>
          </div>

          {error && <div className="bridge-banner error">{error}</div>}
          {status && !error && <div className="bridge-banner">{status}</div>}
          {lastTx && (
            <div className="bridge-banner success">
              Sent! Tx:{" "}
              <a
                href={`${
                  sourceChain.blockExplorer || "https://etherscan.io"
                }/tx/${lastTx}`}
                target="_blank"
                rel="noreferrer"
              >
                {lastTx.slice(0, 10)}...
              </a>
            </div>
          )}

          <button
            className="bridge-primary"
            onClick={handleBridge}
            disabled={!canBridge || isSwitching || isWriting}
          >
            {!isConnected
              ? "Connect wallet"
              : isSwitching || isWriting
              ? "Preparing transaction..."
              : "Bridge tokens"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default function BridgePage() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        initialChain={supportedChains[0].viemChain}
        modalSize="compact"
      >
        <BridgeForm />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
