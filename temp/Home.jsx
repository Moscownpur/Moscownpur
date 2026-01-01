import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Users, MessageCircle, Shield, Brain, ZapOff, Sparkles, Lock } from "lucide-react";
import MoscownpurLogo from "../components/ui/MoscownpurLogo.jsx";

const Home = () => {
  const { primaryColor } = useTheme();

  useEffect(() => {
    document.title = "Where Creators Truly Connect | Moscownpur Circles";
  }, []);

  const bgPrimaryStyle = { backgroundColor: 'var(--primary-color)' };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--primary-color)] selection:text-black font-sans relative overflow-hidden">

      {/* 🌌 WHOLE PAGE BACKGROUND LOGO 🌌 */}
      <div className="fixed -bottom-[30%] -right-[30%] w-[130vmin] h-[130vmin] pointer-events-none z-0 opacity-20 flex items-center justify-center">
        <MoscownpurLogo
          className="w-full h-full text-[var(--primary-color)] animate-[spin_60s_linear_infinite]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">

        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl tracking-wide leading-none font-bungee grid gap-4">
              Moscownpur
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--primary-color)] to-white">
                Circles
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white font-bungee mt-8">
              Where Creators Truly Connect
            </p>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed pt-8 font-light">
              The private social layer of <span className="font-semibold text-white">MosCownpur</span> —<br />
              designed for creators who value depth over reach and conversation over noise.
            </p>
          </div>
        </section>

        <Separator className="bg-white/10 max-w-4xl mx-auto" />

        {/* --- INTRO SECTION --- */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-2xl md:text-3xl font-bungee leading-relaxed text-gray-200">
              "Inside Circles, writers, worldbuilders, and designers come together in small, trusted communities to discuss ideas, exchange feedback, and grow their universes collaboratively."
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-gray-400 font-nerko text-xl tracking-wide">
              <span className="flex items-center gap-2"><ZapOff className="w-5 h-5 text-red-400" /> No distractions</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2"><ZapOff className="w-5 h-5 text-red-400" /> No performative feeds</span>
              <span className="text-white/20">•</span>
              <span className="text-white">Just people who care about building better worlds.</span>
            </div>
          </div>
        </section>

        {/* --- WHAT ARE CIRCLES? --- */}
        <section className="py-20 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="px-4 py-1 border-[var(--primary-color)] text-[var(--primary-color)] uppercase tracking-widest">Concept</Badge>
              <h2 className="text-5xl md:text-6xl font-bungee text-white">What Are Circles?</h2>
              <p className="text-gray-400 text-xl font-bungee">
                Intentional micro-communities within MosCownpur.
                <Link to="/lexicon" className="ml-2 text-[var(--primary-color)] hover:underline">Explore the Lexicon</Link>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-[var(--primary-color)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <Brain className="w-6 h-6 text-white group-hover:text-[var(--primary-color)]" />
                </div>
                <h3 className="text-2xl font-bungee mb-4">Focus</h3>
                <p className="text-gray-400 leading-relaxed">Each Circle is built around shared interests — a universe, a genre, a project, or a creative goal.</p>
              </div>

              <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-[var(--primary-color)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <Lock className="w-6 h-6 text-white group-hover:text-[var(--primary-color)]" />
                </div>
                <h3 className="text-2xl font-bungee mb-4">Privacy</h3>
                <p className="text-gray-400 leading-relaxed">Private by default. A sanctuary where your conversations remain clear, meaningful, and safe.</p>
              </div>

              <div className="bg-black/40 border border-white/10 p-8 rounded-3xl hover:border-[var(--primary-color)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-white group-hover:text-[var(--primary-color)]" />
                </div>
                <h3 className="text-2xl font-bungee mb-4">Depth</h3>
                <p className="text-gray-400 leading-relaxed">Built for long-form, thoughtful discussion. As your universe grows, your connections deepen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY MOSCOWNPUR CIRCLES --- */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bungee mb-16 text-center">Why Moscownpur Circles?</h2>

            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <h3 className="text-3xl font-nerko text-[var(--primary-color)]">Designed for Creators</h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl text-gray-300 font-bungee mb-2">Circles are not social media.</p>
                  <p className="text-gray-400 leading-relaxed">They are collaborative spaces where ideas are respected and explored deeply.</p>
                </div>
              </div>
              <Separator className="bg-white/5" />

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <h3 className="text-3xl font-nerko text-[var(--primary-color)]">Signal Over Noise</h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl text-gray-300 font-bungee mb-2">No engagement bait. No algorithms.</p>
                  <p className="text-gray-400 leading-relaxed">Your Circle decides the pace and direction. Focus on what truly matters.</p>
                </div>
              </div>
              <Separator className="bg-white/5" />

              {/* Feature 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <h3 className="text-3xl font-nerko text-[var(--primary-color)]">Trust & Privacy First</h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl text-gray-300 font-bungee mb-2">Small groups foster honesty.</p>
                  <p className="text-gray-400 leading-relaxed">Share early drafts, raw ideas, and half-formed thoughts without fear of judgment.</p>
                </div>
              </div>
              <Separator className="bg-white/5" />

              {/* Feature 4 */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <h3 className="text-3xl font-nerko text-[var(--primary-color)]">Seamless Integration</h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-xl text-gray-300 font-bungee mb-2">Connected to your Universe.</p>
                  <p className="text-gray-400 leading-relaxed">Discuss characters, timelines, and worlds while staying connected to the systems you already use in MosCownpur.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- NARRATIVE OS & AUDIENCE --- */}
        <section className="py-24 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

            {/* Narrative OS Side */}
            <div className="space-y-8 p-8 rounded-3xl bg-black/20 border border-white/5">
              <h3 className="text-4xl font-nerko">The Narrative OS</h3>
              <p className="text-2xl font-bungee text-gray-300 leading-relaxed">
                "MosCownpur is your <span className="text-[var(--primary-color)]">Narrative Engine</span>.<br /> Circles are where its creators meet."
              </p>
              <p className="text-gray-400">If MosCownpur helps you build worlds, Circles help you build together.</p>
            </div>

            {/* Audience Side */}
            <div className="space-y-8">
              <h3 className="text-4xl font-nerko">Who Circles Are For</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-xl group">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">1</span>
                  <span className="text-gray-300">Writers building long-form universes</span>
                </li>
                <li className="flex items-center gap-4 text-xl group">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">2</span>
                  <span className="text-gray-300">Game designers crafting lore-heavy worlds</span>
                </li>
                <li className="flex items-center gap-4 text-xl group">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">3</span>
                  <span className="text-gray-300">Storytellers collaborating with trusted peers</span>
                </li>
                <li className="flex items-center gap-4 text-xl group">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm group-hover:border-[var(--primary-color)] group-hover:text-[var(--primary-color)] transition-colors">4</span>
                  <span className="text-gray-300">Creators who prefer substance over scale</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 px-6 text-center">
          <h2 className="text-6xl md:text-8xl mb-4 font-nerko">Join Circles</h2>

          <p className="text-2xl md:text-3xl text-gray-400 font-bungee mb-12">
            Find your people. Build better worlds — together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="rounded-full px-12 py-8 text-xl text-black font-bold font-nerko tracking-wide transition-transform hover:scale-105"
                style={bgPrimaryStyle}
              >
                Start Meaningful Conversations
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
