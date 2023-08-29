import { useAccount, useContractRead } from "wagmi";
import swampABI from "../statics/abis/LPStakingABI.json";
import { formatEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useUserStakedLP() {
  const { address } = useAccount();

  const { data } = useContractRead({
    abi: swampABI,
    address: CONTRACT,
    functionName: "balanceOf",
    args: [address],
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
