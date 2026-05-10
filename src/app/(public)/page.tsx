"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Users, Briefcase, TrendingUp, Shield, 
  MessageSquare, Star, Search, FileCheck, Handshake, 
  CheckCircle2, DollarSign, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active Creators", value: "2,500+" },
  { label: "Brands Onboarded", value: "150+" },
  { label: "Campaigns Completed", value: "500+" },
  { label: "NPR Earned by Creators", value: "10M+" },
];

const features = [
  {
    icon: Users,
    title: "Discover Talent",
    description: "Browse through verified Nepali creators across all major social platforms with detailed analytics.",
  },
  {
    icon: Briefcase,
    title: "Launch Campaigns",
    description: "Create and manage influencer campaigns with clear deliverables, budgets, and timelines.",
  },
  {
    icon: TrendingUp,
    title: "Track Performance",
    description: "Monitor campaign progress, engagement metrics, and ROI with real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Secure Deals",
    description: "Escrow-protected payments and verified creator profiles ensure safe transactions.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Built-in messaging system for seamless collaboration between brands and creators.",
  },
  {
    icon: Star,
    title: "Creator-First",
    description: "Fair pricing, transparent processes, and timely payments for Nepali content creators.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up as a creator or brand and set up your profile with your unique value proposition.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Post or Browse Campaigns",
    description: "Brands post campaigns while creators browse and apply to opportunities that match their niche.",
    icon: Search,
  },
  {
    step: "03",
    title: "Connect & Collaborate",
    description: "Use our messaging system to discuss terms, negotiate pricing, and finalize the deal.",
    icon: Handshake,
  },
  {
    step: "04",
    title: "Launch & Track",
    description: "Execute the campaign, track performance in real-time, and ensure a successful delivery.",
    icon: TrendingUp,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Basic profile",
      "Browse campaigns",
      "Apply to 5 campaigns/month",
      "Standard support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "NPR 2,999/mo",
    description: "For serious creators",
    features: [
      "Enhanced profile",
      "Unlimited campaign applications",
      "Priority visibility",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "For brands & agencies",
    features: [
      "Unlimited campaigns",
      "Creator discovery & outreach",
      "Advanced analytics",
      "Dedicated account manager",
      "API access",
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
    quote: "SponsorNepal helped me land my first major brand deal. The platform made the entire process seamless!",
  },
  {
    name: "Pooja Shrestha",
    role: "Lifestyle Influencer",
    avatar: "PS",
    quote: "As a creator, I love how transparent the platform is. I know exactly what to expect from each campaign.",
  },
  {
    name: "Rajesh Kumar",
    role: "Marketing Director, BrandX",
    avatar: "RK",
    quote: "We found the perfect creators for our campaign within days. Highly recommend for any Nepal-based brand.",
  },
];

const creatorBenefits = [
  "Showcase your social media metrics",
  "Apply to campaigns that match your niche",
  "Negotiate fair pricing directly with brands",
  "Receive secure payments through escrow",
  "Build long-term brand partnerships",
  "Access exclusive creator resources",
];

const brandBenefits = [
  "Access verified creator profiles",
  "Post campaigns and receive applications",
  "Review creator metrics and past work",
  "Manage all campaigns in one dashboard",
  "Direct messaging with creators",
  "Performance tracking and reporting",
];

export default function HomePage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Nepal&apos;s Creator Economy is Growing
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Connect with
                <span className="text-primary"> Nepali Creators</span>
                <br />
                Build Your Brand
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The premier marketplace connecting Nepali content creators with brands for meaningful sponsorships and influencer marketing campaigns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/signup?role=creator">
                    Join as Creator
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/signup?role=brand">
                    Hire Creators
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-8xl font-bold text-primary/5 absolute -top-4 -left-2">{item.step}</div>
                <Card className="h-full border-0 bg-transparent shadow-none">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why SponsorNepal?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built specifically for the Nepali creator ecosystem with features that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                For Creators
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Turn Your Passion Into Profit</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Connect with brands, negotiate fair deals, and grow your creator business in Nepal&apos;s thriving influencer market.
              </p>
              <ul className="space-y-4">
                {creatorBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link href="/signup?role=creator">Start as Creator</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl" />
                <Card className="relative border-primary/20">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20" />
                        <div>
                          <div className="font-semibold">Creative Nepali</div>
                          <div className="text-sm text-muted-foreground">15K+ followers</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20" />
                        <div>
                          <div className="font-semibold">Tech Reviewer NP</div>
                          <div className="text-sm text-muted-foreground">50K+ subscribers</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20" />
                        <div>
                          <div className="font-semibold">Fitness with Aashish</div>
                          <div className="text-sm text-muted-foreground">100K+ followers</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                <Briefcase className="h-4 w-4" />
                For Brands
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Find the Perfect Creators</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Discover verified Nepali creators, manage campaigns, and track performance — all in one powerful platform.
              </p>
              <ul className="space-y-4">
                {brandBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link href="/signup?role=brand">Start as Brand</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl" />
                <Card className="relative border-primary/20">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Tech Brand Campaign</span>
                          <span className="text-sm text-muted-foreground">Active</span>
                        </div>
                        <div className="text-2xl font-bold">12 Applications</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Fashion Brand Launch</span>
                          <span className="text-sm text-muted-foreground">Open</span>
                        </div>
                        <div className="text-2xl font-bold">28 Applications</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Food & Dining</span>
                          <span className="text-sm text-muted-foreground">Completed</span>
                        </div>
                        <div className="text-2xl font-bold">5 Deals</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    {plan.popular && (
                      <div className="text-xs font-medium text-primary bg-primary/10 rounded-full py-1 px-3 w-fit mx-auto mb-2">
                        Most Popular
                      </div>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold mt-2">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
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
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of creators and brands already growing with SponsorNepal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Creator Business?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join thousands of Nepali creators and brands already on the platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/creators">Explore Creators</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}