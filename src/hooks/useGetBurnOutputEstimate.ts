import { useContractRead } from "wagmi";
import contractABI from "../statics/abis/contractABI.json";
import { formatEther, parseEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useGetBurnOutputEstimate(amountIn: bigint) {
  const { data } = useContractRead({
    abi: contractABI,
    address: CONTRACT,
    enabled: amountIn > 0,
    functionName: "getBurnOutputEstimate",
    args: [amountIn],
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
