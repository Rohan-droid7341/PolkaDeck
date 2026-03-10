"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { platformTokenABI } from "@/lib/contracts";
import { fetchPlatformTokenDetails, formatBalance } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConnectWallet from "@/components/ConnectWallet";

import { Zap, CheckCircle, Network } from "lucide-react";

const InfoPoint = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 mt-1">
      <Icon className="w-5 h-5 text-indigo-300" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-100">{title}</h3>
      <p className="text-sm text-gray-400">{children}</p>
    </div>
  </div>
);

export default function BuyTokenPage() {
  const { address, isConnected, chain } = useAccount();

  const [pasAmountStr, setPasAmountStr] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [txHash, setTxHash] = useState(null);

  // Fetch token details
  useEffect(() => {
    if (chain?.id) {
      fetchPlatformTokenDetails(chain.id).then(setTokenDetails);
    }
  }, [chain?.id]);

  const tokenSymbol = tokenDetails?.symbol || "TOKEN";
  const tokenDecimals = tokenDetails?.decimals ?? 18;
  const tokenAddress = tokenDetails?.address;

  // Token price
  const { data: priceData } = useReadContract({
    address: tokenAddress,
    abi: platformTokenABI,
    functionName: "tokenPrice",
    chainId: chain?.id,
    query: { enabled: !!tokenAddress },
  });

  const tokenPrice = priceData ?? 0n;

  // PAS Balance
  const {
    data: pasBalanceData,
    refetch: refetchPasBalance,
    isLoading: isLoadingPasBalance,
  } = useBalance({
    address,
    chainId: chain?.id,
    query: { enabled: isConnected },
  });

  const pasBalance = pasBalanceData?.value ?? 0n;

  // Token Balance
  const {
    data: tokenBalanceData,
    refetch: refetchTokenBalance,
    isLoading: isLoadingTokenBalance,
  } = useBalance({
    address,
    token: tokenAddress,
    chainId: chain?.id,
    query: { enabled: isConnected && !!tokenAddress },
  });

  const tokenBalance = tokenBalanceData?.value ?? 0n;

  // Write contract
  const { writeContractAsync, isPending } = useWriteContract();

  // Wait for receipt
  const { isLoading: waitingTx, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // After success refresh balances
  useEffect(() => {
    if (isSuccess) {
      refetchPasBalance();
      refetchTokenBalance();
      setPasAmountStr("");
    }
  }, [isSuccess]);

  const handleBuy = async () => {
    if (!pasAmountStr || !tokenAddress) return;

    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: platformTokenABI,
        functionName: "buyTokens",
        value: parseEther(pasAmountStr),
      });

      setTxHash(hash);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const parsedAmount = pasAmountStr ? parseEther(pasAmountStr) : 0n;
  const insufficientBalance = parsedAmount > pasBalance;

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <Zap className="w-16 h-16 text-purple-500 mb-6" />
        <h2 className="text-2xl font-semibold mb-3 text-gray-100">
          Connect Your Wallet
        </h2>
        <p className="text-gray-400 mb-6 max-w-sm">
          Connect to Polkadot Hub TestNet to buy {tokenSymbol} with PAS.
        </p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
      {/* Info */}
      <div className="lg:col-span-2 bg-gradient-to-br from-indigo-950 via-gray-900 to-gray-900 p-8 rounded-2xl border border-gray-700/60 shadow-lg shadow-purple-900/20">
        <div className="space-y-6">
          <InfoPoint icon={CheckCircle} title="Invest in Decks">
            {tokenSymbol} is required to invest in all curated strategies
            (Decks) on the platform.
          </InfoPoint>

          <InfoPoint icon={Network} title="Platform Participation">
            Holding {tokenSymbol} may unlock future governance and reward
            features.
          </InfoPoint>

          <InfoPoint icon={Zap} title="Simple On‑chain Purchase">
            Buy {tokenSymbol} instantly using your PAS balance via a trusted
            on‑chain contract.
          </InfoPoint>
        </div>
      </div>

      {/* Buy Card */}
      <div className="lg:col-span-3">
        <Card border className="!bg-gray-900/80 backdrop-blur-xl border-gray-800/70 shadow-xl shadow-black/40">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-50">
            Buy {tokenSymbol} on Polkadot Hub TestNet
          </h2>

          <div className="space-y-6">
            {/* Balances */}
            <div className="text-xs sm:text-sm space-y-2 text-gray-300 bg-gray-900/60 rounded-lg px-3 py-3 border border-gray-800/80">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">PAS balance</span>
                <span className="font-medium">
                  {isLoadingPasBalance
                    ? "..."
                    : formatBalance(pasBalance, 18, 6)}{" "}
                  PAS
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">{tokenSymbol} balance</span>
                <span className="font-medium">
                  {isLoadingTokenBalance
                    ? "..."
                    : formatBalance(tokenBalance, tokenDecimals, 4)}{" "}
                  {tokenSymbol}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current rate</span>
                <span className="font-medium">
                  {tokenPrice
                    ? `1 ${tokenSymbol} ≈ ${formatBalance(
                        tokenPrice,
                        18,
                        6
                      )} PAS`
                    : "Loading..."}
                </span>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <label
                htmlFor="pasAmount"
                className="block text-sm font-medium text-gray-200"
              >
                Amount of PAS to spend
              </label>
              <div className="relative">
                <Input
                  id="pasAmount"
                  type="number"
                  value={pasAmountStr}
                  onChange={(e) => setPasAmountStr(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="any"
                  className={`pr-16 bg-gray-900/70 border-gray-700/70 focus:border-purple-500/80 focus:ring-purple-500/40 ${
                    insufficientBalance
                      ? "!border-red-500/80 focus:!ring-red-500/40"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    pasAmountStr !== formatEther(pasBalance) &&
                    setPasAmountStr(formatEther(pasBalance))
                  }
                  disabled={isPending || waitingTx || pasBalance === 0n}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs px-2 py-1 rounded-md bg-purple-700/80 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Max
                </button>
              </div>
              {insufficientBalance && (
                <p className="text-xs text-red-400 mt-1">
                  Insufficient PAS balance.
                </p>
              )}
            </div>

            {/* Button + status */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={handleBuy}
                disabled={
                  !pasAmountStr || insufficientBalance || isPending || waitingTx
                }
                className="w-full !py-2.5 text-sm font-semibold"
              >
                {isPending || waitingTx
                  ? "Processing transaction..."
                  : `Buy ${tokenSymbol} with PAS`}
              </Button>

              {isSuccess && (
                <p className="text-green-400 text-xs sm:text-sm text-center">
                  Transaction confirmed. Balances updated.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}