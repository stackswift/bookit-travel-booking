import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Star, Calendar, Users, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Experience, Slot } from "@/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExperienceDetails();
    }
  }, [id]);

  const fetchExperienceDetails = async () => {
    try {
      const { data: expData, error: expError } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();

      if (expError) throw expError;
      setExperience(expData);

      const { data: slotsData, error: slotsError } = await supabase
        .from("slots")
        .select("*")
        .eq("experience_id", id)
        .gte("date", new Date().toISOString().split("T")[0])
        .gt("available_spots", 0)
        .order("date", { ascending: true })
        .order("time", { ascending: true })
        .limit(20);

      if (slotsError) throw slotsError;
      setSlots(slotsData || []);
    } catch (error) {
      console.error("Error fetching experience:", error);
      toast.error("Failed to load experience details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    navigate(`/checkout/${id}/${selectedSlot}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-96 rounded-xl mb-8" />
          <Skeleton className="w-3/4 h-10 mb-4" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden mb-8 shadow-card">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm text-foreground border-0">
            {experience.category}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{experience.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="font-medium">{experience.rating}</span>
                  <span className="text-muted-foreground">({experience.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{experience.duration_hours} hours</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
            </div>

            {/* Highlights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {experience.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-card">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ₹{experience.price}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Select a Time Slot</h3>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No available slots at the moment
                      </p>
                    ) : (
                      slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-smooth ${
                            selectedSlot === slot.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">
                              {format(parseISO(slot.date), "MMM dd, yyyy")}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {slot.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{slot.available_spots} spots left</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleBookNow}
                  disabled={!selectedSlot || slots.length === 0}
                  className="w-full gradient-hero text-white hover:opacity-90"
                  size="lg"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
