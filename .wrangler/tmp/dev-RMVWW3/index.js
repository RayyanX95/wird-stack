var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/i18n/locales/en.ts
var en_default = {
  brand: "WirdStack",
  // Consumed by worker/index.ts to rewrite og:/meta tags per locale at the
  // edge, since non-JS social crawlers never see anything Vue renders.
  // Kept here rather than duplicated in the worker so the two can't drift.
  seo: {
    title: "WirdStack \u2014 small acts, kept up daily",
    description: "Anchor one small act to each prayer you already pray. Free, no account, works offline."
  },
  common: {
    close: "Close",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    pause: "Pause",
    resume: "Resume",
    done: "Done",
    missed: "Missed",
    notScheduled: "Not scheduled",
    skipToContent: "Skip to content"
  },
  nav: {
    today: "Today",
    habits: "Habits",
    stats: "Stats",
    newHabit: "New habit",
    new: "New",
    main: "Main"
  },
  // Keyed by the Prayer union in types/habit.ts.
  prayers: {
    Fajr: "Fajr",
    Dhuhr: "Dhuhr",
    Asr: "Asr",
    Maghrib: "Maghrib",
    Isha: "Isha"
  },
  weekdays: {
    long: {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday"
    },
    // Rendered in the day picker and the weekday chart, where there is room
    // for roughly one glyph.
    short: {
      Sun: "S",
      Mon: "M",
      Tue: "T",
      Wed: "W",
      Thu: "T",
      Fri: "F",
      Sat: "S"
    }
  },
  theme: {
    system: "system",
    light: "light",
    dark: "dark",
    label: "Theme: {preference}. Click to change.",
    labelSystem: "Theme: system ({resolved}). Click to change."
  },
  locale: {
    switchTo: "\u0627\u0644\u062A\u0628\u062F\u064A\u0644 \u0625\u0644\u0649 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    current: "English"
  },
  today: {
    greeting: {
      night: "A blessed night",
      morning: "A blessed morning",
      afternoon: "A blessed afternoon",
      evening: "A blessed evening"
    },
    summaryNone: "Nothing scheduled for today",
    summaryAllDone: "Every habit stacked today \u2014 alhamdulillah",
    summaryProgress: "{done} of {total} habits stacked so far today",
    nextPrayer: "Next prayer",
    tomorrow: "Tomorrow",
    nextUp: "Next up",
    inTime: "in {time}",
    habitsAfter: "Habits after {prayer}",
    fallbackLocation: "Showing prayer times for {location}.",
    useMyLocation: "Use my location",
    timesUnavailable: "Prayer times are unavailable right now.",
    // True first run: no habits exist anywhere yet.
    firstRunTitle: "Nothing stacked yet",
    firstRunBody: "Pick a prayer you already pray and attach one small act to it \u2014 that\u2019s the whole method.",
    // Habits exist, just none scheduled today (all paused, or all run on other days).
    emptyTitle: "Nothing due today",
    emptyBody: "No habit is scheduled for today. Check the days it runs, or add another.",
    createFirst: "Create your first habit",
    addAnother: "Add another habit",
    methodPicker: "Prayer time calculation method",
    ringLabel: "{value} of {total} habits done today"
  },
  // Countdown units, assembled in usePrayerTimes.
  duration: {
    hoursMinutes: "{hours}h {minutes}m",
    hours: "{hours}h",
    minutes: "{minutes}m"
  },
  prayerTimes: {
    fallbackCity: "Makkah",
    locationUnavailable: "Location unavailable \u2014 showing times for {city}.",
    noGeolocation: "This browser can\u2019t share a location.",
    serviceError: "Prayer time service returned {status}",
    unexpectedShape: "Prayer time service returned an unexpected shape",
    loadFailed: "Could not load prayer times",
    methods: {
      2: "ISNA \u2014 North America",
      3: "Muslim World League",
      4: "Umm al-Qura \u2014 Makkah",
      5: "Egyptian General Authority",
      1: "University of Karachi",
      8: "Gulf Region",
      13: "Diyanet \u2014 Turkey"
    }
  },
  habits: {
    title: "Habits",
    total: "{count} total",
    pausedCount: "{count} paused",
    filterLabel: "Filter habits",
    filters: {
      all: "All",
      active: "Active",
      paused: "Paused"
    },
    emptyAll: "No habits.",
    emptyActive: "No active habits.",
    emptyPaused: "No paused habits.",
    noHabitsTitle: "No habits yet",
    noHabitsBody: "Pick a prayer you already pray and attach something small to it \u2014 one verse is a real habit.",
    createFirst: "Create your first habit",
    status: {
      paused: "Paused",
      new: "New",
      atRisk: "At risk",
      streakDays: "{count}-day"
    },
    // Second line on a row that can't be ticked today.
    runsOn: "After {prayer} \xB7 runs {days}",
    afterPrayer: "After {prayer} \xB7 {minimal}",
    markDone: "Mark done",
    markAsDone: "Mark {title} as done",
    markAsNotDone: "Mark {title} as not done",
    pausedRowLabel: "{title} \u2014 paused; resume it to check it off",
    notScheduledRowLabel: "{title} \u2014 not scheduled today",
    resumeToCheck: "Resume this habit to check it off",
    notScheduledToday: "Not scheduled today",
    backup: {
      title: "Backup & restore",
      note: "Your habits live only in this browser. Export a file to keep them safe, or to move them to another device.",
      export: "Export backup",
      import: "Restore from file",
      confirmTitle: "Replace everything?",
      confirmBody: "Restoring will replace your current {current} habits with the {incoming} in this file, along with all their history. This can\u2019t be undone.",
      confirmAction: "Replace",
      error: {
        malformed: "That file is a WirdStack backup but it\u2019s damaged and can\u2019t be read.",
        "not-wirdstack": "That doesn\u2019t look like a WirdStack backup file.",
        "too-new": "That backup was made by a newer version of WirdStack. Update the app first."
      }
    }
  },
  habitForm: {
    newTitle: "New habit",
    editTitle: "Edit habit",
    subtitle: "Stack it after a prayer",
    notFoundTitle: "Habit not found",
    notFoundBody: "This habit may have been deleted, or the link you followed is out of date.",
    backToHabits: "Back to habits",
    fieldTitle: "Title",
    titlePlaceholder: "e.g. Read Qur\u2019an",
    fieldAnchor: "Anchor prayer",
    fieldMinimal: "Minimal version",
    minimalPlaceholder: "e.g. 1 verse",
    minimalHint: "Two-minute rule \u2014 smaller than feels necessary.",
    fieldDays: "Days",
    daysHint: "Every day by default \u2014 narrow it down for day-specific habits like fasting Mondays.",
    submitCreate: "Create habit",
    submitUpdate: "Update habit",
    successCreatedTitle: "Habit stacked",
    successCreatedBody: "It\u2019s on your Today list \u2014 you\u2019ll see it after your next prayer.",
    successUpdatedTitle: "Habit updated",
    successUpdatedBody: "Your changes have been saved.",
    goToHabits: "Go to habits",
    errors: {
      title: "Title is required",
      minimalVersion: "Give it a minimal version",
      days: "Pick at least one day"
    }
  },
  habitDetails: {
    backToHabits: "Back to habits",
    startedOn: "Started {date}",
    currentStreak: "Current streak",
    longestStreak: "Longest streak",
    scheduledDays: "Set in Days",
    thisWeek: "This week",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    notFound: "Habit not found.",
    deleteTitle: "Delete habit?",
    deleteBody: "This will permanently delete \u201C{title}\u201D and its completion history. This can\u2019t be undone.",
    deletedTitle: "Deleted",
    deletedBody: "The habit has been deleted.",
    cellNotScheduled: "{date} \u2014 not scheduled",
    cellUpcoming: "{date} \u2014 upcoming",
    cellDone: "{date} \u2014 completed, click to unmark",
    cellMissed: "{date} \u2014 missed, click to mark done"
  },
  stats: {
    title: "Stats",
    range: "{month} \xB7 to date",
    emptyTitle: "Not enough data yet",
    emptyBody: "Log a few check-ins and your completion rates, weekday patterns and prayer breakdown will show up here.",
    goToToday: "Go to Today",
    completionRate: "Completion rate",
    bestStreak: "Best active streak",
    atRisk: "At risk",
    activeHabits: "Active habits",
    byWeekday: "Completion by weekday",
    byWeekdayCaption: "% of scheduled habits done",
    byWeekdayChartLabel: "Completion rate by weekday",
    nothingScheduled: "nothing scheduled",
    weekdayDetail: "{rate}% of {count} scheduled",
    last30: "Last 30 days",
    less: "Less",
    more: "More",
    dayNothingScheduled: "{date} \u2014 nothing scheduled",
    dayDone: "{date} \u2014 {done} of {total} done",
    byPrayer: "By anchor prayer",
    strongest: "Strongest",
    weakest: "Weakest",
    weakestNote: "{prayer} is where habits slip most \u2014 try shrinking that one until it is trivial.",
    pausedExcluded: "{count} paused habits excluded from these stats.",
    pausedExcludedOne: "1 paused habit excluded from these stats."
  },
  privacy: {
    title: "Privacy",
    updated: "Last updated {date}",
    back: "Back to home",
    summaryHeading: "The short version",
    summaryBody: "WirdStack has no accounts, no cookies, and no advertising. Your habits and your history are written to your own browser and are never sent anywhere. Two things leave your device: an approximate location, used to calculate your prayer times, and an anonymous count of pages opened.",
    storedHeading: "What stays on your device",
    storedBody: "All of this is kept in your browser\u2019s local storage. It never reaches us, because there is no server to reach:",
    storedHabits: "Your habits and their completion history",
    storedCoords: "Your approximate coordinates and the city name resolved from them",
    storedSettings: "Your prayer-time calculation method, theme, and language",
    storedTimes: "A cache of the prayer times already fetched for today",
    sentHeading: "What leaves your device",
    sentBody: "Your approximate location, and nothing else. It goes to two services that turn it into prayer times and a city name. We do not control them, and their own privacy policies apply:",
    sentAladhanName: "Aladhan (aladhan.com)",
    sentAladhanDetail: "receives your approximate coordinates and the calculation method, and returns prayer times. Your habits are never included.",
    sentGeocodeName: "BigDataCloud (bigdatacloud.com)",
    sentGeocodeDetail: "receives the same approximate coordinates once per location, and returns a city name so the app can say \u201CRiyadh\u201D instead of a pair of numbers.",
    infraHeading: "Who can see your IP address",
    infraBody: "Loading any website reveals your IP address to whoever serves it \u2014 that is how the web works, not a choice this app makes. Two providers are involved in serving WirdStack. Neither receives your habits or your location:",
    sentFontsName: "Google Fonts (fonts.googleapis.com)",
    sentFontsDetail: "serves the typefaces the app is set in.",
    sentHostingName: "Cloudflare Pages",
    sentHostingDetail: "hosts the site and keeps standard server request logs.",
    precisionHeading: "About your location",
    precisionBody: "The app asks your browser for a location only when you grant permission, and you can refuse \u2014 it will fall back to Makkah and say so. Before any coordinates are sent, they are rounded to two decimal places, roughly a 1km area. That is more than accurate enough for prayer times, which shift by about a minute every 20km, and it means the precise fix your device produced never leaves it.",
    analyticsHeading: "Analytics",
    analyticsBody: "We count page views through Cloudflare Web Analytics, to know whether the app is being used at all. It sets no cookies, does not follow you to any other site, and records nothing about your habits \u2014 only that a page was opened, roughly which country from, and what kind of device. The numbers are aggregate: there is no per-person profile to look at, including for us.",
    neverHeading: "What we never do",
    neverBody: "No accounts. No cookies. No advertising. No profile of you is built, and nothing is ever sold or shared. Your habits are not part of the page-view counts above and never leave your device.",
    controlHeading: "Your control",
    controlBody: "You can revoke location permission at any time in your browser settings. Clearing your browser\u2019s site data for WirdStack erases everything the app has stored, immediately and permanently \u2014 so export a backup first if you want to keep your history. Because there are no accounts, there is no data of yours held anywhere for us to delete on request.",
    contactHeading: "Contact",
    contactBody: "Questions about this policy can be sent to {email}."
  },
  notFound: {
    title: "This page doesn\u2019t exist",
    body: "The link may be out of date, or the habit it pointed to has since been deleted.",
    goToToday: "Go to Today"
  },
  // Route titles — read by the router's afterEach hook.
  routes: {
    landing: "WirdStack \u2014 small acts, kept up daily",
    today: "Today",
    habits: "Habits",
    newHabit: "New habit",
    habitDetails: "Habit",
    editHabit: "Edit habit",
    stats: "Stats",
    notFound: "Not found",
    privacy: "Privacy"
  },
  landing: {
    howItWorks: "How it works",
    features: "Features",
    startFree: "Start free",
    openApp: "Open WirdStack",
    eyebrow: "Habit stacking, anchored to salah",
    headlineLead: "Small acts,",
    headlineRest: "kept up",
    headlineEmphasis: "daily",
    lede: "The Prophet \uFDFA said the deeds most beloved to Allah are those done consistently, even if they are few. WirdStack attaches one small act to each prayer you already pray \u2014 so the habit has somewhere to live.",
    ctaFirst: "Start your first habit",
    ctaReturning: "Continue where you left off",
    seeHow: "See how it works",
    note: "Free \xB7 No account \xB7 Works offline",
    cardHead: "Next prayer where you are",
    cardFallback: "using {location} \u2014 use my location",
    cardTomorrow: "tomorrow",
    cardOffline: "Prayer times are offline right now \u2014 everything else still works.",
    methodEyebrow: "The method",
    methodHeadline: "Three rules, and that is the whole app.",
    steps: {
      anchorTitle: "Anchor it to a prayer",
      anchorBody: "You already stop five times a day. That is the cue \u2014 you never have to remember it, and you never have to invent a time that works.",
      shrinkTitle: "Shrink it until it is easy",
      shrinkBody: "One verse. Thirty-three counts. A single dollar. Small enough that a bad day still ends with it done.",
      chainTitle: "Let the chain do the work",
      chainBody: "Every check-in extends a streak you can see. Missing one day is a gap, not a failure \u2014 the chain picks up again tomorrow."
    },
    quote: "The most beloved of deeds to Allah are those that are most consistent, even if it is small.",
    quoteSource: "Sahih al-Bukhari 6464",
    featuresEyebrow: "What you get",
    featuresHeadline: "Enough to be useful. Nothing to manage.",
    features_: {
      timesTitle: "Your real prayer times",
      timesBody: "Calculated for your coordinates, refreshed daily, with the calculation method your community follows.",
      scheduleTitle: "Day-specific schedules",
      scheduleBody: "Fasting Mondays, Sadaqah Fridays, Qur\u2019an every morning. A habit only shows up on the days it belongs to.",
      statsTitle: "Honest statistics",
      statsBody: "Completion rate by weekday and by prayer, so you can see which anchor is carrying you and which one keeps slipping.",
      pauseTitle: "Pause without losing history",
      pauseBody: "Travelling, unwell, or in a hard season? Pause a habit. It stops counting against you and keeps everything it earned.",
      themeTitle: "Built for night and day",
      themeBody: "A considered dark theme for Fajr and Isha \u2014 not an inverted screenshot, a second palette designed on purpose.",
      privacyTitle: "Stays on your device",
      privacyBody: "Your practice is written to your browser\u2019s own storage. No account, no server, nothing to leak."
    },
    closerTitle: "Start with one verse.",
    closerBody: "Pick a prayer, pick something small, and let tomorrow take care of itself.",
    footer: "WirdStack \u2014 a wird (\u0648\u0631\u062F) is a devotional practice kept up daily; this app helps you stack one onto every prayer."
  }
};

