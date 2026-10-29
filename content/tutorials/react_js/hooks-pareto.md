# React Hooks & Patterns — 80/20 Pareto Mastery

> **Audience:** Experienced JS/TypeScript developer who knows JSX and components (see `jsx_components.md`).  
> **Goal:** Master all essential React hooks and patterns in one place — the 20% that appears in 80% of real React codebases.  
> **Domain:** Developer Team Dashboard (same as `jsx_components.md` — consistent context throughout).

---

## The 20% That Covers 80%

| # | Topic | Why It's in the 20% |
|---|---|---|
| 1 | **`useState`** — primitive, object, array state | Every single component needs local state |
| 2 | **`useEffect`** — 3 dependency forms + cleanup | All API calls, subscriptions, timers live here |
| 3 | **`useRef`** — DOM refs + mutable values | Forms, animations, storing timer IDs |
| 4 | **`useContext` + `createContext`** | Global state without Redux — theme, auth, user |
| 5 | **`useReducer`** | Complex state with multiple related updates |
| 6 | **`useMemo` + `useCallback`** | Performance — prevent expensive recalculation |
| 7 | **`React.memo`** | Prevent unnecessary child re-renders |
| 8 | **Custom Hooks** | Extract and reuse stateful logic across components |
| 9 | **Controlled Forms** | Every real app has forms — complete pattern |
| 10 | **Lifting State Up + Composition** | The React mental model for data flow |

---

## Part 1 — Complete Code

