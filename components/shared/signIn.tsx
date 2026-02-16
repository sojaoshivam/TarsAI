"use client"

import Image from "next/image";
import * as React from "react"


// Mock Link for preview
const Link = ({ href, children, className }: any) => (
    <a href={href} className={className} onClick={(e) => e.preventDefault()}>{children}</a>
);

// Mock useRouter for preview
const useRouter = () => ({
    push: (url: string) => console.log(`[Mock Router] Navigating to: ${url}`),
});

// Mock useSignIn for preview
const useSignIn = () => {
    return {
        isLoaded: true,
        signIn: {
            create: async ({ identifier, password }: any) => {
                console.log(`[Mock Clerk] Attempting sign in with: ${identifier}`);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

                // Simulate basic validation failure or success
                if (password === "wrong") {
                    throw { errors: [{ longMessage: "Incorrect password (Mock)" }] };
                }
                return { status: "complete", createdSessionId: "sess_123mock" };
            },
            authenticateWithRedirect: async ({ strategy }: any) => {
                console.log(`[Mock Clerk] OAuth Redirect with strategy: ${strategy}`);
                await new Promise((resolve) => setTimeout(resolve, 800));
            }
        },
        setActive: async ({ session }: any) => console.log(`[Mock Clerk] Setting active session: ${session}`),
    };
};

// --- END MOCKS ---

const SignIn1 = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Simple client-side validation
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle Email/Password Sign In
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                // Set the active session and redirect to dashboard
                await setActive({ session: result.createdSessionId });
                alert("Sign in successful! Redirecting to dashboard...");
                router.push("/dashboard");
            } else {
                // If 2FA or other steps are required, you would handle them here
                console.log("Sign in requires further steps:", result);
            }
        } catch (err: any) {
            console.error("Error:", err.errors?.[0] || err);
            // Display the error message from Clerk (e.g., "Incorrect password")
            setError(err.errors?.[0]?.longMessage || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google OAuth
    const handleGoogleSignIn = async () => {
        if (!isLoaded) return;

        try {
            setIsLoading(true);
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sign-in", // Redirects back here to process the token
                redirectUrlComplete: "/dashboard", // Final destination
            });
            alert("Redirecting to Google...");
        } catch (err: any) {
            console.error("Google Sign In Error:", err);
            setError("An error occurred with Google Sign In");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full rounded-xl font-sans">
            {/* Centered glass card */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">

                {/* Logo */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-none mb-6 shadow-lg">
                    {/* Placeholder logo - replace with your own if needed */}
                    <Image
                        src="/logo1.png"
                        alt="logo image"
                        height={40}
                        width={40}
                    />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    Sign-In
                </h2>

                {/* Form */}
                <form onSubmit={handleSignIn} className="flex flex-col w-full gap-4">
                    <div className="w-full flex flex-col gap-3">
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            disabled={isLoading}
                            className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            disabled={isLoading}
                            className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <div className="text-xs text-red-400 text-left pl-2 animate-pulse">
                                {error}
                            </div>
                        )}
                    </div>

                    <hr className="opacity-10 border-white" />

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm disabled:opacity-50"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>

                        <div className="w-full text-center mt-2">
                            <span className="text-xs text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="underline text-white/80 hover:text-white transition-colors"
                                >
                                    Sign up, it&apos;s free!
                                </Link>
                            </span>
                        </div>
                    </div>
                </form>
            </div>

            {/* User count and avatars */}
            <div className="relative z-10 mt-12 flex flex-col items-center text-center pointer-events-none select-none">
                <p className="text-gray-400 text-sm mb-2">
                    Join <span className="font-medium text-white">thousands</span> of
                    developers
                </p>
                <div className="flex">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="user"
                        className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
                    />
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="user"
                        className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover -ml-3"
                    />
                    <img
                        src="https://randomuser.me/api/portraits/men/54.jpg"
                        alt="user"
                        className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover -ml-3"
                    />
                    <img
                        src="https://randomuser.me/api/portraits/women/68.jpg"
                        alt="user"
                        className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover -ml-3"
                    />
                </div>
            </div>
        </div>
    );
};

export { SignIn1 };