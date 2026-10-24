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
  // Example: { id: "sam", name: "Sam", emoji: "🦁", color: "sun" },
  players: [
    { id: "jack",  name: "Jack",  emoji: "🦖", color: "leaf"  },
    { id: "alice", name: "Alice", emoji: "🦄", color: "berry" },
    { id: "ella",  name: "Ella",  emoji: "🐬", color: "sky"   },
    { id: "will",  name: "Will",  emoji: "🦁", color: "sun"   },
    { id: "sophie",name: "Sophie",emoji: "🦊", color: "tang"  },
    { id: "lucy",  name: "Lucy",  emoji: "🐧", color: "grape" }
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
  // Folders inside each subject. Special lessons usually list `players` so only that kid sees them.
  folders: {
    Basics:   { emoji: "🧮", color: "sky",   note: "Quizzes give 🍇 5 grapes" },
    Concepts: { emoji: "💡", color: "sun",   note: "Quizzes give 🍇 5 grapes + a spin" },
    Special:  { emoji: "🌟", color: "berry", note: "Big lessons. 🍇 5 grapes + a spin" }
  },
  lessons: [
    { id: "counting", subject: "maths", section: "Basics", title: "Count the Grapes", emoji: "🔢", color: "grape", href: "lessons/basics.html?l=counting", status: "ready" },
    { id: "compare",  subject: "maths", section: "Basics", title: "More or Less",     emoji: "🐊", color: "leaf",  href: "lessons/basics.html?l=compare",  status: "ready" },
    { id: "add10",    subject: "maths", section: "Basics", title: "Adding Up",        emoji: "➕", color: "sky",   href: "lessons/basics.html?l=add10",    status: "ready" },
    { id: "sub10",    subject: "maths", section: "Basics", title: "Taking Away",      emoji: "➖", color: "berry", href: "lessons/basics.html?l=sub10",    status: "ready" },
    { id: "bonds",    subject: "maths", section: "Basics", title: "Make 10",          emoji: "🔟", color: "tang",  href: "lessons/basics.html?l=bonds",    status: "ready" },
    { id: "doubles",  subject: "maths", section: "Basics", title: "Doubles and Halves", emoji: "👯", color: "grape", href: "lessons/basics.html?l=doubles", status: "ready" },
    { id: "skip",     subject: "maths", section: "Basics", title: "Count in 2s, 5s, 10s", emoji: "🦘", color: "leaf", href: "lessons/basics.html?l=skip",   status: "ready" },
    { id: "place",    subject: "maths", section: "Basics", title: "Tens and Ones",    emoji: "🧱", color: "sky",   href: "lessons/basics.html?l=place",    status: "ready" },
    { id: "times",    subject: "maths", section: "Basics", title: "Times Tables",     emoji: "✖️", color: "berry", href: "lessons/basics.html?l=times",    status: "ready" },
    { id: "share",    subject: "maths", section: "Basics", title: "Sharing Fairly",   emoji: "➗", color: "tang",  href: "lessons/basics.html?l=share",    status: "ready" },
    { id: "add20",    subject: "maths", section: "Basics", title: "Adding to 20",   emoji: "🔢", color: "grape", href: "lessons/basics.html?l=add20",    status: "ready" },
    { id: "sub20",    subject: "maths", section: "Basics", title: "Taking Away to 20", emoji: "🦖", color: "leaf", href: "lessons/basics.html?l=sub20", status: "ready" },
    { id: "oddeven",  subject: "maths", section: "Basics", title: "Odd or Even",    emoji: "🧦", color: "sky",   href: "lessons/basics.html?l=oddeven",  status: "ready" },
    { id: "beforeafter", subject: "maths", section: "Basics", title: "Before and After", emoji: "🚂", color: "berry", href: "lessons/basics.html?l=beforeafter", status: "ready" },
    { id: "addtens",  subject: "maths", section: "Basics", title: "Adding Tens",    emoji: "🚀", color: "tang",  href: "lessons/basics.html?l=addtens",  status: "ready" },
    { id: "clock",    subject: "maths", section: "Basics", title: "Telling the Time", emoji: "⏰", color: "grape", href: "lessons/basics.html?l=clock",  status: "ready" },
    { id: "money",    subject: "maths", section: "Basics", title: "Counting Money", emoji: "💰", color: "leaf",  href: "lessons/basics.html?l=money",    status: "ready" },
    { id: "shapes",   subject: "maths", section: "Basics", title: "Shapes",         emoji: "🔷", color: "sky",   href: "lessons/basics.html?l=shapes",   status: "ready" },
    { id: "fractions", subject: "maths", section: "Basics", title: "Halves and Quarters", emoji: "🍕", color: "berry", href: "lessons/basics.html?l=fractions", status: "ready" },
    { id: "story",    subject: "maths", section: "Basics", title: "Story Sums",     emoji: "📖", color: "tang",  href: "lessons/basics.html?l=story",    status: "ready" },
    { id: "n1000", subject: "maths", section: "Special", players: ["alice"], title: "Numbers to 1000", say: "Numbers to one thousand!", emoji: "🏰", color: "grape", href: "lessons/basics.html?l=n1000", status: "ready" },
    { id: "prime-grapes", subject: "maths", section: "Concepts", title: "Prime Grapes", say: "Prime grapes! Can you make a rectangle?", emoji: "🍇", color: "grape", href: "lessons/prime-grapes.html", status: "ready" }
  ]
};