```jsx
// ─────────────────────────────────────────────────────────────
//  File: TeamDashboard.jsx
//  React 18 + Vite — Drop into src/App.jsx or src/TeamDashboard.jsx
//  Run: npm create vite@latest my-app -- --template react
// ─────────────────────────────────────────────────────────────

import { 
  useState, useEffect, useRef, useContext, useReducer,
  useMemo, useCallback, createContext, memo
} from 'react';

// ══════════════════════════════════════════════════════════════
// 1. CONTEXT — createContext + Provider + useContext
// ══════════════════════════════════════════════════════════════

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// ══════════════════════════════════════════════════════════════
// 2. CUSTOM HOOK — useFetch (reusable API call logic)
// ══════════════════════════════════════════════════════════════

function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // useEffect mein async directly nahi karte — wrapper function banate hain
    let isCancelled = false;                    // cleanup: stale response ignore

    async function fetchData() {
      try {
        setLoading(true);
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!isCancelled) setData(json);        // only set if still mounted
      } catch (err) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchData();

    return () => { isCancelled = true; };       // cleanup: prevent state update on unmount
  }, [url]);                                    // re-fetch when url changes

  return { data, loading, error };
}

// ══════════════════════════════════════════════════════════════
// 3. CUSTOM HOOK — useLocalStorage
// ══════════════════════════════════════════════════════════════

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lazy initializer — only runs once on mount
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error('useLocalStorage error:', err);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ══════════════════════════════════════════════════════════════
// 4. USEREDUCER — Task management with actions
// ══════════════════════════════════════════════════════════════

const TASK_ACTIONS = {
  ADD:    'ADD_TASK',
  TOGGLE: 'TOGGLE_TASK',
  DELETE: 'DELETE_TASK',
  CLEAR:  'CLEAR_COMPLETED',
};

const initialTaskState = {
  tasks: [
    { id: 1, title: 'Setup FastAPI backend',    completed: true,  assignee: 'Arjun'  },
    { id: 2, title: 'Design React dashboard',   completed: false, assignee: 'Priya'  },
    { id: 3, title: 'Write LangChain pipeline', completed: false, assignee: 'Rohan'  },
  ],
  nextId: 4,
};

function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD:
      return {
        ...state,
        tasks:  [...state.tasks, { id: state.nextId, ...action.payload, completed: false }],
        nextId: state.nextId + 1,
      };
    case TASK_ACTIONS.TOGGLE:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case TASK_ACTIONS.DELETE:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload.id) };
    case TASK_ACTIONS.CLEAR:
      return { ...state, tasks: state.tasks.filter(t => !t.completed) };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// ══════════════════════════════════════════════════════════════
// 5. REACT.MEMO — Prevent unnecessary re-renders
// ══════════════════════════════════════════════════════════════

const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }) {
  console.log(`TaskItem render: ${task.title}`);   // see when it re-renders

  return (
    <li style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 0' }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>
        {task.title}
        <small style={{ color: '#888', marginLeft: '8px' }}>— {task.assignee}</small>
      </span>
      <button onClick={() => onDelete(task.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
    </li>
  );
});

// ══════════════════════════════════════════════════════════════
// 6. TASK FORM — Controlled form with validation
// ══════════════════════════════════════════════════════════════

function AddTaskForm({ onAdd }) {
  // Object state — multiple related fields in one state
  const [formData, setFormData] = useState({ title: '', assignee: '' });
  const [errors, setErrors]     = useState({});
  const titleRef                = useRef(null);       // DOM ref — auto-focus

  useEffect(() => {
    titleRef.current?.focus();                        // focus on mount
  }, []);

  // Generic onChange — handles all fields with one function
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));  // spread to avoid mutation
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim())    newErrors.title    = 'Title is required';
    if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();                               // prevent page reload
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd(formData);
    setFormData({ title: '', assignee: '' });         // reset form
    setErrors({});
    titleRef.current?.focus();                        // re-focus after submit
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <div>
        <input
          ref={titleRef}
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title..."
          style={{ border: errors.title ? '1px solid red' : '1px solid #ccc', padding: '6px', width: '100%', boxSizing: 'border-box' }}
        />
        {errors.title && <small style={{ color: 'red' }}>{errors.title}</small>}
      </div>
      <div>
        <input
          type="text"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          placeholder="Assignee name..."
          style={{ border: errors.assignee ? '1px solid red' : '1px solid #ccc', padding: '6px', width: '100%', boxSizing: 'border-box' }}
        />
        {errors.assignee && <small style={{ color: 'red' }}>{errors.assignee}</small>}
      </div>
      <button type="submit" style={{ padding: '8px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Add Task
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════
// 7. TASK PANEL — useReducer + useCallback + useMemo
// ══════════════════════════════════════════════════════════════

function TaskPanel() {
  const [taskState, dispatch] = useReducer(taskReducer, initialTaskState);
  const { theme }             = useContext(ThemeContext);   // consume context

  // useCallback — stable reference so TaskItem (memo'd) doesn't re-render needlessly
  const handleToggle = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE, payload: { id } });
  }, []);                                              // no deps — dispatch is stable

  const handleDelete = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.DELETE, payload: { id } });
  }, []);

  const handleAdd = useCallback((formData) => {
    dispatch({ type: TASK_ACTIONS.ADD, payload: formData });
  }, []);

  // useMemo — only recompute when tasks array changes
  const stats = useMemo(() => ({
    total:     taskState.tasks.length,
    completed: taskState.tasks.filter(t => t.completed).length,
    pending:   taskState.tasks.filter(t => !t.completed).length,
  }), [taskState.tasks]);

  const panelStyle = {
    background:   theme === 'dark' ? '#1a1a2e' : '#ffffff',
    color:        theme === 'dark' ? '#e0e0e0' : '#333333',
    padding:      '20px',
    borderRadius: '8px',
    boxShadow:    '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <div style={panelStyle}>
      <h2>📋 Team Tasks</h2>
      <p style={{ color: '#888', fontSize: '0.85rem' }}>
        Total: {stats.total} | ✅ Done: {stats.completed} | ⏳ Pending: {stats.pending}
      </p>

      <AddTaskForm onAdd={handleAdd} />

      {taskState.tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>No tasks yet. Add one above! 🎉</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {taskState.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {stats.completed > 0 && (
        <button
          onClick={() => dispatch({ type: TASK_ACTIONS.CLEAR })}
          style={{ marginTop: '8px', color: '#888', background: 'none', border: '1px solid #ccc', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear {stats.completed} completed
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 8. DEVELOPER LIST — useEffect + useState + useRef (timer)
// ══════════════════════════════════════════════════════════════

const MOCK_DEVELOPERS = [
  { id: 1, name: 'Arjun Mehta',  role: 'Backend',  salary: 95000,  online: true  },
  { id: 2, name: 'Priya Sharma', role: 'Frontend', salary: 82000,  online: false },
  { id: 3, name: 'Rohan Verma',  role: 'AI/ML',    salary: 110000, online: true  },
];

function DeveloperList() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [seconds, setSeconds]       = useState(0);

  // useRef — store timer ID (changing it shouldn't trigger re-render)
  const timerRef = useRef(null);

  // useEffect 1 — simulate API fetch (runs ONCE on mount)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDevelopers(MOCK_DEVELOPERS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);                  // cleanup if unmounts early
  }, []);                                                // [] = run once

  // useEffect 2 — start timer (runs once, cleanup on unmount)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);                      // functional update — safe with stale closure
    }, 1000);
    return () => clearInterval(timerRef.current);        // cleanup on unmount
  }, []);

  // useMemo — recompute only when developers or filter changes
  const filteredDevs = useMemo(() => {
    if (filter === 'online')  return developers.filter(d => d.online);
    if (filter === 'offline') return developers.filter(d => !d.online);
    return developers;
  }, [developers, filter]);

  if (loading) return <p>⏳ Loading developers... ({seconds}s elapsed)</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {['all', 'online', 'offline'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background:   filter === f ? '#0070f3' : '#eee',
              color:        filter === f ? '#fff'    : '#333',
              border:       'none',
              padding:      '4px 12px',
              borderRadius: '20px',
              cursor:       'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredDevs.map(dev => (
          <li key={dev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{dev.online ? '🟢' : '🔴'}</span>
            <span style={{ flex: 1 }}><strong>{dev.name}</strong> — {dev.role}</span>
            <span style={{ color: '#888' }}>₹{dev.salary.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <small style={{ color: '#aaa' }}>Dashboard uptime: {seconds}s</small>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 9. ROOT — Context Provider + Theme Toggle + useLocalStorage
// ══════════════════════════════════════════════════════════════

export default function TeamDashboard() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const appStyle = {
    minHeight:  '100vh',
    background: theme === 'dark' ? '#0d0d1a' : '#f5f5f5',
    color:      theme === 'dark' ? '#e0e0e0' : '#333',
    padding:    '24px',
    fontFamily: 'system-ui, sans-serif',
    transition: 'background 0.3s',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={appStyle}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1>🚀 Developer Dashboard</h1>
          <button onClick={toggleTheme} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <section>
            <h2>👥 Team Members</h2>
            <DeveloperList />
          </section>
          <section>
            <TaskPanel />
          </section>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
```

