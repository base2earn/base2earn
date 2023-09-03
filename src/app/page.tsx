"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import NumberInput from "@/src/components/Reusable/NumberInput";
import { parseEther } from "viem";
import useTokenBalance from "@/src/hooks/useTokenBalance";
import { useWeb2Context } from "@/src/contexts/web2Context";
import { B2E_ADDRESS, CONTRACT } from "@/src/statics/addresses";
import useBurn from "@/src/hooks/useBurn";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
import useGetStats from "../hooks/useGetStats";
import useGetNextBurn from "../hooks/useGetNextBurn";
import Timer from "../components/Reusable/Timer";
import useGetBurnCap from "../hooks/useGetBurnCap";
import useEstimate from "../hooks/useEstimate";
import useGetBurnOutputEstimate from "../hooks/useGetBurnOutputEstimate";

export default function Stake() {
  const [value, setValue] = useState("");

  const web2Context = useWeb2Context();
  const b2eBalance = useTokenBalance(B2E_ADDRESS);
  const nextTimeBurn = useGetNextBurn();
  const stats = useGetStats();
  const maxAmount = useGetBurnCap();

  const amountIn = useMemo(() => parseEther(value as `${number}`), [value]);
  const outputEstimate = useGetBurnOutputEstimate(amountIn)
  const burnTX = useBurn(amountIn, amountIn > 0);

  const acceptedValue = useMemo(() => {
    if (outputEstimate <= stats.rewardPool) {
      return outputEstimate;
    }
    return stats.rewardPool;
  }, [outputEstimate, stats]);

  const estimateOut = useEstimate(acceptedValue);

  return (
    <section className="relative z-10 w-full flex items-center">
      <motion.div
        initial={{ scale: 1.05, opacity: 0, translateY: "-20px" }}
        animate={{ scale: 1, opacity: 1, translateY: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full flex justify-center"
      >
        <div className="flex w-full max-w-3xl">
          <div
            className={`w-full border-[1px] backdrop-blur-sm border-slate-100/20 rounded-md bg-dark p-6 font-sans`}
          >
            <div className="text-xl font-bold text-center">
              Burn $B2E to earn a % of the reward pool
            </div>

            <div className="mt-6 w-full justify-between flex items-center">
              <div className="flex flex-col  text-center">
                Total Burn Pool Balance
                <div className="flex gap-2 items-center">
                  <div className="font-bold">
                    {stats.rewardPool.toFixed(4)} ETH
                  </div>
                  <div>
                    {web2Context && (
                      <span>
                        (
                        {formatNumberToCurrency(
                          stats.rewardPool * Number(web2Context.ethPrice)
                        )}
                        )
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col  text-center">
                Total Burned Tokens
                <div className="flex gap-2 items-center">
                  <div className="font-bold">
                    {Number(stats.totalBurned * 100 / 1_000_000).toFixed(2)}%
                  </div>
                  <div>
                    {web2Context && (
                      <span>
                        (
                        {formatNumberToCurrency(
                          stats.totalBurned * Number(web2Context.b2ePrice)
                        )}
                        )
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-center">
                <div>Total Claimed ETH</div>
                <div className="flex gap-2 items-center">
                  <div className="font-bold">
                    {stats.totalRewards.toFixed(6)} ETH
                  </div>
                  <div>
                    {web2Context && (
                      <span>
                        (
                        {formatNumberToCurrency(
                          stats.totalRewards * Number(web2Context.ethPrice)
                        )}
                        )
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center text-2xl text-orange">
              <Timer seconds={nextTimeBurn} />
            </div>

            <div className="mt-6">
              <div className="w-full justify-between flex">
                <div className="flex gap-1">
                  <div>In Wallet:</div>
                  <div className="font-bold">
                    {b2eBalance ? Number(b2eBalance.formatted).toFixed(4) : "0"}
                    &nbsp;B2E
                  </div>
                </div>
                <div className="flex gap-5">
                  <a
                    target="_blank"
                    href="https://app.alienbase.xyz/?outputCurrency=0x7c01268fF1797daA31ed155D72d86723e8a499e7&chainId=8453"
                    className="underline text-moon"
                  >
                    Get B2E
                  </a>
                  Max Burn Amount: {maxAmount} B2E
                </div>
              </div>

              <NumberInput
                tokenSymbol="B2E"
                value={estimateOut.toString()}
                balance={b2eBalance ? b2eBalance.formatted : "0"}
                setValueCallback={setValue}
                unitPrice={web2Context?.b2ePrice}
              />

              <div className="flex gap-2">
                <div>Return Amount: </div>
                <div>
                  {acceptedValue.toString()} ETH (${acceptedValue * Number(web2Context?.ethPrice)})
                </div>
              </div>
              <div className="mt-6 w-full flex justify-between gap-6 font-bold">
                <button
                  disabled={
                    !burnTX.transaction.write ||
                    !value ||
                    (b2eBalance && amountIn > b2eBalance.value)
                  }
                  onClick={() => {
                    if (burnTX.transaction.write) {
                      burnTX.transaction.write();
                    }
                  }}
                  className="disabled:contrast-50 flex-col bg-moon rounded-md w-full transition-transform relative flex justify-center items-center px-4 h-12 "
                >
                  {burnTX.confirmation.isLoading ? "BURNING" : "BURN"}
                </button>
              </div>
              <div className="mt-2 text-xs">
                Burn rewards are limited to 10% of pool, to ensure the most
                users get access to rewards! If you try to burn more, your
                tokens will not be burned, and the TX will fail.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
