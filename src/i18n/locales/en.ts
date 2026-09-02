/**
 * English message catalogue — the source of truth for the app's copy.
 *
 * `ar.ts` mirrors this shape key-for-key; anything added here without an Arabic
 * counterpart falls back to the English string rather than rendering the raw
 * key (see `fallbackLocale` in ../index.ts).
 *
 * Prayer and weekday names are keyed by their English data value (`Fajr`,
 * `Mon`) because that is what `types/habit.ts` persists — the stored habit is
 * locale-independent, and only its label is translated.
 */
export default {
  brand: 'WirdStack',

  common: {
    close: 'Close',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    pause: 'Pause',
    resume: 'Resume',
    done: 'Done',
    missed: 'Missed',
    notScheduled: 'Not scheduled',
    skipToContent: 'Skip to content',
  },

  nav: {
    today: 'Today',
    habits: 'Habits',
    stats: 'Stats',
    newHabit: 'New habit',
    new: 'New',
    main: 'Main',
  },

  // Keyed by the Prayer union in types/habit.ts.
  prayers: {
    Fajr: 'Fajr',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
  },

  weekdays: {
    long: {
      Sun: 'Sunday',
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
    },
    // Rendered in the day picker and the weekday chart, where there is room
    // for roughly one glyph.
    short: {
      Sun: 'S',
      Mon: 'M',
      Tue: 'T',
      Wed: 'W',
      Thu: 'T',
      Fri: 'F',
      Sat: 'S',
    },
  },

  theme: {
    system: 'system',
    light: 'light',
    dark: 'dark',
    label: 'Theme: {preference}. Click to change.',
    labelSystem: 'Theme: system ({resolved}). Click to change.',
  },

  locale: {
    switchTo: 'التبديل إلى العربية',
    current: 'English',
  },

  today: {
    greeting: {
      night: 'A blessed night',
      morning: 'A blessed morning',
      afternoon: 'A blessed afternoon',
      evening: 'A blessed evening',
    },
    summaryNone: 'Nothing scheduled for today',
    summaryAllDone: 'Every habit stacked today — alhamdulillah',
    summaryProgress: '{done} of {total} habits stacked so far today',
    nextPrayer: 'Next prayer',
    tomorrow: 'Tomorrow',
    nextUp: 'Next up',
    inTime: 'in {time}',
    habitsAfter: 'Habits after {prayer}',
    fallbackLocation: 'Showing prayer times for {location}.',
    useMyLocation: 'Use my location',
    timesUnavailable: 'Prayer times are unavailable right now.',
    // True first run: no habits exist anywhere yet.
    firstRunTitle: 'Nothing stacked yet',
    firstRunBody: 'Pick a prayer you already pray and attach one small act to it — that’s the whole method.',
    // Habits exist, just none scheduled today (all paused, or all run on other days).
    emptyTitle: 'Nothing due today',
    emptyBody: 'No habit is scheduled for today. Check the days it runs, or add another.',
    createFirst: 'Create your first habit',
    addAnother: 'Add another habit',
    methodPicker: 'Prayer time calculation method',
    ringLabel: '{value} of {total} habits done today',
  },

  // Countdown units, assembled in usePrayerTimes.
  duration: {
    hoursMinutes: '{hours}h {minutes}m',
    hours: '{hours}h',
    minutes: '{minutes}m',
  },

  prayerTimes: {
    fallbackCity: 'Makkah',
    locationUnavailable: 'Location unavailable — showing times for {city}.',
    noGeolocation: 'This browser can’t share a location.',
    serviceError: 'Prayer time service returned {status}',
    unexpectedShape: 'Prayer time service returned an unexpected shape',
    loadFailed: 'Could not load prayer times',
    methods: {
      2: 'ISNA — North America',
      3: 'Muslim World League',
      4: 'Umm al-Qura — Makkah',
      5: 'Egyptian General Authority',
      1: 'University of Karachi',
      8: 'Gulf Region',
      13: 'Diyanet — Turkey',
    },
  },

  habits: {
    title: 'Habits',
    total: '{count} total',
    pausedCount: '{count} paused',
    filterLabel: 'Filter habits',
    filters: {
      all: 'All',
      active: 'Active',
      paused: 'Paused',
    },
    emptyAll: 'No habits.',
    emptyActive: 'No active habits.',
    emptyPaused: 'No paused habits.',
    noHabitsTitle: 'No habits yet',
    noHabitsBody:
      'Pick a prayer you already pray and attach something small to it — one verse is a real habit.',
    createFirst: 'Create your first habit',
    status: {
      paused: 'Paused',
      new: 'New',
      atRisk: 'At risk',
      streakDays: '{count}-day',
    },
    // Second line on a row that can't be ticked today.
    runsOn: 'After {prayer} · runs {days}',
    afterPrayer: 'After {prayer} · {minimal}',
    markDone: 'Mark done',
    markAsDone: 'Mark {title} as done',
    markAsNotDone: 'Mark {title} as not done',
    pausedRowLabel: '{title} — paused; resume it to check it off',
    notScheduledRowLabel: '{title} — not scheduled today',
    resumeToCheck: 'Resume this habit to check it off',
    notScheduledToday: 'Not scheduled today',
    backup: {
      title: 'Backup & restore',
      note: 'Your habits live only in this browser. Export a file to keep them safe, or to move them to another device.',
      export: 'Export backup',
      import: 'Restore from file',
      confirmTitle: 'Replace everything?',
      confirmBody:
        'Restoring will replace your current {current} habits with the {incoming} in this file, along with all their history. This can’t be undone.',
      confirmAction: 'Replace',
      error: {
        malformed: 'That file is a WirdStack backup but it’s damaged and can’t be read.',
        'not-wirdstack': 'That doesn’t look like a WirdStack backup file.',
        'too-new': 'That backup was made by a newer version of WirdStack. Update the app first.',
      },
    },
  },

  habitForm: {
    newTitle: 'New habit',
    editTitle: 'Edit habit',
    subtitle: 'Stack it after a prayer',
    notFoundTitle: 'Habit not found',
    notFoundBody: 'This habit may have been deleted, or the link you followed is out of date.',
    backToHabits: 'Back to habits',
    fieldTitle: 'Title',
    titlePlaceholder: 'e.g. Read Qur’an',
    fieldAnchor: 'Anchor prayer',
    fieldMinimal: 'Minimal version',
    minimalPlaceholder: 'e.g. 1 verse',
    minimalHint: 'Two-minute rule — smaller than feels necessary.',
    fieldDays: 'Days',
    daysHint: 'Every day by default — narrow it down for day-specific habits like fasting Mondays.',
    submitCreate: 'Create habit',
    submitUpdate: 'Update habit',
    successCreatedTitle: 'Habit stacked',
    successCreatedBody: 'It’s on your Today list — you’ll see it after your next prayer.',
    successUpdatedTitle: 'Habit updated',
    successUpdatedBody: 'Your changes have been saved.',
    goToHabits: 'Go to habits',
    errors: {
      title: 'Title is required',
      minimalVersion: 'Give it a minimal version',
      days: 'Pick at least one day',
    },
  },

  habitDetails: {
    backToHabits: 'Back to habits',
    startedOn: 'Started {date}',
    currentStreak: 'Current streak',
    longestStreak: 'Longest streak',
    scheduledDays: 'Set in Days',
    thisWeek: 'This week',
    previousWeek: 'Previous week',
    nextWeek: 'Next week',
    notFound: 'Habit not found.',
    deleteTitle: 'Delete habit?',
    deleteBody:
      'This will permanently delete “{title}” and its completion history. This can’t be undone.',
    deletedTitle: 'Deleted',
    deletedBody: 'The habit has been deleted.',
    cellNotScheduled: '{date} — not scheduled',
    cellUpcoming: '{date} — upcoming',
    cellDone: '{date} — completed, click to unmark',
    cellMissed: '{date} — missed, click to mark done',
  },

  stats: {
    title: 'Stats',
    range: '{month} · to date',
    emptyTitle: 'Not enough data yet',
    emptyBody:
      'Log a few check-ins and your completion rates, weekday patterns and prayer breakdown will show up here.',
    goToToday: 'Go to Today',
    completionRate: 'Completion rate',
    bestStreak: 'Best active streak',
    atRisk: 'At risk',
    activeHabits: 'Active habits',
    byWeekday: 'Completion by weekday',
    byWeekdayCaption: '% of scheduled habits done',
    byWeekdayChartLabel: 'Completion rate by weekday',
    nothingScheduled: 'nothing scheduled',
    weekdayDetail: '{rate}% of {count} scheduled',
    last30: 'Last 30 days',
    less: 'Less',
    more: 'More',
    dayNothingScheduled: '{date} — nothing scheduled',
    dayDone: '{date} — {done} of {total} done',
    byPrayer: 'By anchor prayer',
    strongest: 'Strongest',
    weakest: 'Weakest',
    weakestNote: '{prayer} is where habits slip most — try shrinking that one until it is trivial.',
    pausedExcluded: '{count} paused habits excluded from these stats.',
    pausedExcludedOne: '1 paused habit excluded from these stats.',
  },

  privacy: {
    title: 'Privacy',
    updated: 'Last updated {date}',
    back: 'Back to home',

    summaryHeading: 'The short version',
    summaryBody:
      'WirdStack has no accounts, no cookies, and no advertising. Your habits and your history are written to your own browser and are never sent anywhere. Two things leave your device: an approximate location, used to calculate your prayer times, and an anonymous count of pages opened.',

    storedHeading: 'What stays on your device',
    storedBody:
      'All of this is kept in your browser’s local storage. It never reaches us, because there is no server to reach:',
    storedHabits: 'Your habits and their completion history',
    storedCoords: 'Your approximate coordinates and the city name resolved from them',
    storedSettings: 'Your prayer-time calculation method, theme, and language',
    storedTimes: 'A cache of the prayer times already fetched for today',

    sentHeading: 'What leaves your device',
    sentBody:
      'Your approximate location, and nothing else. It goes to two services that turn it into prayer times and a city name. We do not control them, and their own privacy policies apply:',
    sentAladhanName: 'Aladhan (aladhan.com)',
    sentAladhanDetail:
      'receives your approximate coordinates and the calculation method, and returns prayer times. Your habits are never included.',
    sentGeocodeName: 'BigDataCloud (bigdatacloud.com)',
    sentGeocodeDetail:
      'receives the same approximate coordinates once per location, and returns a city name so the app can say “Riyadh” instead of a pair of numbers.',

    infraHeading: 'Who can see your IP address',
    infraBody:
      'Loading any website reveals your IP address to whoever serves it — that is how the web works, not a choice this app makes. Two providers are involved in serving WirdStack. Neither receives your habits or your location:',
    sentFontsName: 'Google Fonts (fonts.googleapis.com)',
    sentFontsDetail: 'serves the typefaces the app is set in.',
    sentHostingName: 'Cloudflare Pages',
    sentHostingDetail: 'hosts the site and keeps standard server request logs.',

    precisionHeading: 'About your location',
    precisionBody:
      'The app asks your browser for a location only when you grant permission, and you can refuse — it will fall back to Makkah and say so. Before any coordinates are sent, they are rounded to two decimal places, roughly a 1km area. That is more than accurate enough for prayer times, which shift by about a minute every 20km, and it means the precise fix your device produced never leaves it.',

    analyticsHeading: 'Analytics',
    analyticsBody:
      'We count page views through Cloudflare Web Analytics, to know whether the app is being used at all. It sets no cookies, does not follow you to any other site, and records nothing about your habits — only that a page was opened, roughly which country from, and what kind of device. The numbers are aggregate: there is no per-person profile to look at, including for us.',

    neverHeading: 'What we never do',
    neverBody:
      'No accounts. No cookies. No advertising. No profile of you is built, and nothing is ever sold or shared. Your habits are not part of the page-view counts above and never leave your device.',

    controlHeading: 'Your control',
    controlBody:
      'You can revoke location permission at any time in your browser settings. Clearing your browser’s site data for WirdStack erases everything the app has stored, immediately and permanently — so export a backup first if you want to keep your history. Because there are no accounts, there is no data of yours held anywhere for us to delete on request.',

    contactHeading: 'Contact',
    contactBody: 'Questions about this policy can be sent to {email}.',
  },

  notFound: {
    title: 'This page doesn’t exist',
    body: 'The link may be out of date, or the habit it pointed to has since been deleted.',
    goToToday: 'Go to Today',
  },

  // Route titles — read by the router's afterEach hook.
  routes: {
    landing: 'WirdStack — small acts, kept up daily',
    today: 'Today',
    habits: 'Habits',
    newHabit: 'New habit',
    habitDetails: 'Habit',
    editHabit: 'Edit habit',
    stats: 'Stats',
    notFound: 'Not found',
    privacy: 'Privacy',
  },

  landing: {
    howItWorks: 'How it works',
    features: 'Features',
    startFree: 'Start free',
    openApp: 'Open WirdStack',
    eyebrow: 'Habit stacking, anchored to salah',
    headlineLead: 'Small acts,',
    headlineRest: 'kept up',
    headlineEmphasis: 'daily',
    lede:
      'The Prophet ﷺ said the deeds most beloved to Allah are those done consistently, even if they are few. WirdStack attaches one small act to each prayer you already pray — so the habit has somewhere to live.',
    ctaFirst: 'Start your first habit',
    ctaReturning: 'Continue where you left off',
    seeHow: 'See how it works',
    note: 'Free · No account · Works offline',
    cardHead: 'Next prayer where you are',
    cardFallback: 'using {location} — use my location',
    cardTomorrow: 'tomorrow',
    cardOffline: 'Prayer times are offline right now — everything else still works.',
    methodEyebrow: 'The method',
    methodHeadline: 'Three rules, and that is the whole app.',
    steps: {
      anchorTitle: 'Anchor it to a prayer',
      anchorBody:
        'You already stop five times a day. That is the cue — you never have to remember it, and you never have to invent a time that works.',
      shrinkTitle: 'Shrink it until it is easy',
      shrinkBody:
        'One verse. Thirty-three counts. A single dollar. Small enough that a bad day still ends with it done.',
      chainTitle: 'Let the chain do the work',
      chainBody:
        'Every check-in extends a streak you can see. Missing one day is a gap, not a failure — the chain picks up again tomorrow.',
    },
    quote: 'The most beloved of deeds to Allah are those that are most consistent, even if it is small.',
    quoteSource: 'Sahih al-Bukhari 6464',
    featuresEyebrow: 'What you get',
    featuresHeadline: 'Enough to be useful. Nothing to manage.',
    features_: {
      timesTitle: 'Your real prayer times',
      timesBody:
        'Calculated for your coordinates, refreshed daily, with the calculation method your community follows.',
      scheduleTitle: 'Day-specific schedules',
      scheduleBody:
        'Fasting Mondays, Sadaqah Fridays, Qur’an every morning. A habit only shows up on the days it belongs to.',
      statsTitle: 'Honest statistics',
      statsBody:
        'Completion rate by weekday and by prayer, so you can see which anchor is carrying you and which one keeps slipping.',
      pauseTitle: 'Pause without losing history',
      pauseBody:
        'Travelling, unwell, or in a hard season? Pause a habit. It stops counting against you and keeps everything it earned.',
      themeTitle: 'Built for night and day',
      themeBody:
        'A considered dark theme for Fajr and Isha — not an inverted screenshot, a second palette designed on purpose.',
      privacyTitle: 'Stays on your device',
      privacyBody:
        'Your practice is written to your browser’s own storage. No account, no server, nothing to leak.',
    },
    closerTitle: 'Start with one verse.',
    closerBody: 'Pick a prayer, pick something small, and let tomorrow take care of itself.',
    footer:
      'WirdStack — a wird (ورد) is a devotional practice kept up daily; this app helps you stack one onto every prayer.',
  },
} as const;
