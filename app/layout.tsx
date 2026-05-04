import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata: Metadata = { title: '2heartsdating', description: 'Two Hearts. One Meaningful Connection.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Navbar />{children}<Footer /></body></html>; }
