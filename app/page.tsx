"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useUserStore } from "./stores/use-user-store";

export default function Home() {
  const [showUser, setShowUser] = useState(false);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Button variant="outline" onClick={() => setShowUser((showUser) => !showUser)}>
              Mostrar usuário
            </Button>
            {showUser && (
              <div>Usuário: {useUserStore.getState().user?.name || "Não há usuário"}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
