import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Calendar, MapPin, Users, Mail, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Booking, Experience, Slot } from "@/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";

const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (bookingError) throw bookingError;
      setBooking(bookingData);

      const { data: slotData, error: slotError } = await supabase
        .from("slots")
        .select("*")
        .eq("id", bookingData.slot_id)
        .single();

      if (slotError) throw slotError;
      setSlot(slotData);

      const { data: expData, error: expError } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", slotData.experience_id)
        .single();

      if (expError) throw expError;
      setExperience(expData);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!booking || !experience || !slot) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for booking with BookIt. We've sent a confirmation email to {booking.user_email}
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Experience Info */}
              <div>
                <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{experience.location}</span>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-muted-foreground">
                      {format(parseISO(slot.date), "EEEE, MMMM dd, yyyy")} at {slot.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-muted-foreground">{booking.num_guests} person{booking.num_guests > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{booking.user_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{booking.user_phone}</span>
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div className="space-y-2">
                <h4 className="font-semibold mb-3">Payment Summary</h4>
                
                {booking.discount_amount > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Amount</span>
                      <span>₹{(booking.total_price + booking.discount_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount ({booking.promo_code})</span>
                      <span>-₹{booking.discount_amount.toFixed(2)}</span>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary">₹{booking.total_price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Browse More Experiences
            </Button>
            <Button
              onClick={() => window.print()}
              className="flex-1 gradient-hero text-white hover:opacity-90"
              size="lg"
            >
              Print Confirmation
            </Button>
          </div>

          {/* Important Note */}
          <Card className="mt-6 bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-2">Important Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring a valid ID for verification</li>
                <li>Check your email for detailed instructions</li>
                <li>For any changes, contact us at support@bookit.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
