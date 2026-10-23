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

  // Lessons appear on the home screen in this order.
  //   status: "ready" (playable) or "soon" (shows as a locked tile)
  //   players: omit to show to everyone, or list ids e.g. ["jack"]
  //   color: grape | leaf | sun | sky | berry | tang
  lessons: [
    {
      id: "prime-grapes",
      title: "Prime Grapes",
      say: "Prime grapes! Can you make a rectangle?",
      emoji: "🍇",
      color: "grape",
      href: "lessons/prime-grapes.html",
      status: "ready"
    }
  ]
};
