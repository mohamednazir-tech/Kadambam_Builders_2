import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Trash2, ArrowLeft, Star, Quote, MessageSquare } from "lucide-react";
import { checkAuth, clearAuth } from "@/lib/simple-auth";
import { getAllTestimonials, updateTestimonialStatus, deleteTestimonial, type Testimonial } from "@/lib/testimonials";

const EditTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = checkAuth();
    if (!isAuth) {
      navigate("/admin");
      return;
    }

    loadTestimonials();
  }, [navigate]);

  const loadTestimonials = async () => {
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const success = await updateTestimonialStatus(id, 'approved');
    if (success) {
      loadTestimonials();
      alert('Testimonial approved successfully!');
    } else {
      alert('Failed to approve testimonial. Please try again.');
    }
  };

  const handleReject = async (id: string) => {
    const success = await updateTestimonialStatus(id, 'rejected');
    if (success) {
      loadTestimonials();
      alert('Testimonial rejected successfully!');
    } else {
      alert('Failed to reject testimonial. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const success = await deleteTestimonial(id);
      if (success) {
        loadTestimonials();
        alert('Testimonial deleted successfully!');
      } else {
        alert('Failed to delete testimonial. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Admin
            </button>
            <h1 className="text-xl font-semibold">Manage Testimonials</h1>
          </div>
          <button
            onClick={clearAuth}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Client Reviews</h2>
          <p className="text-muted-foreground">
            Approve, reject, or delete client testimonials. Only approved testimonials will be visible on the website.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Testimonials Yet</h3>
            <p className="text-muted-foreground">
              When clients submit reviews, they will appear here for your approval.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card p-6 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                        {getStatusText(testimonial.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="text-gold fill-gold" size={14} />
                      ))}
                    </div>
                    <div className="flex items-start gap-3">
                      <Quote className="text-gold/30 shrink-0" size={20} />
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {testimonial.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(testimonial.id!)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(testimonial.id!)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(testimonial.id!)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Submitted: {testimonial.created_at ? new Date(testimonial.created_at).toLocaleString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">How it works:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Clients can submit reviews through the website</li>
            <li>• Reviews appear here with "Pending" status</li>
            <li>• Only approved reviews are visible to visitors</li>
            <li>• You can approve, reject, or delete any review</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditTestimonialsPage;
