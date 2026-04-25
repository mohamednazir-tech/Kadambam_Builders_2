import { supabase } from './supabase';

export interface GuideContent {
  id?: string;
  title: string;
  hero_description: string;
  cost_basic: string;
  cost_premium: string;
  sample_calculation: string;
  materials: string;
  legal_docs: string;
  legal_regs: string;
  timeline: string;
  created_at?: string;
  updated_at?: string;
}

export const getGuideContent = async (): Promise<GuideContent | null> => {
  try {
    const { data, error } = await supabase
      .from('guide_content')
      .select('*')
      .eq('id', 'guide-page')
      .maybeSingle();

    if (error) {
      console.error('Error fetching guide content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching guide content:', error);
    return null;
  }
};

export const updateGuideContent = async (content: Partial<GuideContent>): Promise<GuideContent | null> => {
  try {
    const { data, error } = await supabase
      .from('guide_content')
      .upsert([{ 
        id: 'guide-page',
        ...content,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error updating guide content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving guide content:', error);
    return null;
  }
};

// Fallback default content
export const defaultGuideContent: GuideContent = {
  title: "Building Construction in Tirunelveli: Complete Cost Guide 2026",
  hero_description: "Everything you need to know about building a home in Tirunelveli - from costs and materials to construction timeline and legal requirements.",
  cost_basic: "₹1,600 - ₹1,900/sq.ft",
  cost_premium: "₹2,200 - ₹3,000/sq.ft",
  sample_calculation: "Construction Cost (₹1,750/sq.ft): ₹21,00,000\nGovernment Approvals & Fees: ₹1,50,000\nInterior Finishes: ₹3,00,000\nTotal Estimated Cost: ₹25,50,000",
  materials: "Foundation:\n• M20 Grade Concrete\n• Fe500 Steel Bars\n• Waterproof Chemicals\n• Country Bricks (Local)\n\nWalls & Roof:\n• Solid Concrete Blocks\n• Weather-resistant Paint\n• Clay Roof Tiles\n• Heat Insulation\n\nFinishing:\n• Ceramic Tiles\n• Wooden Windows\n• Marine Plywood\n• Anti-corrosive Fittings",
  legal_docs: "• Parent Document / Sale Deed\n• Encumbrance Certificate\n• Patta and Chitta\n• Approved Building Plan\n• Commencement Certificate\n• Completion Certificate",
  legal_regs: "• FSI/FAR rules as per DTCP\n• Setback requirements\n• Height restrictions\n• Rainwater harvesting mandatory\n• Septic tank norms\n• Tree plantation requirements",
  timeline: "1-2 Months: Planning & Approvals\n2-3 Months: Foundation & Structure\n2-3 Months: Finishing Work\n1 Month: Inspection & Handover\n\nTotal: 6-9 Months (For a standard 2BHK house - 1200 sq.ft)"
};
