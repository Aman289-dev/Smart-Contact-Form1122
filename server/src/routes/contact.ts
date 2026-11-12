import { Router } from 'express';
import { ContactMessage } from '../models/ContactMessage';

const router = Router();

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// Public: anyone can send a message. There is deliberately no route to read
// messages back, since the app has no login to protect one.
router.post('/', async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const input = {
    name: text(body.name),
    email: text(body.email).toLowerCase(),
    subject: text(body.subject),
    message: text(body.message),
  };

  const errors: Record<string, string> = {};
  if (!input.name) errors.name = 'Please enter your name.';
  if (!input.email) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(input.email)) errors.email = 'Please enter a valid email.';
  if (!input.message) errors.message = 'Please enter a message.';
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (!errors[key] && input[key].length > LIMITS[key]) {
      errors[key] = `Must be at most ${LIMITS[key]} characters.`;
    }
  }
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ success: false, error: 'Please check the form.', errors });
    return;
  }

  const saved = await ContactMessage.create(input);
  res.status(201).json({ success: true, id: saved.id });
});

export default router;
