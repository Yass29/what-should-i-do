import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Duration = 5 | 15 | 30 | 60
type Category = 'Surprise me' | 'Cybersecurity' | 'Coding' | 'Arduino' | 'Career' | 'Money'

type Activity = {
  title: string
  category: Exclude<Category, 'Surprise me'>
  description: string
  emoji: string
}

type HistoryItem = {
  title: string
  category: string
  duration: Duration
  completedAt: string
}

const durations: Duration[] = [5, 15, 30, 60]
const categories: Category[] = ['Surprise me', 'Cybersecurity', 'Coding', 'Arduino', 'Career', 'Money']

const activities: Record<Duration, Activity[]> = {
  5: [
    { title: 'Review 5 Security+ flashcards', category: 'Cybersecurity', description: 'Pick five concepts you keep forgetting and review them quickly.', emoji: '🛡️' },
    { title: 'Write one tiny coding function', category: 'Coding', description: 'Solve one small problem: format a string, filter an array, or validate input.', emoji: '💻' },
    { title: 'Sketch one Arduino idea', category: 'Arduino', description: 'Write a tiny input → output idea you could build later.', emoji: '🔌' },
    { title: 'Improve one line of your CV', category: 'Career', description: 'Rewrite one bullet so it shows impact, tools used, and a clear result.', emoji: '🎯' },
    { title: 'Write one money-making idea', category: 'Money', description: 'Note one small problem people might pay to solve.', emoji: '💸' },
  ],
  15: [
    { title: 'Do a 10-question Security+ quiz', category: 'Cybersecurity', description: 'Answer quickly, then review only the questions you missed.', emoji: '🛡️' },
    { title: 'Build one React component', category: 'Coding', description: 'Create a reusable button, card, timer, modal, or progress bar.', emoji: '⚛️' },
    { title: 'Test one Arduino sensor or output', category: 'Arduino', description: 'Make one thing work: LED, buzzer, button, distance sensor, or display.', emoji: '🔌' },
    { title: 'Find and save one strong job posting', category: 'Career', description: 'Save it and note the top five keywords you should mirror in your CV.', emoji: '💼' },
    { title: 'Research one small money-making idea', category: 'Money', description: 'Find one problem people already pay to solve and note a simple offer.', emoji: '💸' },
  ],
  30: [
    { title: 'Complete part of a TryHackMe room', category: 'Cybersecurity', description: 'Choose one focused section and take short notes while you complete it.', emoji: '🧪' },
    { title: 'Build a mini feature for this app', category: 'Coding', description: 'Add a useful feature and make it work end to end.', emoji: '🚀' },
    { title: 'Prototype an Arduino mini project', category: 'Arduino', description: 'Connect two parts together and make a small interaction actually work.', emoji: '🤖' },
    { title: 'Tailor your CV to one job', category: 'Career', description: 'Match the language of the posting and strengthen the most relevant bullets.', emoji: '📄' },
    { title: 'Validate one project idea', category: 'Money', description: 'Search competitors, pricing, and whether people are actively asking for it.', emoji: '📈' },
  ],
  60: [
    { title: 'Do a focused Security+ study sprint', category: 'Cybersecurity', description: 'Study one domain, quiz yourself, and finish by writing a five-line summary.', emoji: '🔐' },
    { title: 'Build and ship a tiny web app', category: 'Coding', description: 'Pick one tiny idea, build the core feature, and get it working end to end.', emoji: '🧑‍💻' },
    { title: 'Create an Arduino prototype', category: 'Arduino', description: 'Build something complete enough to demo, even if it is still rough.', emoji: '🛠️' },
    { title: 'Apply to two well-matched jobs', category: 'Career', description: 'Tailor your CV, write concise messages, and track where you applied.', emoji: '🚀' },
    { title: 'Build a first version of something sellable', category: 'Money', description: 'Create a simple template, tool, service page, or digital product someone could pay for.', emoji: '💰' },
  ],
}

const todayKey = () => new Date().toISOString().slice(0, 10)

