import { redirect } from "next/navigation"
import { auth, signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LoginPage() {
  const session = await auth()

  // Redirect if already logged in
  if (session) {
    redirect("/")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <span className="text-3xl font-bold text-primary-foreground">B</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Bloxstyle</CardTitle>
          <CardDescription>
            The ultimate fashion hub for Roblox avatars. Create, share, and discover amazing outfits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signIn("roblox", { redirectTo: "/" })
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.403 5.597L5.597 18.403l12.806-12.806zM5.597 5.597l12.806 12.806L5.597 5.597z" />
              </svg>
              Sign in with Roblox
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            <br />
            Not affiliated with Roblox Corporation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
