import { useRef, useState, type FormEvent } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { Alert, Button, Field, Input } from '@/components/ui';
import { inputClass } from '@/components/ui/Input';
import { cn } from '@/utils/cn';
import { lift } from '@/utils/lift';

type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: '', email: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 5000;
// Order the fields appear in, so the first one with an error gets the focus.
const fieldOrder: (keyof Values)[] = ['name', 'email', 'subject', 'message'];

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  if (!v.email.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Please enter a valid email.';
  if (!v.message.trim()) errors.message = 'Please enter a message.';
  return errors;
}

export default function ContactForm({ className }: { className?: string }) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function focusFirstError(found: Errors) {
    const first = fieldOrder.find((k) => found[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/contact', values);
      setSent(true);
      setValues(empty);
    } catch (err) {
      const data = axios.isAxiosError(err) ? err.response?.data : null;
      if (data?.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }
      setFormError(data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const panel = 'rounded-lg border border-border bg-background p-6 md:p-10';

  if (sent) {
    return (
      <div className={cn(panel, 'flex flex-col items-start gap-5 self-start', className)}>
        <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.5} />
        <div role="status">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Message sent</p>
          <h3 className="mt-3 text-3xl font-medium leading-[1.05] tracking-tight">Thank you for writing.</h3>
          <p className="mt-4 max-w-md text-sm leading-[1.8] text-muted-foreground">
            Your message is on its way to us. Expect a reply within two working days.
          </p>
        </div>
        <Button variant="outline" className={cn('text-xs uppercase tracking-wider', lift)} onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label="Contact form"
      className={cn(panel, 'flex flex-col gap-6 self-start', className)}
    >
      {formError && <Alert>{formError}</Alert>}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="contact-name" required error={errors.name}>
          <Input
            id="contact-name"
            autoComplete="name"
            maxLength={100}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            value={values.name}
            onChange={set('name')}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email" required error={errors.email}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            maxLength={200}
            placeholder="Your email address"
            aria-invalid={!!errors.email}
            value={values.email}
            onChange={set('email')}
          />
        </Field>
      </div>
      <Field label="Subject" htmlFor="contact-subject" hint="Optional" error={errors.subject}>
        <Input
          id="contact-subject"
          maxLength={150}
          placeholder="What is this about?"
          aria-invalid={!!errors.subject}
          value={values.subject}
          onChange={set('subject')}
        />
      </Field>
      <Field label="Message" htmlFor="contact-message" required error={errors.message}>
        <textarea
          id="contact-message"
          rows={7}
          maxLength={MESSAGE_MAX}
          placeholder="Tell us a little about what you have in mind…"
          aria-invalid={!!errors.message}
          className={inputClass('resize-y')}
          value={values.message}
          onChange={set('message')}
        />
        <p className="text-right text-xs text-muted-foreground" aria-hidden>
          {values.message.length} / {MESSAGE_MAX}
        </p>
      </Field>
      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          We only use your details to reply to you.
        </p>
        <Button type="submit" size="lg" loading={loading} className={cn('text-xs uppercase tracking-wider', lift)}>
          Send message
        </Button>
      </div>
    </form>
  );
}
