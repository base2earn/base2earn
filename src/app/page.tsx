"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import NumberInput from "@/src/components/Reusable/NumberInput";
import { Address, parseEther } from "viem";
import useTokenBalance from "@/src/hooks/useTokenBalance";
import { useWeb2Context } from "@/src/contexts/web2Context";
import useAllowance from "@/src/hooks/useAllowance";
import useApprove from "@/src/hooks/useApprove";
import { B2E_ADDRESS, CONTRACT } from "@/src/statics/addresses";
import useBurn from "@/src/hooks/useBurn";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
import useGetStats from "../hooks/useGetStats";

export default function Stake() {
  const [value, setValue] = useState("");

  const web2Context = useWeb2Context();
  const b2eBalance = useTokenBalance(B2E_ADDRESS);

  const stats = useGetStats();

  const amountIn = useMemo(() => parseEther(value as `${number}`), [value]);

  const b2eAllowance = useAllowance(B2E_ADDRESS as Address, CONTRACT);
  const approveTX = useApprove(amountIn, B2E_ADDRESS as Address, CONTRACT);

  const burnTX = useBurn(amountIn, amountIn > 0);

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
                Current Pool Reward
                <div className="flex gap-2 items-center">
                  <div className="font-bold">{stats.rewardPool.toFixed(4)} ETH</div>
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
                Total Burned
                <div className="flex gap-2 items-center">
                  <div className="font-bold">
                    {stats.totalBurned.toFixed(4)} ETH
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
                <div>Total Rewards</div>
                <div className="flex gap-2 items-center">
                  <div className="font-bold">
                    {stats.totalRewards.toFixed(4)} ETH
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

            <div className="mt-6">
              <div className="w-full justify-between flex">
                <div className="flex gap-1">
                  <div>In Wallet:</div>
                  <div className="font-bold">
                    {b2eBalance ? Number(b2eBalance.formatted).toFixed(4) : "0"}
                    &nbsp;B2E
                  </div>
                </div>
                <a
                  target="_blank"
                  href="https://shibbex.com/legacy/add/ETH/0xB0cb6dE25BFc5811E323DBF0495d9BA6A154f43a?chainId=109"
                  className="underline text-moon"
                >
                  Get B2E
                </a>
              </div>

              <NumberInput
                tokenSymbol="B2E"
                value={value}
                balance={b2eBalance ? b2eBalance.formatted : "0"}
                setValueCallback={setValue}
                unitPrice={web2Context?.b2ePrice}
              />
              <div className="mt-6 w-full flex justify-between gap-6 font-bold">
                {amountIn > 0 && b2eAllowance < amountIn ? (
                  <button
                    disabled={!approveTX.transaction.write || !value}
                    onClick={() => {
                      if (approveTX.transaction.write) {
                        approveTX.transaction.write();
                      }
                    }}
                    className="disabled:contrast-50 bg-moon rounded-md w-full gap-2 transition-transform relative flex justify-center items-center px-4 h-12"
                  >
                    {approveTX.confirmation.isLoading ? "APPROVING" : "APPROVE"}
                  </button>
                ) : (
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
                )}
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
