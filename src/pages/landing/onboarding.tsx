import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Onboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    role: '',
    teamSize: '',
    preferences: {
      notifications: true,
      dataSharing: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Process onboarding data
      console.log('Onboarding complete with data:', formData);
      
      // Redirect to dashboard on completion
      router.push('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Welcome to CCO Platform!</h2>
            <p>Let's get your account set up. First, tell us about your company.</p>
            
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="button-group">
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="onboarding-step">
            <h2>Your Role</h2>
            <p>Tell us about your role in the company.</p>
            
            <div className="form-group">
              <label htmlFor="role">Your Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="coo">Chief Operating Officer</option>
                <option value="operations_manager">Operations Manager</option>
                <option value="department_head">Department Head</option>
                <option value="team_lead">Team Lead</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="teamSize">Team Size</label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                required
              >
                <option value="">Select Team Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            
            <div className="button-group">
              <button type="button" onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="onboarding-step">
            <h2>Preferences</h2>
            <p>Set your account preferences.</p>
            
            <div className="form-group checkbox">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={handleChange}
              />
              <label htmlFor="notifications">
                Receive email notifications about updates and insights
              </label>
            </div>
            
            <div className="form-group checkbox">
              <input
                id="dataSharing"
                name="dataSharing"
                type="checkbox"
                checked={formData.preferences.dataSharing}
                onChange={handleChange}
              />
              <label htmlFor="dataSharing">
                Share anonymous usage data to help improve the platform
              </label>
            </div>
            
            <div className="button-group">
              <button type="button" onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button type="submit" onClick={handleSubmit} className="btn-primary">
                Complete Setup
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Onboarding - CCO Platform</title>
      </Head>
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
        </form>
      </div>
    </>
  );
};

export default Onboarding; 