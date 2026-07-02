import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-sm text-gray-900">{question}</span>
        <i className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} data-lucide="chevron-down"></i>
      </button>
      <div className={`px-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-sm text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => (
  <section className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
    <div className="flex flex-col gap-3">
      <FAQItem 
        question="How do I create a new task?" 
        answer="Click the 'Create' button in the top right corner, fill in the task details, and click 'Save' to create your task."
      />
      <FAQItem 
        question="Can I assign tasks to multiple users?" 
        answer="Yes, you can assign tasks to multiple team members by selecting them from the assignee dropdown when creating or editing a task."
      />
      <FAQItem 
        question="How do I change my notification settings?" 
        answer="Go to Settings > Notification Settings to customize your notification preferences for different types of updates."
      />
      <FAQItem 
        question="What are the different task statuses?" 
        answer="Tasks can have statuses like To Do, In Progress, In Review, and Completed. You can change these by dragging tasks between columns or editing the task."
      />
    </div>
  </section>
);

export default FAQSection;
