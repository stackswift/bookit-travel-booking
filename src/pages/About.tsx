import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Heart, Shield, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              About BookIt
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're on a mission to help people discover and book unforgettable experiences
            around the world. From scuba diving adventures to mountain treks, cultural tours
            to culinary journeys—we connect you with amazing moments.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                At BookIt, we believe that life is meant to be explored. We're passionate about
                creating a platform that makes it easy for adventurers like you to discover,
                book, and enjoy unique experiences that create lasting memories.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're seeking adrenaline-pumping activities, cultural immersion, or
                peaceful getaways, we curate the best experiences from trusted providers around
                the globe.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <Card className="relative glass-strong border-white/10 overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary">
                        <Compass className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Discover</h3>
                        <p className="text-sm text-muted-foreground">
                          Explore curated experiences from around the world
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-secondary to-accent">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Connect</h3>
                        <p className="text-sm text-muted-foreground">
                          Join a community of passionate adventurers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-accent to-primary">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Trust</h3>
                        <p className="text-sm text-muted-foreground">
                          Book with confidence through our secure platform
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-strong border-white/10 hover:shadow-card transition-smooth">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  We carefully vet every experience and provider to ensure you receive
                  the highest quality adventures.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/10 hover:shadow-card transition-smooth">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Focused</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We're here to support you every step
                  of your journey.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/10 hover:shadow-card transition-smooth">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously improve our platform to make discovering and booking
                  experiences easier than ever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-strong border-white/10 overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-12">By the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">Experiences</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-muted-foreground">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                    100+
                  </div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    4.9★
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
