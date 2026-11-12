import { Mail, MapPin, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';

const details = [
  { icon: Mail, label: 'Write to us', text: 'We reply to every message.' },
  { icon: Clock, label: 'Response time', text: 'Usually within two working days.' },
  { icon: MapPin, label: 'Where we are', text: 'Working remotely, wherever you are.' },
];

export default function ContactPage() {
  return (
    <Layout>
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact us</p>
            <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
              Let’s start a <em>conversation</em>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              A question, an idea or just a hello — leave us a note and we’ll get back to you.
            </p>
            <ul className="mt-10">
              {details.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-3 border-t border-border py-5 text-sm">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}
