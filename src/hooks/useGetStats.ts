import { useContractRead } from "wagmi";
import contractABI from "../statics/abis/contractABI.json";
import { formatEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useGetStats() {
  const { data } = useContractRead({
    abi: contractABI,
    address: CONTRACT,
    functionName: "getStats",
    chainId: CHAIN_ID,
    watch: true,
  });

  const stats = {
    totalBurned: data ? Number(formatEther((data as any)[0] as bigint)) : 0,
    totalRewards: data ? Number(formatEther((data as any)[1] as bigint)) : 0,
    rewardPool: data ? Number(formatEther((data as any)[2] as bigint)) : 0,
  };
  return stats;
}
