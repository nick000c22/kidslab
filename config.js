/* ============================================================
   KIDS LAB — the only file you normally need to edit.
   Add a lesson: drop its .html file into /lessons and add an
   entry to `lessons` below. Re-upload the folder. Done.
   ============================================================ */

window.KIDSLAB_CONFIG = {
  appName: "Kids Lab",

  // Family leaderboard. Works once the site is deployed from GitHub on Netlify.
  // Set to "" to turn it off (each iPad then just keeps its own stars).
  scoreboardUrl: "/api/scores",

  // Who can play. Add as many as you like, one line each.
  //   id:    lowercase, no spaces, must be unique and NEVER change (stars are saved against it)
  //   emoji: any emoji as their picture
  //   color: grape | leaf | sun | sky | berry | tang
  //   gender: "girl" (female voice, sparkle items first) or "boy" (male voice, action items first)
  // Example: { id: "sam", name: "Sam", emoji: "🦁", color: "sun", gender: "boy" },
  players: [
    { id: "jack",  name: "Jack",  emoji: "🦖", color: "leaf", gender: "boy" },
    { id: "alice", name: "Alice", emoji: "🦄", color: "berry", gender: "girl" },
    { id: "ella",  name: "Ella",  emoji: "🐬", color: "sky", gender: "girl" },
    { id: "will",  name: "Will",  emoji: "🦁", color: "sun", gender: "boy" },
    { id: "sophie",name: "Sophie",emoji: "🦊", color: "tang", gender: "girl" },
    { id: "lucy",  name: "Lucy",  emoji: "🐧", color: "grape", gender: "girl" }
  ],

  // Lessons appear on the home screen in this order, grouped by section.
  //   status: "ready" (playable) or "soon" (shows as a locked tile)
  //   players: omit to show to everyone, or list ids e.g. ["jack"]
  //   color: grape | leaf | sun | sky | berry | tang
  // A tick shows on a tile once that kid has completed its quiz.
  // Subjects: after picking a name, kids choose a subject, then see its sections.
  // Basics quizzes give grapes. Concepts quizzes give grapes and a spin of the prize wheel.
  // A finished Basics quiz locks that lesson for this many days, so kids move on to harder ones.
  // A grown-up's 🎯 practise flag (or "Clear tick") opens it again.
  basicsLockDays: 2,
  subjects: [
    { id: "maths",   title: "Maths",   emoji: "🔢", color: "grape", sections: ["Basics", "Concepts", "Special"] },
    { id: "science", title: "Science", emoji: "🔬", color: "leaf",  sections: ["Basics", "Concepts", "Special"] },
    // English quizzes give 🔧 car parts for the Garage instead of grapes.
    { id: "english", title: "English", emoji: "📖", color: "tang",  sections: ["Basics", "Concepts", "Special"],
      notes: { Basics: "Quizzes give 🔧 5 car parts", Concepts: "Quizzes give 🔧 5 parts + a spin", Special: "Big lessons. 🔧 5 parts + a spin" } }
  ],
  // Topics inside the Basics folder, in the order they appear. Lessons inside a topic go easiest to hardest.
  topics: [
    { id: "numbers",   title: "Numbers",          emoji: "🔢", color: "grape" },
    { id: "adding",    title: "Adding",           emoji: "➕", color: "sky" },
    { id: "takeaway",  title: "Taking Away",      emoji: "➖", color: "berry" },
    { id: "times",     title: "Multiplication",   emoji: "✖️", color: "tang" },
    { id: "divide",    title: "Division",         emoji: "➗", color: "leaf" },
    { id: "fractions", title: "Fractions",        emoji: "🍕", color: "sun" },
    { id: "shapes",    title: "Shapes",           emoji: "🔷", color: "sky" },
    { id: "time",      title: "Time",             emoji: "⏰", color: "grape" },
    { id: "money",     title: "Money",            emoji: "💰", color: "leaf" },
    { id: "problems",  title: "Problem Solving",  emoji: "🧩", color: "berry" },
    // Science topics
    { id: "biology",   title: "Biology",          emoji: "🌿", color: "leaf" },
    { id: "chemistry", title: "Chemistry",        emoji: "🧪", color: "grape" },
    { id: "physics",   title: "Physics",          emoji: "⚡", color: "sun" },
    { id: "space",     title: "Earth and Space",  emoji: "🪐", color: "sky" },
    // English topics
    { id: "abc",       title: "Alphabet",         emoji: "🔤", color: "grape" },
    { id: "sounds",    title: "Sounds and Rhymes", emoji: "🎵", color: "berry" },
    { id: "words",     title: "Reading Words",    emoji: "👀", color: "sky" },
    { id: "spelling",  title: "Spelling",         emoji: "🧩", color: "leaf" },
    { id: "sentences", title: "Sentences",        emoji: "✏️", color: "tang" },
    { id: "stories",   title: "Stories",          emoji: "📚", color: "sun" }
  ],
  // Folders inside each subject. Special lessons usually list `players` so only that kid sees them.
  folders: {
    Basics:   { emoji: "🧮", color: "sky",   note: "Quizzes give 🍇 5 grapes" },
    Concepts: { emoji: "💡", color: "sun",   note: "Quizzes give 🍇 5 grapes + a spin" },
    Special:  { emoji: "🌟", color: "berry", note: "Big lessons. 🍇 5 grapes + a spin" }
  },
  lessons: [
    // ---- numbers ----
    { id: "counting", subject: "maths", section: "Basics", topic: "numbers", title: "Count the Grapes", emoji: "🔢", color: "grape", href: "lessons/basics.html?l=counting", status: "ready" },
    { id: "compare",  subject: "maths", section: "Basics", topic: "numbers", title: "More or Less",     emoji: "🐊", color: "leaf",  href: "lessons/basics.html?l=compare",  status: "ready" },
    { id: "beforeafter", subject: "maths", section: "Basics", topic: "numbers", title: "Before and After", emoji: "🚂", color: "berry", href: "lessons/basics.html?l=beforeafter", status: "ready" },
    { id: "skip",     subject: "maths", section: "Basics", topic: "numbers", title: "Count in 2s, 5s, 10s", emoji: "🦘", color: "leaf", href: "lessons/basics.html?l=skip",   status: "ready" },
    { id: "oddeven",  subject: "maths", section: "Basics", topic: "numbers", title: "Odd or Even",    emoji: "🧦", color: "sky",   href: "lessons/basics.html?l=oddeven",  status: "ready" },
    { id: "place",    subject: "maths", section: "Basics", topic: "numbers", title: "Tens and Ones",    emoji: "🧱", color: "sky",   href: "lessons/basics.html?l=place",    status: "ready" },
    { id: "round10", subject: "maths", section: "Basics", topic: "numbers", title: "Rounding to 10", emoji: "🎯", color: "sky", href: "lessons/basics.html?l=round10", status: "ready" },
    // ---- adding ----
    { id: "add10",    subject: "maths", section: "Basics", topic: "adding", title: "Adding Up",        emoji: "➕", color: "sky",   href: "lessons/basics.html?l=add10",    status: "ready" },
    { id: "bonds",    subject: "maths", section: "Basics", topic: "adding", title: "Make 10",          emoji: "🔟", color: "tang",  href: "lessons/basics.html?l=bonds",    status: "ready" },
    { id: "doubles",  subject: "maths", section: "Basics", topic: "adding", title: "Doubles and Halves", emoji: "👯", color: "grape", href: "lessons/basics.html?l=doubles", status: "ready" },
    { id: "add20",    subject: "maths", section: "Basics", topic: "adding", title: "Adding to 20",   emoji: "🔢", color: "grape", href: "lessons/basics.html?l=add20",    status: "ready" },
    { id: "addtens",  subject: "maths", section: "Basics", topic: "adding", title: "Adding Tens",    emoji: "🚀", color: "tang",  href: "lessons/basics.html?l=addtens",  status: "ready" },
    { id: "add3", subject: "maths", section: "Basics", topic: "adding", title: "Adding Three Numbers", emoji: "🧺", color: "leaf", href: "lessons/basics.html?l=add3", status: "ready" },
    { id: "add2digit", subject: "maths", section: "Basics", topic: "adding", title: "Adding Big Numbers", emoji: "🧮", color: "grape", href: "lessons/basics.html?l=add2digit", status: "ready" },
    { id: "addcarry", subject: "maths", section: "Basics", topic: "adding", title: "Adding with Carrying", emoji: "🎒", color: "tang", href: "lessons/basics.html?l=addcarry", status: "ready" },
    // ---- takeaway ----
    { id: "sub10",    subject: "maths", section: "Basics", topic: "takeaway", title: "Taking Away",      emoji: "➖", color: "berry", href: "lessons/basics.html?l=sub10",    status: "ready" },
    { id: "sub20",    subject: "maths", section: "Basics", topic: "takeaway", title: "Taking Away to 20", emoji: "🦖", color: "leaf", href: "lessons/basics.html?l=sub20", status: "ready" },
    { id: "subtens", subject: "maths", section: "Basics", topic: "takeaway", title: "Taking Away Tens", emoji: "🪜", color: "sky", href: "lessons/basics.html?l=subtens", status: "ready" },
    { id: "sub2digit", subject: "maths", section: "Basics", topic: "takeaway", title: "Taking Away Big Numbers", emoji: "🧮", color: "berry", href: "lessons/basics.html?l=sub2digit", status: "ready" },
    { id: "subborrow", subject: "maths", section: "Basics", topic: "takeaway", title: "Taking Away with Swapping", emoji: "🔁", color: "grape", href: "lessons/basics.html?l=subborrow", status: "ready" },
    // ---- times ----
    { id: "times",    subject: "maths", section: "Basics", topic: "times", title: "Times Tables",     emoji: "✖️", color: "berry", href: "lessons/basics.html?l=times",    status: "ready" },
    { id: "times34", subject: "maths", section: "Basics", topic: "times", title: "3 and 4 Times Tables", emoji: "🍀", color: "leaf", href: "lessons/basics.html?l=times34", status: "ready" },
    { id: "times69", subject: "maths", section: "Basics", topic: "times", title: "6, 7, 8, 9 Times Tables", emoji: "🕷️", color: "grape", href: "lessons/basics.html?l=times69", status: "ready" },
    { id: "timesmix", subject: "maths", section: "Basics", topic: "times", title: "Times Tables Challenge", emoji: "🏆", color: "tang", href: "lessons/basics.html?l=timesmix", status: "ready" },
    // ---- divide ----
    { id: "share",    subject: "maths", section: "Basics", topic: "divide", title: "Sharing Fairly",   emoji: "➗", color: "tang",  href: "lessons/basics.html?l=share",    status: "ready" },
    { id: "divfacts", subject: "maths", section: "Basics", topic: "divide", title: "Dividing by 2, 5, 10", emoji: "🍰", color: "sky", href: "lessons/basics.html?l=divfacts", status: "ready" },
    { id: "divtables", subject: "maths", section: "Basics", topic: "divide", title: "Dividing with All Tables", emoji: "🍕", color: "berry", href: "lessons/basics.html?l=divtables", status: "ready" },
    { id: "divrem", subject: "maths", section: "Basics", topic: "divide", title: "Leftovers (Remainders)", emoji: "🧁", color: "tang", href: "lessons/basics.html?l=divrem", status: "ready" },
    // ---- fractions ----
    { id: "fractions", subject: "maths", section: "Basics", topic: "fractions", title: "Halves and Quarters", emoji: "🍕", color: "berry", href: "lessons/basics.html?l=fractions", status: "ready" },
    { id: "fracof", subject: "maths", section: "Basics", topic: "fractions", title: "Fractions of Numbers", emoji: "🥧", color: "grape", href: "lessons/basics.html?l=fracof", status: "ready" },
    { id: "fracbigger", subject: "maths", section: "Basics", topic: "fractions", title: "Which Fraction is Bigger?", emoji: "⚖️", color: "leaf", href: "lessons/basics.html?l=fracbigger", status: "ready" },
    { id: "fracequiv", subject: "maths", section: "Basics", topic: "fractions", title: "Same Fractions", emoji: "🍫", color: "sky", href: "lessons/basics.html?l=fracequiv", status: "ready" },
    // ---- shapes ----
    { id: "shapes",   subject: "maths", section: "Basics", topic: "shapes", title: "Shapes",         emoji: "🔷", color: "sky",   href: "lessons/basics.html?l=shapes",   status: "ready" },
    { id: "shapes3d", subject: "maths", section: "Basics", topic: "shapes", title: "3D Shapes", emoji: "🧊", color: "berry", href: "lessons/basics.html?l=shapes3d", status: "ready" },
    { id: "symmetry", subject: "maths", section: "Basics", topic: "shapes", title: "Symmetry", emoji: "🦋", color: "grape", href: "lessons/basics.html?l=symmetry", status: "ready" },
    // ---- time ----
    { id: "clock",    subject: "maths", section: "Basics", topic: "time", title: "Telling the Time", emoji: "⏰", color: "grape", href: "lessons/basics.html?l=clock",  status: "ready" },
    { id: "clock5", subject: "maths", section: "Basics", topic: "time", title: "Time to 5 Minutes", emoji: "🕰️", color: "sky", href: "lessons/basics.html?l=clock5", status: "ready" },
    { id: "calendar", subject: "maths", section: "Basics", topic: "time", title: "Days and Months", emoji: "📅", color: "leaf", href: "lessons/basics.html?l=calendar", status: "ready" },
    { id: "duration", subject: "maths", section: "Basics", topic: "time", title: "How Long?", emoji: "⏳", color: "tang", href: "lessons/basics.html?l=duration", status: "ready" },
    // ---- money ----
    { id: "money",    subject: "maths", section: "Basics", topic: "money", title: "Counting Money", emoji: "💰", color: "leaf",  href: "lessons/basics.html?l=money",    status: "ready" },
    { id: "shopping", subject: "maths", section: "Basics", topic: "money", title: "Going Shopping", emoji: "🛒", color: "berry", href: "lessons/basics.html?l=shopping", status: "ready" },
    { id: "change", subject: "maths", section: "Basics", topic: "money", title: "Getting Change", emoji: "💵", color: "sun", href: "lessons/basics.html?l=change", status: "ready" },
    // ---- problems ----
    { id: "patterns", subject: "maths", section: "Basics", topic: "problems", title: "What Comes Next?", emoji: "🔁", color: "sky", href: "lessons/basics.html?l=patterns", status: "ready" },
    { id: "story",    subject: "maths", section: "Basics", topic: "problems", title: "Story Sums",     emoji: "📖", color: "tang",  href: "lessons/basics.html?l=story",    status: "ready" },
    { id: "story2", subject: "maths", section: "Basics", topic: "problems", title: "Two-Step Stories", emoji: "📚", color: "grape", href: "lessons/basics.html?l=story2", status: "ready" },
    // ---- science: biology ----
    { id: "living", subject: "science", section: "Basics", topic: "biology", title: "Living or Not Living?", emoji: "🌱", color: "leaf", href: "lessons/basics.html?l=living", status: "ready" },
    { id: "animalgroups", subject: "science", section: "Basics", topic: "biology", title: "Animal Groups", emoji: "🦁", color: "tang", href: "lessons/basics.html?l=animalgroups", status: "ready" },
    { id: "lifecycles", subject: "science", section: "Basics", topic: "biology", title: "Life Cycles", emoji: "🐸", color: "grape", href: "lessons/basics.html?l=lifecycles", status: "ready" },
    { id: "body", subject: "science", section: "Basics", topic: "biology", title: "My Body", emoji: "🫀", color: "berry", href: "lessons/basics.html?l=body", status: "ready" },
    { id: "foodchains", subject: "science", section: "Basics", topic: "biology", title: "Food Chains", emoji: "🦊", color: "sky", href: "lessons/basics.html?l=foodchains", status: "ready" },
    // ---- science: chemistry ----
    { id: "states", subject: "science", section: "Basics", topic: "chemistry", title: "Solid, Liquid or Gas?", emoji: "🧊", color: "sky", href: "lessons/basics.html?l=states", status: "ready" },
    { id: "melting", subject: "science", section: "Basics", topic: "chemistry", title: "Melting and Freezing", emoji: "🌡️", color: "berry", href: "lessons/basics.html?l=melting", status: "ready" },
    { id: "colours", subject: "science", section: "Basics", topic: "chemistry", title: "Mixing Colours", emoji: "🎨", color: "tang", href: "lessons/basics.html?l=colours", status: "ready" },
    { id: "dissolving", subject: "science", section: "Basics", topic: "chemistry", title: "Dissolve or Not?", emoji: "🥄", color: "grape", href: "lessons/basics.html?l=dissolving", status: "ready" },
    // ---- science: physics ----
    { id: "pushpull", subject: "science", section: "Basics", topic: "physics", title: "Push or Pull?", emoji: "👐", color: "sky", href: "lessons/basics.html?l=pushpull", status: "ready" },
    { id: "floatsink", subject: "science", section: "Basics", topic: "physics", title: "Float or Sink?", emoji: "🛁", color: "grape", href: "lessons/basics.html?l=floatsink", status: "ready" },
    { id: "magnets", subject: "science", section: "Basics", topic: "physics", title: "Magnets", emoji: "🧲", color: "berry", href: "lessons/basics.html?l=magnets", status: "ready" },
    { id: "shadows", subject: "science", section: "Basics", topic: "physics", title: "Light and Shadows", emoji: "🔦", color: "sun", href: "lessons/basics.html?l=shadows", status: "ready" },
    { id: "circuits", subject: "science", section: "Basics", topic: "physics", title: "Electric Circuits", emoji: "💡", color: "leaf", href: "lessons/basics.html?l=circuits", status: "ready" },
    // ---- science: space ----
    { id: "daynight", subject: "science", section: "Basics", topic: "space", title: "Day and Night", emoji: "🌗", color: "grape", href: "lessons/basics.html?l=daynight", status: "ready" },
    { id: "planets", subject: "science", section: "Basics", topic: "space", title: "The Planets", emoji: "🪐", color: "sky", href: "lessons/basics.html?l=planets", status: "ready" },
    // ---- English (english.js). Quizzes give 🔧 car parts. ----
    { id: "abc-am", subject: "english", section: "Basics", topic: "abc", title: "Letters A to M", emoji: "🅰️", color: "grape", href: "lessons/basics.html?l=abc-am", status: "ready" },
    { id: "abc-nz", subject: "english", section: "Basics", topic: "abc", title: "Letters N to Z", emoji: "🔤", color: "sky", href: "lessons/basics.html?l=abc-nz", status: "ready" },
    { id: "abc-trace", subject: "english", section: "Basics", topic: "abc", title: "Trace the Letters", emoji: "✍️", color: "leaf", href: "lessons/basics.html?l=abc-trace", status: "ready" },
    { id: "abc-bigsmall", subject: "english", section: "Basics", topic: "abc", title: "Big and Small", emoji: "🔠", color: "tang", href: "lessons/basics.html?l=abc-bigsmall", status: "ready" },
    { id: "abc-small", subject: "english", section: "Basics", topic: "abc", title: "Small Letters", emoji: "🔡", color: "berry", href: "lessons/basics.html?l=abc-small", status: "ready" },
    { id: "abc-order", subject: "english", section: "Basics", topic: "abc", title: "ABC Order", emoji: "🚂", color: "sun", href: "lessons/basics.html?l=abc-order", status: "ready" },
    { id: "first-letter", subject: "english", section: "Basics", topic: "sounds", title: "First Letter", emoji: "🐍", color: "leaf", href: "lessons/basics.html?l=first-letter", status: "ready" },
    { id: "rhyme", subject: "english", section: "Basics", topic: "sounds", title: "Rhyme Time", emoji: "🎵", color: "berry", href: "lessons/basics.html?l=rhyme", status: "ready" },
    { id: "blends", subject: "english", section: "Basics", topic: "sounds", title: "sh, ch, th...", emoji: "🐑", color: "sky", href: "lessons/basics.html?l=blends", status: "ready" },
    { id: "cvc", subject: "english", section: "Basics", topic: "words", title: "Picture Words", emoji: "🐱", color: "tang", href: "lessons/basics.html?l=cvc", status: "ready" },
    { id: "sight1", subject: "english", section: "Basics", topic: "words", title: "Sight Words 1", emoji: "👀", color: "grape", href: "lessons/basics.html?l=sight1", status: "ready" },
    { id: "families", subject: "english", section: "Basics", topic: "words", title: "Word Families", emoji: "👨‍👩‍👧", color: "leaf", href: "lessons/basics.html?l=families", status: "ready" },
    { id: "sight2", subject: "english", section: "Basics", topic: "words", title: "Sight Words 2", emoji: "🧐", color: "berry", href: "lessons/basics.html?l=sight2", status: "ready" },
    { id: "spell-cvc", subject: "english", section: "Basics", topic: "spelling", title: "Spell It", emoji: "🧩", color: "sky", href: "lessons/basics.html?l=spell-cvc", status: "ready" },
    { id: "spell-bee", subject: "english", section: "Basics", topic: "spelling", title: "Spelling Bee", emoji: "🐝", color: "sun", href: "lessons/basics.html?l=spell-bee", status: "ready" },
    { id: "missing", subject: "english", section: "Basics", topic: "sentences", title: "Missing Word", emoji: "🕳️", color: "grape", href: "lessons/basics.html?l=missing", status: "ready" },
    { id: "capitals", subject: "english", section: "Basics", topic: "sentences", title: "Capitals and Full Stops", emoji: "✏️", color: "tang", href: "lessons/basics.html?l=capitals", status: "ready" },
    { id: "plurals", subject: "english", section: "Basics", topic: "sentences", title: "More Than One", emoji: "🐑", color: "leaf", href: "lessons/basics.html?l=plurals", status: "ready" },
    { id: "past", subject: "english", section: "Basics", topic: "sentences", title: "Yesterday", emoji: "⏪", color: "sky", href: "lessons/basics.html?l=past", status: "ready" },
    { id: "opposites", subject: "english", section: "Basics", topic: "sentences", title: "Opposites", emoji: "↔️", color: "berry", href: "lessons/basics.html?l=opposites", status: "ready" },
    { id: "wordtypes", subject: "english", section: "Basics", topic: "sentences", title: "Word Types", emoji: "🏷️", color: "sun", href: "lessons/basics.html?l=wordtypes", status: "ready" },
    { id: "riddles", subject: "english", section: "Basics", topic: "stories", title: "Riddles", emoji: "🤔", color: "grape", href: "lessons/basics.html?l=riddles", status: "ready" },
    { id: "stories", subject: "english", section: "Basics", topic: "stories", title: "Story Time", emoji: "📚", color: "tang", href: "lessons/basics.html?l=stories", status: "ready" },
    { id: "make-sentence", subject: "english", section: "Concepts", title: "Make a Sentence", emoji: "🧱", color: "sky", href: "lessons/basics.html?l=make-sentence", status: "ready" },
    { id: "detective", subject: "english", section: "Concepts", title: "Reading Detective", emoji: "🔎", color: "grape", href: "lessons/basics.html?l=detective", status: "ready" },
    { id: "jack-abc", subject: "english", section: "Special", players: ["jack"], title: "Jack's ABC Adventure", say: "Jack's A B C adventure!", emoji: "🦖", color: "leaf", href: "lessons/basics.html?l=jack-abc", status: "ready" },
    { id: "alice-reading", subject: "english", section: "Special", players: ["alice"], title: "Alice's Reading Challenge", emoji: "🦄", color: "berry", href: "lessons/basics.html?l=alice-reading", status: "ready" },
    { id: "n1000", subject: "maths", section: "Special", players: ["alice"], title: "Numbers to 1000", say: "Numbers to one thousand!", emoji: "🏰", color: "grape", href: "lessons/basics.html?l=n1000", status: "ready" },
    { id: "prime-grapes", subject: "maths", section: "Concepts", title: "Prime Grapes", say: "Prime grapes! Can you make a rectangle?", emoji: "🍇", color: "grape", href: "lessons/prime-grapes.html", status: "ready" }
  ]
};
