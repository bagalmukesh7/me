import Link from 'next/link';
import { Shield, FileText, GraduationCap, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-header py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-navy font-medium text-sm mb-6">
            <Shield className="w-4 h-4" />
            Government of India Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6">
            One Platform for All<br />
            <span className="text-saffron">Government Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Discover schemes, competitive exams, and government jobs — all in one place. 
            Apply, track, and get verified with UGOVA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started <ArrowRight className="inline w-5 h-5 ml-2" />
            </Link>
            <Link href="/schemes" className="bg-white text-navy px-8 py-3 rounded-lg font-semibold border-2 border-navy hover:bg-navy hover:text-white transition-all text-lg">
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-saffron">500+</div>
              <div className="text-sm text-gray-600">Government Schemes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-navy">200+</div>
              <div className="text-sm text-gray-600">Exams Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green">1000+</div>
              <div className="text-sm text-gray-600">Job Openings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-saffron">50K+</div>
              <div className="text-sm text-gray-600">Citizens Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">What You Can Do on UGOVA</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Everything you need to access government opportunities — simplified and centralized.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-14 h-14 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-saffron" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">Government Schemes</h3>
              <p className="text-gray-600">Browse and apply for welfare schemes, subsidies, and benefits across all states.</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">Competitive Exams</h3>
              <p className="text-gray-600">Stay updated on UPSC, SSC, Banking, Railway, and state-level exam notifications.</p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-7 h-7 text-green" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">Government Jobs</h3>
              <p className="text-gray-600">Find and apply for the latest government job openings across all departments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your UGOVA profile with basic details' },
              { step: '2', title: 'Browse', desc: 'Explore schemes, exams, and jobs' },
              { step: '3', title: 'Apply', desc: 'Click apply and get redirected to official portal' },
              { step: '4', title: 'Track', desc: 'Monitor all applications from your dashboard' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-navy mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-saffron" />
              <span>Official Portal Redirects Only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-saffron" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-saffron" />
              <span>AI-Powered Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-saffron" />
              <span>100% Free to Use</span>
            </div>
          </div>
          <Link href="/register" className="btn-saffron inline-block">
            Join UGOVA Today
          </Link>
        </div>
      </section>
    </div>
  );
}