---

## Part 2 — Syntax Cheat Sheet

| Hook / Feature | Code Pattern | What It Does | When to Use |
|---|---|---|---|
| `useState(val)` | `const [count, setCount] = useState(0)` | Local component state | Any value that triggers re-render on change |
| `useState(fn)` | `useState(() => JSON.parse(localStorage.getItem('k')))` | Lazy initializer — fn runs only once | Expensive initial value |
| `setX(prev => ...)` | `setCount(prev => prev + 1)` | Functional update — always latest state | Async updates, counters, toggles |
| Object state update | `setState(prev => ({ ...prev, key: val }))` | Partial update without mutation | Object state with multiple fields |
| Array state — add | `setArr(prev => [...prev, newItem])` | Immutable append | Adding to a list |
| Array state — remove | `setArr(prev => prev.filter(i => i.id !== id))` | Immutable filter | Deleting from list |
| Array state — update | `setArr(prev => prev.map(i => i.id === id ? {...i, done: true} : i))` | Immutable map | Updating one item |
| `useEffect(() => {}, [])` | Empty array | Runs once after mount | API fetch, setup subscriptions |
| `useEffect(() => {})` | No array | Runs after every render | Debugging (avoid in production) |
| `useEffect(() => {}, [dep])` | With deps | Runs when dep changes | Re-fetch when filter changes |
| `useEffect` cleanup | `return () => clearInterval(id)` | Runs before next effect or unmount | Timers, subscriptions, event listeners |
| `useRef(null)` | `const ref = useRef(null)` | Mutable value — no re-render | DOM refs, timer IDs, previous values |
| DOM ref | `ref={myRef}` + `myRef.current.focus()` | Access DOM node directly | Focus, scroll, measure element |
| Mutable ref | `timerRef.current = setInterval(...)` | Store value without re-render | Timer IDs, abort controllers |
| `createContext(default)` | `const Ctx = createContext({})` | Create context object | Global state setup |
| `<Ctx.Provider value={...}>` | Wraps component tree | Provide value to all descendants | Theme, auth, language, user |
| `useContext(Ctx)` | `const { theme } = useContext(ThemeContext)` | Consume context value | Any deep component needing global data |
| `useReducer(reducer, init)` | `const [state, dispatch] = useReducer(fn, init)` | Complex state with actions | Multiple related state updates |
| `dispatch({ type, payload })` | `dispatch({ type: 'ADD', payload: data })` | Send action to reducer | All state changes via action object |
| `useMemo(() => val, [deps])` | `const stats = useMemo(() => compute(), [data])` | Cache computed value | Expensive calculations, derived data |
| `useCallback(fn, [deps])` | `const handleClick = useCallback(() => ..., [])` | Cache function reference | Stable props for `memo`'d children |
| `memo(Component)` | `const Child = memo(function Child(props) {...})` | Skip re-render if props unchanged | Children receiving callback props |
| Custom hook | `function useFetch(url) { ... return {data, loading, error} }` | Extract reusable stateful logic | Logic shared across multiple components |
| Async in useEffect | `useEffect(() => { async function fn() {...}; fn(); }, [])` | Wrapper for async operations | All async operations in effects |
| Stale closure fix | `setCount(prev => prev + 1)` | Functional update avoids stale value | State in setInterval / setTimeout |
| Cancellation | `let cancelled = false; return () => { cancelled = true }` | Prevent state update on unmount | Fetch inside useEffect |
| Controlled input | `value={state} onChange={e => setState(e.target.value)}` | React controls input value | All form inputs |
| Generic onChange | `setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))` | One handler for all fields | Multi-field forms |
| Form submit | `<form onSubmit={fn}>` + `e.preventDefault()` | Handle form, prevent reload | All form submissions |
| `useLocalStorage` (custom) | `const [val, setVal] = useLocalStorage('key', init)` | Persist state across sessions | Theme, preferences, cart |
| Lazy useState init | `useState(() => expensiveCompute())` | Avoid re-running on every render | Reading from storage / heavy init |

