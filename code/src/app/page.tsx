'use client'

import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardBody } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { Badge } from '@/components/Badge'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-background text-on-surface">
      <Navigation currentPath="/" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:py-32 bg-gradient-to-b from-surface-container to-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-primary rounded-full">
              <span className="text-label-md font-semibold">✨ POWERED BY AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface leading-tight">
              Master TIU with Adaptive Learning
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-lg">
              Optimize your TIU (Tes Intelegensia Umum) preparation with our intelligent platform.
              Analyze every answer and get personalized learning paths to achieve your best score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg">Start Learning Today</Button>
              </Link>
              <Link href="#demo">
                <Button variant="secondary" size="lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-body-sm text-on-surface-variant pt-4 border-t border-outline-variant">
              <div>
                <p className="font-semibold text-on-surface">10,000+</p>
                <p>Active Learners</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">500+</p>
                <p>Practice Questions</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">98%</p>
                <p>Success Rate</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <Card>
              <CardHeader
                title="Your Learning Progress"
                description="Week 1 of adaptive training"
              />
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <ProgressBar
                      value={65}
                      variant="primary"
                      label="Verbal Reasoning"
                    />
                  </div>
                  <div>
                    <ProgressBar
                      value={45}
                      variant="warning"
                      label="Numerical Reasoning"
                    />
                  </div>
                  <div>
                    <ProgressBar
                      value={78}
                      variant="success"
                      label="Figural Reasoning"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Why Choose TIU Prep?
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven pedagogical methods to help you
              achieve your best potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Adaptive Learning',
                description:
                  'Our algorithms learn your strengths and weaknesses to create personalized practice paths.',
              },
              {
                icon: '📊',
                title: 'Detailed Analytics',
                description:
                  'Track your progress with comprehensive performance metrics and improvement trends.',
              },
              {
                icon: '⚡',
                title: 'Instant Feedback',
                description:
                  'Get detailed explanations for every question to understand concepts deeply.',
              },
              {
                icon: '🎯',
                title: 'Targeted Practice',
                description:
                  'Focus on areas where you need improvement with targeted question sets.',
              },
              {
                icon: '📱',
                title: 'Learn Anywhere',
                description:
                  'Study on any device with our fully responsive and offline-capable platform.',
              },
              {
                icon: '🏆',
                title: 'Proven Results',
                description:
                  'Our learners improve their scores by an average of 35% in just 8 weeks.',
              },
            ].map((feature, idx) => (
              <Card key={idx} hoverable>
                <CardHeader>
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="font-title-lg text-on-surface">{feature.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-body-sm text-on-surface-variant">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 px-6 bg-surface-container">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-12 text-center">
            Master All TIU Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: 'Verbal Reasoning',
                color: 'primary',
                description:
                  'Test your language comprehension, vocabulary, and logical reasoning skills.',
                questions: 180,
              },
              {
                category: 'Numerical Reasoning',
                color: 'secondary',
                description:
                  'Strengthen your mathematical and numerical analysis capabilities.',
                questions: 180,
              },
              {
                category: 'Figural Reasoning',
                color: 'tertiary',
                description:
                  'Develop your spatial reasoning and pattern recognition abilities.',
                questions: 180,
              },
            ].map((cat) => (
              <Card key={cat.category} hoverable>
                <CardHeader title={cat.category}>
                  <Badge variant={cat.color as any} className="mt-3">
                    {cat.questions} Questions
                  </Badge>
                </CardHeader>
                <CardBody>
                  <p className="text-body-sm text-on-surface-variant">{cat.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">
            Ready to Ace Your TIU?
          </h2>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have improved their scores with our platform. Start your
            free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-6">
            No credit card required • Free 7-day trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-on-surface text-surface py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TIU Prep</h3>
              <p className="text-sm opacity-75">
                The most advanced platform for TIU preparation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link href="#" className="hover:opacity-100">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-100">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface border-opacity-20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2024 TIU Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
