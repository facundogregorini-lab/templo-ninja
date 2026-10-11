// A/B test of the home page (Vercel Routing Middleware): at the same address, "/", half of the visitors see the
// current home (index.html) and half the new one (nueva.html). No redirect, so the ads' landing page, its
// parameters (utm_*, fbclid, gclid) and the Pixel's PageView stay exactly as they are.
//
// - Each browser keeps its variant in the tn_home cookie (90 days): every visit, the return from Mercado Pago
//   (/?aporte=ok) and the links back to "/" show it the same home. analytics.js reads the cookie and reports the
//   exposure to PostHog (experiment "home-nueva").
// - Robots (Google, Meta's crawler and ad review, link previews) always get the current home and no cookie: the
//   new one is noindex, and they are not people.
// - AB_HOME_NUEVA_SHARE (Vercel environment variable, 0 to 1) is the share of new visitors sent to the new home.
//   Unset or 0: the test is off, everyone gets the current home and no cookie is written, so nobody is assigned
//   before the launch. 0.5 starts it. Changing it needs a redeploy; people already assigned keep their variant.
//   AB_HOME_FORCE=actual|nueva sends everyone to one home (to stop the test, or to ship the winner).
// - ?home=nueva or ?home=actual picks one by hand (QA): it sets the cookie plus tn_home_qa, so analytics.js
//   leaves those visits out of the experiment.
import { next, rewrite } from '@vercel/functions';

export const config = { matcher: '/' };

export const COOKIE = 'tn_home', QA_COOKIE = 'tn_home_qa', VARIANTS = ['actual', 'nueva'];
const MAX_AGE = 90 * 86400;
export const BOTS = /\bbot\b|bot[/;)]|crawl|spider|slurp|facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|adsbot|mediapartners|google-inspectiontool|googleother|bingpreview|lighthouse|headlesschrome|pagespeed|chrome-lighthouse|whatsapp|telegrambot|slackbot|discordbot|twitterbot|linkedinbot|embedly|pinterest|skypeuripreview|vkshare|preview/i;

const readCookie = (header, name) => (header || '').split(/;\s*/).map(c => c.split('=')).find(([k]) => k === name)?.[1];

// Which home this request gets, and the cookies to write. Pure, for the tests (tests/ab.cjs).
export function decide({ url, cookie, userAgent, env = {}, random = Math.random }) {
  const u = new URL(url), forced = env.AB_HOME_FORCE, qa = u.searchParams.get('home');
  if (VARIANTS.includes(forced)) return { variant: forced, cookies: [] };
  if (BOTS.test(userAgent || '')) return { variant: 'actual', cookies: [] };
  const set = v => `${COOKIE}=${v}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax; Secure`;
  if (VARIANTS.includes(qa)) return { variant: qa, cookies: [set(qa), `${QA_COOKIE}=1; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax; Secure`] };
  const kept = readCookie(cookie, COOKIE);
  if (VARIANTS.includes(kept)) return { variant: kept, cookies: [] };
  const share = Math.min(1, Math.max(0, Number(env.AB_HOME_NUEVA_SHARE) || 0));
  if (!share) return { variant: 'actual', cookies: [] }; // the test is off: nobody is assigned
  const variant = random() < share ? 'nueva' : 'actual';
  return { variant, cookies: [set(variant)] };
}

export default function middleware(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();
  const { variant, cookies } = decide({ url: request.url, cookie: request.headers.get('cookie'), userAgent: request.headers.get('user-agent'), env: process.env });
  const headers = new Headers({ 'Cache-Control': 'private, no-cache' }); // the same address answers two different pages
  for (const c of cookies) headers.append('Set-Cookie', c);
  if (variant === 'nueva') {
    const target = new URL(request.url); target.pathname = '/nueva.html'; target.hash = '';
    return rewrite(target, { headers });
  }
  return next({ headers });
}
