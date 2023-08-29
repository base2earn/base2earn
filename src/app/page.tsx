"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";
import NumberInput from "@/src/components/Reusable/NumberInput";
import { Address, parseEther } from "viem";
import useTokenBalance from "@/src/hooks/useTokenBalance";
import { useWeb2Context } from "@/src/contexts/web2Context";
import useAllowance from "@/src/hooks/useAllowance";
import useApprove from "@/src/hooks/useApprove";
import {
  DOPAMOON_ADDRESS,
  LP_ADDRESS,
  SHEX_ADDRESS,
  STAKING_CONTRACT,
} from "@/src/statics/addresses";
import useStake from "@/src/hooks/useBurn";
import useWithdraw from "@/src/hooks/useWithdraw";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
import usePendingRewards from "@/src/hooks/usePendingRewards";
import useClaim from "@/src/hooks/useClaim";
import lpLogo from "@/src/statics/images/logo.png";
import useTotalStakedLP from "@/src/hooks/useTotalStakedLP";
import useUserStakedLP from "@/src/hooks/useUserStakedLP";
import useLPPrice from "@/src/hooks/useLPPrice";
import useDopaRewardData from "@/src/hooks/useDopaRewardData";
import useShexRewardData from "@/src/hooks/useShexRewardData";
import useBurn from "@/src/hooks/useBurn";

export default function Stake() {
  const [value, setValue] = useState("");

  const web2Context = useWeb2Context();
  const dopaLPBalance = useTokenBalance(LP_ADDRESS);

  const totalStakedLP = useTotalStakedLP();
  const userStakedLP = useUserStakedLP();
  const dopaPendingRewards = usePendingRewards(DOPAMOON_ADDRESS);
  const shexPendingRewards = usePendingRewards(SHEX_ADDRESS);
  const dopaRewardRate = useDopaRewardData();

  const lpPrice = useLPPrice(
    web2Context && web2Context.bonePrice ? Number(web2Context.bonePrice) : 0
  );

  const dopaAPR = useMemo(() => {
    if (web2Context && web2Context.dopamoonPrice && dopaRewardRate) {
      const userStakedLPCheck = userStakedLP ? userStakedLP : 1;
      const userLPTokensValue = userStakedLPCheck * lpPrice;

      const dopaPerYear = dopaRewardRate * 60 * 60 * 24 * 365;

      const userYearlyRewards =
        (dopaPerYear * userStakedLPCheck) / totalStakedLP;

      const userYearlyRewardsValue =
        userYearlyRewards * Number(web2Context.dopamoonPrice);

      return ((userYearlyRewardsValue / userLPTokensValue) * 100).toFixed(0);
    }
    return 0;
  }, [lpPrice, userStakedLP, web2Context, totalStakedLP, dopaRewardRate]);

  const shexAPR = useMemo(() => {
    if (web2Context && web2Context.dopamoonPrice && web2Context.shexPerDay) {
      const userStakedLPCheck = userStakedLP ? userStakedLP : 1;
      const userLPTokensValue = userStakedLPCheck * lpPrice;

      const shexPerYear = Number(web2Context.shexPerDay) * 365;

      const userYearlyRewards =
        (shexPerYear * userStakedLPCheck) / totalStakedLP;

      const userYearlyRewardsValue =
        userYearlyRewards * Number(web2Context.shexPrice);

      console.log("totalRewardsValue", userYearlyRewardsValue);

      return ((userYearlyRewardsValue / userLPTokensValue) * 100).toFixed(0);
    }
    return 0;
  }, [lpPrice, userStakedLP, web2Context, totalStakedLP]);

  const amountIn = useMemo(() => parseEther(value as `${number}`), [value]);

  const dopaAllowance = useAllowance(LP_ADDRESS as Address, STAKING_CONTRACT);
  const approveLPTX = useApprove(
    amountIn,
    LP_ADDRESS as Address,
    STAKING_CONTRACT
  );

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
              Burn XX to earn % of the pool
            </div>

            <div className="mt-6 w-full justify-between flex items-center">
              <div className="flex flex-col  text-center">
                Current Pool Reward
                <div className="flex gap-2 items-center">
                  <div className="font-bold">{totalStakedLP.toFixed(4)}</div>
                  <div>
                    {lpPrice && (
                      <span>
                        ({formatNumberToCurrency(totalStakedLP * lpPrice)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col  text-center">
                Total Burned
                <div className="flex gap-2 items-center">
                  <div className="font-bold">{totalStakedLP.toFixed(4)}</div>
                  <div>
                    {lpPrice && (
                      <span>
                        ({formatNumberToCurrency(totalStakedLP * lpPrice)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-center">
                <div>Total Rewards</div>
                <div className="flex gap-2 items-center">
                  <div className="font-bold">{userStakedLP.toFixed(4)}</div>
                  <div>
                    {lpPrice && (
                      <span>
                        ({formatNumberToCurrency(userStakedLP * lpPrice)})
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
                    {dopaLPBalance
                      ? Number(dopaLPBalance.formatted).toFixed(4)
                      : "0"}
                    B2E
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
                tokenSymbol="DOPA"
                value={value}
                balance={dopaLPBalance ? dopaLPBalance.formatted : "0"}
                setValueCallback={setValue}
                unitPrice={lpPrice}
              />
              <div className="mt-6 w-full flex justify-between gap-6 font-bold">
                {amountIn > 0 && dopaAllowance < amountIn ? (
                  <button
                    disabled={!approveLPTX.transaction.write || !value}
                    onClick={() => {
                      if (approveLPTX.transaction.write) {
                        approveLPTX.transaction.write();
                      }
                    }}
                    className="disabled:contrast-50 bg-moon rounded-md w-full gap-2 transition-transform relative flex justify-center items-center px-4 h-12"
                  >
                    {approveLPTX.confirmation.isLoading
                      ? "APPROVING"
                      : "APPROVE"}
                  </button>
                ) : (
                  <button
                    disabled={
                      !burnTX.transaction.write ||
                      !value ||
                      (dopaLPBalance && amountIn > dopaLPBalance.value)
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
