import Image from "next/image";

export default function StreakLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-full flex-col">
      <header className="my-4 flex justify-center">
        <Image src="/logo.svg" alt="OTA Streak" width={77} height={24} />
      </header>
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
