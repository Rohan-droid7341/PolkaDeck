"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { investmentDeckManagerAddress, investmentDeckManagerABI, erc20ABI } from "@/lib/contracts";
import { formatBalance, fetchPlatformTokenDetails } from "@/lib/utils";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function InvestmentForm({ deck }) {

  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);

  useEffect(() => {
    if (chain?.id) {
      setTokenDetails(null);

      fetchPlatformTokenDetails(chain.id)
        .then(setTokenDetails)
        .catch(() =>
          setTokenDetails({
            address: undefined,
            symbol: "ERROR",
            decimals: 18,
          })
        );
    }
  }, [chain?.id]);

  const investmentTokenAddress = tokenDetails?.address;
  const tokenDecimals = tokenDetails?.decimals ?? 18;
  const tokenSymbol = tokenDetails?.symbol || "TOKEN";
  const deckIdNumeric = deck?.id;

  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useBalance({
    address,
    token: investmentTokenAddress,
    chainId: chain?.id,
    query: { enabled: isConnected && !!address && !!investmentTokenAddress },
  });

  const balance = balanceData?.value ?? 0n;

  const parsedAmount =
    amount && tokenDetails ? parseUnits(amount, tokenDecimals) : 0n;

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: investmentTokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, investmentDeckManagerAddress],
    chainId: chain?.id,
    query: { enabled: !!address && !!investmentTokenAddress },
  });

  const needsApproval =
    allowance !== undefined &&
    parsedAmount > 0n &&
    allowance < parsedAmount;

  const { writeContractAsync } = useWriteContract();

  const handleInvest = async () => {

    if (!parsedAmount || parsedAmount === 0n) return;

    try {
      setLoading(true);

      /* APPROVE IF NEEDED */

      if (needsApproval) {

        const approveHash = await writeContractAsync({
          address: investmentTokenAddress,
          abi: erc20ABI,
          functionName: "approve",
          args: [investmentDeckManagerAddress, parsedAmount],
        });

        await publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });

        await refetchAllowance();
      }

      /* INVEST */

      const investHash = await writeContractAsync({
        address: investmentDeckManagerAddress,
        abi: investmentDeckManagerABI,
        functionName: "invest",
        args: [deckIdNumeric, parsedAmount],
      });

      await publicClient.waitForTransactionReceipt({
        hash: investHash,
      });

      /* REFRESH UI */

      setAmount("");

      await refetchBalance();
      await refetchAllowance();

    } catch (err) {
      console.error("Investment failed:", err);
    }

    setLoading(false);
  };

  const insufficientBalance =
    parsedAmount > 0n && parsedAmount > balance;

  if (!isConnected || !address) {
    return (
      <Card>
        <p className="text-center text-gray-400 text-sm">
          Connect wallet to invest.
        </p>
      </Card>
    );
  }

  if (!deck) {
    return (
      <Card>
        <p className="text-center text-gray-500 text-sm">
          Deck data unavailable.
        </p>
      </Card>
    );
  }

  if (!tokenDetails) {
    return (
      <Card>
        <p className="text-center text-gray-500 text-sm animate-pulse">
          Loading token info...
        </p>
      </Card>
    );
  }

  return (
    <Card border={true} className="!bg-gray-800/80">

      <h2 className="text-lg font-semibold mb-4">
        Invest in <span className="text-purple-300">{deck.name}</span>
      </h2>

      <div className="text-xs text-gray-400 mb-3 flex justify-between">
        <span>Your Balance:</span>
        <span className="text-gray-200 font-medium">
          {isLoadingBalance
            ? "..."
            : formatBalance(balance, tokenDecimals, 4)}{" "}
          {tokenSymbol}
        </span>
      </div>

      <div className="mb-4">

        <label className="block text-sm text-gray-300 mb-1">
          Amount ({tokenSymbol})
        </label>

        <div className="relative">

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={loading}
            className="pr-14"
          />

          <button
            onClick={() =>
              setAmount(formatUnits(balance, tokenDecimals))
            }
            disabled={loading || balance === 0n}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-purple-700 px-2 py-1 rounded text-white"
          >
            Max
          </button>

        </div>

        {insufficientBalance && (
          <p className="text-xs text-red-400 mt-1">
            Insufficient balance
          </p>
        )}
      </div>

      <Button
        onClick={handleInvest}
        disabled={loading || parsedAmount === 0n || insufficientBalance}
        className="w-full"
      >
        {loading ? "Processing..." : `Invest`}
      </Button>

    </Card>
  );
}