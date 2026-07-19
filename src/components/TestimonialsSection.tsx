import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, Quote, Send, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getApprovedTestimonials, submitTestimonial, type Testimonial } from "@/lib/testimonials";
import { supabase } from "@/lib/supabase";

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getApprovedTestimonials();
      setTestimonials(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

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
        () => {
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-slide with smooth transition
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, testimonials.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, testimonials.length, goToSlide]);

  // Handle submit
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
    <section id="testimonials" className="section-padding bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div ref={ref} className={`container mx-auto relative ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
        {/* Header with sparkle */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-3">
            <Sparkles size={14} />
            <span>What Our Clients Say</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Client <span className="text-gold relative">
              Testimonials
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gold/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-muted-foreground mt-2">Real experiences from real people</p>
        </div>

        {isLoading ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-xl animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="h-20 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            {/* Main Testimonial Card */}
            <div className="relative">
              <div className={`bg-card rounded-2xl p-8 md:p-10 shadow-xl border border-border/50 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-gold/10">
                  <Quote size={80} />
                </div>
                <div className="absolute bottom-4 left-4 text-gold/5">
                  <Quote size={60} className="rotate-180" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                      <Star key={i} className="text-gold fill-gold" size={20} />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground/90 text-center leading-relaxed mb-6">
                    "{testimonials[currentIndex].text}"
                  </blockquote>

                  {/* Author */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold/70 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">
                        {testimonials[currentIndex].name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Satisfied Client
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background hover:bg-gold hover:text-white text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-border/50"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-background hover:bg-gold hover:text-white text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-border/50"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center items-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-10 h-2 bg-gold rounded-full' 
                      : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mt-4">
              <span className="text-xs text-muted-foreground">
                {isAutoPlaying ? '● Auto-sliding' : '● Paused'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="text-gold" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">No Reviews Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your experience with Kadambam Builders!
            </p>
          </div>
        )}

        {/* Add Review Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="group inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-md mx-auto mt-8 bg-card p-6 rounded-2xl shadow-xl border border-border/50 animate-fade-up">
            <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold transition"
                  maxLength={50}
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Share your experience..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px] resize-vertical transition"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.text.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`transition-colors ${
                          star <= form.rating 
                            ? 'text-gold fill-gold' 
                            : 'text-gray-300'
                        }`} 
                        size={28} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
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