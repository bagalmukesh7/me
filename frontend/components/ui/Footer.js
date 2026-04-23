import Link from 'next/link';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-saffron" />
              <span className="text-xl font-bold">UGOVA</span>
            </div>
            <p className="text-gray-300 text-sm">
              Unified Government Opportunities & Verification App. Empowering citizens with digital access to government schemes, exams, and jobs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-saffron">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schemes" className="text-gray-300 hover:text-white">Schemes</Link></li>
              <li><Link href="/exams" className="text-gray-300 hover:text-white">Exams</Link></li>
              <li><Link href="/jobs" className="text-gray-300 hover:text-white">Jobs</Link></li>
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-saffron">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://india.gov.in" target="_blank" className="text-gray-300 hover:text-white">India Portal</a></li>
              <li><a href="https://mygov.in" target="_blank" className="text-gray-300 hover:text-white">MyGov</a></li>
              <li><a href="https://digilocker.gov.in" target="_blank" className="text-gray-300 hover:text-white">DigiLocker</a></li>
              <li><a href="https://umang.gov.in" target="_blank" className="text-gray-300 hover:text-white">UMANG</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-saffron">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4" /> support@ugova.gov.in</li>
              <li className="flex items-center gap-2 text-gray-300"><Phone className="w-4 h-4" /> 1800-XXX-XXXX</li>
              <li className="flex items-center gap-2 text-gray-300"><MapPin className="w-4 h-4" /> New Delhi, India</li>
            </ul>
          </div>
        </div>

        {/* Tricolor stripe */}
        <div className="flex h-1 mt-8 rounded-full overflow-hidden">
          <div className="flex-1 bg-saffron"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-green"></div>
        </div>

        <div className="text-center mt-4 text-sm text-gray-400">
          UGOVA - Unified Government Opportunities & Verification App
        </div>
      </div>
    </footer>
  );
}
