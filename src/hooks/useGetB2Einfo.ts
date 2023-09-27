import { Address, useAccount, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem";
import { erc20ABI } from "wagmi";
import { CONTRACT } from "../statics/addresses";
import contractABI from "../statics/abis/contractABI.json";

export default function useGetB2Einfo() {
  const { data } = useContractRead({
    address: CONTRACT,
    abi: contractABI,
    functionName: "getB2Einfo",
    args: [],
    watch: true,
  });

  console.log("useGetB2Einfo", {
    totalBurned: data ? Number(formatEther((data as any)[0] as bigint)) : 0,
    totalBurnRewards: data
      ? Number(formatEther((data as any)[1] as bigint))
      : 0,
    b2eETHbalance: data ? Number(formatEther((data as any)[2] as bigint)) : 0,
    timeToNextBurn: data ? Number(formatEther((data as any)[3] as bigint)) : 0,
    maxTokensToBurn: data ? Number(formatEther((data as any)[4] as bigint)) : 0,
    burnCapInEth: data ? Number(formatEther((data as any)[5] as bigint)) : 0,
    maxEthOutput: data ? Number(formatEther((data as any)[6] as bigint)) : 0,
  });

  return {
    totalBurned: data ? Number(formatEther((data as any)[0] as bigint)) : 0,
    totalBurnRewards: data
      ? Number(formatEther((data as any)[1] as bigint))
      : 0,
    b2eETHbalance: data ? Number(formatEther((data as any)[2] as bigint)) : 0,
    timeToNextBurn: data ? Number(formatEther((data as any)[3] as bigint)) : 0,
    maxTokensToBurn: data ? Number(formatEther((data as any)[4] as bigint)) : 0,
    burnCapInEth: data ? Number(formatEther((data as any)[5] as bigint)) : 0,
    maxEthOutput: data ? Number(formatEther((data as any)[6] as bigint)) : 0,
  };
}
