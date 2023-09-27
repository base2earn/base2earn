"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import NumberInput from "@/src/components/Reusable/NumberInput";
import { parseEther } from "viem";
import useTokenBalance from "@/src/hooks/useTokenBalance";
import { useWeb2Context } from "@/src/contexts/web2Context";
import { B2E_ADDRESS, BRB_ADDRESS } from "@/src/statics/addresses";
import useBurn from "@/src/hooks/useBurn";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
import Timer from "../components/Reusable/Timer";
import useEstimate from "../hooks/useEstimate";
import useGetBurnOutputEstimate from "../hooks/useGetBurnOutputEstimate";
import useGetB2Einfo from "../hooks/useGetB2Einfo";
import useBaseToReflectionAmount from "../hooks/useBaseToReflectionAmount";
import useTotalSupply from "../hooks/useTotalSupply";
import useMigrate from "../hooks/useMigrate";
import { useBalance } from "wagmi";

export default function Stake() {
  const [value, setValue] = useState("");

  const web2Context = useWeb2Context();
  const b2eBalance = useTokenBalance(B2E_ADDRESS);
  const brbBalance = useTokenBalance(BRB_ADDRESS);
  const baseToReflectionAmount = useBaseToReflectionAmount();
  const totalSupply = useTotalSupply();

  const amountIn = useMemo(() => parseEther(value as `${number}`), [value]);
  const outputEstimate = useGetBurnOutputEstimate(amountIn);
  const burnTX = useBurn(amountIn, amountIn > 0);
  const stats = useGetB2Einfo();

  const [migrateValue, setMigrateValue] = useState("");
  const migrateAmount = useMemo(
    () => parseEther(migrateValue as `${number}`),
    [migrateValue]
  );
  const migrateTX = useMigrate(migrateAmount, migrateAmount > 0);

  const acceptedValue = useMemo(() => {
    if (outputEstimate <= stats.maxEthOutput) {
      return outputEstimate;
    }
    return stats.maxEthOutput;
  }, [outputEstimate, stats]);

  const estimateOut = useEstimate(acceptedValue);

  return (
    <>
      {b2eBalance && +b2eBalance.formatted > -1 ? (
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
                  Migrate $B2E for $BRB at 1:1 ratio!
                </div>

                <div className="mt-6">
                  <div className="w-full justify-between flex">
                    <div className="flex gap-1">
                      <div>In Wallet:</div>
                      <div className="font-bold">
                        {b2eBalance
                          ? Number(b2eBalance.formatted).toFixed(4)
                          : "0"}
                        &nbsp;B2E
                      </div>
                    </div>
                  </div>

                  <NumberInput
                    tokenSymbol="BRB"
                    value={estimateOut.toString()}
                    balance={b2eBalance ? b2eBalance.formatted : "0"}
                    setValueCallback={setMigrateValue}
                    unitPrice={web2Context?.b2ePrice}
                  />

                  <div className="mt-6 w-full flex justify-between gap-6 font-bold">
                    <button
                      disabled={
                        !migrateTX.transaction.write ||
                        !migrateValue ||
                        (b2eBalance && migrateAmount > b2eBalance.value)
                      }
                      onClick={() => {
                        if (migrateTX.transaction.write) {
                          migrateTX.transaction.write();
                        }
                      }}
                      className="disabled:contrast-50 flex-col bg-moon rounded-md w-full transition-transform relative flex justify-center items-center px-4 h-12 "
                    >
                      {burnTX.confirmation.isLoading ? "MIGRATING" : "MIGRATE"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}
      <section
        className={`relative z-10 w-full flex items-center ${
          +b2eBalance?.formatted > 0 ? "my-8" : null
        }`}
      >
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
                Burn $BRB to earn a % of the reward pool
              </div>

              <div className="mt-6 w-full justify-between flex items-center">
                <div className="flex flex-col  text-center">
                  Total Burn Pool Balance
                  <div className="flex gap-2 items-center justify-center">
                    <div className="font-bold">
                      {stats.b2eETHbalance.toFixed(3)} ETH
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  Total Burned Tokens
                  <div className="flex gap-2 items-center justify-center">
                    <div className="font-bold">
                      {+totalSupply > 0 ? +stats.totalBurned / +totalSupply : 0}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <div>Total Claimed ETH</div>
                  <div className="flex gap-2 items-center justify-center">
                    <div className="font-bold">
                      {stats.totalBurnRewards.toFixed(6)} ETH
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <div>Total Reflected</div>
                  <div className="flex gap-2 items-center justify-center">
                    <div className="font-bold">
                      {+baseToReflectionAmount - 1}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center text-2xl text-orange">
                <Timer seconds={stats.timeToNextBurn} />
              </div>

              <div className="mt-6">
                <div className="w-full justify-between flex">
                  <div className="flex gap-1">
                    <div>In Wallet:</div>
                    <div className="font-bold">
                      {b2eBalance
                        ? Number(b2eBalance.formatted).toFixed(4)
                        : "0"}
                      &nbsp;BRB
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <a
                      target="_blank"
                      // href="https://app.alienbase.xyz/?outputCurrency=0x7c01268fF1797daA31ed155D72d86723e8a499e7&chainId=8453"
                      href="https://pancakeswap.finance/swap?outputCurrency=0x1Af8cb7660330F4db7Fa9F62a24830DE226A0f65&chain=bsc"
                      className="underline text-moon"
                    >
                      Get BRB
                    </a>
                    Max Burn Amount: {stats.maxTokensToBurn} BRB
                  </div>
                </div>

                <NumberInput
                  tokenSymbol="BRB"
                  value={estimateOut.toString()}
                  balance={b2eBalance ? b2eBalance.formatted : "0"}
                  setValueCallback={setValue}
                  unitPrice={web2Context?.b2ePrice}
                />

                <div className="flex gap-2">
                  <div>Return Amount: </div>
                  <div>
                    {acceptedValue.toString()} ETH ($
                    {acceptedValue * Number(web2Context?.ethPrice)})
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
    </>
  );
}
