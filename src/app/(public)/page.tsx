"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Users, Briefcase, TrendingUp, Shield, 
  MessageSquare, Star, Search, FileCheck, Handshake, 
  CheckCircle2, DollarSign, Sparkles, Zap, Target, Globe,
  Play, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAccent } from "@/components/ui/card";

const stats = [
  { label: "Active Creators", value: "2,500+", icon: Users },
  { label: "Brands Onboarded", value: "150+", icon: Briefcase },
  { label: "Campaigns Completed", value: "500+", icon: Target },
  { label: "NPR Earned", value: "10M+", icon: DollarSign },
];

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    description: "AI-powered creator matching based on niche, audience, and engagement metrics.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Briefcase,
    title: "Campaign Management",
    description: "Create, manage, and track campaigns with detailed analytics and reporting.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Real-time metrics, ROI tracking, and engagement insights for every campaign.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Protected payments with milestone-based releases for worry-free collaborations.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Built-in communication tools for seamless brand-creator collaboration.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Star,
    title: "Verified Profiles",
    description: "All creators are vetted and verified to ensure quality partnerships.",
    color: "from-indigo-500 to-violet-500",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and build your professional profile showcasing your audience and expertise.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Discover Opportunities",
    description: "Browse campaigns or let our AI match you with perfect brand partnerships.",
    icon: Search,
  },
  {
    step: "03",
    title: "Collaborate & Create",
    description: "Connect with brands, negotiate terms, and create amazing content together.",
    icon: Handshake,
  },
  {
    step: "04",
    title: "Get Paid Securely",
    description: "Receive payments through our secure escrow system upon campaign completion.",
    icon: DollarSign,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for creators getting started",
    features: [
      "Basic creator profile",
      "Browse all campaigns",
      "Apply to 5 campaigns/month",
      "Standard support",
      "Basic analytics",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "NPR 2,999",
    period: "/month",
    description: "For serious creators and growing brands",
    features: [
      "Enhanced profile & portfolio",
      "Unlimited campaign applications",
      "Priority matching algorithm",
      "Advanced analytics dashboard",
      "Direct brand messaging",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "For brands and agencies with scale",
    features: [
      "Unlimited campaigns",
      "Creator discovery & outreach",
      "White-label options",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sanjay Bhatta",
    role: "Tech YouTuber",
    avatar: "SB",
    quote: "SponsorNepal helped me land my first major brand deal. The platform made the entire process seamless and professional!",
    metric: "3x revenue growth",
  },
  {
    name: "Pooja Shrestha",
    role: "Lifestyle Influencer",
    avatar: "PS",
    quote: "As a creator, I love how transparent the platform is. I know exactly what to expect from each campaign.",
    metric: "50+ brand deals",
  },
  {
    name: "Rajesh Kumar",
    role: "Marketing Director",
    avatar: "RK",
    quote: "We found the perfect creators for our campaign within days. The quality of talent on SponsorNepal is exceptional.",
    metric: "200% ROI achieved",
  },
];

const creatorBenefits = [
  { text: "Showcase your social media metrics", icon: TrendingUp },
  { text: "Apply to campaigns that match your niche", icon: Target },
  { text: "Negotiate fair pricing directly with brands", icon: DollarSign },
  { text: "Receive secure payments through escrow", icon: Shield },
  { text: "Build long-term brand partnerships", icon: Handshake },
  { text: "Access exclusive creator resources", icon: Sparkles },
];

const brandBenefits = [
  { text: "Access verified Nepali creator profiles", icon: CheckCircle2 },
  { text: "Post campaigns and receive applications", icon: FileCheck },
  { text: "Review creator metrics and past work", icon: TrendingUp },
  { text: "Manage all campaigns in one dashboard", icon: Briefcase },
  { text: "Direct messaging with creators", icon: MessageSquare },
  { text: "Performance tracking and reporting", icon: Target },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-muted-foreground">Now serving</span>
                <span className="font-semibold text-foreground">2,500+ creators</span>
                <span className="text-muted-foreground">across Nepal</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance"
            >
              Connect with{" "}
              <span className="gradient-text-vibrant">Nepali Creators</span>
              <br />
              <span className="text-muted-foreground">Build Your Brand</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The premier marketplace connecting Nepali content creators with brands for meaningful sponsorships and influencer marketing campaigns.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="xl" variant="gradient-vibrant" className="gap-2 group" asChild>
                <Link href="/signup?role=creator">
                  Join as Creator
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="gap-2 border-2" asChild>
                <Link href="/signup?role=brand">
                  <Briefcase className="h-5 w-5" />
                  Hire Creators
                </Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground mb-6">Trusted by leading brands</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                {["Ncell", "Daraz", "IME Pay", "Foodmandu", "SastoDeal"].map((brand) => (
                  <span key={brand} className="text-lg font-semibold">{brand}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="glass" className="text-center p-6">
                  <stat.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built specifically for the Nepali creator ecosystem with features that matter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="elevated" className="h-full group hover-lift overflow-hidden">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4">
              <Globe className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in four simple steps and start growing your creator business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <Card variant="outline" className="h-full text-center group hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-primary/20 mb-2">{item.step}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Benefits Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                For Creators
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Turn Your Passion Into{" "}
                <span className="gradient-text">Profit</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Connect with brands, negotiate fair deals, and grow your creator business in Nepal&apos;s thriving influencer market.
              </p>
              <ul className="space-y-4 mb-8">
                {creatorBenefits.map((benefit, index) => (
                  <motion.li 
                    key={benefit.text} 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </motion.li>
                ))}
              </ul>
              <Button size="lg" variant="gradient" className="gap-2" asChild>
                <Link href="/signup?role=creator">
                  Start as Creator
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl" />
                <Card variant="glass" className="relative">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {[
                        { name: "Creative Nepali", followers: "15K+ followers", platform: "Instagram", color: "from-pink-500 to-rose-500" },
                        { name: "Tech Reviewer NP", followers: "50K+ subscribers", platform: "YouTube", color: "from-red-500 to-orange-500" },
                        { name: "Fitness with Aashish", followers: "100K+ followers", platform: "TikTok", color: "from-cyan-500 to-blue-500" },
                      ].map((creator, i) => (
                        <div key={creator.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {creator.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{creator.name}</div>
                            <div className="text-sm text-muted-foreground">{creator.followers}</div>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {creator.platform}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 text-sm font-medium mb-4">
                <Briefcase className="h-4 w-4" />
                For Brands
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Find the Perfect{" "}
                <span className="gradient-text">Creators</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Discover verified Nepali creators, manage campaigns, and track performance — all in one powerful platform.
              </p>
              <ul className="space-y-4 mb-8">
                {brandBenefits.map((benefit, index) => (
                  <motion.li 
                    key={benefit.text} 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </motion.li>
                ))}
              </ul>
              <Button size="lg" variant="gradient" className="gap-2" asChild>
                <Link href="/signup?role=brand">
                  Start as Brand
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:order-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
                <Card variant="glass" className="relative">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {[
                        { name: "Tech Brand Campaign", status: "Active", applications: 12, color: "bg-emerald-500" },
                        { name: "Fashion Brand Launch", status: "Open", applications: 28, color: "bg-blue-500" },
                        { name: "Food & Dining", status: "Completed", applications: 5, color: "bg-purple-500" },
                      ].map((campaign, i) => (
                        <div key={campaign.name} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{campaign.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${campaign.color}`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {campaign.applications} Applications
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <DollarSign className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={plan.popular ? "lg:-mt-4 lg:mb-4" : ""}
              >
                <Card 
                  variant={plan.popular ? "elevated" : "default"}
                  className={`h-full ${plan.popular ? 'border-2 border-primary shadow-xl shadow-primary/10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl text-muted-foreground font-medium">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'gradient' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href="/signup">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of creators and brands already growing with SponsorNepal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-4 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">{testimonial.metric}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="gradient" className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
              
              <CardContent className="relative p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white text-balance">
                  Ready to Transform Your Creator Business?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Join thousands of Nepali creators and brands already on the platform. Start your journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="xl" variant="secondary" className="gap-2 shadow-xl" asChild>
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 gap-2" asChild>
                    <Link href="/creators">
                      <Play className="h-5 w-5" />
                      Explore Creators
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
