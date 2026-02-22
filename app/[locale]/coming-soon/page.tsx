import React from "react";
import { MoveRight } from "lucide-react";

export default function ComingSoonPage() {
  return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0b] relative overflow-hidden font-sans">
              {/* Background Decorative Elements */}
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />

              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

              <main className="relative z-10 w-full max-w-4xl px-6 text-center space-y-12">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in slide-in-from-top duration-1000">
                          <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-3 animate-pulse" />
                          <span className="text-white/70 text-sm font-medium tracking-wide uppercase">Launching Spring 2026</span>
                    </div>

                    {/* Hero Section */}
                    <section className="space-y-6">
                          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white animate-in zoom-in duration-1000">
                                Something <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-[length:200%_auto] animate-gradient">
                                      Phenomenal
                                </span>
                                <br />
                                is Coming.
                          </h1>

                          <p className="max-w-xl mx-auto text-white/40 text-lg md:text-xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                We are redefining the marketplace experience. A new era of buying, selling, and AI-powered discovery is almost here.
                          </p>
                    </section>

                    {/* Interactive Element */}
                    <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                          <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                <button className="relative px-8 py-4 bg-white text-black font-semibold rounded-xl flex items-center gap-2 hover:bg-white/90 transition-all duration-300 transform group-hover:translate-y-[-2px]">
                                      Notify Me
                                      <MoveRight className="w-4 h-4" />
                                </button>
                          </div>
                          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                                Be an Early Adopter
                          </button>
                    </div>

                    {/* Footer info */}
                    <footer className="pt-20 text-white/20 text-sm tracking-widest uppercase animate-in fade-in duration-1000 delay-1000">
                          &copy; 2026 BuyOrSell UAE. All Rights Reserved.
                    </footer>
              </main>

              <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