---

## Part 3 — `useState` Deep Dive (Q&A)

### Q1 — State update kyun synchronous nahi hai?

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count);      // ❌ still 0 — state update queued, not applied yet
}
```

`setCount` React ko batata hai "re-render schedule karo" — value **next render** pe update hoti hai. Current render mein `count` wahi rehta hai jo tha.

```jsx
// ✅ Current render mein updated value chahiye toh:
function handleClick() {
  const newCount = count + 1;
  setCount(newCount);
  console.log(newCount);   // ✅ correct value
}
```

---

### Q2 — Object state update mein spread kyun zaroori hai?

```jsx
const [profile, setProfile] = useState({ name: 'Arjun', role: 'Backend', salary: 95000 });

// ❌ WRONG — poora object replace ho jaata hai, name aur role gayab!
setProfile({ salary: 100000 });
// profile is now: { salary: 100000 }  ← name, role are gone!

// ✅ CORRECT — spread se baaki fields preserve hote hain
setProfile(prev => ({ ...prev, salary: 100000 }));
// profile is now: { name: 'Arjun', role: 'Backend', salary: 100000 }
```

React state ka **poora object replace** karta hai — JS ki tarah merge nahi karta. Spread operator `...prev` pehle ke saare fields copy karta hai, phir nayi value override karti hai.

---

### Q3 — Array state mein item add/remove/update kaise karein without mutation?

```jsx
const [tasks, setTasks] = useState([
  { id: 1, title: 'Design UI', done: false },
  { id: 2, title: 'Write API', done: true  },
]);

// ── ADD ──────────────────────────────────────────────────────
setTasks(prev => [...prev, { id: 3, title: 'Write tests', done: false }]);

// ── REMOVE ───────────────────────────────────────────────────
setTasks(prev => prev.filter(t => t.id !== 2));

// ── UPDATE one item ───────────────────────────────────────────
setTasks(prev => prev.map(t =>
  t.id === 1 ? { ...t, done: true } : t
));

