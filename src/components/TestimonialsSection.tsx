import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, Quote, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { getApprovedTestimonials, submitTestimonial, type Testimonial } from "@/lib/testimonials";
import { supabase } from "@/lib/supabase";

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch testimonials
  const fetchTestimonials = async () => {
    const data = await getApprovedTestimonials();
    setTestimonials(data);
  };

  useEffect(() => {
    fetchTestimonials();

    // Set up real-time subscription for new approved testimonials
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials',
          filter: 'status=eq.approved'
        },
        (payload) => {
          console.log('Testimonials changed:', payload);
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.text.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (form.text.length < 10) {
      alert("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    
    const success = await submitTestimonial({
      name: form.name.trim(),
      text: form.text.trim(),
      rating: form.rating
    });

    if (success) {
      setForm({ name: "", text: "", rating: 5 });
      setShowForm(false);
      alert("Thank you for your review! It will be visible after admin approval.");
    } else {
      alert("Failed to submit review. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <section id="testimonials" className="section-padding bg-muted">
      <div ref={ref} className={`container mx-auto ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          Client <span className="text-gold">Testimonials</span>
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mb-12 rounded-full" />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card rounded-lg p-6 shadow-sm">
              <Quote className="text-gold/30 mb-3" size={32} />
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="text-gold fill-gold" size={14} />
                ))}
              </div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
            </div>
          ))}
        </div>

        {/* Add Review Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gold text-accent-foreground px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
          >
            <Send size={18} />
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-md mx-auto mt-8 bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  maxLength={50}
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Share your experience with Kadambam Builders..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px] resize-vertical"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.text.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1"
                    >
                      <Star 
                        className={`transition-colors ${
                          star <= form.rating 
                            ? 'text-gold fill-gold' 
                            : 'text-gray-300'
                        }`} 
                        size={24} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-accent-foreground py-3 rounded-md font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Your review will be visible after admin approval
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
