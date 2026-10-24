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
  subjects: [
    { id: "maths",   title: "Maths",   emoji: "🔢", color: "grape", sections: ["Basics", "Concepts", "Special"] },
    { id: "science", title: "Science", emoji: "🔬", color: "leaf",  sections: ["Basics", "Concepts", "Special"] }
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
    { id: "problems",  title: "Problem Solving",  emoji: "🧩", color: "berry" }
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
    { id: "n1000", subject: "maths", section: "Special", players: ["alice"], title: "Numbers to 1000", say: "Numbers to one thousand!", emoji: "🏰", color: "grape", href: "lessons/basics.html?l=n1000", status: "ready" },
    { id: "prime-grapes", subject: "maths", section: "Concepts", title: "Prime Grapes", say: "Prime grapes! Can you make a rectangle?", emoji: "🍇", color: "grape", href: "lessons/prime-grapes.html", status: "ready" }
  ]
};
