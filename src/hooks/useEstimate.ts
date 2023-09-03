import { useContractRead } from "wagmi";
import routerABI from "../statics/abis/routerABI.json";
import { formatEther, parseEther } from "viem";
import { B2E_ADDRESS, CHAIN_ID, ROUTER } from "../statics/addresses";

export default function useEstimate(amountIn: number) {
  const { data } = useContractRead({
    abi: routerABI,
    address: ROUTER,
    functionName: "getAmountsIn",
    enabled: Number(amountIn) > 0,
    args: [
      parseEther(amountIn.toString()),
      [B2E_ADDRESS, "0x4200000000000000000000000000000000000006"],
    ],
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? formatEther((data as any)[0] as bigint) : 0;
}
