import {
  AlertTriangle,
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  Droplets,
  FileText,
  Flame,
  Globe2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sprout,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/site';

type ContactItem = {
  title: string;
  description: string;
  phone?: string;
  phoneLabel?: string;
  email?: string;
  address?: string;
  icon: typeof Phone;
};

export function Resources() {
  const quickContacts: ContactItem[] = [
    {
      title: 'City Hall',
      description: 'Main line for city services and departments',
      phone: '+17603738661',
      phoneLabel: '(760) 373-8661',
      address: `21000 Hacienda Blvd, ${siteConfig.city}, ${siteConfig.state} 93505`,
      icon: Phone,
    },
    {
      title: 'Police (Non-Emergency)',
      description: 'Connect with police services through City Hall',
      phone: '+17603738661',
      phoneLabel: '(760) 373-8661',
      icon: Shield,
    },
    {
      title: 'Fire Department',
      description: 'Non-emergency fire services',
      phone: '+17603737344',
      phoneLabel: '(760) 373-7344',
      icon: Flame,
    },
    {
      title: 'Water Emergencies (After Hours)',
      description: 'Water standby for urgent issues',
      phone: '+17605595713',
      phoneLabel: '(760) 559-5713',
      icon: Droplets,
    },
    {
      title: 'Emergency',
      description: 'Life-threatening emergencies',
      phone: '911',
      phoneLabel: '911',
      icon: AlertTriangle,
    },
    {
      title: 'Library',
      description: 'Kern County Library - local branch',
      phone: '+17603734757',
      phoneLabel: '(760) 373-4757',
      icon: BookOpen,
    },
  ];

  const councilMembers = [
    {
      title: 'Mayor',
      name: 'Marquette E. Hawkins',
      phone: '+17603381405',
      phoneLabel: '(760) 338-1405',
      email: 'mhawkins@californiacity-ca.gov',
    },
    {
      title: 'Mayor Pro Tem',
      name: 'Jim Creighton',
      phone: '+16617523447',
      phoneLabel: '(661) 752-3447',
      email: 'jcreighton@californiacity-ca.gov',
    },
    {
      title: 'Councilmember',
      name: 'Ronald Smith',
      phone: '+16615289809',
      phoneLabel: '(661) 528-9809',
      email: 'rsmith@californiacity-ca.gov',
    },
    {
      title: 'Councilmember',
      name: 'Della Clark',
      phone: '+16617523448',
      phoneLabel: '(661) 752-3448',
      email: 'dclark@californiacity-ca.gov',
    },
    {
      title: 'Councilmember',
      name: 'Vacant',
      phone: '',
      phoneLabel: '-',
      email: '',
    },
  ];

  const departments = [
    {
      title: 'City Manager',
      name: 'Scott Grayson',
      phone: '+17603381317',
      phoneLabel: '(760) 338-1317',
      secondaryPhone: '+17603737170',
      secondaryLabel: '(760) 373-7170',
      email: 'sgrayson@californiacity-ca.gov',
      address: `21000 Hacienda Blvd, ${siteConfig.city}, ${siteConfig.state} 93505`,
    },
    {
      title: 'Finance Department',
      name: 'Kenny Cooper, Finance Director',
      phone: '+17603737483',
      phoneLabel: '(760) 373-7483',
      email: 'Contact via City Hall',
    },
    {
      title: 'Building & Code Enforcement',
      name: 'Tiffany Carter, Building Official',
      phone: '+17603381498',
      phoneLabel: '(760) 338-1498',
      email: 'Contact via City Hall',
    },
    {
      title: 'Planning Department',
      name: 'Liz Garcia, Planning Director',
      phone: '+17603381377',
      phoneLabel: '(760) 338-1377',
      email: 'Contact via City Hall',
    },
    {
      title: 'Fire Department',
      name: 'Kristy Hightower, Deputy Fire Marshal',
      phone: '+17603737344',
      phoneLabel: '(760) 373-7344',
      email: 'Contact via City Hall',
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SEO
        title={siteConfig.seo.pages.resourcesTitle}
        description={siteConfig.seo.pages.resourcesDescription}
        path="/resources"
      />

      {/* Hero */}
      <section className="relative bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <p className="text-primary font-semibold mb-3">City services and trusted contacts</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Community Resources</h1>
              <p className="text-lg text-on-surface-variant mb-6">
                Your guide to city services, departments, and essential contacts in {siteConfig.city}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">Contact CalCity.info</Link>
                <a
                  href="https://www.californiacity-ca.gov/CC/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  Official City Website
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="card bg-surface-container-high">
                <Landmark className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">City Snapshot</h3>
                <p className="text-on-surface-variant">
                  Founded in May 1958 and incorporated December 10, 1965, {siteConfig.city} is the
                  third-largest incorporated city in land area in California and the eleventh largest in the United
                  States.
                </p>
              </div>
              <div className="card bg-surface-container-high">
                <Calendar className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">City Hall Hours</h3>
                <p className="text-on-surface-variant">Monday - Friday, 8:00 AM - 5:00 PM</p>
                <p className="text-on-surface-variant">21000 Hacienda Blvd, {siteConfig.city}, {siteConfig.state} 93505</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contacts */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-3">Quick contacts</h2>
              <p className="text-on-surface-variant text-lg">
                The most-requested numbers for residents and visitors.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <div key={contact.title} className="card bg-surface-container-low">
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{contact.title}</h3>
                      <p className="text-on-surface-variant mb-3">{contact.description}</p>
                      {contact.phone && (
                        <a className="text-primary font-semibold" href={`tel:${contact.phone}`}>
                          {contact.phoneLabel}
                        </a>
                      )}
                      {contact.address && (
                        <p className="text-sm text-on-surface-variant mt-2">{contact.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* City Government */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Landmark className="w-7 h-7 text-primary" />
                <h2 className="text-3xl font-display font-bold">City government</h2>
              </div>
              <p className="text-on-surface-variant text-lg mb-8">
                City Council meetings are held the 2nd and 4th Tuesday of every month at 5:00 PM at City Hall,
                21000 Hacienda Blvd, {siteConfig.city}, {siteConfig.state} 93505.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {councilMembers.map((member) => (
                  <div key={`${member.title}-${member.name}`} className="card">
                    <p className="text-sm text-primary font-semibold">{member.title}</p>
                    <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                    {member.phone ? (
                      <a className="text-primary" href={`tel:${member.phone}`}>
                        {member.phoneLabel}
                      </a>
                    ) : (
                      <p className="text-on-surface-variant">{member.phoneLabel}</p>
                    )}
                    {member.email && (
                      <div className="mt-2 flex items-center gap-2 text-on-surface-variant">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${member.email}`} className="hover:text-primary">
                          {member.email}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="card bg-surface-container-high">
                <Calendar className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Meeting schedule</h3>
                <p className="text-on-surface-variant">City Council: 2nd & 4th Tuesday, 5:00 PM</p>
                <p className="text-on-surface-variant">Planning Commission: 1st & 3rd Tuesday, 6:00 PM</p>
              </div>
              <div className="card bg-surface-container-high">
                <ClipboardList className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Agendas & recordings</h3>
                <p className="text-on-surface-variant mb-3">
                  Council agendas and recorded meetings are available online through the official city website.
                </p>
                <a
                  href="https://www.californiacity-ca.gov/CC/index.php/departments/city-council"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold"
                >
                  View City Council resources
                </a>
              </div>
              <div className="card bg-surface-container-high">
                <Shield className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">Public safety</h3>
                <p className="text-on-surface-variant">Emergency: 911</p>
                <p className="text-on-surface-variant">Police non-emergency: (760) 373-8661</p>
                <p className="text-on-surface-variant">Fire non-emergency: (760) 373-7344</p>
                <p className="text-on-surface-variant mt-2">
                  Police and fire chiefs are newly appointed as part of staffing improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Departments */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">City departments</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-8">
            Direct lines for key departments and leadership.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.title} className="card bg-surface-container-low">
                <h3 className="text-lg font-semibold mb-1">{dept.title}</h3>
                <p className="text-on-surface-variant mb-3">{dept.name}</p>
                <a className="text-primary font-semibold" href={`tel:${dept.phone}`}>
                  {dept.phoneLabel}
                </a>
                {dept.secondaryPhone && (
                  <p className="text-on-surface-variant mt-1">
                    Desk: <a href={`tel:${dept.secondaryPhone}`} className="text-primary">{dept.secondaryLabel}</a>
                  </p>
                )}
                {dept.email && (
                  <div className="mt-2 flex items-center gap-2 text-on-surface-variant">
                    <Mail className="w-4 h-4" />
                    {dept.email.includes('@') ? (
                      <a href={`mailto:${dept.email}`} className="hover:text-primary">
                        {dept.email}
                      </a>
                    ) : (
                      <span>{dept.email}</span>
                    )}
                  </div>
                )}
                {dept.address && (
                  <p className="text-sm text-on-surface-variant mt-3">{dept.address}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Utilities */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">Public utilities</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-8">
            Water, wastewater, and waste management services for {siteConfig.city} residents.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-surface">
              <h3 className="text-lg font-semibold mb-2">Water Department</h3>
              <p className="text-on-surface-variant">City Hall, 21000 Hacienda Blvd, {siteConfig.city}, {siteConfig.state} 93505</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+17603738661" className="text-primary">(760) 373-8661</a>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:waterdept@californiacity-ca.gov" className="text-primary">waterdept@californiacity-ca.gov</a>
                </div>
                <p className="text-on-surface-variant">Fax: (760) 373-7809</p>
              </div>
              <div className="mt-4">
                <p className="text-on-surface-variant">Business Hours:</p>
                <p className="text-on-surface-variant">Monday - Thursday, 8:30 AM - 5:45 PM</p>
                <p className="text-on-surface-variant">Every other Friday, 8:30 AM - 4:45 PM</p>
                <p className="text-on-surface-variant">Closed alternative Fridays, weekends, and holidays.</p>
              </div>
              <div className="mt-4">
                <p className="text-on-surface-variant font-semibold">Emergency Contacts</p>
                <p className="text-on-surface-variant">Business hours: City Hall (760) 373-8661 or Public Works (760) 373-7199</p>
                <p className="text-on-surface-variant">After hours: Water Standby (760) 559-5713</p>
              </div>
              <div className="mt-4">
                <p className="text-on-surface-variant">Water sources: Ground water and State Water Project</p>
                <p className="text-on-surface-variant">Base rate: $52.99/month for 3/4" residential (900 cubic feet minimum)</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="card bg-surface">
                <h3 className="text-lg font-semibold mb-2">Wastewater Treatment</h3>
                <p className="text-on-surface-variant">
                  Contact: Rickard Vazquez, Sewer Collection & Wastewater Treatment Plant Operator
                </p>
                <div className="mt-3 flex items-center gap-2 text-on-surface-variant">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+17603733720" className="text-primary">(760) 373-3720</a>
                </div>
                <div className="mt-2 flex items-center gap-2 text-on-surface-variant">
                  <MapPin className="w-4 h-4" />
                  <span>10835 Nelson Drive, {siteConfig.city}, {siteConfig.state} 93505</span>
                </div>
                <p className="text-on-surface-variant mt-3">1 MGD wastewater treatment plant serving city residents only.</p>
              </div>
              <div className="card bg-surface">
                <h3 className="text-lg font-semibold mb-2">Waste management</h3>
                <p className="text-on-surface-variant">Trash service: Contact City Hall for current provider information.</p>
                <p className="text-on-surface-variant">Recycling programs are available through the city.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Services */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">Community services</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-8">
            Libraries, senior services, parks, and local programs that keep {siteConfig.city} connected.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-surface-container-low">
              <BookOpen className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Kern County Library - {siteConfig.city} Branch</h3>
              <p className="text-on-surface-variant">9507 California City Boulevard, {siteConfig.city}, {siteConfig.state} 93505</p>
              <a href="tel:+17603734757" className="text-primary font-semibold">(760) 373-4757</a>
              <p className="text-on-surface-variant mt-2">Part of the Kern County Library system.</p>
            </div>
            <div className="card bg-surface-container-low">
              <Users className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Mable Davis Senior Center</h3>
              <p className="text-on-surface-variant">A community resource for senior programs and gatherings.</p>
              <p className="text-on-surface-variant mt-2">Contact City Hall for current hours and activities.</p>
            </div>
            <div className="card bg-surface-container-low">
              <Sprout className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Parks & Recreation</h3>
              <p className="text-on-surface-variant">
                New skatepark (groundbreaking expected, completion targeted for Summer 2024), splashpad under
                construction, and clubhouse development underway.
              </p>
              <p className="text-on-surface-variant mt-2">Central Park lake cattail maintenance and restoration in progress.</p>
              <p className="text-on-surface-variant mt-2">City Hall grounds recently cleared and properly maintained.</p>
            </div>
            <div className="card bg-surface-container-low">
              <ClipboardList className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Business licenses & permits</h3>
              <p className="text-on-surface-variant">Business licenses available through City Hall.</p>
              <p className="text-on-surface-variant">Building permits: (760) 338-1498</p>
              <p className="text-on-surface-variant mt-2">Economic development opportunities are actively pursued by the city.</p>
            </div>
            <div className="card bg-surface-container-low">
              <Building2 className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Schools & education</h3>
              <p className="text-on-surface-variant">
                Schools serving {siteConfig.city} are part of the broader Kern County educational system.
              </p>
              <p className="text-on-surface-variant mt-2">Contact City Hall for the latest school listings and contact info.</p>
            </div>
            <div className="card bg-surface-container-low">
              <AlertTriangle className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Healthcare & emergency services</h3>
              <p className="text-on-surface-variant">Emergency: 911</p>
              <p className="text-on-surface-variant">Police non-emergency: (760) 373-8661</p>
              <p className="text-on-surface-variant">Fire non-emergency: (760) 373-7344</p>
              <p className="text-on-surface-variant mt-2">
                Regional hospitals and clinics serve the community. Kern County resources provide the most up-to-date
                facility listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">Operating hours summary</h2>
          </div>
          <div className="card bg-surface overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-2 text-on-surface">Service</th>
                  <th className="py-3 px-2 text-on-surface">Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant">
                  <td className="py-3 px-2 text-on-surface-variant">City Hall</td>
                  <td className="py-3 px-2 text-on-surface">Monday - Friday, 8:00 AM - 5:00 PM</td>
                </tr>
                <tr className="border-b border-outline-variant">
                  <td className="py-3 px-2 text-on-surface-variant">Water Department</td>
                  <td className="py-3 px-2 text-on-surface">
                    Monday - Thursday, 8:30 AM - 5:45 PM; every other Friday, 8:30 AM - 4:45 PM
                  </td>
                </tr>
                <tr className="border-b border-outline-variant">
                  <td className="py-3 px-2 text-on-surface-variant">City Council Meetings</td>
                  <td className="py-3 px-2 text-on-surface">2nd & 4th Tuesday, 5:00 PM</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-on-surface-variant">Planning Commission</td>
                  <td className="py-3 px-2 text-on-surface">1st & 3rd Tuesday, 6:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Documents & Forms */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">Important documents & forms</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-6">
            Key documents are available online or by request through the appropriate department.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <ul className="text-on-surface-variant space-y-3">
                <li><a href="https://www.californiacity-ca.gov/CC/index.php/community/local-news/166-california-city-municipal-code" target="_blank" rel="noreferrer" className="text-primary hover:underline">Municipal Code</a></li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/2023_June_Cal_City_2020_UWMP_with_Dates.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">2020 Urban Water Management Plan</a> (PDF)</li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/California_City_Tables_-_Water-Sewer_Rates_v2_2018.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">Water & Sewer Rates & Fees</a> (PDF)</li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/2017-Validated-Water-Loss-Audit-Report.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">Water Loss Audit Report</a> (PDF)</li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/Indoor_Tips_100.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">Water Saving Tips</a> (PDF)</li>
                <li><a href="https://www.californiacity-ca.gov/CC/index.php/mandatory-water-conservation" target="_blank" rel="noreferrer" className="text-primary hover:underline">Mandatory Water Conservation Restrictions</a></li>
              </ul>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Applications & Forms</h3>
              <ul className="text-on-surface-variant space-y-3">
                <li><a href="https://www.californiacity-ca.gov/CC/index.php/building/permit-applications-forms" target="_blank" rel="noreferrer" className="text-primary hover:underline">Building Permit Applications & Forms</a></li>
                <li><a href="https://www.californiacity-ca.gov/CC/index.php/planning/applications" target="_blank" rel="noreferrer" className="text-primary hover:underline">Planning Department Applications</a></li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/Water_Standby_Fee_Waiver_Letter_2023_080323_2.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">Water Standby Fee Appeal Form</a> (PDF)</li>
                <li><a href="https://www.californiacity-ca.gov/CC/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Pay Water Bill Online</a></li>
                <li><a href="https://www.californiacity-ca.gov/CC/images/What_you_need_to_know_about_the_Water_Department.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">Understanding Your Water Bill</a> (PDF)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">Recent city updates (2025-2026)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-surface">
              <h3 className="text-lg font-semibold mb-2">Infrastructure & water</h3>
              <ul className="text-on-surface-variant space-y-2">
                <li>City is working toward water independence from AVEK Water Agency to reduce development fees.</li>
                <li>Water storage facility and well repairs are in progress.</li>
                <li>Moving from consultants to in-house teams for multi-million dollar savings.</li>
              </ul>
            </div>
            <div className="card bg-surface">
              <h3 className="text-lg font-semibold mb-2">Community development</h3>
              <ul className="text-on-surface-variant space-y-2">
                <li>Desert Jade senior housing is nearly full, with more senior housing planned.</li>
                <li>Fee reductions on new home permits to attract builders.</li>
                <li>Adherence to the Permit Streamlining Act for development review.</li>
                <li>Strategic planning for Inland Port proximity opportunities.</li>
                <li>District elections resolution adopted for a transition from at-large to district-based elections.</li>
              </ul>
            </div>
            <div className="card bg-surface md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Staffing improvements</h3>
              <p className="text-on-surface-variant">
                New department directors and leadership roles have been filled, including Public Works, Planning,
                HR, Police Chief, and Fire Chief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* External Links */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Globe2 className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-display font-bold">External resources</h2>
          </div>
          <p className="text-on-surface-variant text-lg mb-8">
            Official agencies and online services connected to {siteConfig.city}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Official city website</h3>
              <p className="text-on-surface-variant mb-3">News, agendas, and citywide updates.</p>
              <a
                href="https://www.californiacity-ca.gov/CC/"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold"
              >
                Visit californiacity-ca.gov
              </a>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Water bill payment</h3>
              <p className="text-on-surface-variant mb-3">Pay water bills online through the city portal.</p>
              <a
                href="https://www.californiacity-ca.gov/CC/"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold"
              >
                Go to online payments
              </a>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Council meeting recordings</h3>
              <p className="text-on-surface-variant mb-3">Watch recorded City Council meetings and agendas.</p>
              <a
                href="https://www.californiacity-ca.gov/CC/index.php/departments/city-council"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold"
              >
                Council resources
              </a>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Kern County services</h3>
              <p className="text-on-surface-variant">Kern Council of Governments resources for the region.</p>
              <p className="text-on-surface-variant mt-2">21000 Hacienda Blvd, {siteConfig.city}, {siteConfig.state} 93505</p>
              <a href="tel:+17603738661" className="text-primary font-semibold">(760) 373-8661</a>
              <a
                href="https://www.kerncog.org/californiacity/"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold block mt-2"
              >
                Visit Kern COG
              </a>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">California Public Utilities Commission</h3>
              <p className="text-on-surface-variant mb-2">Utilities regulation for water, gas, and electric services.</p>
              <a href="tel:+18006497570" className="text-primary font-semibold">(800) 649-7570</a>
            </div>
            <div className="card bg-surface-container-low">
              <h3 className="text-lg font-semibold mb-2">Division of Drinking Water - District 19</h3>
              <p className="text-on-surface-variant">4925 Commerce Drive, Suite 120, Bakersfield, {siteConfig.state} 93309</p>
              <a href="tel:+16613357315" className="text-primary font-semibold block mt-2">(661) 335-7315</a>
              <a href="mailto:dwpdist19@waterboards.ca.gov" className="text-primary font-semibold block mt-1">
                dwpdist19@waterboards.ca.gov
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* City Hall Contact */}
      <section className="py-16 bg-surface-container-low">
        <div className="container mx-auto px-4">
          <div className="card bg-surface">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display font-bold">City Hall main contact</h2>
                </div>
                <p className="text-on-surface-variant">21000 Hacienda Blvd, {siteConfig.city}, {siteConfig.state} 93505</p>
                <p className="text-on-surface-variant">Phone: (760) 373-8661</p>
                <p className="text-on-surface-variant">Fax: (760) 373-7511</p>
                <p className="text-on-surface-variant">Website: californiacity-ca.gov</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="tel:+17603738661" className="btn-primary">Call City Hall</a>
                <a
                  href="https://www.californiacity-ca.gov/CC/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  Visit City Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="card bg-surface-container-low flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Need more help?</h2>
              <p className="text-on-surface-variant">
                Reach out to the CalCity.info team and we will help you find the right contact.
              </p>
            </div>
            <Link to="/contact" className="btn-primary">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
