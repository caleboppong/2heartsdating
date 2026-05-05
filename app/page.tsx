import { ShieldCheck, Search, LockKeyhole, CheckCircle2, Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

const profiles = [
  { name: 'Amanda', age: 33, role: 'Teacher', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { name: 'Isabel', age: 34, role: 'Nurse', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80' },
  { name: 'Lariah', age: 31, role: 'Manager', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { name: 'Michael', age: 36, role: 'Engineer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

const plans = [
  { title: 'Basic Plan', price: '9', icon: '💗', featured: false },
  { title: 'Gold Plan', price: '19', icon: '🤍', featured: true },
  { title: 'Platinum Plan', price: '29', icon: '🛡️', featured: false },
];

export default function Home() {
  return (
    <main className="hm-page">
      <header className="hm-header">
        <Link href="/" className="hm-logo"><span className="hm-logo-mark"><Heart size={24} fill="currentColor" /></span><span>2heartsdating</span></Link>
        <nav className="hm-nav"><Link href="/search">Browse</Link><Link href="/matches">Matches</Link><Link href="/pricing">Subscription</Link><Link href="/safety">Help</Link><Link href="/login">Login</Link><Link href="/signup" className="hm-signup">Sign Up</Link></nav>
      </header>
      <section className="hm-hero"><div className="hm-hero-copy"><h1>Find Your<br />Perfect Match</h1><p>Join 2heartsdating, a professional dating site for meaningful relationships.</p><div className="hm-hero-actions"><Link href="/signup" className="hm-btn hm-btn-primary">Get Started</Link><Link href="/about" className="hm-btn hm-btn-glass">Learn More</Link></div></div></section>
      <section className="hm-trust-strip"><div><ShieldCheck /> Verified Profiles</div><div><Search /> Advanced Search</div><div><LockKeyhole /> Secure & Private</div></section>
      <section className="hm-content-grid"><div className="hm-card hm-signup-card"><h2>Sign Up & <span>Find Love</span></h2><input placeholder="Full Name" /><input placeholder="Email Address" /><input placeholder="Password" type="password" /><div className="hm-field-row"><select><option>Woman</option><option>Man</option></select><select><option>Looking For</option><option>Marriage</option><option>Relationship</option></select></div><Link href="/signup" className="hm-btn hm-btn-primary hm-wide">Create Account</Link><small>By signing up, you accept our Terms and Privacy Policy.</small></div>
      <div className="hm-main-panel"><div className="hm-card hm-approval-card"><h2>Admin Approval Process</h2><p><CheckCircle2 size={16} /> All profiles are reviewed before going live.</p><div className="hm-approval-flow"><div className="hm-status-box"><CheckCircle2 /><strong>Profile Pending</strong><Link href="/dashboard">Check Out</Link></div><span>›</span><div className="hm-status-box approved"><CheckCircle2 /><strong>Approved Member</strong><Link href="/search">View Profile</Link></div></div></div>
      <div className="hm-card hm-search-card"><h2>Find Your Match</h2><div className="hm-search-row"><select><option>Looking For: Women</option><option>Men</option></select><select><option>Age Range: 25–40</option></select><select><option>Religion: Any</option><option>Christian</option><option>Muslim</option></select><Link href="/search" className="hm-btn hm-btn-primary">Search Now</Link></div><div className="hm-profile-row">{profiles.map((p) => (<article className="hm-profile" key={p.name}><img src={p.img} alt={`${p.name} profile`} /><div><strong>{p.name} {p.age}</strong><span>{p.role}</span></div><Link href="/search">View Profile</Link></article>))}</div></div></div></section>
      <section className="hm-pricing"><h2>Upgrade to <span>Premium</span></h2><div className="hm-plan-row">{plans.map(plan => (<div className={`hm-plan ${plan.featured ? 'featured' : ''}`} key={plan.title}><h3>{plan.title}</h3><p>{plan.icon} Selected Features</p><div className="hm-price"><sup>£</sup>{plan.price}<small>/month</small></div><Link href="/pricing">Get Started</Link></div>))}</div></section>
      <footer className="hm-footer"><nav><Link href="/about">About</Link><Link href="/safety">Safety Tips</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></nav><div className="hm-social"><Facebook /><Twitter /><Instagram /></div><small>© 2026 2heartsdating. All Rights Reserved.</small></footer>
    </main>
  );
}
