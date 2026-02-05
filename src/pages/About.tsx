
import { ArrowLeft, Github, Linkedin, Mail, Twitter, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

import lumaLogoDk from "@/assets/luma-logo-dk.png";
import lumaLogoLt from "@/assets/luma-logo-lt.png";
import profilePic from "@/assets/profile-pic.png";
import { useTheme } from "@/contexts/ThemeContext";


const About = () => {
  const { isNight } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <SEO title="About" description="Learn more about Luma Weather." />
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">About Luma</h1>
            </div>

            <div className="flex justify-center pt-4 pb-0">
              <img
                src={isNight ? lumaLogoDk : lumaLogoLt}
                alt="Luma Weather Logo"
                className="h-32 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          {/* Intro Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-card p-8 shadow-sm border"
          >
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Luma Weather isn't your typical weather app. It was built to bring a little cuteness to your daily forecast!
                <br /><br />
                Most weather apps feel a bit cold and robotic to me, so I created Luma to be soft, friendly, and just...really cute.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mt-4">
                The name "Luma" comes from the Latin word <em>lumen</em> (light). It makes me think of sunshine, good vibes, and making your day a little brighter! ✨
              </p>
            </div>
          </motion.div>


          {/* Features */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold px-2">Cool Stuff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Smart Geolocation", desc: "'Find me' button gets your current location" },
                { title: "Night Shift", desc: "Colors change with the time of day" },
                { title: "Outfit Tips", desc: "Tells you if you might need an umbrella or a jacket" },
                { title: "Privacy First", desc: "Your location stays on your device" },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-3xl bg-card border shadow-sm flex flex-col gap-2">
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold px-2">Built With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "React", desc: "Core Framework" },
                { name: "TypeScript", desc: "Type Safety" },
                { name: "Vite", desc: "Super Fast Build" },
                { name: "Tailwind", desc: "Styling" },
                { name: "Framer", desc: "Animations" },
                { name: "Shadcn UI", desc: "Components" },
                { name: "Lucide", desc: "Icons" },
                { name: "React Router", desc: "Navigation" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-2xl bg-secondary/50 border border-border/50"
                >
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>



          {/* My Links */}
          <motion.div variants={itemVariants} className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold px-2">The Developer</h2>
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 border border-indigo-500/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-full overflow-hidden shadow-lg border-2 border-indigo-500/20">
                  <img src={profilePic} alt="Crystal Reyes" className="h-full w-full object-cover" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-lg font-bold">Crystal Reyes</h3>
                  <p className="text-muted-foreground">Frontend Engineer & UX Enthusiast</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://crystalreyes.dev"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </a>
                  <a
                    href="https://github.com/crystalgardner"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Github className="h-4 w-4" />
                    </Button>
                  </a>
                  <a
                    href="https://linkedin.com/in/crystalreyesdev"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="mailto:hi@crystalreyes.dev">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div >
  );
};

export default About;
