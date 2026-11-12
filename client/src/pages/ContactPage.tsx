import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { ArrowRight, Clock, Compass, Inbox, MailCheck, Plus, ShieldCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';
import { buttonClass } from '@/components/ui';
import { cn } from '@/utils/cn';
import { lift } from '@/utils/lift';

const promises = [
  { icon: Inbox, text: 'Read by a real person' },
  { icon: Clock, text: 'A reply within two working days' },
  { icon: ShieldCheck, text: 'Your details stay private' },
];

const details = [
  { icon: MailCheck, label: 'Best for', text: 'Questions, ideas, feedback or a simple hello.' },
  { icon: Clock, label: 'Response time', text: 'Usually within two working days.' },
  { icon: Compass, label: 'Where we are', text: 'Working remotely, wherever you are.' },
];

const faqs = [
  {
    q: 'How quickly will I hear back?',
    a: 'We read every message and reply within two working days, usually sooner.',
  },
  {
    q: 'What should I include in my message?',
    a: 'A few lines on what you need, and any dates that matter. The more context you give, the more useful our first reply will be.',
  },
  {
    q: 'Is my information kept private?',
    a: 'Your details are used only to reply to your message. We never sell or share them.',
  },
  {
    q: 'Can I attach files?',
    a: 'Not yet. Describe what you have in your message and we will tell you the best way to send it over.',
  },
];

const eyebrow = 'text-xs uppercase tracking-[0.2em] text-muted-foreground';
const bandHeading = 'mt-3 text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl';
const lightButton = 'bg-primary-foreground text-primary hover:bg-primary-foreground/90';
const lightOutline =
  'border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10';

export default function ContactPage() {
  const reduceMotion = useReducedMotion();
  // The one entrance on this page: the hero copy fades up, each piece 100ms after the last.
  const enter = (step: number): MotionProps =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: step * 0.1, ease: [0.2, 0.7, 0.2, 1] },
        };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/assets/generated/contact-hero.webp"
          width={1920}
          height={1088}
          alt="A notebook, pen and cup on a desk by a window in soft morning light"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div aria-hidden className="absolute inset-0 bg-background/80 md:hidden" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-linear-to-r from-background from-30% via-background/60 via-55% to-transparent to-85% md:block"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-32">
          <div className="max-w-xl">
            <motion.p {...enter(0)} className={eyebrow}>
              Contact us
            </motion.p>
            <motion.h1
              {...enter(1)}
              className="mt-4 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl"
            >
              Let’s start a <em className="italic">conversation</em>
            </motion.h1>
            <motion.p {...enter(2)} className="mt-6 max-w-md text-sm leading-[1.8] text-muted-foreground">
              A question, an idea or just a hello. Leave us a note and a real person will write back
              within two working days.
            </motion.p>
            <motion.div {...enter(3)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#form"
                className={buttonClass({
                  size: 'lg',
                  className: cn('text-xs uppercase tracking-wider', lift),
                })}
              >
                Send a message
              </a>
              <a
                href="#faq"
                className="inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-150 hover:text-primary"
              >
                Read the FAQ <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section id="promise" className="scroll-mt-24 border-b border-border bg-background">
        <ul className="mx-auto grid max-w-6xl gap-px px-4 py-6 md:grid-cols-3 md:gap-8 md:px-8 md:py-8">
          {promises.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 py-2 text-sm">
              <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Form */}
      <section id="form" className="scroll-mt-24 bg-muted py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div id="details" className="scroll-mt-24">
            <p className={eyebrow}>Get in touch</p>
            <h2 className={bandHeading}>Send us a message</h2>
            <p className="mt-5 max-w-md text-sm leading-[1.8] text-muted-foreground">
              Fill in the form and we will take it from there. Only your name, email and a message are
              needed.
            </p>
            <ul className="mt-10">
              {details.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-4 border-t border-border py-5 text-sm last:border-b">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-1">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className={eyebrow}>Good to know</p>
            <h2 className={bandHeading}>Questions, answered</h2>
            <div className="group mt-10 hidden max-w-xs overflow-hidden rounded-lg bg-muted lg:block">
              <img
                src="/assets/generated/contact-letters.webp"
                width={1024}
                height={1280}
                alt="A small stack of envelopes tied with string, sealed in terracotta wax, beside a pen"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
              />
            </div>
          </div>
          <div className="border-b border-border">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border-t border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-medium tracking-tight transition-colors duration-150 hover:text-primary [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus
                    className="h-4 w-4 shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="max-w-[65ch] pb-6 text-sm leading-[1.8] text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            We would love to hear from you.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#form"
              className={buttonClass({
                size: 'lg',
                className: cn('text-xs uppercase tracking-wider', lightButton, lift),
              })}
            >
              Send a message
            </a>
            <a
              href="#faq"
              className={buttonClass({
                variant: 'outline',
                size: 'lg',
                className: cn('text-xs uppercase tracking-wider', lightOutline, lift),
              })}
            >
              Read the FAQ
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