function App() {
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('Surprise me')
  const [activity, setActivity] = useState<Activity | null>(null)
  const [xp, setXp] = useState(() => Number(localStorage.getItem('wsid-xp') ?? 0))
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('wsid-streak') ?? 0))
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('wsid-history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('wsid-xp', String(xp))
  }, [xp])

  useEffect(() => {
    localStorage.setItem('wsid-streak', String(streak))
  }, [streak])

  useEffect(() => {
    localStorage.setItem('wsid-history', JSON.stringify(history))
  }, [history])

  const level = Math.floor(xp / 100) + 1
  const levelProgress = xp % 100

  const currentOptions = useMemo(() => {
    if (!selectedDuration) return []
    const options = activities[selectedDuration]
    return selectedCategory === 'Surprise me'
      ? options
      : options.filter((item) => item.category === selectedCategory)
  }, [selectedDuration, selectedCategory])

  const pickActivity = (duration: Duration, category = selectedCategory) => {
    const base = activities[duration]
    const options = category === 'Surprise me'
      ? base
      : base.filter((item) => item.category === category)

    if (!options.length) return

    let next = options[Math.floor(Math.random() * options.length)]

    if (activity && options.length > 1) {
      while (next.title === activity.title) {
        next = options[Math.floor(Math.random() * options.length)]
      }
    }

    setSelectedDuration(duration)
    setActivity(next)
  }

  const chooseCategory = (category: Category) => {
    setSelectedCategory(category)
    if (selectedDuration) pickActivity(selectedDuration, category)
  }

  const markDone = () => {
    if (!activity || !selectedDuration) return

    const earned = selectedDuration
    setXp((current) => current + earned)

    const today = todayKey()
    const last = localStorage.getItem('wsid-last-completed')

    if (last !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)

      setStreak((current) => (last === yesterdayKey ? current + 1 : 1))
      localStorage.setItem('wsid-last-completed', today)
    }

    const completed: HistoryItem = {
      title: activity.title,
      category: activity.category,
      duration: selectedDuration,
      completedAt: new Date().toISOString(),
    }

    setHistory((current) => [completed, ...current].slice(0, 6))
    pickActivity(selectedDuration)
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="topbar">
          <div className="eyebrow">Turn spare time into progress</div>

          <div className="stats">
            <div className="stat-chip"><span>🔥</span><strong>{streak}</strong> day streak</div>
            <div className="stat-chip"><span>⚡</span><strong>{xp}</strong> XP</div>
          </div>
        </div>

        <h1>What Should I Do?</h1>
        <p className="subtitle">
          Tell me how much time you have. I’ll give you one productive thing to do right now.
        </p>

        <div className="level-card">
          <div className="level-copy">
            <span>Level {level}</span>
            <span>{levelProgress}/100 XP</span>
          </div>
          <div className="progress-track" aria-label="Level progress">
            <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="section-label">How much time do you have?</div>
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

        <div className="section-label category-heading">What do you feel like doing?</div>
        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'category-button active' : 'category-button'}
              onClick={() => chooseCategory(category)}
            >
              {category}
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

            <div className="action-row">
              <button className="done-button" onClick={markDone}>
                ✓ Done <span>+{selectedDuration} XP</span>
              </button>
              <button
                className="another-button"
                onClick={() => selectedDuration && pickActivity(selectedDuration)}
              >
                Another one <span aria-hidden="true">↻</span>
              </button>
            </div>
          </article>
        )}

        {history.length > 0 && (
          <section className="history-panel">
            <div className="history-header">
              <div>
                <span className="section-label">Recent wins</span>
                <h3>Your completed missions</h3>
              </div>
              <button className="clear-history" onClick={() => setHistory([])}>Clear</button>
            </div>

            <div className="history-list">
              {history.map((item, index) => (
                <div className="history-item" key={`${item.completedAt}-${index}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                  </div>
                  <span className="history-xp">+{item.duration} XP</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      <footer>
        <span>Small time. Real progress.</span>
        <span>V2</span>
      </footer>
    </main>
  )
}

export default App
