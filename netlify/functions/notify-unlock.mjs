/**
 * Emails GMZ when someone enters the consultation code successfully.
 *
 * The trigger is deliberately the unlock, not a page view. A page view fires
 * for bots, for link previews that Gmail, iMessage and WhatsApp fetch on their
 * own, and for anyone who arrives and gives up at the veil. None of those are
 * a person looking at the work, and an alert that cries wolf gets filtered,
 * which would also bury the consultation requests arriving in the same inbox.
 *
 * It reports *when*, not *who*. There is no identity to report: the veil takes
 * a shared code, not a login. The client IP is deliberately not collected or
 * sent. Netlify's coarse geo headers are included because "someone in Menlo
 * Park got in this evening" is useful for following up a link you sent, and
 * a city is not an identification.
 *
 * Inert unless RESEND_API_KEY and NOTIFY_EMAIL_TO are both set, so previews
 * and local runs never send mail. It always answers 204 regardless of what
 * happened downstream: the browser must never learn whether a key is
 * configured, and the unlock must never appear to fail because a notification
 * did.
 */

const ALLOWED_ORIGIN_SUFFIX = '.gmzlandscape.com';

export default async (request, context) => {
  // Fire and forget from the browser's side, so nothing here is worth telling
  // the caller about. 204 for every outcome, including the failures below.
  const quiet = () => new Response(null, { status: 204 });

  if (request.method !== 'POST') return quiet();

  /*
   * A public endpoint that sends mail is a public endpoint that can be made to
   * send a lot of mail. This is not real protection, since an Origin header is
   * trivially forged, but it does stop the endpoint being fired accidentally
   * from somewhere else, and it costs nothing. The real limits are Resend's
   * own quota and the fact that nothing here loops.
   */
  const origin = request.headers.get('origin') ?? '';
  if (origin && !new URL(origin).hostname.endsWith(ALLOWED_ORIGIN_SUFFIX)) {
    return quiet();
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM ?? 'onboarding@resend.dev';
  if (!key || !to) return quiet();

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* A malformed body still gets a notification, just a thinner one. */
  }

  const geo = context?.geo ?? {};
  const place = [geo.city, geo.subdivision?.code, geo.country?.code].filter(Boolean).join(', ');

  const when = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const landed = typeof body.path === 'string' ? body.path.slice(0, 200) : 'unknown';
  const came =
    typeof body.referrer === 'string' && body.referrer ? body.referrer.slice(0, 200) : '';

  const lines = [
    'Someone entered the consultation code and is looking at the portfolio.',
    '',
    `Time:    ${when} (Pacific)`,
    `Landed:  ${landed}`,
    place ? `Roughly: ${place}` : null,
    came ? `Came by: ${came}` : null,
    '',
    'This is one notification per visit, not per page. It says when, not who:',
    'the code is shared, so there is no identity to report.',
  ].filter((line) => line !== null);

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Portfolio opened${place ? ` from ${place}` : ''}`,
        text: lines.join('\n'),
      }),
    });
  } catch {
    /* An unreachable mail API must not turn into a visible error. */
  }

  return quiet();
};
