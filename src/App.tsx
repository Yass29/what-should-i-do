const activities = {
  5: [
    "Review 5 Security+ flashcards",
    "Read one cybersecurity article",
    "Write one small coding function",
    "Brainstorm one app idea",
  ],

  15: [
    "Complete a short Security+ quiz",
    "Practice coding for 15 minutes",
    "Test something with Arduino",
    "Improve one section of your CV",
  ],

  30: [
    "Complete a TryHackMe room section",
    "Build a small React component",
    "Work on an Arduino mini project",
    "Apply to one job",
  ],

  60: [
    "Build a mini coding project",
    "Complete a full Security+ study session",
    "Create an Arduino prototype",
    "Work on a project that could eventually make money",
  ],
}

function App() {
  return (
    <div>
      <h1>What Should I Do?</h1>

      <p>Choose how much free time you have.</p>

      <div>
        <button>5 min</button>
        <button>15 min</button>
        <button>30 min</button>
        <button>60 min</button>
      </div>
    </div>
  )
}

export default App