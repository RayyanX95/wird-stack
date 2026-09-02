/**
 * Arabic (MSA) message catalogue — mirrors en.ts key for key.
 *
 * This is not a translation of the English; it is the same product written in
 * Arabic. Three vocabulary decisions carry most of that difference:
 *
 * - **وِرد (pl. أوراد), not عادة, for the thing being tracked.** A wird is the
 *   classical term for a devotional practice held to daily — it is what the
 *   app is named after, and it is what a practising Muslim actually calls
 *   this. "عادة" is the dictionary translation of "habit" and reads as
 *   secular self-improvement copy; "وِردك اليوم" reads as the user's own
 *   religious life. Note وِرد is *masculine*, where عادة was feminine, so
 *   every agreeing adjective changes with it: موقوف, جديد, متعثّر. The plural
 *   أوراد is non-human and therefore takes feminine-singular agreement
 *   (أوراد نشطة, أوراد موقوفة) — the two are not inconsistent.
 *
 * - **مداومة, not سلسلة, for a streak.** المداومة على العمل is the exact
 *   concept in the hadith this app is built on (أدومها — "the most
 *   consistent"). "أطول مداومة" says what "longest streak" means to a Muslim;
 *   a chain metaphor does not.
 *
 * - **أقلّ ما يُجزئ for the Two-Minute Rule's minimal version.** يُجزئ is the
 *   fiqh term for "what suffices / what counts", so this reads as immediately
 *   obvious rather than as the calque "النسخة المصغّرة".
 *
 * Other conventions, kept deliberate:
 *
 * - **Numerals stay Western** (1, 2, 3), not Arabic-Indic — what Gulf and
 *   Levantine digital products overwhelmingly use, and consistent with the
 *   mono prayer-time readout. `-nu-latn` in utils/date.ts enforces the same
 *   for formatted dates.
 * - **Counted phrases sidestep Arabic's six-way plural agreement**
 *   ("المجموع: {count}") rather than inflecting a noun after a number.
 * - **The hadith is quoted in its authentic Bukhari wording**, not translated
 *   back from the English rendering.
 */
