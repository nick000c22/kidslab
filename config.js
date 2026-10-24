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
    { id: "maths",   title: "Maths",   emoji: "🔢", color: "grape", sections: ["Basics", "Concepts"] },
    { id: "science", title: "Science", emoji: "🔬", color: "leaf",  sections: ["Basics", "Concepts"] }
  ],
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
    { id: "prime-grapes", subject: "maths", section: "Concepts", title: "Prime Grapes", say: "Prime grapes! Can you make a rectangle?", emoji: "🍇", color: "grape", href: "lessons/prime-grapes.html", status: "ready" }
  ]
};
