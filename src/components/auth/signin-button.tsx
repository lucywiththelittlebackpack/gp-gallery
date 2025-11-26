import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export function SignInButton() {
    const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    return (
        <form
            action={async () => {
                "use server"
                await signIn(isMock ? "mock-login" : "google", { redirectTo: "/dashboard" })
            }}
        >
            <Button type="submit" size="lg" className="text-lg px-8">
                {isMock ? "Try Demo (Mock)" : "Connect Google Photos"}
            </Button>
        </form>
    )
}