// ❌ NEVER DO THIS — direct mutation
tasks.push({ id: 3, title: 'New task' });   // React doesn't see this!
setTasks(tasks);                             // same reference = no re-render
```

**Rule:** Array methods jo **new array** return karte hain: `map`, `filter`, `slice`, spread `[...arr]` ✅  
Array methods jo **original array mutate** karte hain: `push`, `pop`, `splice`, `sort`, `reverse` ❌

---

### Q4 — `useState` vs `useRef` — kab kya use karein?

| Need | Use |
|---|---|
| UI re-render chahiye when value changes | `useState` |
| Value store karna hai without re-render | `useRef` |
| DOM element access karna hai | `useRef` |
| Previous render ki value track karna hai | `useRef` |
| Timer / interval ID store karna hai | `useRef` |
| Controlled form input | `useState` |

```jsx
// useRef for timer ID — changing it doesn't cause re-render
const timerRef = useRef(null);
timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);

// useState for seconds — re-render chahiye display ke liye
const [seconds, setSeconds] = useState(0);
```

---

### Q5 — Functional update `setCount(prev => prev + 1)` kab zaroori hai?

```jsx
// ❌ Bug in setInterval — count is always 0 from first render (stale closure)
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);    // 'count' captured as 0 forever — stale closure!
  }, 1000);
  return () => clearInterval(id);
}, []);                      // empty deps = count frozen at 0

// ✅ Functional update — prev is ALWAYS the latest value
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);   // prev = actual current value ✅
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**Rule:** Jab bhi state update previous state pe depend kare, functional form use karo: `setX(prev => newValue)`.

---

## Part 4 — `useEffect` Deep Dive (Q&A)

### Q1 — Dependency array ke teeno forms ka exact behavior

```jsx
// Form 1 — No dependency array: runs AFTER EVERY render
useEffect(() => {
  console.log('Every render ke baad chalta hoon');
});                         // ⚠️ Rarely correct

// Form 2 — Empty array []: runs ONCE after first render (mount only)
useEffect(() => {
  console.log('Sirf ek baar — componentDidMount ki tarah');
  fetchData();
}, []);

// Form 3 — With deps: runs after mount + whenever deps change
useEffect(() => {
  console.log('filter badla — re-fetch karta hoon');
  fetchFilteredData(filter);
}, [filter]);               // re-runs whenever filter changes
```

---

### Q2 — Cleanup function kab chahiye — 3 real examples

```jsx
// Example 1: setInterval — clear on unmount
useEffect(() => {
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id);          // ✅ clear timer on unmount
}, []);

// Example 2: fetch — abort on unmount or url change
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(r => r.json()).then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err.message); });
  return () => controller.abort();          // ✅ abort in-flight request
}, [url]);

// Example 3: Event listener — remove on unmount
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);  // ✅ cleanup
}, []);
```

**Rule:** Jab bhi `useEffect` mein kuch "start" karo (timer, subscription, listener, fetch), cleanup mein "stop" karo.

---

### Q3 — Infinite loop kab ban jaata hai — kaise bachein?

```jsx
// ❌ Infinite loop — no deps array, effect changes state, re-render, effect again...
useEffect(() => {
  setCount(count + 1);          // state change → re-render → effect → state change...
});

// ❌ Object/Array in deps — new reference every render
const options = { limit: 10 }; // new object created on every render!
useEffect(() => {
  fetchData(options);
}, [options]);                   // always "new" → infinite loop

// ✅ Fix: Use primitive values in deps
useEffect(() => {
  fetchData({ limit: 10 });
}, []);                          // stable — run once

// ✅ Fix: useMemo to stabilize object dependency
const options = useMemo(() => ({ limit: 10 }), []);
useEffect(() => {
  fetchData(options);
}, [options]);                   // stable reference → runs once
```

---

### Q4 — `useEffect` mein async/await directly kyun nahi kar sakte?

```jsx
// ❌ WRONG — async function returns a Promise
// React expects cleanup function (or undefined), not a Promise
useEffect(async () => {
  const data = await fetchData();   // ⚠️ React warns about this
  setData(data);
}, []);

// ✅ CORRECT — inner async function define karo, call karo
useEffect(() => {
  async function load() {
    const data = await fetchData();
    setData(data);
  }
  load();
}, []);

// ✅ ALSO OK — IIFE
useEffect(() => {
  (async () => {
    const data = await fetchData();
    setData(data);
  })();
}, []);
```

