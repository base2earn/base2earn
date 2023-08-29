import { useContractRead } from "wagmi";
import LPStakingABI from "../statics/abis/LPStakingABI.json";
import { formatEther } from "viem";
import { CHAIN_ID, B2E_ADDRESS, CONTRACT } from "../statics/addresses";

export default function useDopaRewardData() {
  const { data } = useContractRead({
    abi: LPStakingABI,
    address: CONTRACT,
    functionName: "getRewardRate",
    args: [B2E_ADDRESS],
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
