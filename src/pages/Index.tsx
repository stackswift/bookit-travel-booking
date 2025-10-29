import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Experience } from "@/types";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Index = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with animated background */}
      <section className="relative overflow-hidden py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-full border border-white/20 mb-4 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-semibold">Trusted by 50K+ Adventurers</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="block mb-2">Discover</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
                Epic Experiences
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Book unique adventures and create{" "}
              <span className="text-accent font-semibold">unforgettable memories</span>{" "}
              around the world
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => {
                  const experiencesSection = document.querySelector('#experiences-section');
                  experiencesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-8 py-4 rounded-full overflow-hidden shadow-primary hover:shadow-xl-custom transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-smooth"></div>
                <span className="relative z-10 font-bold text-lg text-white flex items-center gap-2">
                  Explore Now
                  <span className="group-hover:translate-x-1 transition-smooth">→</span>
                </span>
              </button>

              <button
                onClick={() => {
                  const experiencesSection = document.querySelector('#experiences-section');
                  experiencesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-strong px-8 py-4 rounded-full border border-white/20 hover:border-primary/50 transition-smooth font-bold text-lg cursor-pointer"
              >
                View Deals
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground mt-1">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section id="experiences-section" className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Popular Experiences
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from our curated collection of world-class adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {experiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ExperienceCard experience={experience} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Index;