---

### Q5 — `useLayoutEffect` vs `useEffect`

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Timing | After browser paint (async) | Before browser paint (sync) |
| Use case | Fetch, subscriptions, timers | DOM measurement, tooltip position |
| Performance | Non-blocking ✅ | Blocks paint — use sparingly |
| Server side | Works | SSR warning ⚠️ |

```jsx
// useLayoutEffect: measure DOM BEFORE user sees anything — no visual flicker
useLayoutEffect(() => {
  const { width, height } = ref.current.getBoundingClientRect();
  setDimensions({ width, height });    // set before paint
}, []);
```

**Real-world:** 95% of the time `useEffect` sahi hai. `useLayoutEffect` sirf tab jab visible flicker dikh raha ho.

---

## Part 5 — Performance: `useMemo` + `useCallback` + `React.memo`

### Q1 — `useMemo` vs `useCallback` difference

```jsx
// useMemo — caches a COMPUTED VALUE (result of calling a function)
const stats = useMemo(() => ({
  total:     tasks.length,
  completed: tasks.filter(t => t.completed).length,
}), [tasks]);                   // recompute only when tasks changes
// stats is an object (the value)

// useCallback — caches a FUNCTION ITSELF (the function reference)
const handleToggle = useCallback((id) => {
  dispatch({ type: 'TOGGLE', payload: { id } });
}, []);                         // same function reference across renders
// handleToggle is a function
```

**Simple rule:**
- `useMemo` → **value** cache karo (filtered list, computed stats, sorted array)
- `useCallback` → **function** cache karo (event handlers passed to child components)

---

### Q2 — `React.memo` + `useCallback` together kyun zaroori hai?

```jsx
// Without memo — re-renders every time parent re-renders (even if props same)
function TaskItem({ task, onToggle }) {
  console.log('TaskItem render');
  return <div onClick={() => onToggle(task.id)}>{task.title}</div>;
}

// With memo — re-renders ONLY if props changed (shallow comparison)
const TaskItem = memo(function TaskItem({ task, onToggle }) {
  return <div onClick={() => onToggle(task.id)}>{task.title}</div>;
});
```

**Problem — memo is useless without useCallback:**

```jsx
// ❌ memo fails — new function reference every render
function Parent() {
  const handleToggle = (id) => dispatch(...);  // NEW function every render!
  return <TaskItem onToggle={handleToggle} />;  // memo sees new prop = re-renders
}

// ✅ useCallback makes reference stable
function Parent() {
  const handleToggle = useCallback((id) => dispatch(...), []);
  return <TaskItem onToggle={handleToggle} />;  // same reference = memo works ✅
}
```

**Pattern:** `React.memo` + `useCallback` = always pair them. Ek ke bina doosra incomplete hai.

---

### Q3 — Kab optimize NAHI karna chahiye?

```jsx
// ❌ Premature optimization — adds overhead with no benefit
const items = useMemo(() => [1, 2, 3], []);          // pointless — trivial computation
const handleLocalToggle = useCallback(() => setOpen(true), []); // not passed to children

// ✅ Optimize only when:
// 1. React Profiler shows actual slow re-renders
// 2. Computation is expensive (sorting 10k items, complex calculations)
// 3. Child component has React.memo and needs stable function props
```

> **React team says:** Don't optimize until you measure. Premature `useMemo`/`useCallback` adds code complexity with no user-visible benefit — and can actually slow things down.

---

## Part 6 — `useReducer` Deep Dive

### When to Use `useReducer` over `useState`

```
useState ✅          useReducer ✅
─────────────────   ───────────────────────────────
Simple values       Multiple related state updates
Independent fields  Next state depends on previous
1-2 state updates   Actions with different outcomes
                    Predictable state transitions
                    Easier testing (pure function)
```

### Reducer Pattern Explained

