import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const AboutUs = () => {
  const services = [
    { title: 'Free Shipping', description: 'Free shipping on all US order or order above', icon: '📦' },
    { title: '24X7 Support', description: 'Contact us 24 hours a day, 7 days a week', icon: '🎧' },
    { title: '30 Days Return', description: 'Simply return it within 30 days for an exchange', icon: '↩️' },
    { title: 'Payment Secure', description: 'Contact us 24 hours a day, 7 days a week', icon: '🔒' }
  ];

  const stats = [
    { value: '65K+', label: 'Vendors', description: 'Contrary to popular belief, Lorem is not simply random text' },
    { value: '$458K+', label: 'Earnings', description: 'Contrary to popular belief, Lorem is not simply random text' },
    { value: '25M+', label: 'Sold', description: 'Contrary to popular belief, Lorem is not simply random text' },
    { value: '100K+', label: 'Users', description: 'Contrary to popular belief, Lorem is not simply random text' }
  ];

  const team = [
    { name: 'Benjamin Martin', role: 'Vendor' },
    { name: 'Amelia Martin', role: 'Vendor' },
    { name: 'Emma Watson', role: 'Manager' },
    { name: 'Olivia Smith', role: 'Manager' },
    { name: 'William Dalin', role: 'Manager' }
  ];

  return (
    <div className="min-h-screen bg-white">


      {/* Who We Are Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Who We <span className="text-emerald-600">Are?</span></h2>
              <p className="text-gray-600">WE'RE HERE TO SERVE ONLY THE BEST PRODUCTS FOR YOU, ENRICHING YOUR HOMES WITH THE BEST ESSENTIALS.</p>
              <p className="text-gray-500">Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/api/placeholder/400/300" alt="About Us 1" className="rounded-lg" />
              <img src="/api/placeholder/400/300" alt="About Us 2" className="rounded-lg" />
              <img src="/api/placeholder/400/300" alt="About Us 3" className="rounded-lg" />
              <img src="/api/placeholder/400/300" alt="About Us 4" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our <span className="text-emerald-600">Services</span></h2>
          <div className="grid grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl text-gray-300 mb-4">"</div>
            <p className="text-gray-600 mb-6">Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy typesetting industry.</p>
            <div className="flex items-center justify-center mb-4">
              <img src="/api/placeholder/64/64" alt="John Doe" className="rounded-full" />
            </div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-gray-500">General Manager</p>
            <div className="flex justify-center text-yellow-400 mt-2">★★★★★</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <h3 className="font-semibold mb-2">{stat.label}</h3>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our <span className="text-emerald-600">Team</span></h2>
          <div className="grid grid-cols-5 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img src="/api/placeholder/200/200" alt={member.name} className="rounded-lg mb-4 w-full" />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 
    </div>
  );
};

export default AboutUs;