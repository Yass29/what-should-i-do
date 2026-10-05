import { FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type Duration = 5 | 15 | 30 | 60
type Category = 'Surprise me' | 'Cybersecurity' | 'Coding' | 'Arduino' | 'Career' | 'Money'
type RealCategory = Exclude<Category, 'Surprise me'>

type Activity = {
  id: string
  title: string
  category: RealCategory
  description: string
  emoji: string
  custom?: boolean
}

type HistoryItem = {
  title: string
  category: string
  duration: Duration
  completedAt: string
}

const durations: Duration[] = [5, 15, 30, 60]
const categories: Category[] = ['Surprise me', 'Cybersecurity', 'Coding', 'Arduino', 'Career', 'Money']
const realCategories: RealCategory[] = ['Cybersecurity', 'Coding', 'Arduino', 'Career', 'Money']

const baseActivities: Record<Duration, Activity[]> = {
  5: [
    { id: '5-cyber-1', title: 'Review 5 Security+ flashcards', category: 'Cybersecurity', description: 'Pick five concepts you keep forgetting and review them quickly.', emoji: '🛡️' },
    { id: '5-code-1', title: 'Write one tiny coding function', category: 'Coding', description: 'Solve one small problem: format a string, filter an array, or validate input.', emoji: '💻' },
    { id: '5-arduino-1', title: 'Sketch one Arduino idea', category: 'Arduino', description: 'Write a tiny input → output idea you could build later.', emoji: '🔌' },
    { id: '5-career-1', title: 'Improve one line of your CV', category: 'Career', description: 'Rewrite one bullet so it shows impact, tools used, and a clear result.', emoji: '🎯' },
    { id: '5-money-1', title: 'Write one money-making idea', category: 'Money', description: 'Note one small problem people might pay to solve.', emoji: '💸' },
  ],
  15: [
    { id: '15-cyber-1', title: 'Do a 10-question Security+ quiz', category: 'Cybersecurity', description: 'Answer quickly, then review only the questions you missed.', emoji: '🛡️' },
    { id: '15-code-1', title: 'Build one React component', category: 'Coding', description: 'Create a reusable button, card, timer, modal, or progress bar.', emoji: '⚛️' },
    { id: '15-arduino-1', title: 'Test one Arduino sensor or output', category: 'Arduino', description: 'Make one thing work: LED, buzzer, button, distance sensor, or display.', emoji: '🔌' },
    { id: '15-career-1', title: 'Find and save one strong job posting', category: 'Career', description: 'Save it and note the top five keywords you should mirror in your CV.', emoji: '💼' },
    { id: '15-money-1', title: 'Research one small money-making idea', category: 'Money', description: 'Find one problem people already pay to solve and note a simple offer.', emoji: '💸' },
  ],
  30: [
    { id: '30-cyber-1', title: 'Complete part of a TryHackMe room', category: 'Cybersecurity', description: 'Choose one focused section and take short notes while you complete it.', emoji: '🧪' },
    { id: '30-code-1', title: 'Build a mini feature for this app', category: 'Coding', description: 'Add a useful feature and make it work end to end.', emoji: '🚀' },
    { id: '30-arduino-1', title: 'Prototype an Arduino mini project', category: 'Arduino', description: 'Connect two parts together and make a small interaction actually work.', emoji: '🤖' },
    { id: '30-career-1', title: 'Tailor your CV to one job', category: 'Career', description: 'Match the language of the posting and strengthen the most relevant bullets.', emoji: '📄' },
    { id: '30-money-1', title: 'Validate one project idea', category: 'Money', description: 'Search competitors, pricing, and whether people are actively asking for it.', emoji: '📈' },
  ],
  60: [
    { id: '60-cyber-1', title: 'Do a focused Security+ study sprint', category: 'Cybersecurity', description: 'Study one domain, quiz yourself, and finish by writing a five-line summary.', emoji: '🔐' },
    { id: '60-code-1', title: 'Build and ship a tiny web app', category: 'Coding', description: 'Pick one tiny idea, build the core feature, and get it working end to end.', emoji: '🧑‍💻' },
    { id: '60-arduino-1', title: 'Create an Arduino prototype', category: 'Arduino', description: 'Build something complete enough to demo, even if it is still rough.', emoji: '🛠️' },
    { id: '60-career-1', title: 'Apply to two well-matched jobs', category: 'Career', description: 'Tailor your CV, write concise messages, and track where you applied.', emoji: '🚀' },
    { id: '60-money-1', title: 'Build a first version of something sellable', category: 'Money', description: 'Create a simple template, tool, service page, or digital product someone could pay for.', emoji: '💰' },
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
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('wsid-favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [customActivities, setCustomActivities] = useState<Record<Duration, Activity[]>>(() => {
    const saved = localStorage.getItem('wsid-custom-activities')
    return saved ? JSON.parse(saved) : { 5: [], 15: [], 30: [], 60: [] }
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [customDuration, setCustomDuration] = useState<Duration>(15)
  const [customCategory, setCustomCategory] = useState<RealCategory>('Coding')

  useEffect(() => localStorage.setItem('wsid-xp', String(xp)), [xp])
  useEffect(() => localStorage.setItem('wsid-streak', String(streak)), [streak])
  useEffect(() => localStorage.setItem('wsid-history', JSON.stringify(history)), [history])
  useEffect(() => localStorage.setItem('wsid-favorites', JSON.stringify(favorites)), [favorites])
  useEffect(() => localStorage.setItem('wsid-custom-activities', JSON.stringify(customActivities)), [customActivities])

  const level = Math.floor(xp / 100) + 1
  const levelProgress = xp % 100

  const allActivities = useMemo(() => {
    return {
      5: [...baseActivities[5], ...customActivities[5]],
      15: [...baseActivities[15], ...customActivities[15]],
      30: [...baseActivities[30], ...customActivities[30]],
      60: [...baseActivities[60], ...customActivities[60]],
    } satisfies Record<Duration, Activity[]>
  }, [customActivities])

  const stats = useMemo(() => {
    const completed = history.length
    const minutes = history.reduce((sum, item) => sum + item.duration, 0)
    const counts = realCategories.map((category) => ({
      category,
      count: history.filter((item) => item.category === category).length,
    }))
    const topCategory = counts.sort((a, b) => b.count - a.count)[0]
    return { completed, minutes, topCategory: topCategory?.count ? topCategory.category : '—' }
  }, [history])

  const pickActivity = (duration: Duration, category = selectedCategory) => {
    const base = allActivities[duration]
    const options = category === 'Surprise me' ? base : base.filter((item) => item.category === category)
    if (!options.length) return

    let next = options[Math.floor(Math.random() * options.length)]
    if (activity && options.length > 1) {
      while (next.id === activity.id) next = options[Math.floor(Math.random() * options.length)]
    }

    setSelectedDuration(duration)
    setActivity(next)
  }

  const chooseCategory = (category: Category) => {
    setSelectedCategory(category)
    if (selectedDuration) pickActivity(selectedDuration, category)
  }

  const toggleFavorite = () => {
    if (!activity) return
    setFavorites((current) =>
      current.includes(activity.id)
        ? current.filter((id) => id !== activity.id)
        : [...current, activity.id],
    )
  }

  const markDone = () => {
    if (!activity || !selectedDuration) return

    setXp((current) => current + selectedDuration)

    const today = todayKey()
    const last = localStorage.getItem('wsid-last-completed')
    if (last !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)
      setStreak((current) => (last === yesterdayKey ? current + 1 : 1))
      localStorage.setItem('wsid-last-completed', today)
    }

    setHistory((current) => [{
      title: activity.title,
      category: activity.category,
      duration: selectedDuration,
      completedAt: new Date().toISOString(),
    }, ...current].slice(0, 30))

    pickActivity(selectedDuration)
  }

  const addCustomActivity = (event: FormEvent) => {
    event.preventDefault()
    const title = customTitle.trim()
    if (!title) return

    const next: Activity = {
      id: `custom-${Date.now()}`,
      title,
      category: customCategory,
      description: customDescription.trim() || 'A custom mission you added yourself.',
      emoji: '✨',
      custom: true,
    }

    setCustomActivities((current) => ({
      ...current,
      [customDuration]: [...current[customDuration], next],
    }))

    setCustomTitle('')
    setCustomDescription('')
    setShowCustomForm(false)
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="topbar">
          <div className="eyebrow">Turn spare time into progress</div>
          <div className="stats">
            <div className="stat-chip">🔥 <strong>{streak}</strong> day streak</div>
            <div className="stat-chip">⚡ <strong>{xp}</strong> XP</div>
          </div>
        </div>

        <h1>What Should I Do?</h1>
        <p className="subtitle">Tell me how much time you have. I’ll give you one productive thing to do right now.</p>

        <div className="level-card">
          <div className="level-copy"><span>Level {level}</span><span>{levelProgress}/100 XP</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${levelProgress}%` }} /></div>
        </div>

        <div className="mini-stats">
          <div><strong>{stats.completed}</strong><span>Missions</span></div>
          <div><strong>{stats.minutes}</strong><span>Minutes</span></div>
          <div><strong>{favorites.length}</strong><span>Favorites</span></div>
          <div><strong>{stats.topCategory}</strong><span>Top category</span></div>
        </div>

        <div className="section-label">How much time do you have?</div>
        <div className="duration-grid">
          {durations.map((duration) => (
            <button key={duration} className={selectedDuration === duration ? 'duration-button active' : 'duration-button'} onClick={() => pickActivity(duration)}>
              <span className="duration-number">{duration}</span><span className="duration-label">min</span>
            </button>
          ))}
        </div>

        <div className="section-label category-heading">What do you feel like doing?</div>
        <div className="category-row">
          {categories.map((category) => (
            <button key={category} className={selectedCategory === category ? 'category-button active' : 'category-button'} onClick={() => chooseCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        {!activity ? (
          <div className="empty-state"><span className="empty-icon">↗</span><p>Pick a time above to get your first mission.</p></div>
        ) : (
          <article className="activity-card">
            <div className="activity-topline">
              <span className="activity-emoji">{activity.emoji}</span>
              <span className="category-pill">{activity.category}</span>
              {activity.custom && <span className="custom-pill">Custom</span>}
              <span className="time-pill">{selectedDuration} min</span>
              <button className={favorites.includes(activity.id) ? 'favorite-button active' : 'favorite-button'} onClick={toggleFavorite} aria-label="Toggle favorite">
                {favorites.includes(activity.id) ? '★' : '☆'}
              </button>
            </div>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
            <div className="action-row">
              <button className="done-button" onClick={markDone}>✓ Done <span>+{selectedDuration} XP</span></button>
              <button className="another-button" onClick={() => selectedDuration && pickActivity(selectedDuration)}>Another one <span>↻</span></button>
            </div>
          </article>
        )}

        <section className="tools-panel">
          <div>
            <span className="section-label">Make it yours</span>
            <h3>Add your own missions</h3>
            <p>Create activities that actually match what you want to work on.</p>
          </div>
          <button className="secondary-button" onClick={() => setShowCustomForm((value) => !value)}>
            {showCustomForm ? 'Close' : '+ Add activity'}
          </button>
        </section>

        {showCustomForm && (
          <form className="custom-form" onSubmit={addCustomActivity}>
            <input value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} placeholder="Activity title" required />
            <textarea value={customDescription} onChange={(event) => setCustomDescription(event.target.value)} placeholder="Short description (optional)" rows={3} />
            <div className="form-row">
              <select value={customDuration} onChange={(event) => setCustomDuration(Number(event.target.value) as Duration)}>
                {durations.map((duration) => <option key={duration} value={duration}>{duration} min</option>)}
              </select>
              <select value={customCategory} onChange={(event) => setCustomCategory(event.target.value as RealCategory)}>
                {realCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <button className="done-button" type="submit">Save activity</button>
          </form>
        )}

        {history.length > 0 && (
          <section className="history-panel">
            <div className="history-header">
              <div><span className="section-label">Recent wins</span><h3>Your completed missions</h3></div>
              <button className="clear-history" onClick={() => setHistory([])}>Clear</button>
            </div>
            <div className="history-list">
              {history.slice(0, 6).map((item, index) => (
                <div className="history-item" key={`${item.completedAt}-${index}`}>
                  <div><strong>{item.title}</strong><span>{item.category}</span></div>
                  <span className="history-xp">+{item.duration} XP</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      <footer><span>Small time. Real progress.</span><span>V3</span></footer>
    </main>
  )
}

export default App