```jsx
// 1. Define action types as constants (typo prevention)
const TASK_ACTIONS = { ADD: 'ADD_TASK', TOGGLE: 'TOGGLE_TASK', DELETE: 'DELETE_TASK' };

// 2. Pure reducer function — same input = same output always
function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD:
      return { ...state, tasks: [...state.tasks, { id: state.nextId, ...action.payload }], nextId: state.nextId + 1 };
    case TASK_ACTIONS.TOGGLE:
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, completed: !t.completed } : t) };
    case TASK_ACTIONS.DELETE:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload.id) };
    default:
      throw new Error(`Unknown action: ${action.type}`);  // fail loudly on typos
  }
}

// 3. Use in component
const [taskState, dispatch] = useReducer(taskReducer, initialTaskState);

// 4. Dispatch actions — never mutate state directly
dispatch({ type: TASK_ACTIONS.ADD,    payload: { title: 'New task', assignee: 'Arjun' } });
dispatch({ type: TASK_ACTIONS.TOGGLE, payload: { id: 1 } });
dispatch({ type: TASK_ACTIONS.DELETE, payload: { id: 2 } });
```

---

## Part 7 — React vs Other Patterns

### 1. `useState` vs Direct Variable Mutation

```jsx
// ❌ Vanilla JS thinking — direct mutation
let count = 0;
function increment() {
  count++;              // works in memory, React doesn't know → no re-render!
}

// ✅ React way — setState triggers re-render
const [count, setCount] = useState(0);
function increment() {
  setCount(prev => prev + 1);   // React knows → schedules re-render
}
```

---

### 2. `useEffect` vs Class Lifecycle Methods

```jsx
// Class component (old — don't use)
componentDidMount()  { this.fetchData(); }
componentDidUpdate(prevProps) {
  if (prevProps.id !== this.props.id) this.fetchData(this.props.id);
}
componentWillUnmount() { this.subscription.unsubscribe(); }

// Hooks — one place, same behavior
useEffect(() => {
  fetchData(id);
  return () => subscription.unsubscribe();   // cleanup = componentWillUnmount
}, [id]);                                    // deps = componentDidUpdate logic
```

---

### 3. `useContext` vs Prop Drilling

```jsx
// ❌ Prop drilling — theme passed through 3 useless levels
<App theme="dark">
  <Dashboard theme="dark">
    <Sidebar theme="dark">
      <Button theme="dark" />    {/* finally used here */}
    </Sidebar>
  </Dashboard>
</App>

// ✅ Context — Button reads directly, no passing needed
const { theme } = useContext(ThemeContext);
```

---

### 4. `useReducer` vs Redux

```jsx
// useReducer — local component state, no extra library
const [state, dispatch] = useReducer(reducer, initialState);

// Redux Toolkit — global app state, separate library
// Use Redux when: many unrelated components share state, complex async flows,
// need Redux DevTools time-travel, or team already uses Redux.
// For most apps: Context + useReducer is enough.
```

---

### 5. Custom Hooks vs Class Mixins

```jsx
// Custom hooks — composable, explicit dependencies, easy to test
function useFetch(url)              { return { data, loading, error }; }
function useDebounce(value, delay)  { return debouncedValue; }
function useLocalStorage(key, init) { return [val, setVal]; }

// Clean composition in component — reads like prose
function MyComponent() {
  const { data, loading }  = useFetch('/api/team');
  const [theme, setTheme]  = useLocalStorage('theme', 'light');
  const query              = useDebounce(rawSearch, 300);
}
```

---

### 6. Controlled vs Uncontrolled Inputs

```jsx
// Uncontrolled — React doesn't manage value (like vanilla JS)
const inputRef = useRef();
<input ref={inputRef} defaultValue="Arjun" />
// Read: inputRef.current.value — only when needed (e.g. on submit)

// Controlled — React is single source of truth (recommended)
const [name, setName] = useState('Arjun');
<input value={name} onChange={e => setName(e.target.value)} />
// name always reflects current input value

// When to use uncontrolled: <input type="file">, 3rd party non-React libs
// Otherwise: always controlled
```

---

### 7. Key Prop — Why It Breaks Without Correct Keys

```jsx
// ❌ Using index as key — bugs when list is reordered or filtered
{tasks.map((task, index) => <TaskItem key={index} task={task} />)}
// If task at index 0 is deleted, item at index 1 becomes index 0
// React thinks it's the SAME item — wrong state carried over!

// ✅ Using stable unique ID
{tasks.map(task => <TaskItem key={task.id} task={task} />)}
// React correctly identifies which item was removed
```

