import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black -z-10" />
      
      <SignUp 
        appearance={{
          variables: {
            colorPrimary: '#10b981',
            colorTextOnPrimaryBackground: '#000000',
            colorBackground: '#18181b',
            colorText: '#ffffff',
            colorInputBackground: '#27272a',
            colorInputText: '#ffffff',
          },
          elements: {
            card: "border border-emerald-500/20 shadow-2xl shadow-emerald-500/5",
            headerTitle: "text-2xl font-bold uppercase tracking-tighter",
            formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest",
          }
        }}
      />
    </div>
  );
}