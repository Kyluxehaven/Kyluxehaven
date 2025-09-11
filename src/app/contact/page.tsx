import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.75 13.96c.25.13.42.2.66.34.2.1.33.21.5.38a.91.91 0 01.12.18c.08.13.1.25.12.38s0 .28-.06.41a.83.83 0 01-.34.38 2.37 2.37 0 01-.62.25c-.25.04-.5.06-.75.06h-.1c-.31 0-.62-.05-.93-.16a5.53 5.53 0 01-1.31-.51 10.32 10.32 0 01-3.23-3.15 6.13 6.13 0 01-.99-2.28c-.13-.34-.2-.7-.2-1.07 0-.39.1-.78.3-1.15s.45-.7.75-1a.48.48 0 01.35-.15c.1 0 .2.02.3.05s.2.08.3.15l.38.47c.1.13.18.27.25.4s.1.28.1.43-.03.3-.1.45l-.57.72c-.12.15-.15.28-.15.4s.05.23.15.34l.15.16a6.2 6.2 0 002.5 2.2 2.62 2.62 0 00.93.42z" />
      <path d="M12 21.8c-5.4 0-9.8-4.4-9.8-9.8S6.6 2.2 12 2.2c2.6 0 5.1.98 7 2.8s2.8 4.3 2.8 7c0 2.2-.72 4.3-2.1 6.1l-1.5 1.5-1.1-2.1-1.4 1.5c-1.8 2-4.4 3.1-7.1 3.1zM12 0a12 12 0 100 24 12 12 0 000-24z" />
    </svg>
  );

export default function ContactPage() {
  const emailAddress = 'kyluxehaven@outlook.com';
  const phoneNumber = '2348112289850';
  const whatsappMessage = "Hello! I'm interested in your products.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl sm:text-4xl font-headline">Contact Us</CardTitle>
            <CardDescription className="mt-2">
              We're here to help! Reach out to us through email or WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1">
                  <a href={`mailto:${emailAddress}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    Send an Email
                  </a>
                </Button>
                <Button asChild size="lg" className="flex-1 bg-[#25D366] hover:bg-[#128C7E]">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>
                </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
                <p>We typically respond within a few hours.</p>
                <p className="font-semibold mt-2">Our Email: <a href={`mailto:${emailAddress}`} className="text-primary hover:underline">{emailAddress}</a></p>
                <p className="font-semibold">Our WhatsApp: <a href={whatsappUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+{phoneNumber}</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