export default {
  brand: 'WirdStack',

  common: {
    close: 'إغلاق',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    pause: 'إيقاف مؤقت',
    resume: 'استئناف',
    // These three label days in the history calendar, so they describe a day
    // rather than a wird.
    done: 'تمّ',
    missed: 'فات',
    notScheduled: 'غير مجدول',
    skipToContent: 'تخطَّ إلى المحتوى',
  },

  nav: {
    today: 'اليوم',
    // Possessive: these are the user's own awrad, not a generic list.
    habits: 'أورادي',
    stats: 'الإحصائيات',
    newHabit: 'وِرد جديد',
    new: 'جديد',
    main: 'الرئيسية',
  },

  prayers: {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  },

  weekdays: {
    long: {
      Sun: 'الأحد',
      Mon: 'الاثنين',
      Tue: 'الثلاثاء',
      Wed: 'الأربعاء',
      Thu: 'الخميس',
      Fri: 'الجمعة',
      Sat: 'السبت',
    },
    // The single-letter abbreviations Arabic calendars conventionally use —
    // first letter of each day name, not a transliteration of the English.
    short: {
      Sun: 'ح',
      Mon: 'ن',
      Tue: 'ث',
      Wed: 'ر',
      Thu: 'خ',
      Fri: 'ج',
      Sat: 'س',
    },
  },

  theme: {
    system: 'النظام',
    light: 'فاتح',
    dark: 'داكن',
    label: 'المظهر: {preference}. انقر للتغيير.',
    labelSystem: 'المظهر: النظام ({resolved}). انقر للتغيير.',
  },

  locale: {
    switchTo: 'Switch to English',
    current: 'العربية',
  },

  today: {
    greeting: {
      // Before Fajr is qiyam time, so the night greeting names it rather than
      // wishing someone a generic good night — at 3am this app is open for
      // one reason.
      night: 'قيامٌ مبارك',
      morning: 'صباحٌ مبارك',
      afternoon: 'نهارٌ مبارك',
      evening: 'مساءٌ مبارك',
    },
    summaryNone: 'لا وِرد مجدول اليوم',
    summaryAllDone: 'تمّت أورادُ اليوم — الحمد لله',
    // "من أصل" is the fixed Arabic compound for "out of". Without it the line
    // reads "…{done} من {total} من أوراد…" — two bare من's doing two different
    // jobs in one breath, which is the sort of thing that marks a sentence as
    // translated rather than written.
    summaryProgress: 'أتممتَ {done} من أصل {total} من أوراد اليوم',
    nextPrayer: 'الصلاة القادمة',
    tomorrow: 'غدًا',
    nextUp: 'التالية',
    inTime: 'بعد {time}',
    habitsAfter: 'الأوراد بعد {prayer}',
    // "بتوقيت" — the idiom Arabic media uses for "on the clock of <city>".
    fallbackLocation: 'أوقات الصلاة معروضة بتوقيت {location}.',
    useMyLocation: 'استخدم موقعي',
    timesUnavailable: 'أوقات الصلاة غير متاحة الآن.',
    emptyTitle: 'لا وِرد لهذا اليوم',
    emptyBody: 'اقرِن عملًا صغيرًا بصلاةٍ تصلّيها أصلًا، وسيظهر هنا غدًا.',
    createFirst: 'ابدأ وِردك الأول',
    methodPicker: 'طريقة حساب أوقات الصلاة',
    ringLabel: 'أتممتَ {value} من أصل {total} من أوراد اليوم',
  },

  duration: {
    hoursMinutes: '{hours}س {minutes}د',
    hours: '{hours}س',
    minutes: '{minutes}د',
  },

  prayerTimes: {
    fallbackCity: 'مكة المكرمة',
    locationUnavailable: 'تعذّر تحديد الموقع — تُعرض أوقات {city}.',
    noGeolocation: 'هذا المتصفح لا يستطيع مشاركة الموقع.',
    serviceError: 'أعادت خدمة أوقات الصلاة الرمز {status}',
    unexpectedShape: 'أعادت خدمة أوقات الصلاة استجابة غير متوقعة',
    loadFailed: 'تعذّر تحميل أوقات الصلاة',
    methods: {
      2: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
      3: 'رابطة العالم الإسلامي',
      4: 'أم القرى — مكة المكرمة',
      5: 'الهيئة المصرية العامة للمساحة',
      1: 'جامعة كراتشي',
      8: 'منطقة الخليج',
      13: 'رئاسة الشؤون الدينية — تركيا',
    },
  },

  habits: {
    title: 'أورادي',
    total: 'المجموع: {count}',
    pausedCount: 'منها {count} موقوفة',
    filterLabel: 'تصفية الأوراد',
    filters: {
      all: 'الكل',
      active: 'النشطة',
      paused: 'الموقوفة',
    },
    emptyAll: 'لا توجد أوراد.',
    emptyActive: 'لا توجد أوراد نشطة.',
    emptyPaused: 'لا توجد أوراد موقوفة.',
    noHabitsTitle: 'لا أوراد بعد',
    noHabitsBody: 'اختر صلاةً تصلّيها أصلًا واقرِن بها شيئًا صغيرًا — آيةٌ واحدة وِردٌ حقيقي.',
    createFirst: 'ابدأ وِردك الأول',
    status: {
      // Singular: these label one wird, which is masculine.
      paused: 'موقوف',
      new: 'جديد',
      // "متعثّر" (faltering) rather than "في خطر": the app's whole posture is
      // that a missed day is a gap, not a failure, and alarm language would
      // contradict the copy everywhere else.
      atRisk: 'متعثّر',
      streakDays: '{count} يوم',
    },
    runsOn: 'بعد {prayer} · أيام {days}',
    afterPrayer: 'بعد {prayer} · {minimal}',
    markDone: 'تمّ',
    markAsDone: 'تعليم {title} كمنجَز',
    markAsNotDone: 'إلغاء تعليم {title}',
    pausedRowLabel: '{title} — موقوف؛ استأنفه لتتمكن من تعليمه',
    notScheduledRowLabel: '{title} — غير مجدول اليوم',
    resumeToCheck: 'استأنف هذا الوِرد لتتمكن من تعليمه',
    notScheduledToday: 'غير مجدول اليوم',
  },

  habitForm: {
    newTitle: 'وِرد جديد',
    editTitle: 'تعديل الوِرد',
    subtitle: 'اقرِنه بصلاةٍ تصلّيها',
    notFoundTitle: 'الوِرد غير موجود',
    notFoundBody: 'قد يكون هذا الوِرد قد حُذف، أو أن الرابط الذي اتّبعته لم يعد صالحًا.',
    backToHabits: 'العودة إلى الأوراد',
    fieldTitle: 'العنوان',
    titlePlaceholder: 'مثال: قراءة القرآن',
    // A direct question reads better as a field label than an abstract noun
    // phrase, and it states the app's whole premise in three words.
    fieldAnchor: 'بعد أي صلاة؟',
    // Fiqh vocabulary: "the least that suffices" — instantly legible, where
    // "النسخة المصغّرة" is a calque of "minimal version".
    fieldMinimal: 'أقلّ ما يُجزئ',
    minimalPlaceholder: 'مثال: آية واحدة',
    minimalHint: 'قاعدة الدقيقتين — أقلّ مما تظنه كافيًا.',
    fieldDays: 'الأيام',
    daysHint: 'كل الأيام افتراضيًا — ضيّقها للأوراد المرتبطة بأيام بعينها مثل صيام الاثنين.',
    submitCreate: 'أضِف الوِرد',
    submitUpdate: 'حفظ التعديلات',
    successCreatedTitle: 'تمّت إضافة وِردك',
    successCreatedBody: 'أصبح في أوراد اليوم — ستراه بعد صلاتك القادمة.',
    successUpdatedTitle: 'تم تحديث الوِرد',
    successUpdatedBody: 'حُفظت تعديلاتك.',
    goToHabits: 'الذهاب إلى أورادي',
    errors: {
      title: 'العنوان مطلوب',
      minimalVersion: 'حدّد أقلّ ما يُجزئ',
      days: 'اختر يومًا واحدًا على الأقل',
    },
  },

  habitDetails: {
    backToHabits: 'العودة إلى الأوراد',
    startedOn: 'بدأ في {date}',
    currentStreak: 'المداومة الحالية',
    longestStreak: 'أطول مداومة',
    scheduledDays: 'الأيام المحددة',
    thisWeek: 'هذا الأسبوع',
    previousWeek: 'الأسبوع السابق',
    nextWeek: 'الأسبوع التالي',
    notFound: 'الوِرد غير موجود.',
    deleteTitle: 'حذف الوِرد؟',
    deleteBody: 'سيحذف هذا «{title}» وسجلّ مداومته نهائيًا. لا يمكن التراجع عن ذلك.',
    deletedTitle: 'تم الحذف',
    deletedBody: 'حُذف الوِرد.',
    cellNotScheduled: '{date} — غير مجدول',
    cellUpcoming: '{date} — قادم',
    cellDone: '{date} — تمّ، انقر لإلغاء التعليم',
    cellMissed: '{date} — فات، انقر لتعليمه منجَزًا',
  },

  stats: {
    title: 'الإحصائيات',
    range: '{month} · حتى تاريخه',
    emptyTitle: 'لا توجد بيانات كافية بعد',
    emptyBody:
      'سجّل بضعة إتمامات وستظهر هنا نسب المداومة وأنماط الأيام والتوزيع حسب الصلاة.',
    goToToday: 'الذهاب إلى اليوم',
    completionRate: 'نسبة المداومة',
    bestStreak: 'أفضل مداومة',
    // Plural أوراد is non-human, so it takes feminine-singular agreement.
    atRisk: 'أوراد متعثّرة',
    activeHabits: 'أوراد نشطة',
    byWeekday: 'المداومة حسب اليوم',
    byWeekdayCaption: '% من الأوراد المجدولة',
    byWeekdayChartLabel: 'نسبة المداومة حسب اليوم',
    nothingScheduled: 'لا شيء مجدول',
    weekdayDetail: '{rate}% من {count} مجدولة',
    last30: 'آخر 30 يومًا',
    less: 'أقل',
    more: 'أكثر',
    dayNothingScheduled: '{date} — لا شيء مجدول',
    dayDone: '{date} — {done} من {total} تمّت',
    byPrayer: 'حسب الصلاة المقترنة',
    strongest: 'الأقوى',
    weakest: 'الأضعف',
    weakestNote: 'عند {prayer} تتعثّر أورادك أكثر — جرّب تصغيره حتى يصبح يسيرًا جدًا.',
    pausedExcluded: 'استُثنيت {count} أوراد موقوفة من هذه الإحصاءات.',
    pausedExcludedOne: 'استُثني وِردٌ موقوف واحد من هذه الإحصاءات.',
  },

  notFound: {
    title: 'هذه الصفحة غير موجودة',
    body: 'قد يكون الرابط لم يعد صالحًا، أو أن الوِرد الذي يشير إليه قد حُذف.',
    goToToday: 'الذهاب إلى اليوم',
  },

  routes: {
    landing: 'WirdStack — أعمالٌ صغيرة تدوم كل يوم',
    today: 'اليوم',
    habits: 'أورادي',
    newHabit: 'وِرد جديد',
    habitDetails: 'وِرد',
    editHabit: 'تعديل الوِرد',
    stats: 'الإحصائيات',
    notFound: 'غير موجود',
  },

  landing: {
    howItWorks: 'كيف يعمل',
    features: 'المزايا',
    startFree: 'ابدأ مجانًا',
    openApp: 'افتح WirdStack',
    eyebrow: 'أورادٌ مقترنة بالصلاة',
    headlineLead: 'أعمالٌ صغيرة،',
    headlineRest: 'تدوم',
    headlineEmphasis: 'كل يوم',
    lede:
      'قال النبي ﷺ إن أحبَّ الأعمال إلى الله أدومُها وإن قلَّ. يقرن WirdStack عملًا صغيرًا بكل صلاة تصلّيها — ليجد الوِردُ مكانًا يعيش فيه.',
    ctaFirst: 'ابدأ وِردك الأول',
    ctaReturning: 'تابع من حيث توقفت',
    seeHow: 'شاهد كيف يعمل',
    note: 'مجانًا · بدون حساب · يعمل دون اتصال',
    cardHead: 'الصلاة القادمة في موقعك',
    cardFallback: 'بتوقيت {location} — استخدم موقعي',
    cardTomorrow: 'غدًا',
    cardOffline: 'أوقات الصلاة غير متصلة الآن — وكل ما عداها يعمل.',
    methodEyebrow: 'الطريقة',
    methodHeadline: 'ثلاث قواعد، وهذا كل ما في التطبيق.',
    steps: {
      anchorTitle: 'اقرِنه بصلاة',
      anchorBody:
        'أنت تتوقف خمس مرات كل يوم أصلًا. تلك هي الإشارة — لا تحتاج أن تتذكّرها، ولا أن تخترع وقتًا يناسبك.',
      shrinkTitle: 'صغّره حتى يسهُل',
      shrinkBody:
        'آية واحدة. ثلاث وثلاثون تسبيحة. ريال واحد. صغيرٌ بما يكفي ليكتمل حتى في يوم سيّئ.',
      chainTitle: 'دع المداومة تعمل',
      chainBody:
        'كل إتمام يمدّ مداومةً تراها أمامك. تفويت يوم ثغرةٌ لا فشل — وتُستأنف المداومة غدًا.',
    },
    quote: 'أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قلَّ.',
    quoteSource: 'صحيح البخاري 6464',
    featuresEyebrow: 'ما الذي تحصل عليه',
    featuresHeadline: 'ما يكفي ليكون نافعًا. ولا شيء لتديره.',
    features_: {
      timesTitle: 'أوقات صلاتك الحقيقية',
      timesBody: 'محسوبة على إحداثياتك، وتتحدّث يوميًا، وبطريقة الحساب التي يتبعها مجتمعك.',
      scheduleTitle: 'جدولة بأيام محددة',
      scheduleBody:
        'صيام الاثنين، وصدقة الجمعة، وقرآن كل صباح. لا يظهر الوِرد إلا في الأيام التي تخصّه.',
      statsTitle: 'إحصاءات صادقة',
      statsBody:
        'نسبة المداومة حسب اليوم وحسب الصلاة، لترى أيّ اقترانٍ يحملك وأيّها يتفلّت منك.',
      pauseTitle: 'أوقف مؤقتًا دون فقدان سجلّك',
      pauseBody:
        'مسافر أو مريض أو في موسم صعب؟ أوقف الوِرد مؤقتًا. يتوقف عن العدّ ضدّك ويحتفظ بكل ما كسبه.',
      themeTitle: 'مصمَّم لليل والنهار',
      themeBody:
        'مظهر داكن مدروس للفجر والعشاء — ليس لقطةً معكوسة، بل لوحة ألوان ثانية صُمّمت عن قصد.',
      privacyTitle: 'يبقى على جهازك',
      privacyBody: 'أورادك تُكتب في ذاكرة متصفحك وحدها. لا حساب، ولا خادم، ولا شيء يُسرَّب.',
    },
    closerTitle: 'ابدأ بآيةٍ واحدة.',
    closerBody: 'اختر صلاة، واختر شيئًا صغيرًا، ودع الغد يتكفّل بنفسه.',
    footer:
      'WirdStack — الوِرد عملٌ يُداوَم عليه كل يوم؛ وهذا التطبيق يعينك على اقتران وِردك بكل صلاة.',
  },
};
