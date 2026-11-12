import { useState, type FormEvent } from 'react';
import axios from 'axios';
import apiClient from '@/services/apiClient';
import { Alert, Button, Field, Input } from '@/components/ui';
import { inputClass } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: '', email: '', subject: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const set = (key: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await apiClient.post('/contact', values);
      setSent(true);
      setValues(empty);
    } catch (err) {
      const data = axios.isAxiosError(err) ? err.response?.data : null;
      if (data?.errors) setErrors(data.errors);
      setFormError(data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className={cn('flex flex-col items-start gap-4 border-t border-border py-8', className)}>
        <Alert variant="success">Thank you — your message has been sent. We’ll be in touch soon.</Alert>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className={cn('flex flex-col gap-5', className)}>
      {formError && <Alert>{formError}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="contact-name" required error={errors.name}>
          <Input id="contact-name" autoComplete="name" maxLength={100} value={values.name} onChange={set('name')} />
        </Field>
        <Field label="Email" htmlFor="contact-email" required error={errors.email}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            maxLength={200}
            value={values.email}
            onChange={set('email')}
          />
        </Field>
      </div>
      <Field label="Subject" htmlFor="contact-subject" error={errors.subject}>
        <Input id="contact-subject" maxLength={150} value={values.subject} onChange={set('subject')} />
      </Field>
      <Field label="Message" htmlFor="contact-message" required error={errors.message}>
        <textarea
          id="contact-message"
          rows={6}
          maxLength={5000}
          className={inputClass('resize-y')}
          value={values.message}
          onChange={set('message')}
        />
      </Field>
      <div>
        <Button
          type="submit"
          loading={loading}
          className="text-xs uppercase tracking-wider motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5"
        >
          Send message
        </Button>
      </div>
    </form>
  );
}
