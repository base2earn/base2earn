"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/src/statics/images/logo.png";
import Link from "next/link";
import { useWeb2Context } from "@/src/contexts/web2Context";
import { BsDiscord, BsTwitter } from "react-icons/bs";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const web2Context = useWeb2Context();

  return (
    <div className="relative z-50 mt-7 w-full px-4 md:px-7 ">
      <div className="overflow-hidden rounded-md outline-1 outline outline-slate-100/20 w-full flex flex-col md:flex-row justify-center">
        <div className="absolute rounded-tl-lg -top-2 left-2 md:left-5 w-7 h-7 border-l-2 border-t-2 border-green-400/60" />
        <div className="w-full shadow-lg">
          <motion.div
            initial={{
              opacity: 0.5,
              width: 0,
            }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 2, ease: [0.42, 0, 0.58, 1] }}
            className="overflow-hidden group w-full flex h-16 z-50 items-center justify-between backdrop-blur-md bg-slate-100/20 pr-4"
          >
            <Link href="/">
              <div className="flex justify-start items-center gap-4">
                <div className="w-16 h-full">
                  <motion.div
                    initial={{
                      width: "10%",
                    }}
                    animate={{ width: "100%" }}
                    transition={{
                      delay: 0.3,
                      duration: 2,
                      ease: [0.42, 0, 0.58, 1],
                    }}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <Image src={logo} alt="logo" className="p-1 rounded-full" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1, ease: "linear" }}
                  className="relative h-full text-2xl flex items-center font-bold"
                >
                  BASE<span className="text-moon">2</span>EARN
                </motion.div>
              </div>
            </Link>

            <a
              className="flex items-center justify-center gap-2 hover:text-green-400 transition-colors"
              href="https://dexscreener.com/base/0x210dd3a97ff82a3eba4aa60d85b2eb2972ff3322"
              target="_blank"
            >
              <Image src={logo} alt="logo" height={35} />
              {web2Context &&
                web2Context.b2ePrice &&
                `$${web2Context.b2ePrice.toFixed(2)}`}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{ opacity: 1, height: "4rem" }}
          transition={{ delay: 1.5, duration: 1, ease: [0.42, 0, 0.58, 1] }}
          className="z-50 flex h-16 backdrop-blur-md shadow-lg"
        >
          <a
            href="https://discord.gg/9sYVbTfaaN"
            target="_blank"
            className="backdrop-blur-md group cursor-pointer relative w-24 flex justify-center items-center border-r-[1px] border-slate-100/20 h-full transition-colors duration-500"
          >
            <BsDiscord size={23} className="z-10 group-hover:animate-wiggle" />

            <div className="z-0 group-hover:w-full bg-moon absolute bottom-0 h-full w-0 left-0 transition-all ease-in-out duration-500" />
          </a>
          <a
            href="https://twitter.com/realbase2earn"
            target="_blank"
            className="backdrop-blur-md group cursor-pointer relative w-24 flex justify-center items-center border-r-[1px] border-slate-100/20 h-full transition-colors duration-500"
          >
            <BsTwitter size={23} className="z-10 group-hover:animate-wiggle" />
            <div className="z-0 group-hover:w-full bg-moon absolute bottom-0 h-full w-0 left-0 transition-all ease-in-out duration-500" />
          </a>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div className="whitespace-nowrap w-full md:w-auto backdrop-blur-md group cursor-pointer relative px-4 flex justify-center items-center h-full transition-colors duration-500">
                  <div
                    className="z-10 h-full w-full flex justify-center items-center"
                    {...(!ready && {
                      "aria-hidden": true,
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="w-full h-full"
                          >
                            CONNECT WALLET
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            className="w-full h-full bg-red-100/20"
                            onClick={openChainModal}
                            type="button"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div
                          onClick={openAccountModal}
                          className="w-full h-full flex items-center justify-center gap-2"
                        >
                          <div>{account.displayName}</div>

                          {chain.hasIcon && chain.iconUrl && (
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={20}
                              height={20}
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="z-0 group-hover:w-full bg-moon absolute bottom-0 h-full w-0 left-0 transition-all ease-in-out duration-500" />
                </div>
              );
            }}
          </ConnectButton.Custom>
        </motion.div>
      </div>
    </div>
  );
}
