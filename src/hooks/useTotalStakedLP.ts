import { useContractRead } from "wagmi";
import swampABI from "../statics/abis/LPStakingABI.json";
import { formatEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useTotalStakedLP() {
  const { data } = useContractRead({
    abi: swampABI,
    address: CONTRACT,
    functionName: "totalSupply",
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
