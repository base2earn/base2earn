import { useContractRead } from "wagmi";
import contractABI from "../statics/abis/contractABI.json";
import { formatEther, parseEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useEstimate(amountIn: string) {

  const { data } = useContractRead({
    abi: contractABI,
    address: CONTRACT,
    functionName: "getBurnOutputEstimate",
    args: [parseEther(amountIn)],
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