// src/i18n/locales/ar.ts
var ar_default = {
  brand: "WirdStack",
  // يستهلكها worker/index.ts لإعادة كتابة وسوم og:‎ حسب اللغة.
  seo: {
    title: "WirdStack \u2014 \u0623\u0639\u0645\u0627\u0644\u064C \u0635\u063A\u064A\u0631\u0629 \u062A\u062F\u0648\u0645 \u0643\u0644 \u064A\u0648\u0645",
    description: "\u0627\u0642\u0631\u0650\u0646 \u0639\u0645\u0644\u064B\u0627 \u0635\u063A\u064A\u0631\u064B\u0627 \u0628\u0643\u0644 \u0635\u0644\u0627\u0629 \u062A\u0635\u0644\u0651\u064A\u0647\u0627. \u0645\u062C\u0627\u0646\u064B\u0627\u060C \u0628\u062F\u0648\u0646 \u062D\u0633\u0627\u0628\u060C \u0648\u064A\u0639\u0645\u0644 \u062F\u0648\u0646 \u0627\u062A\u0635\u0627\u0644."
  },
  common: {
    close: "\u0625\u063A\u0644\u0627\u0642",
    cancel: "\u0625\u0644\u063A\u0627\u0621",
    delete: "\u062D\u0630\u0641",
    edit: "\u062A\u0639\u062F\u064A\u0644",
    pause: "\u0625\u064A\u0642\u0627\u0641 \u0645\u0624\u0642\u062A",
    resume: "\u0627\u0633\u062A\u0626\u0646\u0627\u0641",
    // These three label days in the history calendar, so they describe a day
    // rather than a wird.
    done: "\u062A\u0645\u0651",
    missed: "\u0641\u0627\u062A",
    notScheduled: "\u063A\u064A\u0631 \u0645\u062C\u062F\u0648\u0644",
    skipToContent: "\u062A\u062E\u0637\u064E\u0651 \u0625\u0644\u0649 \u0627\u0644\u0645\u062D\u062A\u0648\u0649"
  },
  nav: {
    today: "\u0627\u0644\u064A\u0648\u0645",
    // Possessive: these are the user's own awrad, not a generic list.
    habits: "\u0623\u0648\u0631\u0627\u062F\u064A",
    stats: "\u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",
    newHabit: "\u0648\u0650\u0631\u062F \u062C\u062F\u064A\u062F",
    new: "\u062C\u062F\u064A\u062F",
    main: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"
  },
  prayers: {
    Fajr: "\u0627\u0644\u0641\u062C\u0631",
    Dhuhr: "\u0627\u0644\u0638\u0647\u0631",
    Asr: "\u0627\u0644\u0639\u0635\u0631",
    Maghrib: "\u0627\u0644\u0645\u063A\u0631\u0628",
    Isha: "\u0627\u0644\u0639\u0634\u0627\u0621"
  },
  weekdays: {
    long: {
      Sun: "\u0627\u0644\u0623\u062D\u062F",
      Mon: "\u0627\u0644\u0627\u062B\u0646\u064A\u0646",
      Tue: "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621",
      Wed: "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
      Thu: "\u0627\u0644\u062E\u0645\u064A\u0633",
      Fri: "\u0627\u0644\u062C\u0645\u0639\u0629",
      Sat: "\u0627\u0644\u0633\u0628\u062A"
    },
    // The single-letter abbreviations Arabic calendars conventionally use —
    // first letter of each day name, not a transliteration of the English.
    short: {
      Sun: "\u062D",
      Mon: "\u0646",
      Tue: "\u062B",
      Wed: "\u0631",
      Thu: "\u062E",
      Fri: "\u062C",
      Sat: "\u0633"
    }
  },
  theme: {
    system: "\u0627\u0644\u0646\u0638\u0627\u0645",
    light: "\u0641\u0627\u062A\u062D",
    dark: "\u062F\u0627\u0643\u0646",
    label: "\u0627\u0644\u0645\u0638\u0647\u0631: {preference}. \u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u063A\u064A\u064A\u0631.",
    labelSystem: "\u0627\u0644\u0645\u0638\u0647\u0631: \u0627\u0644\u0646\u0638\u0627\u0645 ({resolved}). \u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u063A\u064A\u064A\u0631."
  },
  locale: {
    switchTo: "Switch to English",
    current: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
  },
  today: {
    greeting: {
      // Before Fajr is qiyam time, so the night greeting names it rather than
      // wishing someone a generic good night — at 3am this app is open for
      // one reason.
      night: "\u0642\u064A\u0627\u0645\u064C \u0645\u0628\u0627\u0631\u0643",
      morning: "\u0635\u0628\u0627\u062D\u064C \u0645\u0628\u0627\u0631\u0643",
      afternoon: "\u0646\u0647\u0627\u0631\u064C \u0645\u0628\u0627\u0631\u0643",
      evening: "\u0645\u0633\u0627\u0621\u064C \u0645\u0628\u0627\u0631\u0643"
    },
    summaryNone: "\u0644\u0627 \u0648\u0650\u0631\u062F \u0645\u062C\u062F\u0648\u0644 \u0627\u0644\u064A\u0648\u0645",
    summaryAllDone: "\u062A\u0645\u0651\u062A \u0623\u0648\u0631\u0627\u062F\u064F \u0627\u0644\u064A\u0648\u0645 \u2014 \u0627\u0644\u062D\u0645\u062F \u0644\u0644\u0647",
    // "من أصل" is the fixed Arabic compound for "out of". Without it the line
    // reads "…{done} من {total} من أوراد…" — two bare من's doing two different
    // jobs in one breath, which is the sort of thing that marks a sentence as
    // translated rather than written.
    summaryProgress: "\u0623\u062A\u0645\u0645\u062A\u064E {done} \u0645\u0646 \u0623\u0635\u0644 {total} \u0645\u0646 \u0623\u0648\u0631\u0627\u062F \u0627\u0644\u064A\u0648\u0645",
    nextPrayer: "\u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629",
    tomorrow: "\u063A\u062F\u064B\u0627",
    nextUp: "\u0627\u0644\u062A\u0627\u0644\u064A\u0629",
    inTime: "\u0628\u0639\u062F {time}",
    habitsAfter: "\u0627\u0644\u0623\u0648\u0631\u0627\u062F \u0628\u0639\u062F {prayer}",
    // "بتوقيت" — the idiom Arabic media uses for "on the clock of <city>".
    fallbackLocation: "\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u0645\u0639\u0631\u0648\u0636\u0629 \u0628\u062A\u0648\u0642\u064A\u062A {location}.",
    useMyLocation: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0645\u0648\u0642\u0639\u064A",
    timesUnavailable: "\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u0627\u0644\u0622\u0646.",
    // أول تشغيل حقيقي: لا وِرد على الإطلاق بعد.
    firstRunTitle: "\u0644\u0645 \u064A\u064F\u0642\u0631\u064E\u0646 \u0648\u0650\u0631\u062F\u064C \u0628\u0639\u062F",
    firstRunBody: "\u0627\u062E\u062A\u0631 \u0635\u0644\u0627\u0629\u064B \u062A\u0635\u0644\u0651\u064A\u0647\u0627 \u0623\u0635\u0644\u064B\u0627 \u0648\u0627\u0642\u0631\u0650\u0646 \u0628\u0647\u0627 \u0639\u0645\u0644\u064B\u0627 \u0635\u063A\u064A\u0631\u064B\u0627 \u2014 \u0647\u0630\u0647 \u0647\u064A \u0627\u0644\u0637\u0631\u064A\u0642\u0629 \u0643\u0627\u0645\u0644\u0629.",
    // أوراد موجودة، لكن لا شيء مجدول اليوم (كلها موقوفة، أو أيامها أيام أخرى).
    emptyTitle: "\u0644\u0627 \u0648\u0650\u0631\u062F \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645",
    emptyBody: "\u0644\u0627 \u0648\u0650\u0631\u062F \u0645\u062C\u062F\u0648\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645 \u2014 \u0631\u0627\u062C\u0639 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0645\u062D\u062F\u062F\u0629 \u0644\u0647\u060C \u0623\u0648 \u0623\u0636\u0650\u0641 \u0648\u0650\u0631\u062F\u064B\u0627 \u0622\u062E\u0631.",
    createFirst: "\u0627\u0628\u062F\u0623 \u0648\u0650\u0631\u062F\u0643 \u0627\u0644\u0623\u0648\u0644",
    addAnother: "\u0623\u0636\u0650\u0641 \u0648\u0650\u0631\u062F\u064B\u0627 \u0622\u062E\u0631",
    methodPicker: "\u0637\u0631\u064A\u0642\u0629 \u062D\u0633\u0627\u0628 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629",
    ringLabel: "\u0623\u062A\u0645\u0645\u062A\u064E {value} \u0645\u0646 \u0623\u0635\u0644 {total} \u0645\u0646 \u0623\u0648\u0631\u0627\u062F \u0627\u0644\u064A\u0648\u0645"
  },
  duration: {
    hoursMinutes: "{hours}\u0633 {minutes}\u062F",
    hours: "{hours}\u0633",
    minutes: "{minutes}\u062F"
  },
  prayerTimes: {
    fallbackCity: "\u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629",
    locationUnavailable: "\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0642\u0639 \u2014 \u062A\u064F\u0639\u0631\u0636 \u0623\u0648\u0642\u0627\u062A {city}.",
    noGeolocation: "\u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0644\u0627 \u064A\u0633\u062A\u0637\u064A\u0639 \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u0648\u0642\u0639.",
    serviceError: "\u0623\u0639\u0627\u062F\u062A \u062E\u062F\u0645\u0629 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0631\u0645\u0632 {status}",
    unexpectedShape: "\u0623\u0639\u0627\u062F\u062A \u062E\u062F\u0645\u0629 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639\u0629",
    loadFailed: "\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u0645\u064A\u0644 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629",
    methods: {
      2: "\u0627\u0644\u062C\u0645\u0639\u064A\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629 \u0644\u0623\u0645\u0631\u064A\u0643\u0627 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u0629 (ISNA)",
      3: "\u0631\u0627\u0628\u0637\u0629 \u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A",
      4: "\u0623\u0645 \u0627\u0644\u0642\u0631\u0649 \u2014 \u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629",
      5: "\u0627\u0644\u0647\u064A\u0626\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0644\u0644\u0645\u0633\u0627\u062D\u0629",
      1: "\u062C\u0627\u0645\u0639\u0629 \u0643\u0631\u0627\u062A\u0634\u064A",
      8: "\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062E\u0644\u064A\u062C",
      13: "\u0631\u0626\u0627\u0633\u0629 \u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u062F\u064A\u0646\u064A\u0629 \u2014 \u062A\u0631\u0643\u064A\u0627"
    }
  },
  habits: {
    title: "\u0623\u0648\u0631\u0627\u062F\u064A",
    total: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639: {count}",
    pausedCount: "\u0645\u0646\u0647\u0627 {count} \u0645\u0648\u0642\u0648\u0641\u0629",
    filterLabel: "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0623\u0648\u0631\u0627\u062F",
    filters: {
      all: "\u0627\u0644\u0643\u0644",
      active: "\u0627\u0644\u0646\u0634\u0637\u0629",
      paused: "\u0627\u0644\u0645\u0648\u0642\u0648\u0641\u0629"
    },
    emptyAll: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0648\u0631\u0627\u062F.",
    emptyActive: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0648\u0631\u0627\u062F \u0646\u0634\u0637\u0629.",
    emptyPaused: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0648\u0631\u0627\u062F \u0645\u0648\u0642\u0648\u0641\u0629.",
    noHabitsTitle: "\u0644\u0627 \u0623\u0648\u0631\u0627\u062F \u0628\u0639\u062F",
    noHabitsBody: "\u0627\u062E\u062A\u0631 \u0635\u0644\u0627\u0629\u064B \u062A\u0635\u0644\u0651\u064A\u0647\u0627 \u0623\u0635\u0644\u064B\u0627 \u0648\u0627\u0642\u0631\u0650\u0646 \u0628\u0647\u0627 \u0634\u064A\u0626\u064B\u0627 \u0635\u063A\u064A\u0631\u064B\u0627 \u2014 \u0622\u064A\u0629\u064C \u0648\u0627\u062D\u062F\u0629 \u0648\u0650\u0631\u062F\u064C \u062D\u0642\u064A\u0642\u064A.",
    createFirst: "\u0627\u0628\u062F\u0623 \u0648\u0650\u0631\u062F\u0643 \u0627\u0644\u0623\u0648\u0644",
    status: {
      // Singular: these label one wird, which is masculine.
      paused: "\u0645\u0648\u0642\u0648\u0641",
      new: "\u062C\u062F\u064A\u062F",
      // "متعثّر" (faltering) rather than "في خطر": the app's whole posture is
      // that a missed day is a gap, not a failure, and alarm language would
      // contradict the copy everywhere else.
      atRisk: "\u0645\u062A\u0639\u062B\u0651\u0631",
      streakDays: "{count} \u064A\u0648\u0645"
    },
    runsOn: "\u0628\u0639\u062F {prayer} \xB7 \u0623\u064A\u0627\u0645 {days}",
    afterPrayer: "\u0628\u0639\u062F {prayer} \xB7 {minimal}",
    markDone: "\u062A\u0645\u0651",
    markAsDone: "\u062A\u0639\u0644\u064A\u0645 {title} \u0643\u0645\u0646\u062C\u064E\u0632",
    markAsNotDone: "\u0625\u0644\u063A\u0627\u0621 \u062A\u0639\u0644\u064A\u0645 {title}",
    pausedRowLabel: "{title} \u2014 \u0645\u0648\u0642\u0648\u0641\u061B \u0627\u0633\u062A\u0623\u0646\u0641\u0647 \u0644\u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u062A\u0639\u0644\u064A\u0645\u0647",
    notScheduledRowLabel: "{title} \u2014 \u063A\u064A\u0631 \u0645\u062C\u062F\u0648\u0644 \u0627\u0644\u064A\u0648\u0645",
    resumeToCheck: "\u0627\u0633\u062A\u0623\u0646\u0641 \u0647\u0630\u0627 \u0627\u0644\u0648\u0650\u0631\u062F \u0644\u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u062A\u0639\u0644\u064A\u0645\u0647",
    notScheduledToday: "\u063A\u064A\u0631 \u0645\u062C\u062F\u0648\u0644 \u0627\u0644\u064A\u0648\u0645",
    backup: {
      title: "\u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0648\u0627\u0644\u0627\u0633\u062A\u0639\u0627\u062F\u0629",
      note: "\u0623\u0648\u0631\u0627\u062F\u0643 \u0645\u062D\u0641\u0648\u0638\u0629 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0648\u062D\u062F\u0647. \u0635\u062F\u0651\u0631 \u0645\u0644\u0641\u064B\u0627 \u0644\u062A\u062D\u0641\u0638\u0647\u0627\u060C \u0623\u0648 \u0644\u062A\u0646\u0642\u0644\u0647\u0627 \u0625\u0644\u0649 \u062C\u0647\u0627\u0632 \u0622\u062E\u0631.",
      export: "\u062A\u0635\u062F\u064A\u0631 \u0646\u0633\u062E\u0629",
      import: "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0645\u0646 \u0645\u0644\u0641",
      confirmTitle: "\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0643\u0644 \u0634\u064A\u0621\u061F",
      confirmBody: "\u0633\u062A\u062D\u0644 \u0627\u0644\u0623\u0648\u0631\u0627\u062F \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0644\u0641 ({incoming}) \u0645\u062D\u0644 \u0623\u0648\u0631\u0627\u062F\u0643 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 ({current}) \u0648\u0633\u062C\u0644\u0651\u0647\u0627 \u0643\u0627\u0645\u0644\u064B\u0627. \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0630\u0644\u0643.",
      confirmAction: "\u0627\u0633\u062A\u0628\u062F\u0627\u0644",
      error: {
        malformed: "\u0647\u0630\u0627 \u0645\u0644\u0641 \u0646\u0633\u062E\u0629 \u0645\u0646 WirdStack \u0644\u0643\u0646\u0647 \u062A\u0627\u0644\u0641 \u0648\u0644\u0627 \u064A\u0645\u0643\u0646 \u0642\u0631\u0627\u0621\u062A\u0647.",
        "not-wirdstack": "\u0644\u0627 \u064A\u0628\u062F\u0648 \u0623\u0646 \u0647\u0630\u0627 \u0645\u0644\u0641 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0645\u0646 WirdStack.",
        "too-new": "\u0623\u064F\u0646\u0634\u0626\u062A \u0647\u0630\u0647 \u0627\u0644\u0646\u0633\u062E\u0629 \u0628\u0625\u0635\u062F\u0627\u0631 \u0623\u062D\u062F\u062B \u0645\u0646 WirdStack. \u062D\u062F\u0651\u062B \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0623\u0648\u0644\u064B\u0627."
      }
    }
  },
  habitForm: {
    newTitle: "\u0648\u0650\u0631\u062F \u062C\u062F\u064A\u062F",
    editTitle: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0648\u0650\u0631\u062F",
    subtitle: "\u0627\u0642\u0631\u0650\u0646\u0647 \u0628\u0635\u0644\u0627\u0629\u064D \u062A\u0635\u0644\u0651\u064A\u0647\u0627",
    notFoundTitle: "\u0627\u0644\u0648\u0650\u0631\u062F \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F",
    notFoundBody: "\u0642\u062F \u064A\u0643\u0648\u0646 \u0647\u0630\u0627 \u0627\u0644\u0648\u0650\u0631\u062F \u0642\u062F \u062D\u064F\u0630\u0641\u060C \u0623\u0648 \u0623\u0646 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0630\u064A \u0627\u062A\u0651\u0628\u0639\u062A\u0647 \u0644\u0645 \u064A\u0639\u062F \u0635\u0627\u0644\u062D\u064B\u0627.",
    backToHabits: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0648\u0631\u0627\u062F",
    fieldTitle: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    titlePlaceholder: "\u0645\u062B\u0627\u0644: \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0642\u0631\u0622\u0646",
    // A direct question reads better as a field label than an abstract noun
    // phrase, and it states the app's whole premise in three words.
    fieldAnchor: "\u0628\u0639\u062F \u0623\u064A \u0635\u0644\u0627\u0629\u061F",
    // Fiqh vocabulary: "the least that suffices" — instantly legible, where
    // "النسخة المصغّرة" is a calque of "minimal version".
    fieldMinimal: "\u0623\u0642\u0644\u0651 \u0645\u0627 \u064A\u064F\u062C\u0632\u0626",
    minimalPlaceholder: "\u0645\u062B\u0627\u0644: \u0622\u064A\u0629 \u0648\u0627\u062D\u062F\u0629",
    minimalHint: "\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u062F\u0642\u064A\u0642\u062A\u064A\u0646 \u2014 \u0623\u0642\u0644\u0651 \u0645\u0645\u0627 \u062A\u0638\u0646\u0647 \u0643\u0627\u0641\u064A\u064B\u0627.",
    fieldDays: "\u0627\u0644\u0623\u064A\u0627\u0645",
    daysHint: "\u0643\u0644 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0641\u062A\u0631\u0627\u0636\u064A\u064B\u0627 \u2014 \u0636\u064A\u0651\u0642\u0647\u0627 \u0644\u0644\u0623\u0648\u0631\u0627\u062F \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0623\u064A\u0627\u0645 \u0628\u0639\u064A\u0646\u0647\u0627 \u0645\u062B\u0644 \u0635\u064A\u0627\u0645 \u0627\u0644\u0627\u062B\u0646\u064A\u0646.",
    submitCreate: "\u0623\u0636\u0650\u0641 \u0627\u0644\u0648\u0650\u0631\u062F",
    submitUpdate: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A",
    successCreatedTitle: "\u062A\u0645\u0651\u062A \u0625\u0636\u0627\u0641\u0629 \u0648\u0650\u0631\u062F\u0643",
    successCreatedBody: "\u0623\u0635\u0628\u062D \u0641\u064A \u0623\u0648\u0631\u0627\u062F \u0627\u0644\u064A\u0648\u0645 \u2014 \u0633\u062A\u0631\u0627\u0647 \u0628\u0639\u062F \u0635\u0644\u0627\u062A\u0643 \u0627\u0644\u0642\u0627\u062F\u0645\u0629.",
    successUpdatedTitle: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0648\u0650\u0631\u062F",
    successUpdatedBody: "\u062D\u064F\u0641\u0638\u062A \u062A\u0639\u062F\u064A\u0644\u0627\u062A\u0643.",
    goToHabits: "\u0627\u0644\u0630\u0647\u0627\u0628 \u0625\u0644\u0649 \u0623\u0648\u0631\u0627\u062F\u064A",
    errors: {
      title: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0645\u0637\u0644\u0648\u0628",
      minimalVersion: "\u062D\u062F\u0651\u062F \u0623\u0642\u0644\u0651 \u0645\u0627 \u064A\u064F\u062C\u0632\u0626",
      days: "\u0627\u062E\u062A\u0631 \u064A\u0648\u0645\u064B\u0627 \u0648\u0627\u062D\u062F\u064B\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"
    }
  },
  habitDetails: {
    backToHabits: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0648\u0631\u0627\u062F",
    startedOn: "\u0628\u062F\u0623 \u0641\u064A {date}",
    currentStreak: "\u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
    longestStreak: "\u0623\u0637\u0648\u0644 \u0645\u062F\u0627\u0648\u0645\u0629",
    scheduledDays: "\u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0645\u062D\u062F\u062F\u0629",
    thisWeek: "\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639",
    previousWeek: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0633\u0627\u0628\u0642",
    nextWeek: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062A\u0627\u0644\u064A",
    notFound: "\u0627\u0644\u0648\u0650\u0631\u062F \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F.",
    deleteTitle: "\u062D\u0630\u0641 \u0627\u0644\u0648\u0650\u0631\u062F\u061F",
    deleteBody: "\u0633\u064A\u062D\u0630\u0641 \u0647\u0630\u0627 \xAB{title}\xBB \u0648\u0633\u062C\u0644\u0651 \u0645\u062F\u0627\u0648\u0645\u062A\u0647 \u0646\u0647\u0627\u0626\u064A\u064B\u0627. \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0630\u0644\u0643.",
    deletedTitle: "\u062A\u0645 \u0627\u0644\u062D\u0630\u0641",
    deletedBody: "\u062D\u064F\u0630\u0641 \u0627\u0644\u0648\u0650\u0631\u062F.",
    cellNotScheduled: "{date} \u2014 \u063A\u064A\u0631 \u0645\u062C\u062F\u0648\u0644",
    cellUpcoming: "{date} \u2014 \u0642\u0627\u062F\u0645",
    cellDone: "{date} \u2014 \u062A\u0645\u0651\u060C \u0627\u0646\u0642\u0631 \u0644\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0639\u0644\u064A\u0645",
    cellMissed: "{date} \u2014 \u0641\u0627\u062A\u060C \u0627\u0646\u0642\u0631 \u0644\u062A\u0639\u0644\u064A\u0645\u0647 \u0645\u0646\u062C\u064E\u0632\u064B\u0627"
  },
  stats: {
    title: "\u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",
    range: "{month} \xB7 \u062D\u062A\u0649 \u062A\u0627\u0631\u064A\u062E\u0647",
    emptyTitle: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0643\u0627\u0641\u064A\u0629 \u0628\u0639\u062F",
    emptyBody: "\u0633\u062C\u0651\u0644 \u0628\u0636\u0639\u0629 \u0625\u062A\u0645\u0627\u0645\u0627\u062A \u0648\u0633\u062A\u0638\u0647\u0631 \u0647\u0646\u0627 \u0646\u0633\u0628 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u0648\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u0623\u064A\u0627\u0645 \u0648\u0627\u0644\u062A\u0648\u0632\u064A\u0639 \u062D\u0633\u0628 \u0627\u0644\u0635\u0644\u0627\u0629.",
    goToToday: "\u0627\u0644\u0630\u0647\u0627\u0628 \u0625\u0644\u0649 \u0627\u0644\u064A\u0648\u0645",
    completionRate: "\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629",
    bestStreak: "\u0623\u0641\u0636\u0644 \u0645\u062F\u0627\u0648\u0645\u0629",
    // Plural أوراد is non-human, so it takes feminine-singular agreement.
    atRisk: "\u0623\u0648\u0631\u0627\u062F \u0645\u062A\u0639\u062B\u0651\u0631\u0629",
    activeHabits: "\u0623\u0648\u0631\u0627\u062F \u0646\u0634\u0637\u0629",
    byWeekday: "\u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u062D\u0633\u0628 \u0627\u0644\u064A\u0648\u0645",
    byWeekdayCaption: "% \u0645\u0646 \u0627\u0644\u0623\u0648\u0631\u0627\u062F \u0627\u0644\u0645\u062C\u062F\u0648\u0644\u0629",
    byWeekdayChartLabel: "\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u062D\u0633\u0628 \u0627\u0644\u064A\u0648\u0645",
    nothingScheduled: "\u0644\u0627 \u0634\u064A\u0621 \u0645\u062C\u062F\u0648\u0644",
    weekdayDetail: "{rate}% \u0645\u0646 {count} \u0645\u062C\u062F\u0648\u0644\u0629",
    last30: "\u0622\u062E\u0631 30 \u064A\u0648\u0645\u064B\u0627",
    less: "\u0623\u0642\u0644",
    more: "\u0623\u0643\u062B\u0631",
    dayNothingScheduled: "{date} \u2014 \u0644\u0627 \u0634\u064A\u0621 \u0645\u062C\u062F\u0648\u0644",
    dayDone: "{date} \u2014 {done} \u0645\u0646 {total} \u062A\u0645\u0651\u062A",
    byPrayer: "\u062D\u0633\u0628 \u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u0646\u0629",
    strongest: "\u0627\u0644\u0623\u0642\u0648\u0649",
    weakest: "\u0627\u0644\u0623\u0636\u0639\u0641",
    weakestNote: "\u0639\u0646\u062F {prayer} \u062A\u062A\u0639\u062B\u0651\u0631 \u0623\u0648\u0631\u0627\u062F\u0643 \u0623\u0643\u062B\u0631 \u2014 \u062C\u0631\u0651\u0628 \u062A\u0635\u063A\u064A\u0631\u0647 \u062D\u062A\u0649 \u064A\u0635\u0628\u062D \u064A\u0633\u064A\u0631\u064B\u0627 \u062C\u062F\u064B\u0627.",
    pausedExcluded: "\u0627\u0633\u062A\u064F\u062B\u0646\u064A\u062A {count} \u0623\u0648\u0631\u0627\u062F \u0645\u0648\u0642\u0648\u0641\u0629 \u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0625\u062D\u0635\u0627\u0621\u0627\u062A.",
    pausedExcludedOne: "\u0627\u0633\u062A\u064F\u062B\u0646\u064A \u0648\u0650\u0631\u062F\u064C \u0645\u0648\u0642\u0648\u0641 \u0648\u0627\u062D\u062F \u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0625\u062D\u0635\u0627\u0621\u0627\u062A."
  },
  privacy: {
    title: "\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629",
    updated: "\u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B {date}",
    back: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
    summaryHeading: "\u0628\u0627\u062E\u062A\u0635\u0627\u0631",
    summaryBody: "\u0644\u0627 \u062D\u0633\u0627\u0628\u0627\u062A \u0641\u064A WirdStack\u060C \u0648\u0644\u0627 \u0645\u0644\u0641\u0627\u062A \u0627\u0631\u062A\u0628\u0627\u0637\u060C \u0648\u0644\u0627 \u0625\u0639\u0644\u0627\u0646\u0627\u062A. \u0623\u0648\u0631\u0627\u062F\u0643 \u0648\u0633\u062C\u0644\u0651\u0647\u0627 \u062A\u064F\u0643\u062A\u0628 \u0641\u064A \u0645\u062A\u0635\u0641\u062D\u0643 \u0623\u0646\u062A \u0648\u0644\u0627 \u062A\u064F\u0631\u0633\u064E\u0644 \u0625\u0644\u0649 \u0623\u064A \u0645\u0643\u0627\u0646. \u0634\u064A\u0626\u0627\u0646 \u064A\u063A\u0627\u062F\u0631\u0627\u0646 \u062C\u0647\u0627\u0632\u0643: \u0645\u0648\u0642\u0639 \u062A\u0642\u0631\u064A\u0628\u064A \u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0644\u062D\u0633\u0627\u0628 \u0623\u0648\u0642\u0627\u062A \u0635\u0644\u0627\u062A\u0643\u060C \u0648\u0639\u062F\u062F \u0645\u062C\u0647\u0648\u0644 \u0627\u0644\u0645\u0635\u062F\u0631 \u0644\u0644\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062A\u064A \u0641\u064F\u062A\u062D\u062A.",
    storedHeading: "\u0645\u0627 \u064A\u0628\u0642\u0649 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643",
    storedBody: "\u0643\u0644 \u0645\u0627 \u064A\u0644\u064A \u0645\u062D\u0641\u0648\u0638 \u0641\u064A \u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0645\u062D\u0644\u064A \u0644\u0645\u062A\u0635\u0641\u062D\u0643. \u0644\u0627 \u064A\u0635\u0644 \u0625\u0644\u064A\u0646\u0627\u060C \u0644\u0623\u0646\u0647 \u0644\u0627 \u064A\u0648\u062C\u062F \u062E\u0627\u062F\u0645 \u064A\u0635\u0644 \u0625\u0644\u064A\u0647:",
    storedHabits: "\u0623\u0648\u0631\u0627\u062F\u0643 \u0648\u0633\u062C\u0644\u0651 \u0625\u062A\u0645\u0627\u0645\u0647\u0627",
    storedCoords: "\u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A\u0643 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A\u0629 \u0648\u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C \u0645\u0646\u0647\u0627",
    storedSettings: "\u0637\u0631\u064A\u0642\u0629 \u062D\u0633\u0627\u0628 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629\u060C \u0648\u0627\u0644\u0645\u0638\u0647\u0631\u060C \u0648\u0627\u0644\u0644\u063A\u0629",
    storedTimes: "\u0646\u0633\u062E\u0629 \u0645\u0624\u0642\u062A\u0629 \u0645\u0646 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u062A\u064A \u062C\u064F\u0644\u0628\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645",
    sentHeading: "\u0645\u0627 \u064A\u063A\u0627\u062F\u0631 \u062C\u0647\u0627\u0632\u0643",
    sentBody: "\u0645\u0648\u0642\u0639\u0643 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A\u060C \u0648\u0644\u0627 \u0634\u064A\u0621 \u063A\u064A\u0631\u0647. \u064A\u0630\u0647\u0628 \u0625\u0644\u0649 \u062E\u062F\u0645\u062A\u064A\u0646 \u062A\u062D\u0648\u0651\u0644\u0627\u0646\u0647 \u0625\u0644\u0649 \u0623\u0648\u0642\u0627\u062A \u0635\u0644\u0627\u0629 \u0648\u0627\u0633\u0645 \u0645\u062F\u064A\u0646\u0629. \u0646\u062D\u0646 \u0644\u0627 \u0646\u062A\u062D\u0643\u0645 \u0628\u0647\u0645\u0627\u060C \u0648\u062A\u0633\u0631\u064A \u0633\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0647\u0645\u0627:",
    sentAladhanName: "Aladhan (aladhan.com)",
    sentAladhanDetail: "\u062A\u062A\u0644\u0642\u0649 \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A\u0643 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A\u0629 \u0648\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u060C \u0648\u062A\u0639\u064A\u062F \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629. \u0623\u0648\u0631\u0627\u062F\u0643 \u0644\u0627 \u062A\u064F\u0631\u0633\u064E\u0644 \u0625\u0644\u064A\u0647\u0627 \u0623\u0628\u062F\u064B\u0627.",
    sentGeocodeName: "BigDataCloud (bigdatacloud.com)",
    sentGeocodeDetail: "\u062A\u062A\u0644\u0642\u0649 \u0627\u0644\u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A\u0629 \u0646\u0641\u0633\u0647\u0627 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u0643\u0644 \u0645\u0648\u0642\u0639\u060C \u0648\u062A\u0639\u064A\u062F \u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 \u0644\u064A\u0642\u0648\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \xAB\u0627\u0644\u0631\u064A\u0627\u0636\xBB \u0628\u062F\u0644\u064B\u0627 \u0645\u0646 \u0631\u0642\u0645\u064A\u0646.",
    infraHeading: "\u0645\u0646 \u064A\u0631\u0649 \u0639\u0646\u0648\u0627\u0646 IP \u0627\u0644\u062E\u0627\u0635 \u0628\u0643",
    infraBody: "\u062A\u062D\u0645\u064A\u0644 \u0623\u064A \u0645\u0648\u0642\u0639 \u064A\u0643\u0634\u0641 \u0639\u0646\u0648\u0627\u0646 IP \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0644\u0645\u0646 \u064A\u0642\u062F\u0651\u0645\u0647 \u2014 \u0647\u0643\u0630\u0627 \u062A\u0639\u0645\u0644 \u0627\u0644\u0648\u064A\u0628\u060C \u0648\u0644\u064A\u0633 \u062E\u064A\u0627\u0631\u064B\u0627 \u064A\u062A\u062E\u0630\u0647 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642. \u062C\u0647\u062A\u0627\u0646 \u062A\u0634\u0627\u0631\u0643\u0627\u0646 \u0641\u064A \u062A\u0642\u062F\u064A\u0645 WirdStack\u060C \u0648\u0644\u0627 \u062A\u062A\u0644\u0642\u0649 \u0623\u064A \u0645\u0646\u0647\u0645\u0627 \u0623\u0648\u0631\u0627\u062F\u0643 \u0648\u0644\u0627 \u0645\u0648\u0642\u0639\u0643:",
    sentFontsName: "Google Fonts (fonts.googleapis.com)",
    sentFontsDetail: "\u062A\u0642\u062F\u0651\u0645 \u0627\u0644\u062E\u0637\u0648\u0637 \u0627\u0644\u062A\u064A \u064A\u064F\u0639\u0631\u0636 \u0628\u0647\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642.",
    sentHostingName: "Cloudflare Pages",
    sentHostingDetail: "\u062A\u0633\u062A\u0636\u064A\u0641 \u0627\u0644\u0645\u0648\u0642\u0639 \u0648\u062A\u062D\u062A\u0641\u0638 \u0628\u0633\u062C\u0644\u0627\u062A \u0637\u0644\u0628\u0627\u062A \u062E\u0627\u062F\u0645 \u0645\u0639\u062A\u0627\u062F\u0629.",
    precisionHeading: "\u0639\u0646 \u0645\u0648\u0642\u0639\u0643",
    precisionBody: "\u0644\u0627 \u064A\u0637\u0644\u0628 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0648\u0642\u0639\u0643 \u0645\u0646 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0625\u0644\u0627 \u0628\u0625\u0630\u0646\u0643\u060C \u0648\u0644\u0643 \u0623\u0646 \u062A\u0631\u0641\u0636 \u2014 \u0639\u0646\u062F\u0647\u0627 \u064A\u0639\u0648\u062F \u0625\u0644\u0649 \u062A\u0648\u0642\u064A\u062A \u0645\u0643\u0629 \u0627\u0644\u0645\u0643\u0631\u0645\u0629 \u0648\u064A\u0635\u0631\u0651\u062D \u0628\u0630\u0644\u0643. \u0648\u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644 \u0623\u064A \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A \u062A\u064F\u0642\u0631\u064E\u0651\u0628 \u0625\u0644\u0649 \u0645\u0646\u0632\u0644\u062A\u064A\u0646 \u0639\u0634\u0631\u064A\u062A\u064A\u0646\u060C \u0623\u064A \u0645\u0627 \u064A\u0642\u0627\u0631\u0628 \u0643\u064A\u0644\u0648\u0645\u062A\u0631\u064B\u0627 \u0648\u0627\u062D\u062F\u064B\u0627. \u0648\u0647\u0630\u0627 \u0623\u062F\u0642 \u0645\u0645\u0627 \u062A\u062D\u062A\u0627\u062C\u0647 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629\u060C \u0627\u0644\u062A\u064A \u062A\u062A\u063A\u064A\u0631 \u0628\u0646\u062D\u0648 \u062F\u0642\u064A\u0642\u0629 \u0643\u0644 20 \u0643\u0645\u060C \u0648\u064A\u0639\u0646\u064A \u0623\u0646 \u0627\u0644\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u062F\u0642\u064A\u0642 \u0627\u0644\u0630\u064A \u0623\u0646\u062A\u062C\u0647 \u062C\u0647\u0627\u0632\u0643 \u0644\u0627 \u064A\u063A\u0627\u062F\u0631\u0647 \u0623\u0628\u062F\u064B\u0627.",
    analyticsHeading: "\u0627\u0644\u0625\u062D\u0635\u0627\u0621\u0627\u062A",
    analyticsBody: "\u0646\u062D\u0635\u064A \u0645\u0634\u0627\u0647\u062F\u0627\u062A \u0627\u0644\u0635\u0641\u062D\u0627\u062A \u0639\u0628\u0631 Cloudflare Web Analytics\u060C \u0644\u0646\u0639\u0631\u0641 \u0625\u0646 \u0643\u0627\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0623\u0635\u0644\u064B\u0627. \u0644\u0627 \u064A\u0636\u0639 \u0645\u0644\u0641\u0627\u062A \u0627\u0631\u062A\u0628\u0627\u0637\u060C \u0648\u0644\u0627 \u064A\u062A\u0628\u0639\u0643 \u0625\u0644\u0649 \u0623\u064A \u0645\u0648\u0642\u0639 \u0622\u062E\u0631\u060C \u0648\u0644\u0627 \u064A\u0633\u062C\u0651\u0644 \u0634\u064A\u0626\u064B\u0627 \u0639\u0646 \u0623\u0648\u0631\u0627\u062F\u0643 \u2014 \u0641\u0642\u0637 \u0623\u0646 \u0635\u0641\u062D\u0629 \u0641\u064F\u062A\u062D\u062A\u060C \u0648\u0645\u0646 \u0623\u064A \u0628\u0644\u062F \u062A\u0642\u0631\u064A\u0628\u064B\u0627\u060C \u0648\u0639\u0644\u0649 \u0623\u064A \u0646\u0648\u0639 \u0645\u0646 \u0627\u0644\u0623\u062C\u0647\u0632\u0629. \u0648\u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0625\u062C\u0645\u0627\u0644\u064A\u0629: \u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0644\u0641 \u0634\u062E\u0635\u064A \u0644\u0623\u062D\u062F \u064A\u0645\u0643\u0646 \u0627\u0644\u0627\u0637\u0644\u0627\u0639 \u0639\u0644\u064A\u0647\u060C \u0648\u0644\u0627 \u062D\u062A\u0649 \u0644\u0646\u0627.",
    neverHeading: "\u0645\u0627 \u0644\u0627 \u0646\u0641\u0639\u0644\u0647 \u0623\u0628\u062F\u064B\u0627",
    neverBody: "\u0644\u0627 \u062D\u0633\u0627\u0628\u0627\u062A. \u0648\u0644\u0627 \u0645\u0644\u0641\u0627\u062A \u0627\u0631\u062A\u0628\u0627\u0637. \u0648\u0644\u0627 \u0625\u0639\u0644\u0627\u0646\u0627\u062A. \u0644\u0627 \u064A\u064F\u0628\u0646\u0649 \u0639\u0646\u0643 \u0645\u0644\u0641 \u0634\u062E\u0635\u064A\u060C \u0648\u0644\u0627 \u064A\u064F\u0628\u0627\u0639 \u0634\u064A\u0621 \u0623\u0648 \u064A\u064F\u0634\u0627\u0631\u064E\u0643 \u0623\u0628\u062F\u064B\u0627. \u0648\u0623\u0648\u0631\u0627\u062F\u0643 \u0644\u064A\u0633\u062A \u062C\u0632\u0621\u064B\u0627 \u0645\u0646 \u0625\u062D\u0635\u0627\u0621 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0627\u062A \u0623\u0639\u0644\u0627\u0647 \u0648\u0644\u0627 \u062A\u063A\u0627\u062F\u0631 \u062C\u0647\u0627\u0632\u0643.",
    controlHeading: "\u062A\u062D\u0643\u0651\u0645\u0643",
    controlBody: "\u064A\u0645\u0643\u0646\u0643 \u0633\u062D\u0628 \u0625\u0630\u0646 \u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u062A\u0649 \u0634\u0626\u062A \u0645\u0646 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0645\u062A\u0635\u0641\u062D\u0643. \u0648\u0645\u0633\u062D \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0640 WirdStack \u0645\u0646 \u0645\u062A\u0635\u0641\u062D\u0643 \u064A\u0645\u062D\u0648 \u0643\u0644 \u0645\u0627 \u062E\u0632\u0651\u0646\u0647 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0641\u0648\u0631\u064B\u0627 \u0648\u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u2014 \u0644\u0630\u0627 \u0635\u062F\u0651\u0631 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0623\u0648\u0644\u064B\u0627 \u0625\u0646 \u0623\u0631\u062F\u062A \u0627\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0633\u062C\u0644\u0651\u0643. \u0648\u0644\u0623\u0646\u0647 \u0644\u0627 \u062A\u0648\u062C\u062F \u062D\u0633\u0627\u0628\u0627\u062A\u060C \u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0643 \u0645\u062D\u0641\u0648\u0638\u0629 \u0644\u062F\u064A\u0646\u0627 \u0644\u0646\u062D\u0630\u0641\u0647\u0627 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628.",
    contactHeading: "\u0627\u0644\u062A\u0648\u0627\u0635\u0644",
    contactBody: "\u0644\u0644\u0623\u0633\u0626\u0644\u0629 \u062D\u0648\u0644 \u0647\u0630\u0647 \u0627\u0644\u0633\u064A\u0627\u0633\u0629\u060C \u0631\u0627\u0633\u0644\u0646\u0627 \u0639\u0644\u0649 {email}."
  },
  notFound: {
    title: "\u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062D\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",
    body: "\u0642\u062F \u064A\u0643\u0648\u0646 \u0627\u0644\u0631\u0627\u0628\u0637 \u0644\u0645 \u064A\u0639\u062F \u0635\u0627\u0644\u062D\u064B\u0627\u060C \u0623\u0648 \u0623\u0646 \u0627\u0644\u0648\u0650\u0631\u062F \u0627\u0644\u0630\u064A \u064A\u0634\u064A\u0631 \u0625\u0644\u064A\u0647 \u0642\u062F \u062D\u064F\u0630\u0641.",
    goToToday: "\u0627\u0644\u0630\u0647\u0627\u0628 \u0625\u0644\u0649 \u0627\u0644\u064A\u0648\u0645"
  },
  routes: {
    landing: "WirdStack \u2014 \u0623\u0639\u0645\u0627\u0644\u064C \u0635\u063A\u064A\u0631\u0629 \u062A\u062F\u0648\u0645 \u0643\u0644 \u064A\u0648\u0645",
    today: "\u0627\u0644\u064A\u0648\u0645",
    habits: "\u0623\u0648\u0631\u0627\u062F\u064A",
    newHabit: "\u0648\u0650\u0631\u062F \u062C\u062F\u064A\u062F",
    habitDetails: "\u0648\u0650\u0631\u062F",
    editHabit: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0648\u0650\u0631\u062F",
    stats: "\u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",
    notFound: "\u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F",
    privacy: "\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629"
  },
  landing: {
    howItWorks: "\u0643\u064A\u0641 \u064A\u0639\u0645\u0644",
    features: "\u0627\u0644\u0645\u0632\u0627\u064A\u0627",
    startFree: "\u0627\u0628\u062F\u0623 \u0645\u062C\u0627\u0646\u064B\u0627",
    openApp: "\u0627\u0641\u062A\u062D WirdStack",
    eyebrow: "\u0623\u0648\u0631\u0627\u062F\u064C \u0645\u0642\u062A\u0631\u0646\u0629 \u0628\u0627\u0644\u0635\u0644\u0627\u0629",
    headlineLead: "\u0623\u0639\u0645\u0627\u0644\u064C \u0635\u063A\u064A\u0631\u0629\u060C",
    headlineRest: "\u062A\u062F\u0648\u0645",
    headlineEmphasis: "\u0643\u0644 \u064A\u0648\u0645",
    lede: "\u0642\u0627\u0644 \u0627\u0644\u0646\u0628\u064A \uFDFA \u0625\u0646 \u0623\u062D\u0628\u064E\u0651 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u0644\u0647 \u0623\u062F\u0648\u0645\u064F\u0647\u0627 \u0648\u0625\u0646 \u0642\u0644\u064E\u0651. \u064A\u0642\u0631\u0646 WirdStack \u0639\u0645\u0644\u064B\u0627 \u0635\u063A\u064A\u0631\u064B\u0627 \u0628\u0643\u0644 \u0635\u0644\u0627\u0629 \u062A\u0635\u0644\u0651\u064A\u0647\u0627 \u2014 \u0644\u064A\u062C\u062F \u0627\u0644\u0648\u0650\u0631\u062F\u064F \u0645\u0643\u0627\u0646\u064B\u0627 \u064A\u0639\u064A\u0634 \u0641\u064A\u0647.",
    ctaFirst: "\u0627\u0628\u062F\u0623 \u0648\u0650\u0631\u062F\u0643 \u0627\u0644\u0623\u0648\u0644",
    ctaReturning: "\u062A\u0627\u0628\u0639 \u0645\u0646 \u062D\u064A\u062B \u062A\u0648\u0642\u0641\u062A",
    seeHow: "\u0634\u0627\u0647\u062F \u0643\u064A\u0641 \u064A\u0639\u0645\u0644",
    note: "\u0645\u062C\u0627\u0646\u064B\u0627 \xB7 \u0628\u062F\u0648\u0646 \u062D\u0633\u0627\u0628 \xB7 \u064A\u0639\u0645\u0644 \u062F\u0648\u0646 \u0627\u062A\u0635\u0627\u0644",
    cardHead: "\u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0641\u064A \u0645\u0648\u0642\u0639\u0643",
    cardFallback: "\u0628\u062A\u0648\u0642\u064A\u062A {location} \u2014 \u0627\u0633\u062A\u062E\u062F\u0645 \u0645\u0648\u0642\u0639\u064A",
    cardTomorrow: "\u063A\u062F\u064B\u0627",
    cardOffline: "\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u0629 \u063A\u064A\u0631 \u0645\u062A\u0635\u0644\u0629 \u0627\u0644\u0622\u0646 \u2014 \u0648\u0643\u0644 \u0645\u0627 \u0639\u062F\u0627\u0647\u0627 \u064A\u0639\u0645\u0644.",
    methodEyebrow: "\u0627\u0644\u0637\u0631\u064A\u0642\u0629",
    methodHeadline: "\u062B\u0644\u0627\u062B \u0642\u0648\u0627\u0639\u062F\u060C \u0648\u0647\u0630\u0627 \u0643\u0644 \u0645\u0627 \u0641\u064A \u0627\u0644\u062A\u0637\u0628\u064A\u0642.",
    steps: {
      anchorTitle: "\u0627\u0642\u0631\u0650\u0646\u0647 \u0628\u0635\u0644\u0627\u0629",
      anchorBody: "\u0623\u0646\u062A \u062A\u062A\u0648\u0642\u0641 \u062E\u0645\u0633 \u0645\u0631\u0627\u062A \u0643\u0644 \u064A\u0648\u0645 \u0623\u0635\u0644\u064B\u0627. \u062A\u0644\u0643 \u0647\u064A \u0627\u0644\u0625\u0634\u0627\u0631\u0629 \u2014 \u0644\u0627 \u062A\u062D\u062A\u0627\u062C \u0623\u0646 \u062A\u062A\u0630\u0643\u0651\u0631\u0647\u0627\u060C \u0648\u0644\u0627 \u0623\u0646 \u062A\u062E\u062A\u0631\u0639 \u0648\u0642\u062A\u064B\u0627 \u064A\u0646\u0627\u0633\u0628\u0643.",
      shrinkTitle: "\u0635\u063A\u0651\u0631\u0647 \u062D\u062A\u0649 \u064A\u0633\u0647\u064F\u0644",
      shrinkBody: "\u0622\u064A\u0629 \u0648\u0627\u062D\u062F\u0629. \u062B\u0644\u0627\u062B \u0648\u062B\u0644\u0627\u062B\u0648\u0646 \u062A\u0633\u0628\u064A\u062D\u0629. \u0631\u064A\u0627\u0644 \u0648\u0627\u062D\u062F. \u0635\u063A\u064A\u0631\u064C \u0628\u0645\u0627 \u064A\u0643\u0641\u064A \u0644\u064A\u0643\u062A\u0645\u0644 \u062D\u062A\u0649 \u0641\u064A \u064A\u0648\u0645 \u0633\u064A\u0651\u0626.",
      chainTitle: "\u062F\u0639 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u062A\u0639\u0645\u0644",
      chainBody: "\u0643\u0644 \u0625\u062A\u0645\u0627\u0645 \u064A\u0645\u062F\u0651 \u0645\u062F\u0627\u0648\u0645\u0629\u064B \u062A\u0631\u0627\u0647\u0627 \u0623\u0645\u0627\u0645\u0643. \u062A\u0641\u0648\u064A\u062A \u064A\u0648\u0645 \u062B\u063A\u0631\u0629\u064C \u0644\u0627 \u0641\u0634\u0644 \u2014 \u0648\u062A\u064F\u0633\u062A\u0623\u0646\u0641 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u063A\u062F\u064B\u0627."
    },
    quote: "\u0623\u062D\u0628\u064F\u0651 \u0627\u0644\u0623\u0639\u0645\u0627\u0644\u0650 \u0625\u0644\u0649 \u0627\u0644\u0644\u0647\u0650 \u0623\u062F\u0648\u0645\u064F\u0647\u0627 \u0648\u0625\u0646 \u0642\u0644\u064E\u0651.",
    quoteSource: "\u0635\u062D\u064A\u062D \u0627\u0644\u0628\u062E\u0627\u0631\u064A 6464",
    featuresEyebrow: "\u0645\u0627 \u0627\u0644\u0630\u064A \u062A\u062D\u0635\u0644 \u0639\u0644\u064A\u0647",
    featuresHeadline: "\u0645\u0627 \u064A\u0643\u0641\u064A \u0644\u064A\u0643\u0648\u0646 \u0646\u0627\u0641\u0639\u064B\u0627. \u0648\u0644\u0627 \u0634\u064A\u0621 \u0644\u062A\u062F\u064A\u0631\u0647.",
    features_: {
      timesTitle: "\u0623\u0648\u0642\u0627\u062A \u0635\u0644\u0627\u062A\u0643 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629",
      timesBody: "\u0645\u062D\u0633\u0648\u0628\u0629 \u0639\u0644\u0649 \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A\u0643\u060C \u0648\u062A\u062A\u062D\u062F\u0651\u062B \u064A\u0648\u0645\u064A\u064B\u0627\u060C \u0648\u0628\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u064A \u064A\u062A\u0628\u0639\u0647\u0627 \u0645\u062C\u062A\u0645\u0639\u0643.",
      scheduleTitle: "\u062C\u062F\u0648\u0644\u0629 \u0628\u0623\u064A\u0627\u0645 \u0645\u062D\u062F\u062F\u0629",
      scheduleBody: "\u0635\u064A\u0627\u0645 \u0627\u0644\u0627\u062B\u0646\u064A\u0646\u060C \u0648\u0635\u062F\u0642\u0629 \u0627\u0644\u062C\u0645\u0639\u0629\u060C \u0648\u0642\u0631\u0622\u0646 \u0643\u0644 \u0635\u0628\u0627\u062D. \u0644\u0627 \u064A\u0638\u0647\u0631 \u0627\u0644\u0648\u0650\u0631\u062F \u0625\u0644\u0627 \u0641\u064A \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u064A \u062A\u062E\u0635\u0651\u0647.",
      statsTitle: "\u0625\u062D\u0635\u0627\u0621\u0627\u062A \u0635\u0627\u062F\u0642\u0629",
      statsBody: "\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u062F\u0627\u0648\u0645\u0629 \u062D\u0633\u0628 \u0627\u0644\u064A\u0648\u0645 \u0648\u062D\u0633\u0628 \u0627\u0644\u0635\u0644\u0627\u0629\u060C \u0644\u062A\u0631\u0649 \u0623\u064A\u0651 \u0627\u0642\u062A\u0631\u0627\u0646\u064D \u064A\u062D\u0645\u0644\u0643 \u0648\u0623\u064A\u0651\u0647\u0627 \u064A\u062A\u0641\u0644\u0651\u062A \u0645\u0646\u0643.",
      pauseTitle: "\u0623\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u064B\u0627 \u062F\u0648\u0646 \u0641\u0642\u062F\u0627\u0646 \u0633\u062C\u0644\u0651\u0643",
      pauseBody: "\u0645\u0633\u0627\u0641\u0631 \u0623\u0648 \u0645\u0631\u064A\u0636 \u0623\u0648 \u0641\u064A \u0645\u0648\u0633\u0645 \u0635\u0639\u0628\u061F \u0623\u0648\u0642\u0641 \u0627\u0644\u0648\u0650\u0631\u062F \u0645\u0624\u0642\u062A\u064B\u0627. \u064A\u062A\u0648\u0642\u0641 \u0639\u0646 \u0627\u0644\u0639\u062F\u0651 \u0636\u062F\u0651\u0643 \u0648\u064A\u062D\u062A\u0641\u0638 \u0628\u0643\u0644 \u0645\u0627 \u0643\u0633\u0628\u0647.",
      themeTitle: "\u0645\u0635\u0645\u064E\u0651\u0645 \u0644\u0644\u064A\u0644 \u0648\u0627\u0644\u0646\u0647\u0627\u0631",
      themeBody: "\u0645\u0638\u0647\u0631 \u062F\u0627\u0643\u0646 \u0645\u062F\u0631\u0648\u0633 \u0644\u0644\u0641\u062C\u0631 \u0648\u0627\u0644\u0639\u0634\u0627\u0621 \u2014 \u0644\u064A\u0633 \u0644\u0642\u0637\u0629\u064B \u0645\u0639\u0643\u0648\u0633\u0629\u060C \u0628\u0644 \u0644\u0648\u062D\u0629 \u0623\u0644\u0648\u0627\u0646 \u062B\u0627\u0646\u064A\u0629 \u0635\u064F\u0645\u0651\u0645\u062A \u0639\u0646 \u0642\u0635\u062F.",
      privacyTitle: "\u064A\u0628\u0642\u0649 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643",
      privacyBody: "\u0623\u0648\u0631\u0627\u062F\u0643 \u062A\u064F\u0643\u062A\u0628 \u0641\u064A \u0630\u0627\u0643\u0631\u0629 \u0645\u062A\u0635\u0641\u062D\u0643 \u0648\u062D\u062F\u0647\u0627. \u0644\u0627 \u062D\u0633\u0627\u0628\u060C \u0648\u0644\u0627 \u062E\u0627\u062F\u0645\u060C \u0648\u0644\u0627 \u0634\u064A\u0621 \u064A\u064F\u0633\u0631\u064E\u0651\u0628."
    },
    closerTitle: "\u0627\u0628\u062F\u0623 \u0628\u0622\u064A\u0629\u064D \u0648\u0627\u062D\u062F\u0629.",
    closerBody: "\u0627\u062E\u062A\u0631 \u0635\u0644\u0627\u0629\u060C \u0648\u0627\u062E\u062A\u0631 \u0634\u064A\u0626\u064B\u0627 \u0635\u063A\u064A\u0631\u064B\u0627\u060C \u0648\u062F\u0639 \u0627\u0644\u063A\u062F \u064A\u062A\u0643\u0641\u0651\u0644 \u0628\u0646\u0641\u0633\u0647.",
    footer: "WirdStack \u2014 \u0627\u0644\u0648\u0650\u0631\u062F \u0639\u0645\u0644\u064C \u064A\u064F\u062F\u0627\u0648\u064E\u0645 \u0639\u0644\u064A\u0647 \u0643\u0644 \u064A\u0648\u0645\u061B \u0648\u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u064A\u0639\u064A\u0646\u0643 \u0639\u0644\u0649 \u0627\u0642\u062A\u0631\u0627\u0646 \u0648\u0650\u0631\u062F\u0643 \u0628\u0643\u0644 \u0635\u0644\u0627\u0629."
  }
};

