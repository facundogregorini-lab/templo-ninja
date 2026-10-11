/* Product analytics: PostHog (events, funnels, session replay) and Vercel Web Analytics + Speed Insights.
   The PostHog project key is public (it goes in every page anyway). Events go through /ingest, a rewrite to
   PostHog in vercel.json, so ad blockers that block posthog.com do not drop them.
   Local copies (localhost, 127.0.0.1) load nothing: the events stay in window.tnEvents, for the tests. */
(function () {
  const KEY = 'phc_tPTtLds2LH6udzJtXWcZzHsXyxUrTgxjSDyMmDThg3gz';
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  window.tnEvents = window.tnEvents || [];

  // Vercel: the scripts are served by Vercel itself once Web Analytics and Speed Insights are on in the project.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  if (!local) for (const src of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) {
    const s = document.createElement('script'); s.defer = true; s.src = src; document.head.append(s);
  }

  // PostHog's official loader: a stub that queues calls until the library arrives.
  if (!local) {
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(KEY, {
      api_host: location.origin + '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2025-05-24',          // automatic pageviews, also when the address changes without reloading
      autocapture: true,
      person_profiles: 'identified_only',
      session_recording: { maskAllInputs: true, maskInputOptions: { password: true } },
    });
    window.posthog.register({ app: 'templo-ninja' });
  }

  // What the app calls. Never pass emails, passwords or payment data as properties.
  window.tn = {
    capture(event, props) { window.tnEvents.push([event, props || {}]); window.posthog?.capture?.(event, props || {}); },
    identify(id, props) { window.tnEvents.push(['$identify', { id }]); window.posthog?.identify?.(id, props || {}); },
    people(props) { window.posthog?.setPersonProperties?.(props); window.posthog?.register?.(props); },
    reset() { window.tnEvents.push(['$reset', {}]); window.posthog?.reset?.(); },
    // An experiment's variant (PostHog feature flag), once flags have loaded. Asking for it counts as an exposure,
    // so call it only for the people in the experiment. Local copies read window.tnFlags (the tests set it).
    flag(key, done) {
      if (local || !window.posthog?.onFeatureFlags) return done(window.tnFlags?.[key]);
      window.posthog.onFeatureFlags(() => done(window.posthog.getFeatureFlag(key)));
    },
  };

  /* A/B test of the home (middleware.js): the variant this browser got at "/" is in the tn_home cookie. Every event
     carries it (home_ab), and PostHog's experiment "home-nueva" counts an exposure, home_ab_exposure, each time "/"
     is actually on screen: Instagram and Facebook preload the ad's page in the background, and that is nobody.
     Visits picked by hand with ?home= (tn_home_qa) stay out. The flag mirrors the cookie (person property home_ab),
     so PostHog's own reading of it agrees. */
  const cookie = name => (document.cookie.match('(?:^|; )' + name + '=([^;]*)') || [])[1];
  const home = cookie('tn_home'), qa = cookie('tn_home_qa') === '1';
  const variant = home === 'nueva' ? 'test' : home === 'actual' ? 'control' : null;
  if (!variant) return;
  if (!local) {
    window.posthog.register(qa ? { home_ab_qa: true } : { home_ab: home });
    if (!qa) window.posthog.setPersonPropertiesForFlags({ home_ab: home });
  }
  if (qa || location.pathname !== '/') return;
  let exposed = false;
  const expose = () => {
    if (exposed || document.visibilityState !== 'visible') return;
    exposed = true; document.removeEventListener('visibilitychange', expose);
    window.tn.capture('home_ab_exposure', { variant, home, '$feature/home-nueva': variant });
  };
  document.addEventListener('visibilitychange', expose);
  expose();
})();
