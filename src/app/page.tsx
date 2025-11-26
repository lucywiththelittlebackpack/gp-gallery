import { SignInButton } from "@/components/auth/signin-button";

import { FadeIn } from "@/components/animations/fade-in";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-muted">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Header or Nav could go here */}
      </div>

      <FadeIn className="relative flex place-items-center flex-col gap-8 text-center">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Your Photos, <br /> Reimagined.
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Create stunning, public galleries from your Google Photos albums in seconds.
          Share your best moments with the world.
        </p>

        <SignInButton />
      </FadeIn>

      <FadeIn delay={0.2} className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left mt-24 gap-8">
        <FeatureCard
          title="Connect"
          description="Securely link your Google Photos account with just one click."
        />
        <FeatureCard
          title="Select"
          description="Choose the albums you want to showcase on your public profile."
        />
        <FeatureCard
          title="Share"
          description="Get a beautiful, shareable link for your curated gallery."
        />
      </FadeIn>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        {description}
      </p>
    </div>
  )
}
