import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Experience, Slot } from "@/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const Checkout = () => {
  const { experienceId, slotId } = useParams();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    promoCode: "",
  });

  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [experienceId, slotId]);

  const fetchData = async () => {
    try {
      const { data: expData, error: expError } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", experienceId)
        .single();

      if (expError) throw expError;
      setExperience(expData);

      const { data: slotData, error: slotError } = await supabase
        .from("slots")
        .select("*")
        .eq("id", slotId)
        .single();

      if (slotError) throw slotError;
      setSlot(slotData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load booking details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim() || !experience) return;

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", formData.promoCode.toUpperCase())
        .eq("active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid promo code");
        return;
      }

      const subtotal = experience.price * formData.guests;

      if (subtotal < data.min_amount) {
        toast.error(`Minimum order amount is ₹${data.min_amount}`);
        return;
      }

      let discount = 0;
      if (data.type === "percentage") {
        discount = (subtotal * data.value) / 100;
      } else {
        discount = data.value;
      }

      setPromoDiscount(discount);
      setPromoApplied(true);
      toast.success(`Promo code applied! You saved ₹${discount.toFixed(2)}`);
    } catch (error) {
      console.error("Error applying promo:", error);
      toast.error("Failed to apply promo code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!experience || !slot) return;

    if (formData.guests > slot.available_spots) {
      toast.error(`Only ${slot.available_spots} spots available`);
      return;
    }

    setSubmitting(true);

    try {
      const subtotal = experience.price * formData.guests;
      const finalPrice = subtotal - promoDiscount;

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          slot_id: slotId,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          num_guests: formData.guests,
          total_price: finalPrice,
          promo_code: promoApplied ? formData.promoCode.toUpperCase() : null,
          discount_amount: promoDiscount,
          status: "confirmed",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update slot availability
      const { error: updateError } = await supabase
        .from("slots")
        .update({ available_spots: slot.available_spots - formData.guests })
        .eq("id", slotId);

      if (updateError) throw updateError;

      toast.success("Booking confirmed!");
      navigate(`/confirmation/${bookingData.id}`);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
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

  if (!experience || !slot) {
    return null;
  }

  const subtotal = experience.price * formData.guests;
  const total = subtotal - promoDiscount;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests *</Label>
                    <Input
                      id="guests"
                      type="number"
                      required
                      min={1}
                      max={slot.available_spots}
                      value={formData.guests}
                      onChange={(e) => {
                        setFormData({ ...formData, guests: parseInt(e.target.value) });
                        setPromoApplied(false);
                        setPromoDiscount(0);
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      {slot.available_spots} spots available
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={formData.promoCode}
                        onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                        placeholder="Enter promo code"
                        disabled={promoApplied}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={promoApplied || !formData.promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-primary font-medium">
                        ✓ Promo code applied successfully
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gradient-hero text-white hover:opacity-90"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${total.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-card">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{experience.title}</h4>
                  <p className="text-sm text-muted-foreground">{experience.location}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {format(parseISO(slot.date), "MMM dd, yyyy")} • {slot.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium">{formData.guests}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{experience.price} × {formData.guests} guest{formData.guests > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount ({formData.promoCode})</span>
                      <span>-₹{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
