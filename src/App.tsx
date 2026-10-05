import { useState } from 'react'
import './App.css'

type Duration = 5 | 15 | 30 | 60

type Activity = {
  title: string
  category: string
  description: string
  emoji: string
}

const activities: Record<Duration, Activity[]> = {
  5: [
    {
      title: 'Review 5 Security+ flashcards',
      category: 'Cybersecurity',
      description: 'Pick five concepts you keep forgetting and review them quickly.',
      emoji: '🛡️',
    },
    {
      title: 'Write one tiny coding function',
      category: 'Coding',
      description: 'Solve one small problem: format a string, filter an array, or validate input.',
      emoji: '💻',
    },
    {
      title: 'Brainstorm one useful app idea',
      category: 'Project',
      description: 'Write the problem, who has it, and the smallest possible solution.',
      emoji: '💡',
    },
    {
      title: 'Improve one line of your CV',
      category: 'Career',
      description: 'Rewrite one bullet so it shows impact, tools used, and a clear result.',
      emoji: '🎯',
    },
    {
      title: 'Learn one new terminal command',
      category: 'Learning',
      description: 'Pick one command, test it, and write one example you can remember.',
      emoji: '⌨️',
    },
  ],
  15: [
    {
      title: 'Do a 10-question Security+ quiz',
      category: 'Cybersecurity',
      description: 'Answer quickly, then review only the questions you missed.',
      emoji: '🛡️',
    },
    {
      title: 'Build one React component',
      category: 'Coding',
      description: 'Create a reusable button, card, timer, modal, or progress bar.',
      emoji: '⚛️',
    },
    {
      title: 'Test one Arduino sensor or output',
      category: 'Arduino',
      description: 'Make one thing work: LED, buzzer, button, distance sensor, or display.',
      emoji: '🔌',
    },
    {
      title: 'Find and save one strong job posting',
      category: 'Career',
      description: 'Save it and note the top five keywords you should mirror in your CV.',
      emoji: '💼',
    },
    {
      title: 'Research one small money-making idea',
      category: 'Money',
      description: 'Find one problem people already pay to solve and note a simple offer.',
      emoji: '💸',
    },
  ],
  30: [
    {
      title: 'Complete part of a TryHackMe room',
      category: 'Cybersecurity',
      description: 'Choose one focused section and take short notes while you complete it.',
      emoji: '🧪',
    },
    {
      title: 'Build a mini feature for this app',
      category: 'Coding',
      description: 'Add a category filter, favorites, history, streaks, or local storage.',
      emoji: '🚀',
    },
    {
      title: 'Prototype an Arduino mini project',
      category: 'Arduino',
      description: 'Connect two parts together and make a small interaction actually work.',
      emoji: '🤖',
    },
    {
      title: 'Tailor your CV to one job',
      category: 'Career',
      description: 'Match the language of the posting and strengthen the most relevant bullets.',
      emoji: '📄',
    },
    {
      title: 'Validate one project idea',
      category: 'Money',
      description: 'Search competitors, pricing, and whether people are actively asking for it.',
      emoji: '📈',
    },
  ],
  60: [
    {
      title: 'Do a focused Security+ study sprint',
      category: 'Cybersecurity',
      description: 'Study one domain, quiz yourself, and finish by writing a five-line summary.',
      emoji: '🔐',
    },
    {
      title: 'Build and ship a tiny web app',
      category: 'Coding',
      description: 'Pick one tiny idea, build the core feature, and get it working end to end.',
      emoji: '🧑‍💻',
    },
    {
      title: 'Create an Arduino prototype',
      category: 'Arduino',
      description: 'Build something complete enough to demo, even if it is still rough.',
      emoji: '🛠️',
    },
    {
      title: 'Apply to two well-matched jobs',
      category: 'Career',
      description: 'Tailor your CV, write concise messages, and track where you applied.',
      emoji: '🚀',
    },
    {
      title: 'Build a first version of something sellable',
      category: 'Money',
      description: 'Create a simple template, tool, service page, or digital product someone could pay for.',
      emoji: '💰',
    },
  ],
}

const durations: Duration[] = [5, 15, 30, 60]

function App() {
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)

  const pickActivity = (duration: Duration) => {
    const options = activities[duration]
    let next = options[Math.floor(Math.random() * options.length)]

    if (activity && selectedDuration === duration && options.length > 1) {
      while (next.title === activity.title) {
        next = options[Math.floor(Math.random() * options.length)]
      }
    }

    setSelectedDuration(duration)
    setActivity(next)
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="eyebrow">Turn spare time into progress</div>
        <h1>What Should I Do?</h1>
        <p className="subtitle">
          Tell me how much time you have. I’ll give you one productive thing to do right now.
        </p>

        <div className="duration-grid" aria-label="Choose how much free time you have">
          {durations.map((duration) => (
            <button
              key={duration}
              className={selectedDuration === duration ? 'duration-button active' : 'duration-button'}
              onClick={() => pickActivity(duration)}
            >
              <span className="duration-number">{duration}</span>
              <span className="duration-label">min</span>
            </button>
          ))}
        </div>

        {!activity ? (
          <div className="empty-state">
            <span className="empty-icon">↗</span>
            <p>Pick a time above to get your first mission.</p>
          </div>
        ) : (
          <article className="activity-card">
            <div className="activity-topline">
              <span className="activity-emoji" aria-hidden="true">{activity.emoji}</span>
              <span className="category-pill">{activity.category}</span>
              <span className="time-pill">{selectedDuration} min</span>
            </div>

            <h2>{activity.title}</h2>
            <p>{activity.description}</p>

            <button
              className="another-button"
              onClick={() => selectedDuration && pickActivity(selectedDuration)}
            >
              Give me another one
              <span aria-hidden="true">↻</span>
            </button>
          </article>
        )}
      </section>

      <footer>
        <span>Small time. Real progress.</span>
        <span>V1</span>
      </footer>
    </main>
  )
}

export default App
