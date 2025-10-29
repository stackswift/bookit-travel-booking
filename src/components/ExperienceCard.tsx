import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Link to={`/experience/${experience.id}`}>
      <Card className="group relative overflow-hidden gradient-border hover:shadow-xl-custom transition-smooth cursor-pointer h-full bg-card/50 backdrop-blur-sm border-white/10">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"></div>
        
        <div className="relative overflow-hidden aspect-[4/3]">
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
          
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
          
          {/* Category badge with glow */}
          <Badge className="absolute top-4 right-4 z-20 glass-strong text-foreground border-white/20 font-semibold px-3 py-1 shadow-primary">
            <Sparkles className="w-3 h-3 mr-1 text-accent" />
            {experience.category}
          </Badge>

          {/* Rating badge */}
          <div className="absolute top-4 left-4 z-20 glass-strong px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1 shadow-secondary">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-bold text-sm">{experience.rating}</span>
          </div>
        </div>
        
        <CardContent className="relative p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">{experience.location}</span>
          </div>
          
          <h3 className="font-bold text-xl line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-smooth">
            {experience.title}
          </h3>
          
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {experience.description}
          </p>

          <div className="flex items-center gap-4 text-sm pt-2">
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="font-semibold">{experience.rating}</span>
              <span className="text-muted-foreground text-xs">({experience.review_count})</span>
            </div>
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span className="font-semibold">{experience.duration_hours}h</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative p-5 pt-0 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ₹{experience.price}
              </span>
              <span className="text-sm text-muted-foreground font-medium">/person</span>
            </div>
          </div>
          
          <div className="glass-strong px-4 py-2 rounded-full border border-white/20 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:border-transparent transition-smooth group-hover:shadow-primary">
            <span className="text-sm font-bold group-hover:text-white transition-smooth">Book Now</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
