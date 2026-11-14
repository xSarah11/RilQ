import type { Rover } from "./types";

// All rover content lives here. To add a rover, copy one object and edit it.
// Facts were written to be accurate for students — keep them sourced (NASA, CNSA, Roscosmos).

export const rovers: Rover[] = [
  // ───────────────────────────── MOON ─────────────────────────────
  {
    id: "lunokhod-1",
    planet: "moon",
    name: { ar: "لونوخود ١", en: "Lunokhod 1" },
    agency: { ar: "برنامج الفضاء السوفيتي", en: "Soviet Space Program" },
    country: { ar: "الاتحاد السوفيتي", en: "Soviet Union" },
    flag: "☭",
    landingDate: "1970-11-17",
    landingSite: { ar: "بحر الأمطار", en: "Mare Imbrium (Sea of Rains)" },
    lat: 38.24,
    lng: -35.0,
    model: "lunokhod",
    massKg: 756,
    nasaImagesQuery: "Lunokhod",
    accent: "#e4c27a",
    summary: {
      ar: "أول مركبة آلية تسير على سطح عالم آخر.",
      en: "The first robotic rover to drive on another world.",
    },
    story: {
      ar: "في نوفمبر ١٩٧٠ هبطت المركبة على القمر داخل مهمة لونا ١٧. لم يكن فيها أي رائد فضاء، بل كان فريق من ٥ أشخاص على الأرض يقودها عن بُعد وهم يشاهدون صور كاميراتها. صُممت لتعمل ٣ أشهر قمرية، لكنها استمرت نحو ١٠ أشهر وقطعت أكثر من ١٠ كيلومترات.",
      en: "In November 1970 the rover landed on the Moon aboard the Luna 17 mission. No astronaut was inside — a team of 5 people on Earth drove it remotely while watching its camera images. It was designed for 3 lunar months but kept going for about 10 months and drove more than 10 km.",
    },
    achievements: [
      { ar: "أول مركبة جوالة تُقاد عن بُعد على جرم سماوي آخر", en: "First remote-controlled rover on another celestial body" },
      { ar: "أرسلت أكثر من ٢٠ ألف صورة تلفزيونية", en: "Sent back more than 20,000 TV images" },
      { ar: "عاكسها الليزري ما زال يُستخدم لقياس المسافة بين الأرض والقمر", en: "Its laser reflector is still used to measure the Earth–Moon distance" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "٧٥٦ كغ", en: "756 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٨", en: "8" } },
      { label: { ar: "المسافة", en: "Distance" }, value: { ar: "≈ ١٠.٥ كم", en: "≈ 10.5 km" } },
      { label: { ar: "مدة العمل", en: "Worked for" }, value: { ar: "≈ ١٠ أشهر", en: "≈ 10 months" } },
    ],
    parts: [
      {
        id: "lid",
        mesh: "lid",
        icon: "☀️",
        name: { ar: "الغطاء الشمسي", en: "Solar Lid" },
        role: {
          ar: "غطاء على شكل صدفة، بداخله ألواح شمسية تشحن البطاريات نهارًا، ويُغلق ليلًا ليحفظ حرارة المركبة.",
          en: "A clam-shell lid with solar cells inside. It charges the batteries by day and closes at night to keep the rover warm.",
        },
        funFact: {
          ar: "داخل المركبة سخان صغير يعمل بمادة مشعة ليمنع تجمد الأجهزة في الليل القمري.",
          en: "A small radioactive heater inside kept the electronics from freezing during the lunar night.",
        },
      },
      {
        id: "wheels",
        mesh: "wheels",
        icon: "⚙️",
        name: { ar: "العجلات الثماني", en: "Eight Wheels" },
        role: {
          ar: "لكل عجلة محرك خاص بها، فإذا تعطلت عجلة تستمر الباقية في التحرك.",
          en: "Each wheel had its own motor, so if one failed the others could keep the rover moving.",
        },
        funFact: {
          ar: "كانت المركبة تستدير بتغيير سرعة عجلات اليمين عن عجلات اليسار، مثل الدبابة.",
          en: "It steered by turning the left and right wheels at different speeds — like a tank.",
        },
      },
      {
        id: "reflector",
        mesh: "reflector",
        icon: "🔦",
        name: { ar: "العاكس الليزري", en: "Laser Reflector" },
        role: {
          ar: "مرآة خاصة تعكس أشعة الليزر القادمة من الأرض إلى نفس الاتجاه، فيقيس العلماء المسافة بدقة كبيرة.",
          en: "A special mirror that bounces laser beams from Earth straight back, so scientists can measure the distance very precisely.",
        },
        funFact: {
          ar: "ضاع موقع المركبة لسنوات، ثم وجدته مركبة مدارية في ٢٠١٠ وعاد العاكس للعمل مع الليزر.",
          en: "The rover's exact spot was lost for decades until an orbiter found it in 2010 — and the reflector worked again.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: ليلة على القمر", en: "Mission: A Night on the Moon" },
      intro: {
        ar: "أنت الآن في فريق القيادة على الأرض. اتخذ القرار الصحيح في كل موقف.",
        en: "You are on the driving team back on Earth. Make the right call in each situation.",
      },
      steps: [
        {
          situation: {
            ar: "الليل القمري بدأ، وسيستمر نحو ١٤ يومًا وتنخفض الحرارة إلى أقل من ١٥٠- درجة مئوية. ماذا تفعل؟",
            en: "The lunar night is starting. It lasts about 14 days and the temperature drops below −150 °C. What do you do?",
          },
          options: [
            { text: { ar: "أغلق الغطاء الشمسي لحفظ الحرارة", en: "Close the solar lid to keep heat in" }, correct: true },
            { text: { ar: "استمر في القيادة بالأضواء", en: "Keep driving with the lights on" }, correct: false },
            { text: { ar: "افتح الغطاء أكثر لالتقاط ضوء النجوم", en: "Open the lid wider to catch starlight" }, correct: false },
          ],
          explanation: {
            ar: "في الليل لا توجد شمس لشحن الألواح، فإغلاق الغطاء يحبس حرارة السخان الداخلي ويحمي الأجهزة.",
            en: "There is no sunlight at night, so closing the lid traps heat from the internal heater and protects the electronics.",
          },
        },
        {
          situation: {
            ar: "الصور تصل من الكاميرا ببطء، وأمامك حفرة لا تظهر بوضوح. كيف تقود؟",
            en: "Camera images arrive slowly, and there is a crater ahead you can't see clearly. How do you drive?",
          },
          options: [
            { text: { ar: "بأقصى سرعة قبل أن يحل الظلام", en: "Full speed before it gets dark" }, correct: false },
            { text: { ar: "ببطء، وتتوقف لتنتظر صورة جديدة", en: "Slowly, stopping to wait for a new image" }, correct: true },
            { text: { ar: "أطفئ الكاميرا لتوفير الطاقة", en: "Turn off the camera to save power" }, correct: false },
          ],
          explanation: {
            ar: "الإشارة تحتاج وقتًا للوصول من القمر إلى الأرض، فكان الفريق يقود بخطوات قصيرة ويتأكد من كل صورة.",
            en: "Signals take time to travel between the Moon and Earth, so the team drove in short steps and checked every image.",
          },
        },
        {
          situation: {
            ar: "يريد العلماء قياس المسافة بين الأرض والقمر بدقة سنتيمترات. أي جزء يساعدهم؟",
            en: "Scientists want to measure the Earth–Moon distance to within centimeters. Which part helps?",
          },
          options: [
            { text: { ar: "عدّاد دورات العجلات", en: "The wheel turn counter" }, correct: false },
            { text: { ar: "العاكس الليزري", en: "The laser reflector" }, correct: true },
            { text: { ar: "الغطاء الشمسي", en: "The solar lid" }, correct: false },
          ],
          explanation: {
            ar: "يُرسل ليزر من الأرض، فينعكس ويعود. من زمن الرحلة ذهابًا وإيابًا تُحسب المسافة بدقة.",
            en: "A laser is fired from Earth, it bounces back, and the round-trip time gives a very precise distance.",
          },
        },
      ],
    },
  },
  {
    id: "apollo-lrv",
    planet: "moon",
    name: { ar: "مركبة أبولو القمرية", en: "Apollo Lunar Roving Vehicle" },
    agency: { ar: "ناسا", en: "NASA" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "1971-07-30",
    landingSite: { ar: "هادلي - أبينين (أبولو ١٥)", en: "Hadley–Apennine (Apollo 15)" },
    lat: 26.13,
    lng: 3.63,
    model: "lrv",
    massKg: 210,
    nasaImagesQuery: "Lunar Roving Vehicle",
    accent: "#7ab8ff",
    summary: {
      ar: "سيارة كهربائية قادها رواد الفضاء على سطح القمر.",
      en: "An electric car that astronauts drove on the Moon.",
    },
    story: {
      ar: "في مهمات أبولو ١٥ و١٦ و١٧ (١٩٧١-١٩٧٢) حمل رواد الفضاء معهم سيارة قابلة للطي داخل المركبة القمرية. بفضلها استطاعوا الوصول إلى أماكن أبعد بكثير وجمع صخور أكثر. ما زالت المركبات الثلاث موجودة على القمر حتى اليوم.",
      en: "On Apollo 15, 16 and 17 (1971–1972), astronauts carried a folding car inside their lunar module. It let them reach places much farther away and collect more rocks. All three rovers are still parked on the Moon today.",
    },
    achievements: [
      { ar: "أول مركبة يقودها البشر على عالم آخر", en: "First vehicle driven by humans on another world" },
      { ar: "قطعت مركبة أبولو ١٧ وحدها نحو ٣٦ كم", en: "The Apollo 17 rover alone drove about 36 km" },
      { ar: "نقلت بثًا تلفزيونيًا حيًا للأرض، منه إقلاع أبولو ١٧ من القمر", en: "Sent live TV to Earth, including Apollo 17's liftoff from the Moon" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "≈ ٢١٠ كغ", en: "≈ 210 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٤", en: "4" } },
      { label: { ar: "السرعة", en: "Top speed" }, value: { ar: "≈ ١٣ كم/س", en: "≈ 13 km/h" } },
      { label: { ar: "عدد المركبات", en: "Rovers used" }, value: { ar: "٣", en: "3" } },
    ],
    parts: [
      {
        id: "wheels",
        mesh: "wheels",
        icon: "🕸️",
        name: { ar: "العجلات الشبكية", en: "Wire-Mesh Wheels" },
        role: {
          ar: "إطارات مصنوعة من أسلاك فولاذية منسوجة بدل المطاط، لأن المطاط لا يتحمل حرارة وبرودة القمر.",
          en: "Tires made of woven steel wire instead of rubber, because rubber can't survive the Moon's extreme heat and cold.",
        },
        funFact: {
          ar: "لا يمكن أن تنثقب هذه العجلات، فلا يوجد بداخلها هواء أصلًا.",
          en: "These tires could never get a flat — there was no air inside them.",
        },
      },
      {
        id: "battery",
        mesh: "battery",
        icon: "🔋",
        name: { ar: "البطاريات", en: "Batteries" },
        role: {
          ar: "بطاريتان تعطيان المركبة كل طاقتها. لا يمكن شحنهما، لذلك تُخطط كل رحلة بعناية.",
          en: "Two batteries gave the rover all its power. They could not be recharged, so every trip was carefully planned.",
        },
        funFact: {
          ar: "كل عجلة كان فيها محرك كهربائي صغير خاص بها.",
          en: "Each wheel had its own small electric motor.",
        },
      },
      {
        id: "antenna",
        mesh: "antenna",
        icon: "📡",
        name: { ar: "الهوائي عالي الكسب", en: "High-Gain Antenna" },
        role: {
          ar: "هوائي على شكل مظلة يرسل الصوت والفيديو مباشرة إلى الأرض.",
          en: "An umbrella-shaped antenna that sent voice and live video straight to Earth.",
        },
        funFact: {
          ar: "كان الفريق في الأرض يحرك الكاميرا عن بُعد، وصوّر إقلاع رواد أبولو ١٧ من القمر.",
          en: "The team on Earth could move the camera remotely — they filmed Apollo 17 lifting off the Moon.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: رحلة استكشاف", en: "Mission: The Exploration Drive" },
      intro: {
        ar: "أنت رائد فضاء تقود المركبة. خطط لرحلتك بأمان.",
        en: "You are the astronaut at the wheel. Plan your drive safely.",
      },
      steps: [
        {
          situation: {
            ar: "البطاريات لا تُشحن، وقد تتعطل المركبة. ما أبعد مسافة تذهب إليها عن مركبة الهبوط؟",
            en: "The batteries can't be recharged and the rover might break. How far from the lander do you go?",
          },
          options: [
            { text: { ar: "أبعد ما يمكن، المهم العلم", en: "As far as possible — science first" }, correct: false },
            { text: { ar: "مسافة أستطيع العودة منها مشيًا بالأكسجين المتوفر", en: "Only as far as I could walk back with my oxygen" }, correct: true },
            { text: { ar: "لا أتحرك أبدًا", en: "Don't move at all" }, correct: false },
          ],
          explanation: {
            ar: "هذه قاعدة حقيقية اسمها \"حد العودة مشيًا\": تُخطط الرحلة بحيث يرجع الرواد سيرًا إذا تعطلت المركبة.",
            en: "This was a real rule called the 'walk-back limit': drives were planned so astronauts could walk back if the rover failed.",
          },
        },
        {
          situation: {
            ar: "انكسر واقي الطين، والغبار يتطاير عليك وعلى المعدات. ماذا تفعل؟",
            en: "A fender breaks and dust is spraying over you and the equipment. What do you do?",
          },
          options: [
            { text: { ar: "أصنع واقيًا جديدًا من الخرائط والشريط اللاصق", en: "Build a new fender from maps and tape" }, correct: true },
            { text: { ar: "أكمل القيادة وأتجاهل الغبار", en: "Keep driving and ignore the dust" }, correct: false },
            { text: { ar: "ألغي المهمة وأعود للأرض", en: "Cancel the mission and fly home" }, correct: false },
          ],
          explanation: {
            ar: "هذا حدث فعلًا في أبولو ١٧! صنع الرواد واقيًا من خرائط مغلفة وشريط لاصق، لأن الغبار يسخن المعدات ويتلفها.",
            en: "This really happened on Apollo 17! The astronauts built a fender from laminated maps and tape, because dust overheats and damages equipment.",
          },
        },
        {
          situation: {
            ar: "الناس على الأرض يريدون مشاهدة الاستكشاف مباشرة. ما الجزء المطلوب؟",
            en: "People on Earth want to watch the exploration live. Which part do you need?",
          },
          options: [
            { text: { ar: "البطاريات", en: "The batteries" }, correct: false },
            { text: { ar: "العجلات", en: "The wheels" }, correct: false },
            { text: { ar: "الهوائي عالي الكسب موجّه نحو الأرض", en: "The high-gain antenna pointed at Earth" }, correct: true },
          ],
          explanation: {
            ar: "الهوائي يجب أن يتجه نحو الأرض بدقة لتصل إشارة الفيديو القوية.",
            en: "The antenna must point precisely at Earth for the strong video signal to arrive.",
          },
        },
      ],
    },
  },
  {
    id: "yutu-2",
    planet: "moon",
    name: { ar: "يوتو ٢", en: "Yutu-2" },
    agency: { ar: "إدارة الفضاء الوطنية الصينية", en: "China National Space Administration" },
    country: { ar: "الصين", en: "China" },
    flag: "🇨🇳",
    landingDate: "2019-01-03",
    landingSite: { ar: "فوهة فون كارمان - الجانب البعيد", en: "Von Kármán Crater — Far Side" },
    lat: -45.44,
    lng: 177.59,
    model: "yutu",
    massKg: 140,
    nasaImagesQuery: "Chang'e 4",
    accent: "#ff8a8a",
    summary: {
      ar: "أول مركبة تسير على الجانب البعيد من القمر.",
      en: "The first rover to drive on the far side of the Moon.",
    },
    story: {
      ar: "اسمها يعني \"الأرنب اليشمي\". هبطت مع مهمة تشانغ إي ٤ على الجانب الذي لا نراه أبدًا من الأرض. ولأن الأرض لا تظهر من هناك، استخدمت قمرًا صناعيًا وسيطًا لنقل رسائلها. أصبحت من أطول المركبات القمرية عمرًا.",
      en: "Its name means 'Jade Rabbit'. It landed with the Chang'e 4 mission on the side of the Moon we never see from Earth. Because Earth isn't visible from there, it used a relay satellite to send its messages home. It became one of the longest-working lunar rovers ever.",
    },
    achievements: [
      { ar: "أول هبوط ناعم واستكشاف على الجانب البعيد للقمر", en: "First soft landing and exploration on the Moon's far side" },
      { ar: "كشف رادارها طبقات تحت السطح حتى عمق قرابة ٣٠٠ متر", en: "Its radar revealed layers down to about 300 m under the surface" },
      { ar: "تجاوزت رقم لونوخود ١ كأطول مركبة عملًا على القمر", en: "Beat Lunokhod 1's record as the longest-working Moon rover" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "≈ ١٤٠ كغ", en: "≈ 140 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٦", en: "6" } },
      { label: { ar: "الطاقة", en: "Power" }, value: { ar: "شمسية", en: "Solar" } },
      { label: { ar: "الموقع", en: "Location" }, value: { ar: "الجانب البعيد", en: "Far side" } },
    ],
    parts: [
      {
        id: "solar",
        mesh: "solar",
        icon: "☀️",
        name: { ar: "الألواح الشمسية", en: "Solar Panels" },
        role: {
          ar: "تولد الكهرباء من ضوء الشمس خلال النهار القمري الطويل.",
          en: "Make electricity from sunlight during the long lunar day.",
        },
        funFact: {
          ar: "في الليل القمري لا توجد شمس، فتنام المركبة ويدفئ أجهزتَها سخانٌ صغير يعمل بمادة مشعة.",
          en: "During the lunar night there is no sunlight, so the rover sleeps while a small radioactive heater keeps its parts warm.",
        },
      },
      {
        id: "radar",
        mesh: "radar",
        icon: "📶",
        name: { ar: "رادار اختراق السطح", en: "Ground-Penetrating Radar" },
        role: {
          ar: "يرسل موجات تحت الأرض ويستمع لصداها ليرسم صورة لما تحت السطح دون حفر.",
          en: "Sends waves into the ground and listens to the echoes to map what's below — without digging.",
        },
        funFact: {
          ar: "اكتشف أن تحت المركبة طبقات من حطام نيازك قديمة تراكمت عبر ملايين السنين.",
          en: "It found layers of old impact debris piled up over millions of years.",
        },
      },
      {
        id: "antenna",
        mesh: "antenna",
        icon: "📡",
        name: { ar: "هوائي الاتصال", en: "Communication Antenna" },
        role: {
          ar: "يتواصل مع القمر الصناعي الوسيط \"تشويه تشياو\" الذي ينقل الرسائل إلى الأرض.",
          en: "Talks to the relay satellite Queqiao, which passes messages on to Earth.",
        },
        funFact: {
          ar: "اسم \"تشويه تشياو\" يعني \"جسر طيور العقعق\" من أسطورة صينية قديمة.",
          en: "'Queqiao' means 'Magpie Bridge', from an old Chinese legend.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: الجانب الخفي", en: "Mission: The Hidden Side" },
      intro: {
        ar: "أنت تشغّل مركبة على جانب القمر الذي لا يرى الأرض أبدًا.",
        en: "You are operating a rover on the side of the Moon that never sees Earth.",
      },
      steps: [
        {
          situation: {
            ar: "الأرض غير ظاهرة من موقعك، فكيف ترسل البيانات؟",
            en: "Earth is not visible from where you are. How do you send your data?",
          },
          options: [
            { text: { ar: "عبر القمر الصناعي الوسيط", en: "Through the relay satellite" }, correct: true },
            { text: { ar: "أرفع الهوائي أعلى", en: "Raise the antenna higher" }, correct: false },
            { text: { ar: "أنتظر حتى يدور القمر", en: "Wait for the Moon to turn around" }, correct: false },
          ],
          explanation: {
            ar: "القمر يُظهر دائمًا نفس الوجه للأرض، لذلك لن يرى الجانب البعيد الأرضَ أبدًا. القمر الوسيط يرى الطرفين.",
            en: "The Moon always shows the same face to Earth, so the far side never sees it. The relay satellite can see both.",
          },
        },
        {
          situation: {
            ar: "الليل القمري بدأ، ولا شمس لمدة أسبوعين. ماذا تفعل؟",
            en: "Lunar night has begun — no Sun for two weeks. What do you do?",
          },
          options: [
            { text: { ar: "أستمر في العمل بالبطارية", en: "Keep working on battery" }, correct: false },
            { text: { ar: "أدخل وضع السبات حتى تشرق الشمس", en: "Go into hibernation until sunrise" }, correct: true },
            { text: { ar: "أبحث عن مكان مشمس", en: "Drive to find sunshine" }, correct: false },
          ],
          explanation: {
            ar: "السبات يوفر الطاقة، وسخان صغير يحمي الأجهزة من البرد، ثم تستيقظ المركبة تلقائيًا عندما تشرق الشمس من جديد.",
            en: "Hibernating saves power while a small heater protects the parts from the cold. The rover wakes up automatically when the Sun rises again.",
          },
        },
        {
          situation: {
            ar: "العلماء يريدون معرفة ما تحت السطح، لكن المركبة لا تستطيع الحفر. ما الحل؟",
            en: "Scientists want to know what's under the surface, but the rover can't dig. What's the solution?",
          },
          options: [
            { text: { ar: "رادار اختراق السطح", en: "Ground-penetrating radar" }, correct: true },
            { text: { ar: "الألواح الشمسية", en: "The solar panels" }, correct: false },
            { text: { ar: "تصوير السطح فقط", en: "Just photograph the surface" }, correct: false },
          ],
          explanation: {
            ar: "الرادار يرى ما تحت التربة من خلال صدى الموجات، مثل جهاز السونار.",
            en: "The radar 'sees' under the soil using echoes of waves — like sonar.",
          },
        },
      ],
    },
  },

  // ───────────────────────────── MARS ─────────────────────────────
  {
    id: "sojourner",
    planet: "mars",
    name: { ar: "سوجورنر", en: "Sojourner" },
    agency: { ar: "ناسا", en: "NASA" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "1997-07-04",
    landingSite: { ar: "وادي آريس", en: "Ares Vallis" },
    lat: 19.13,
    lng: -33.22,
    model: "sojourner",
    massKg: 11,
    nasaImagesQuery: "Sojourner rover",
    accent: "#ffd27a",
    summary: {
      ar: "أول مركبة بعجلات على المريخ — بحجم فرن الميكروويف.",
      en: "The first wheeled rover on Mars — about the size of a microwave oven.",
    },
    story: {
      ar: "وصلت مع مهمة \"باثفايندر\" وهبطت بوسائد هوائية ارتدت على السطح. كانت صغيرة جدًا (نحو ١١ كغ)، وصُممت للعمل ٧ أيام مريخية فقط، لكنها عملت ٨٣ يومًا مريخيًا. أثبتت أن المركبات المتحركة على المريخ فكرة ناجحة.",
      en: "It arrived with the Pathfinder mission, which landed using bouncing airbags. It was tiny (about 11 kg) and designed to work for just 7 Mars days (sols) — but it kept going for 83. It proved that driving on Mars could work.",
    },
    achievements: [
      { ar: "أول مركبة جوالة تعمل على كوكب آخر", en: "First rover to operate on another planet" },
      { ar: "أول استخدام لنظام التعليق \"روكر-بوجي\"", en: "First use of the 'rocker-bogie' suspension" },
      { ar: "حللت تركيب صخور المريخ مثل الصخرة \"بارنكل بِل\"", en: "Analyzed Martian rocks such as 'Barnacle Bill'" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "≈ ١١ كغ", en: "≈ 11 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٦", en: "6" } },
      { label: { ar: "المخطط", en: "Planned" }, value: { ar: "٧ أيام مريخية", en: "7 sols" } },
      { label: { ar: "الفعلي", en: "Actual" }, value: { ar: "٨٣ يومًا مريخيًا", en: "83 sols" } },
    ],
    parts: [
      {
        id: "solar",
        mesh: "solar",
        icon: "☀️",
        name: { ar: "اللوح الشمسي", en: "Solar Panel" },
        role: {
          ar: "لوح على ظهر المركبة يعطيها الطاقة من ضوء الشمس.",
          en: "A panel on the rover's back that powers it with sunlight.",
        },
        funFact: {
          ar: "كان يعطي طاقة قليلة جدًا، تقريبًا مثل مصباح صغير!",
          en: "It produced very little power — about as much as a small light bulb!",
        },
      },
      {
        id: "wheels",
        mesh: "wheels",
        icon: "⚙️",
        name: { ar: "تعليق روكر-بوجي", en: "Rocker-Bogie Wheels" },
        role: {
          ar: "نظام يربط العجلات الست بأذرع متحركة، فتبقى كلها ملامسة للأرض على الطرق الوعرة.",
          en: "Links the six wheels with moving arms so all of them stay on the ground over rough terrain.",
        },
        funFact: {
          ar: "نفس هذا التصميم استُخدم بعد ذلك في كل مركبات ناسا على المريخ.",
          en: "This same design was later used on every NASA Mars rover.",
        },
      },
      {
        id: "apxs",
        mesh: "apxs",
        icon: "🔬",
        name: { ar: "مطياف الصخور (APXS)", en: "Rock Spectrometer (APXS)" },
        role: {
          ar: "جهاز في مؤخرة المركبة يُلصق على الصخرة ليعرف العناصر التي تتكون منها.",
          en: "An instrument on the back that is pressed against a rock to find out which elements it's made of.",
        },
        funFact: {
          ar: "أطلق العلماء على الصخور أسماء طريفة مثل \"يوغي\" و\"بارنكل بِل\".",
          en: "Scientists gave rocks fun names like 'Yogi' and 'Barnacle Bill'.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: الخطوات الأولى", en: "Mission: First Steps" },
      intro: {
        ar: "أنت تشغّل أول مركبة على المريخ. كل قرار له قيمة!",
        en: "You are running the first rover on Mars. Every decision counts!",
      },
      steps: [
        {
          situation: {
            ar: "المركبة صغيرة ولا تملك هوائيًا قويًا. كيف تصل بياناتها إلى الأرض؟",
            en: "The rover is small and has no powerful antenna. How does its data reach Earth?",
          },
          options: [
            { text: { ar: "عبر مركبة الهبوط القريبة منها", en: "Through the nearby lander" }, correct: true },
            { text: { ar: "مباشرة بإشارة ضعيفة", en: "Directly, with a weak signal" }, correct: false },
            { text: { ar: "تخزنها حتى يأتي رواد فضاء", en: "Store it until astronauts arrive" }, correct: false },
          ],
          explanation: {
            ar: "كانت سوجورنر تتحدث مع مركبة الهبوط، والمركبة هي التي ترسل كل شيء إلى الأرض. لذلك بقيت قريبة منها.",
            en: "Sojourner talked to the lander, and the lander sent everything to Earth. That's why it stayed close by.",
          },
        },
        {
          situation: {
            ar: "وجدت صخرة غريبة وتريد معرفة مكوناتها. ماذا تستخدم؟",
            en: "You found a strange rock and want to know what it's made of. What do you use?",
          },
          options: [
            { text: { ar: "اللوح الشمسي", en: "The solar panel" }, correct: false },
            { text: { ar: "ألصق مطياف APXS على الصخرة", en: "Press the APXS spectrometer on the rock" }, correct: true },
            { text: { ar: "أدهس الصخرة بالعجلات", en: "Drive over the rock" }, correct: false },
          ],
          explanation: {
            ar: "المطياف يقيس الأشعة الصادرة من الصخرة، ومنها يعرف العلماء العناصر التي فيها.",
            en: "The spectrometer measures radiation coming from the rock, which tells scientists which elements are inside.",
          },
        },
        {
          situation: {
            ar: "الطريق مليء بالصخور الصغيرة والمطبات. ما الذي يساعد المركبة على العبور؟",
            en: "The path is full of small rocks and bumps. What helps the rover get across?",
          },
          options: [
            { text: { ar: "زيادة السرعة", en: "Driving faster" }, correct: false },
            { text: { ar: "نظام روكر-بوجي الذي يبقي العجلات على الأرض", en: "The rocker-bogie keeping all wheels on the ground" }, correct: true },
            { text: { ar: "رفع اللوح الشمسي", en: "Raising the solar panel" }, correct: false },
          ],
          explanation: {
            ar: "الأذرع المتحركة ترفع عجلة وتخفض أخرى، فتتسلق المركبة العوائق دون أن تنقلب.",
            en: "The moving arms lift one wheel and lower another, so the rover climbs obstacles without tipping over.",
          },
        },
      ],
    },
  },
  {
    id: "opportunity",
    planet: "mars",
    name: { ar: "أبورتشونيتي", en: "Opportunity" },
    agency: { ar: "ناسا", en: "NASA" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "2004-01-25",
    landingSite: { ar: "سهل ميريدياني", en: "Meridiani Planum" },
    lat: -1.95,
    lng: -5.53,
    model: "mer",
    massKg: 185,
    nasaImagesQuery: "Opportunity rover",
    accent: "#9fe3b0",
    summary: {
      ar: "صُممت لـ ٩٠ يومًا فعملت قرابة ١٥ سنة!",
      en: "Built to last 90 days — it worked for almost 15 years!",
    },
    story: {
      ar: "هي توأم المركبة \"سبيريت\". هبطت داخل فوهة صغيرة كأنها \"ضربة واحدة في الحفرة\". وجدت حبيبات معدنية صغيرة سماها العلماء \"التوت الأزرق\" تدل على وجود ماء قديم. استمرت تعمل حتى غطتها عاصفة غبار عملاقة في ٢٠١٨.",
      en: "The twin of the rover Spirit. It landed right inside a small crater — a 'hole in one'. It found tiny mineral balls nicknamed 'blueberries' that showed water once existed. It kept working until a giant dust storm covered it in 2018.",
    },
    achievements: [
      { ar: "قطعت أكثر من ٤٥ كم — أطول من سباق الماراثون", en: "Drove more than 45 km — longer than a marathon" },
      { ar: "وجدت أدلة قوية على وجود ماء في ماضي المريخ", en: "Found strong evidence of water in Mars' past" },
      { ar: "عملت أطول من المخطط بأكثر من ٥٠ ضعفًا", en: "Worked more than 50 times longer than planned" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "١٨٥ كغ", en: "185 kg" } },
      { label: { ar: "المسافة", en: "Distance" }, value: { ar: "٤٥.١٦ كم", en: "45.16 km" } },
      { label: { ar: "المخطط", en: "Planned" }, value: { ar: "٩٠ يومًا مريخيًا", en: "90 sols" } },
      { label: { ar: "الفعلي", en: "Actual" }, value: { ar: "≈ ١٥ سنة", en: "≈ 15 years" } },
    ],
    parts: [
      {
        id: "solar",
        mesh: "solar",
        icon: "☀️",
        name: { ar: "الألواح الشمسية", en: "Solar Panels" },
        role: {
          ar: "أجنحة شمسية كبيرة تشحن البطاريات. الغبار عليها كان أكبر خطر على المركبة.",
          en: "Large solar 'wings' that charge the batteries. Dust on them was the rover's biggest danger.",
        },
        funFact: {
          ar: "أحيانًا كانت الرياح تمسح الغبار عن الألواح، فسماها العلماء \"أحداث التنظيف\".",
          en: "Sometimes the wind blew the dust off — scientists called these 'cleaning events'.",
        },
      },
      {
        id: "mast",
        mesh: "mast",
        icon: "📷",
        name: { ar: "سارية الكاميرا (Pancam)", en: "Camera Mast (Pancam)" },
        role: {
          ar: "رأس على عمود مرتفع فيه كاميرات ملونة تشبه العينين، تصور المكان وتساعد في اختيار الطريق.",
          en: "A head on a tall pole with color cameras like eyes — it photographs the scene and helps pick the route.",
        },
        funFact: {
          ar: "الكاميرا تقع تقريبًا في مستوى عين الإنسان.",
          en: "The cameras sit at about the height of a person's eyes.",
        },
      },
      {
        id: "arm",
        mesh: "arm",
        icon: "🦾",
        name: { ar: "الذراع وأداة الكشط (RAT)", en: "Arm & Rock Grinder (RAT)" },
        role: {
          ar: "ذراع آلية في نهايتها أداة تكشط سطح الصخرة لتكشف ما بداخلها.",
          en: "A robotic arm with a tool that grinds away a rock's surface to reveal what's inside.",
        },
        funFact: {
          ar: "الغطاء الذي يحمي أسلاك هذه الأداة مصنوع من ألمنيوم أُخذ من موقع برجي مركز التجارة العالمي، تكريمًا للضحايا.",
          en: "The shield protecting this tool's cables is made of aluminum recovered from the World Trade Center site, as a memorial.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: صياد الماء", en: "Mission: Water Hunter" },
      intro: {
        ar: "أنت سائق المركبة. ابحث عن دليل الماء وحافظ على الطاقة.",
        en: "You are the rover driver. Find evidence of water and save your power.",
      },
      steps: [
        {
          situation: {
            ar: "الغبار تراكم على الألواح والطاقة تنخفض كل يوم. ما القرار الصحيح؟",
            en: "Dust has piled on the panels and power drops every day. What's the right call?",
          },
          options: [
            { text: { ar: "أقلل الأنشطة وأوفر الطاقة وأنتظر الرياح", en: "Cut activities, save power, wait for wind" }, correct: true },
            { text: { ar: "أقود بسرعة لأنفض الغبار", en: "Drive fast to shake the dust off" }, correct: false },
            { text: { ar: "أشغّل كل الأجهزة معًا", en: "Turn on all instruments at once" }, correct: false },
          ],
          explanation: {
            ar: "هذا ما فعله الفريق الحقيقي: توفير الطاقة حتى تأتي رياح تنظف الألواح.",
            en: "That's what the real team did: save power until a wind gust cleaned the panels.",
          },
        },
        {
          situation: {
            ar: "سطح الصخرة مغطى بالغبار والتآكل، وتريد رؤية داخلها. ماذا تستخدم؟",
            en: "The rock's surface is covered with dust and weathering. You want to see inside. What do you use?",
          },
          options: [
            { text: { ar: "أداة الكشط في الذراع", en: "The grinder on the arm" }, correct: true },
            { text: { ar: "الألواح الشمسية", en: "The solar panels" }, correct: false },
            { text: { ar: "أنتظر المطر ليغسلها", en: "Wait for rain to wash it" }, correct: false },
          ],
          explanation: {
            ar: "أداة الكشط تزيل بضعة ملليمترات من السطح فيظهر الصخر النقي للتحليل. (ولا يوجد مطر على المريخ!)",
            en: "The grinder removes a few millimeters so fresh rock shows for analysis. (And it never rains on Mars!)",
          },
        },
        {
          situation: {
            ar: "تريد اختيار وجهتك القادمة من بين صخور بعيدة. ما الجزء الذي يساعدك أولًا؟",
            en: "You need to pick your next destination among distant rocks. Which part helps first?",
          },
          options: [
            { text: { ar: "سارية الكاميرا Pancam", en: "The Pancam mast" }, correct: true },
            { text: { ar: "أداة الكشط", en: "The rock grinder" }, correct: false },
            { text: { ar: "البطارية", en: "The battery" }, correct: false },
          ],
          explanation: {
            ar: "الكاميرا المرتفعة ترى بعيدًا وتلتقط صورًا ملونة يدرسها العلماء قبل القيادة.",
            en: "The tall camera sees far and takes color images that scientists study before driving.",
          },
        },
      ],
    },
  },
  {
    id: "curiosity",
    planet: "mars",
    name: { ar: "كيوريوسيتي", en: "Curiosity" },
    agency: { ar: "ناسا", en: "NASA" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "2012-08-06",
    landingSite: { ar: "فوهة غيل", en: "Gale Crater" },
    lat: -4.59,
    lng: 137.44,
    model: "msl",
    massKg: 899,
    nasaImagesQuery: "Curiosity rover",
    accent: "#ffb07a",
    summary: {
      ar: "مختبر علمي بحجم سيارة، يعمل بالطاقة النووية.",
      en: "A car-sized science lab powered by nuclear energy.",
    },
    story: {
      ar: "هبطت بطريقة مذهلة: \"رافعة سماوية\" أنزلتها بالحبال من الجو. سُميت لحظات الهبوط \"سبع دقائق من الرعب\". اكتشفت أن فوهة غيل كانت يومًا بحيرة فيها ظروف مناسبة لحياة مجهرية، وما زالت تتسلق جبل شارب منذ أكثر من عقد.",
      en: "It landed in an amazing way: a 'sky crane' lowered it on cables from the air. The landing was called 'seven minutes of terror'. It discovered that Gale Crater was once a lake with conditions suitable for microbial life, and it has been climbing Mount Sharp for over a decade.",
    },
    achievements: [
      { ar: "أثبتت أن المريخ كان صالحًا لحياة مجهرية في الماضي", en: "Showed Mars could once have supported microbial life" },
      { ar: "أول هبوط باستخدام الرافعة السماوية", en: "First landing using a sky crane" },
      { ar: "في أغسطس ٢٠٢٦ وصلت إلى ارتفاع كيلومتر كامل وهي تتسلق جبل شارب", en: "In August 2026 it reached 1 km of elevation gain climbing Mount Sharp" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "٨٩٩ كغ", en: "899 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٦", en: "6" } },
      { label: { ar: "الطاقة", en: "Power" }, value: { ar: "نووية", en: "Nuclear" } },
      { label: { ar: "الحجم", en: "Size" }, value: { ar: "سيارة صغيرة", en: "Small car" } },
    ],
    parts: [
      {
        id: "rtg",
        mesh: "rtg",
        icon: "⚛️",
        name: { ar: "مولد الطاقة النووي", en: "Nuclear Power Generator" },
        role: {
          ar: "يحول حرارة مادة البلوتونيوم إلى كهرباء، فيعمل ليلًا ونهارًا ولا يتأثر بالغبار.",
          en: "Turns heat from plutonium into electricity, so it works day and night and dust doesn't matter.",
        },
        funFact: {
          ar: "الحرارة الزائدة منه تُستخدم لتدفئة أجهزة المركبة في برد المريخ.",
          en: "Its extra heat is used to keep the rover's instruments warm in the Martian cold.",
        },
      },
      {
        id: "mast",
        mesh: "mast",
        icon: "🔴",
        name: { ar: "ليزر ChemCam", en: "ChemCam Laser" },
        role: {
          ar: "ليزر في رأس السارية يطلق نبضات على صخرة بعيدة فيبخر جزءًا صغيرًا منها، ثم يحلل الضوء ليعرف مكوناتها.",
          en: "A laser on the mast that zaps a distant rock, vaporizing a tiny spot, then reads the light to learn what it's made of.",
        },
        funFact: {
          ar: "يستطيع تحليل صخرة على بعد عدة أمتار دون أن تتحرك المركبة.",
          en: "It can analyze a rock several meters away without the rover moving.",
        },
      },
      {
        id: "arm",
        mesh: "arm",
        icon: "🦾",
        name: { ar: "الذراع والمثقاب", en: "Arm & Drill" },
        role: {
          ar: "ذراع طولها نحو مترين في نهايتها مثقاب يحفر الصخر ويجمع مسحوقه للمختبرات داخل المركبة.",
          en: "A ~2 m arm with a drill that bores into rock and collects powder for the labs inside the rover.",
        },
        funFact: {
          ar: "أول عينة حفرتها كشفت أن المكان كان بحيرة صالحة لحياة مجهرية.",
          en: "Its first drilled sample revealed the area was once a lake suitable for microbes.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: محقق المريخ", en: "Mission: Mars Detective" },
      intro: {
        ar: "أنت قائد مختبر متحرك. استخدم أدواتك بذكاء.",
        en: "You are in charge of a moving laboratory. Use your tools wisely.",
      },
      steps: [
        {
          situation: {
            ar: "عاصفة غبار ضخمة حجبت الشمس عن المريخ كله. ماذا يحدث لكيوريوسيتي؟",
            en: "A huge dust storm has blocked the Sun across Mars. What happens to Curiosity?",
          },
          options: [
            { text: { ar: "تتوقف لأن ألواحها الشمسية مغطاة", en: "It stops because its solar panels are covered" }, correct: false },
            { text: { ar: "تستمر بالعمل لأنها تعمل بالطاقة النووية", en: "It keeps working because it runs on nuclear power" }, correct: true },
            { text: { ar: "تعود إلى الأرض", en: "It flies back to Earth" }, correct: false },
          ],
          explanation: {
            ar: "مولدها النووي لا يحتاج الشمس، لذلك واصلت العمل خلال عاصفة ٢٠١٨ التي أوقفت أبورتشونيتي.",
            en: "Its nuclear generator doesn't need sunlight, so it kept working through the 2018 storm that stopped Opportunity.",
          },
        },
        {
          situation: {
            ar: "صخرة مثيرة على بعد ٥ أمتار، لكن الطريق مليء بصخور حادة تؤذي العجلات. ماذا تفعل؟",
            en: "An interesting rock is 5 m away, but the path is full of sharp rocks that hurt the wheels. What do you do?",
          },
          options: [
            { text: { ar: "أقود فوق الصخور الحادة بسرعة", en: "Drive over the sharp rocks quickly" }, correct: false },
            { text: { ar: "أحللها عن بعد بليزر ChemCam", en: "Analyze it from here with the ChemCam laser" }, correct: true },
            { text: { ar: "أتجاهلها", en: "Ignore it" }, correct: false },
          ],
          explanation: {
            ar: "الليزر يحلل الصخور من مسافة، فيحمي العجلات التي تضررت فعلًا من الصخور الحادة.",
            en: "The laser analyzes rocks from a distance, protecting wheels that really were damaged by sharp rocks.",
          },
        },
        {
          situation: {
            ar: "تحتاج عينة من داخل الصخرة لتعرف هل كان المكان صالحًا للحياة. ما الأداة؟",
            en: "You need a sample from inside a rock to know if the place was habitable. Which tool?",
          },
          options: [
            { text: { ar: "المثقاب في الذراع", en: "The drill on the arm" }, correct: true },
            { text: { ar: "مولد الطاقة", en: "The power generator" }, correct: false },
            { text: { ar: "العجلات", en: "The wheels" }, correct: false },
          ],
          explanation: {
            ar: "المثقاب يجمع مسحوق الصخر ويوصله لمختبرات المركبة التي تحلل كيمياءه بدقة.",
            en: "The drill collects rock powder and delivers it to the onboard labs that analyze its chemistry in detail.",
          },
        },
      ],
    },
  },
  {
    id: "perseverance",
    planet: "mars",
    name: { ar: "برسيفيرانس", en: "Perseverance" },
    agency: { ar: "ناسا", en: "NASA" },
    country: { ar: "الولايات المتحدة", en: "United States" },
    flag: "🇺🇸",
    landingDate: "2021-02-18",
    landingSite: { ar: "فوهة جيزيرو", en: "Jezero Crater" },
    lat: 18.4447,
    lng: 77.4508,
    model: "msl",
    massKg: 1025,
    nasaImagesQuery: "Perseverance rover",
    liveTraverse: "m20",
    accent: "#b79bff",
    summary: {
      ar: "أثقل مركبة على المريخ، تجمع عينات صخور ليعيدها البشر يومًا ما إلى الأرض.",
      en: "The heaviest rover on Mars, collecting rock samples for a future return to Earth.",
    },
    story: {
      ar: "هبطت في فوهة جيزيرو، وهي بحيرة قديمة كان يصب فيها نهر. تبحث عن آثار حياة ميكروبية قديمة، وتحفظ عينات صخور في أنابيب محكمة. حملت معها المروحية Ingenuity، أول طائرة تطير بمحرك على كوكب آخر.",
      en: "It landed in Jezero Crater, an ancient lake once fed by a river. It searches for signs of ancient microbial life and seals rock samples in tubes. It carried the Ingenuity helicopter — the first aircraft to make a powered flight on another planet.",
    },
    achievements: [
      { ar: "أوصلت Ingenuity التي نفذت ٧٢ رحلة طيران حتى يناير ٢٠٢٤", en: "Delivered Ingenuity, which made 72 flights until January 2024" },
      { ar: "تجربة MOXIE أنتجت نحو ٥ غرامات أكسجين من هواء المريخ (أبريل ٢٠٢١)", en: "Its MOXIE experiment made about 5 g of oxygen from Mars air (April 2021)" },
      { ar: "وجدت في ٢٠٢٤ صخرة \"شيافا فولز\" التي قد تحمل علامات حياة قديمة", en: "In 2024 it found 'Cheyava Falls', a rock that may hold signs of ancient life" },
    ],
    stats: [
      { label: { ar: "الكتلة", en: "Mass" }, value: { ar: "١٬٠٢٥ كغ", en: "1,025 kg" } },
      { label: { ar: "العجلات", en: "Wheels" }, value: { ar: "٦", en: "6" } },
      { label: { ar: "الطاقة", en: "Power" }, value: { ar: "نووية", en: "Nuclear" } },
      { label: { ar: "أنابيب العينات", en: "Sample tubes" }, value: { ar: "٤٣", en: "43" } },
    ],
    parts: [
      {
        id: "rtg",
        mesh: "rtg",
        icon: "⚛️",
        name: { ar: "مولد الطاقة النووي (MMRTG)", en: "Nuclear Power Generator (MMRTG)" },
        role: {
          ar: "يحول حرارة البلوتونيوم إلى كهرباء، فتعمل المركبة ليلًا ونهارًا مثل كيوريوسيتي.",
          en: "Turns heat from plutonium into electricity, so the rover works day and night — like Curiosity.",
        },
        funFact: {
          ar: "تصميم المركبة مبني على كيوريوسيتي، لكنها أثقل وعجلاتها أقوى.",
          en: "Its design is based on Curiosity, but it is heavier and has tougher wheels.",
        },
      },
      {
        id: "mast",
        mesh: "mast",
        icon: "🔴",
        name: { ar: "رأس SuperCam وكاميرات Mastcam-Z", en: "SuperCam & Mastcam-Z" },
        role: {
          ar: "رأس على السارية فيه ليزر يحلل الصخور من بعيد، وكاميرات تقرّب الصورة وتصور بأبعاد ثلاثية.",
          en: "A mast head with a laser that analyzes rocks from a distance, plus zoom cameras that see in 3D.",
        },
        funFact: {
          ar: "في السارية ميكروفون سجّل أصوات الليزر وهو يضرب الصخور على المريخ.",
          en: "A microphone on the mast recorded the sound of the laser hitting rocks on Mars.",
        },
      },
      {
        id: "arm",
        mesh: "arm",
        icon: "🧪",
        name: { ar: "الذراع ومثقاب العينات", en: "Arm & Coring Drill" },
        role: {
          ar: "ذراع آلية في نهايتها مثقاب يقطع أسطوانة صغيرة من الصخر، ثم تُحفظ في أنبوب محكم داخل المركبة.",
          en: "A robotic arm whose drill cuts a small rock core, which is then sealed in a tube inside the rover.",
        },
        funFact: {
          ar: "تحمل المركبة ٤٣ أنبوبًا لحفظ العينات.",
          en: "The rover carries 43 sample tubes.",
        },
      },
    ],
    mission: {
      title: { ar: "مهمة: صياد العينات", en: "Mission: Sample Hunter" },
      intro: {
        ar: "أنت تقود أحدث مركبة على المريخ. قراراتك تحدد ما سيصل إلى مختبرات الأرض.",
        en: "You are driving the newest rover on Mars. Your choices decide what reaches labs on Earth.",
      },
      steps: [
        {
          situation: {
            ar: "وجدت صخرة فيها بقع غريبة قد تكون أثرًا لحياة قديمة. ماذا تفعل؟",
            en: "You found a rock with strange spots that might be a trace of ancient life. What do you do?",
          },
          options: [
            { text: { ar: "أحفر عينة وأحفظها في أنبوب محكم", en: "Drill a core and seal it in a tube" }, correct: true },
            { text: { ar: "أكسرها بالعجلات لأرى داخلها", en: "Crush it with the wheels to look inside" }, correct: false },
            { text: { ar: "أتجاهلها وأكمل الطريق", en: "Ignore it and keep driving" }, correct: false },
          ],
          explanation: {
            ar: "هذا ما حدث مع صخرة \"شيافا فولز\" في ٢٠٢٤: المختبرات على الأرض أدق بكثير من أجهزة المركبة، فالعينة المحفوظة هي الحل.",
            en: "That's what happened with 'Cheyava Falls' in 2024: labs on Earth are far more precise than rover instruments, so a sealed sample is the answer.",
          },
        },
        {
          situation: {
            ar: "تريد معرفة شكل الأرض أمامك قبل أن تقود إليها. ما الذي يساعدك من الأعلى؟",
            en: "You want to see the ground ahead before driving there. What can help from above?",
          },
          options: [
            { text: { ar: "المروحية Ingenuity", en: "The Ingenuity helicopter" }, correct: true },
            { text: { ar: "مولد الطاقة", en: "The power generator" }, correct: false },
            { text: { ar: "أنابيب العينات", en: "The sample tubes" }, correct: false },
          ],
          explanation: {
            ar: "طارت Ingenuity ٧٢ مرة وصوّرت الطريق من الجو، حتى تضررت شفرتها في يناير ٢٠٢٤.",
            en: "Ingenuity flew 72 times, scouting from the air, until a blade was damaged in January 2024.",
          },
        },
        {
          situation: {
            ar: "رواد الفضاء في المستقبل سيحتاجون أكسجين على المريخ. أي تجربة أثبتت أن هذا ممكن؟",
            en: "Future astronauts will need oxygen on Mars. Which experiment proved it is possible?",
          },
          options: [
            { text: { ar: "تجربة MOXIE", en: "The MOXIE experiment" }, correct: true },
            { text: { ar: "الليزر في SuperCam", en: "The SuperCam laser" }, correct: false },
            { text: { ar: "العجلات الست", en: "The six wheels" }, correct: false },
          ],
          explanation: {
            ar: "في ٢٠ أبريل ٢٠٢١ صنعت MOXIE نحو ٥ غرامات أكسجين من ثاني أكسيد الكربون في هواء المريخ.",
            en: "On 20 April 2021, MOXIE made about 5 grams of oxygen from the carbon dioxide in Mars' air.",
          },
        },
      ],
    },
  },
];

export function getRover(id: string): Rover | undefined {
  return rovers.find((r) => r.id === id);
}

export function getRoversByPlanet(planet: string): Rover[] {
  return rovers.filter((r) => r.planet === planet);
}
