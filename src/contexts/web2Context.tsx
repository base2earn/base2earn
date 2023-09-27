"use client";
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";

export type Web2ContextType = {
  b2ePrice: Number;
  ethPrice: Number;
};

export const Web2Context = createContext<Web2ContextType | null>(null);
export function useWeb2Context() {
  return useContext(Web2Context);
}

type Props = {
  children: ReactNode;
};

export default function Web2Provider({ children }: Props) {
  const [b2ePrice, setB2ePrice] = useState<Number>(0);
  const [ethPrice, setEthPrice] = useState<Number>(0);

  useEffect(() => {
    async function fetchPrices() {
      const req = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/bsc/0x1Af8cb7660330F4db7Fa9F62a24830DE226A0f65",
        { next: { revalidate: 10 } }
      );
      const priceData = await req.json();
      setB2ePrice(Number(priceData.pairs[0].priceUsd));

      const reqEth = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/ethereum/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
        { next: { revalidate: 10 } }
      );
      const priceDataEth = await reqEth.json();
      setEthPrice(Number(priceDataEth.pairs[0].priceUsd));
    }

    fetchPrices();
  }, []);

  return (
    <Web2Context.Provider
      value={{
        b2ePrice: b2ePrice,
        ethPrice: ethPrice,
      }}
    >
      {children}
    </Web2Context.Provider>
  );
}