---

### 8. `useContext` for Theme — Persisted with `useLocalStorage`

```jsx
// Context provides value, localStorage persists it across sessions
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');  // persisted!
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

// Any nested component reads it without prop drilling
function Button() {
  const { theme } = useContext(ThemeContext);
  return <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>Click</button>;
}
```

---

## Part 8 — Practice Tasks

> **Instructions:** Same `TeamDashboard.jsx` code use karo. Minor modifications — no new project. Try karo pehle.

---

**Task 1 — `useDebounce` Custom Hook**

`DeveloperList` mein ek search `<input>` add karo. `useDebounce` custom hook banao jo search value ko 300ms delay kare:

```jsx
function useDebounce(value, delay) {
  // Implement with useState + useEffect + cleanup timer
  // Return debounced value
}
```

Developers ko name se filter karo — sirf `debouncedSearch` se (raw input se nahi).

---

**Task 2 — `useReducer` mein EDIT action**

`taskReducer` mein ek nayi action add karo:

```jsx
case TASK_ACTIONS.EDIT:
  // update title of the task with matching id
```

`TaskItem` mein ek pencil ✏️ button add karo. Click karne pe inline `<input>` show ho, Enter press karne pe `EDIT` dispatch karo.

---

**Task 3 — `useMemo` se extended stats**

`TaskPanel` mein `stats` object extend karo:

```jsx
const stats = useMemo(() => ({
  total:           tasks.length,
  completed:       tasks.filter(t => t.completed).length,
  pending:         tasks.filter(t => !t.completed).length,
  percentComplete: /* calculate and format as "67%" string */,
  topAssignee:     /* name of person with most tasks */,
}), [taskState.tasks]);
```

UI mein `percentComplete` ko progress bar ke roop mein dikhao (simple `<div>` with width %).

---

**Task 4 — `useContext` mein `fontSize` add karo**

`ThemeContext` extend karo:

```jsx
const ThemeContext = createContext({
  theme:          'light',
  fontSize:       'medium',
  toggleTheme:    () => {},
  cycleFontSize:  () => {},   // small → medium → large → small
});
```

`useLocalStorage` se `fontSize` persist karo. `TaskPanel` mein font-size toggle button add karo. Map values: `small → 12px`, `medium → 16px`, `large → 20px`. Apply to relevant text.

---

**Task 5 — Real `useFetch` in `DeveloperList`**

Hardcoded `MOCK_DEVELOPERS` replace karo `useFetch` hook se:

```
URL: https://jsonplaceholder.typicode.com/users
```

Response mein `id`, `name` use karo. `loading === true` ke time 3 skeleton placeholder `<div>` dikhao (animated grey bars — CSS `opacity` animation). `error` state mein retry button dikhao jo same URL se re-fetch kare (hint: `useState` se URL ke URL ko key banao).

---

## Summary — The 20% You Just Mastered

```
✅ useState — primitive, object, array + functional update
✅ useEffect — 3 dependency forms + cleanup pattern
✅ useRef — DOM refs + mutable values without re-render
✅ useContext + createContext — global state, no prop drilling
✅ useReducer — complex state with action/dispatch pattern
✅ useMemo — computed value caching (filtered lists, stats)
✅ useCallback — stable function references for memo'd children
✅ React.memo — prevent unnecessary child re-renders
✅ Custom hooks — useFetch, useLocalStorage
✅ Controlled forms — validation, error display, reset, a11y
✅ Async in useEffect — wrapper function pattern
✅ Cleanup — timer, fetch abort, event listener removal
✅ Stale closure fix — functional update form
✅ Performance triad — memo + useCallback + useMemo together
✅ Lazy state initializer — useState(() => fn())
✅ useReducer action types — pattern for predictable updates
```

> **Combined with `jsx_components.md`**, these two files cover ~80% of React patterns in production frontend codebases, AI dashboards, and full-stack Next.js applications.

---

*Files in this series:*  
- `d:\code_fusion\content\tutorials\react_js\jsx_components.md` — JSX, components, props  
- `d:\code_fusion\content\tutorials\react_js\hooks_pareto.md` — Hooks, state, patterns (this file)
