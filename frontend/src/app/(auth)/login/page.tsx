import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="relative z-20 flex items-center text-lg font-space font-medium">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            TE
          </div>
          TaxEase
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "TaxEase made filing my small business taxes incredibly simple. I just took a picture of my ledger and it handled the rest."
            </p>
            <footer className="text-sm">Chuka Obi, Lagos</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight font-space">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="email">
                    Email address
                  </label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                  />
                </div>
                {/* Mock Login goes to dashboard */}
                <Link href="/dashboard" className="w-full mt-2">
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
