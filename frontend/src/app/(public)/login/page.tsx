"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function Login() {

  const router = useRouter();

  const handleGoogleLogin = async () => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/loginWithGoogle`, {
      method: "POST",
      credentials : "include",
    });
    const data = await response.json();

    if(data?.url){
      router.push(data?.url);
    }
    else{
      toast.error("Failed to initiate Google login. Please try again later.");
    }
  }
  catch(e){
    console.error("Error initiating Google login:", e);
    toast.error( "An error occurred while initiating Google login. Please try again later.");
  }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background-primary relative overflow-hidden font-outfit px-4 pt-32 pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full animate-pulse transition-all duration-1000 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        {/* Simplified Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-linear-to-r from-transparent to-blue-500/30" />
            <p className="text-sm font-semibold text-text-secondary italic">
              Har delivery ka hisaab, ek hi app mein
            </p>
            <div className="h-px w-8 bg-linear-to-l from-transparent to-blue-500/30" />
          </div>
        </div>

        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-950/50 border-white/30 dark:border-gray-800/60 shadow-[0_20px_50px_rgba(31,38,135,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden group/card relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-50 pointer-events-none" />
          
          <CardHeader className="border-none bg-transparent pt-10 pb-4 relative z-10 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Welcome Back</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pb-10 pt-4 relative z-10 px-8">
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleGoogleLogin}
                variant="outline" 
                className="w-full py-8 rounded-[1.25rem] border-border-primary bg-white/60 dark:bg-gray-900/40 backdrop-blur-md text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group/btn"
              >
                <Image src="/google.svg" alt="Google" width={22} height={22} className="mr-3" />
                Continue with Google
                <ArrowRight className="ml-auto h-5 w-5 opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full py-8 rounded-[1.25rem] border-border-primary bg-white/60 dark:bg-gray-900/40 backdrop-blur-md text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group/btn"
              >
                <Github className="mr-3 h-5 w-5 text-gray-900 dark:text-white" />
                Continue with GitHub
                <ArrowRight className="ml-auto h-5 w-5 opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
              </Button>
            </div>

            <div className="flex flex-col gap-4 pt-4">
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border-primary dark:border-gray-800 opacity-50"></span>
                </div>
              </div>
              <p className="text-center text-[11px] text-text-tertiary px-4 leading-relaxed font-medium">
                By logging in, you agree to our <Link href="#" className="underline-offset-2 hover:underline text-blue-500/80">Terms</Link> & <Link href="#" className="underline-offset-2 hover:underline text-blue-500/80">Privacy Policy</Link>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="mt-10 flex flex-col items-center gap-4 text-sm font-medium animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <p className="text-text-secondary">
            Having trouble signing in?
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/support"
          >
            <span>Get help</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/support:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
