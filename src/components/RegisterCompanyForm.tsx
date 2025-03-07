
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText, 
  DollarSign, 
  AlertCircle
} from 'lucide-react';

const RegisterCompanyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    founderName: '',
    email: '',
    phone: '',
    industry: '',
    description: '',
    initialShare: '1000',
    sharePrice: '10',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.founderName.trim()) {
      newErrors.founderName = 'Founder name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }
    
    if (!formData.initialShare.trim() || isNaN(Number(formData.initialShare))) {
      newErrors.initialShare = 'Valid number of shares is required';
    }
    
    if (!formData.sharePrice.trim() || isNaN(Number(formData.sharePrice))) {
      newErrors.sharePrice = 'Valid share price is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Get the current user ID if available
        const { data: { user } } = await supabase.auth.getUser();
        const ownerId = user?.id;

        // Insert company data into Supabase
        const { data, error } = await supabase
          .from('companies')
          .insert([
            { 
              name: formData.companyName,
              founder_name: formData.founderName,
              email: formData.email,
              phone: formData.phone,
              industry: formData.industry,
              description: formData.description,
              initial_shares: parseInt(formData.initialShare),
              share_price: parseFloat(formData.sharePrice),
              owner_id: ownerId || null,
              // Initialize trading values
              total_shares: parseInt(formData.initialShare),
              available_shares: parseInt(formData.initialShare),
              current_price: parseFloat(formData.sharePrice),
              market_cap: parseInt(formData.initialShare) * parseFloat(formData.sharePrice),
              public_shares_percent: 100
            }
          ])
          .select();

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Company registration submitted successfully! Your application will be reviewed.",
        });
        
        // Redirect after successful submission
        navigate('/market');
      } catch (error: any) {
        console.error('Error submitting company:', error);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message || "There was an error submitting your company registration.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-sebba-blue p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <Building className="mr-2" /> Register Your Company
          </h1>
          <p className="mt-2 text-blue-100">
            List your company on SEBBA and raise capital through our student stock exchange
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., Tech Innovators"
                />
              </div>
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.companyName}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="founderName" className="block text-sm font-medium text-gray-700">
                Founder Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="founderName"
                  name="founderName"
                  value={formData.founderName}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.founderName ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., John Smith"
                />
              </div>
              {errors.founderName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.founderName}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., contact@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., (123) 456-7890"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.phone}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={18} className="text-gray-400" />
                </div>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.industry ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                >
                  <option value="">Select an industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Food">Food & Beverage</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.industry}
                </p>
              )}
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="Describe your company, business model, and growth potential (min 50 characters)"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="initialShare" className="block text-sm font-medium text-gray-700">
                Initial Shares to Issue *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="initialShare"
                  name="initialShare"
                  value={formData.initialShare}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 block w-full rounded-md border ${
                    errors.initialShare ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., 1000"
                />
              </div>
              {errors.initialShare && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.initialShare}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sharePrice" className="block text-sm font-medium text-gray-700">
                Initial Share Price ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="sharePrice"
                  name="sharePrice"
                  value={formData.sharePrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className={`pl-10 block w-full rounded-md border ${
                    errors.sharePrice ? 'border-red-300' : 'border-gray-300'
                  } py-2 px-3 shadow-sm focus:border-sebba-blue focus:outline-none focus:ring-1 focus:ring-sebba-blue`}
                  placeholder="e.g., 10.00"
                />
              </div>
              {errors.sharePrice && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.sharePrice}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> All company listings are subject to approval by the SEBBA review committee. 
                We will contact you within 3-5 business days regarding the status of your application.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn bg-white text-sebba-blue border border-sebba-blue mr-4 hover:bg-sebba-blue hover:bg-opacity-10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn bg-sebba-blue text-white hover:bg-opacity-90"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompanyForm;
