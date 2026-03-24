import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      {/* Fondo con aura esmeralda sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black -z-10" />
      
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: '#10b981', // Verde Esmeralda ALG
            colorTextOnPrimaryBackground: '#000000',
            colorBackground: '#18181b', // zinc-900
            colorText: '#ffffff',
            colorInputBackground: '#27272a', // zinc-800
            colorInputText: '#ffffff',
          },
          elements: {
            card: "border border-emerald-500/20 shadow-2xl shadow-emerald-500/5",
            headerTitle: "text-2xl font-bold uppercase tracking-tighter",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-all",
            formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest",
            footerActionLink: "text-emerald-400 hover:text-emerald-300"
          }
        }}
      />
    </div>
  );
}