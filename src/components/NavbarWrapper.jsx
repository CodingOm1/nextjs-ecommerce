'use client'; // Mark this file as a client component

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Define routes where the Navbar should not appear
  const excludedRoutes = ['/login', '/register'];

  // Conditionally render Navbar
  if (excludedRoutes.includes(pathname)) return null;

  return <Navbar />;
}
