import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#1f1f1f] border border-[#333] shadow-xl rounded-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-[#333] border-none hover:bg-[#444] text-white",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-[#2a2a2a] border-[#333] text-white focus:border-blue-500 transition-all",
              footerActionText: "text-gray-400",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              formButtonPrimary: "bg-white text-black hover:bg-gray-200 transition-colors",
            }
          }}
        />
      </div>
    </div>
  );
}