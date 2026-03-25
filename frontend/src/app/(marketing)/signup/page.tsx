import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="relative z-20 flex items-center text-lg font-space font-medium">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            TE
          </div>
          TaxWise
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Finally, a tax tool built for everyday Nigerians that speaks our language and respects our time."
            </p>
            <footer className="text-sm">Funmi Adeyemi, Abuja</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight font-space">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter details below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Adeola Chinedu"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                  />
                </div>
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
                {/* Mock Signup goes to dashboard */}
                <Link href="/dashboard" className="w-full mt-2">
                  <Button className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
