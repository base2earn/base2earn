import { Address, useAccount, useContractRead } from "wagmi";
import { formatEther, parseEther, zeroAddress } from "viem";
import { erc20ABI } from "wagmi";
import { BRB_ADDRESS } from "../statics/addresses";
import contractABI from "../statics/abis/contractABI.json";

export default function useBaseToReflectionAmount() {
  const { data } = useContractRead({
    address: BRB_ADDRESS,
    abi: contractABI,
    functionName: "baseToReflectionAmount",
    args: [parseEther("1"), zeroAddress],
    watch: true,
  });

  console.log("data", data);

  return data ? formatEther(data as any as bigint) : 0;
}