// worker/index.ts
var ORIGIN = "https://wird-stack.ibrahim-alrayany.workers.dev";
var MESSAGES = { en: en_default, ar: ar_default };
function localeFor(url, request) {
  const prefix = url.pathname.split("/")[1];
  if (prefix === "ar" || prefix === "en") return prefix;
  const accept = request.headers.get("accept-language") ?? "";
  return /(^|,|\s)ar\b/i.test(accept) ? "ar" : "en";
}
__name(localeFor, "localeFor");
function canonicalPathFor(url, locale) {
  const prefix = url.pathname.split("/")[1];
  if (prefix === "ar" || prefix === "en") return url.pathname;
  return `/${locale}`;
}
__name(canonicalPathFor, "canonicalPathFor");
var SetContent = class {
  constructor(value) {
    this.value = value;
  }
  value;
  static {
    __name(this, "SetContent");
  }
  element(el) {
    el.setAttribute("content", this.value);
  }
};
var SetText = class {
  constructor(value) {
    this.value = value;
  }
  value;
  static {
    __name(this, "SetText");
  }
  element(el) {
    el.setInnerContent(this.value);
  }
};
var worker_default = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (!response.headers.get("content-type")?.includes("text/html")) return response;
    const url = new URL(request.url);
    const locale = localeFor(url, request);
    const alternate = locale === "ar" ? "en" : "ar";
    const { seo } = MESSAGES[locale];
    const pageUrl = ORIGIN + canonicalPathFor(url, locale);
    const image = `${ORIGIN}/og-image${locale === "ar" ? "-ar" : ""}.png`;
    return new HTMLRewriter().on("html", {
      element(el) {
        el.setAttribute("lang", locale);
        el.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
      }
    }).on("title", new SetText(seo.title)).on('meta[name="description"]', new SetContent(seo.description)).on('meta[property="og:title"]', new SetContent(seo.title)).on('meta[property="og:description"]', new SetContent(seo.description)).on('meta[property="og:url"]', new SetContent(pageUrl)).on('meta[property="og:locale"]', new SetContent(locale)).on('meta[property="og:locale:alternate"]', new SetContent(alternate)).on('meta[property="og:image"]', new SetContent(image)).on('meta[name="twitter:image"]', new SetContent(image)).transform(response);
  }
};

// ../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-bMLzm9/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-bMLzm9/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
