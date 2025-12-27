import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Paste any text, email, or receipt, and let our AI instantly generate a complete, professional invoice for you.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get smart, actionable insights about your business finances, generated automatically by our AI analyst.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically generate polite and effective payment reminder emails for overdue invoices with a single click.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all your invoices, track payments, and send reminders for overdue payments.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "This app saved me hours of work. I can now create and send invoices in minutes!",
    author: "Jane Doe",
    title: "Freelance Designer",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=JD",
  },
  {
    quote:
      "The best invoicing app I have ever used. Simple, intuitive, and powerful.",
    author: "John Smith",
    title: "Small Business Owner",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=JS",
  },
  {
    quote:
      "I love the dashboard and reporting features. It helps me keep track of my finaces.",
    author: "Peter Jones",
    title: "Consultant",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=PJ",
  },
];

export const FAQS = [
  {
    question: "How does the AI invoice creation work?",
    answer:
      "Simply paste any text that contains invoice details, such as an email or a list of items, and our AI will automatically generate a professional invoice for you."
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, you can try our platform for free for 14 days. During the trial period, you will have access to all core features without any commitment."
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Of course. Our pricing plans are flexible and scale with your company, and you can change or upgrade your plan at any time by contacting our support team."
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We understand that things change. You can cancel your subscription at any time, and there are no long-term contracts or cancellation fees."
  },
  {
    question: "Can other information be added to an invoice?",
    answer:
      "Yes, you can add additional details such as notes, payment terms, tax information, and even attach files directly to your invoices."
  },
  {
    question: "How does billing work?",
    answer:
      "Billing is handled per workspace rather than per account. You can upgrade or manage individual workspaces based on your business needs."
  },
  {
    question: "How do I change my account email?",
    answer:
      "You can update your account email address at any time from the profile settings page in your account dashboard."
  }
];

// Navigation items configuration
export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "Create Invoice", icon: Plus },
  { id: "profile", name: "Profile", icon: Users },
];