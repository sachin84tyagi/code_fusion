# React JSX & Components — JS/TS Developer's Fast Reference

> **Audience:** Experienced JavaScript/TypeScript developer jo React properly seekh raha hai. JS basics yahan explain nahi honge — focus sirf React-specific syntax, patterns, aur behavior par hai. Agar tujhe `map()`, destructuring, ya arrow functions pata hain, toh tu ready hai. Yahan hum dekhenge ki React ka mental model vanilla JS se alag kyun hai aur kahan alag sochna padta hai.

---

## The 20% That Covers 80%

| # | Topic | Why it's in the 20% |
|---|-------|---------------------|
| 1 | JSX syntax & compilation | Har React component yahan se shuru hota hai — ye samjhe bina kuch nahi chalega |
| 2 | Functional components | React 16.8+ ke baad ye hi standard hai, class components legacy hain |
| 3 | Props & destructuring | Component communication ka ek hi rasta — ye pattern har jagah use hota hai |
| 4 | `className` / `htmlFor` | HTML attributes React mein alag hain — ye galti har beginner karta hai |
| 5 | Conditional rendering (`&&`, ternary, early return) | UI logic ka 90% yahi hai — show/hide, loading states, error states |
| 6 | List rendering with `.map()` + `key` | Har real app mein lists hoti hain — `key` miss karna silent bugs deta hai |
| 7 | Event handling (`onClick`, `onChange`) | Interactivity ka foundation — React ka event system vanilla se alag hai |
| 8 | Fragment (`<> </>`) | Unnecessary DOM wrapper nodes avoid karna — real codebases mein har jagah |
| 9 | `children` prop | Component composition ka core pattern — reusable wrappers/layouts yahi se banate hain |
| 10 | Component composition (parent + child) | React ka "lego" model — ek bada component chhote components se banta hai |

---

## Part 1 — Complete Code

> **Domain:** Developer Team Dashboard — ek realistic component jo ek real project ke HR/team portal mein hoga. Ek `DeveloperCard` component jo individual developer ko display karta hai, aur ek `TeamDashboard` component jo usse compose karta hai.

**File:** `src/components/TeamDashboard.jsx`  
**Setup:** Vite + React (`npm create vite@latest my-app -- --template react`)

```jsx
// src/components/TeamDashboard.jsx
// Drop this file into any Vite + React project (React 18+)
// No `import React from 'react'` needed in modern React with JSX transform

import PropTypes from 'prop-types';

// ─────────────────────────────────────────────────────────────
// CHILD COMPONENT — SkillBadge
// Ek chhota reusable component — sirf ek skill tag render karta hai
// ─────────────────────────────────────────────────────────────
function SkillBadge({ skill, level }) {
  // Inline style object — JS object hai, CSS string nahi
  const badgeStyle = {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '6px',
    marginBottom: '4px',
    backgroundColor: level === 'expert' ? '#4f46e5' : level === 'intermediate' ? '#0891b2' : '#6b7280',
    color: '#ffffff',
  };

  return (
    // Self-closing tags allowed hain jab children na ho
    <span style={badgeStyle}>{skill}</span>
  );
}

// PropTypes — runtime type checking (development mein warnings deta hai)
SkillBadge.propTypes = {
  skill: PropTypes.string.isRequired,
  level: PropTypes.oneOf(['beginner', 'intermediate', 'expert']),
};

// Default props — jab level pass na ho tab ye use hoga
SkillBadge.defaultProps = {
  level: 'beginner',
};

// ─────────────────────────────────────────────────────────────
// CHILD COMPONENT — StatusIndicator
// Online/offline/busy status dot
// ─────────────────────────────────────────────────────────────
function StatusIndicator({ status }) {
  // Early return pattern — conditional rendering ka clean tarika
  if (!status) return null;

  const colors = {
    online: '#22c55e',
    offline: '#6b7280',
    busy: '#f59e0b',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: colors[status] || colors.offline,
        marginRight: '6px',
      }}
      // Template literal in JSX attribute
      aria-label={`Status: ${status}`}
    />
  );
}

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['online', 'offline', 'busy']),
};

// ─────────────────────────────────────────────────────────────
// CHILD COMPONENT — Card (generic wrapper)
// children prop demonstrate karta hai — layout wrapper pattern
// ─────────────────────────────────────────────────────────────
function Card({ children, highlighted }) {
  // className — React mein 'class' nahi likhte
  return (
    <div
      className={`card ${highlighted ? 'card--highlighted' : ''}`}
      style={{
        border: highlighted ? '2px solid #4f46e5' : '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* children — jo bhi is Card ke andar pass karo wo yahan render hoga */}
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  highlighted: PropTypes.bool,
};

Card.defaultProps = {
  highlighted: false,
};

// ─────────────────────────────────────────────────────────────
// MAIN CHILD COMPONENT — DeveloperCard
// Ek developer ka complete profile card
// ─────────────────────────────────────────────────────────────
function DeveloperCard({
  developer,           // object prop — destructured at param level
  onHire,              // function prop — event callback
  onViewProfile,       // function prop
  isSelected = false,  // default prop via ES6 default parameter (modern way)
}) {
  // Destructure the developer object inside the component
  const {
    id,
    name,
    role,
    avatar,
    status,
    skills,
    yearsOfExperience,
    isAvailable,
    githubUrl,
    projectCount,
  } = developer;

  // Handler function — inline se alag rakhna better hai complex logic ke liye
  function handleHireClick() {
    // Synthetic event yahan nahi chahiye — sirf data upar bhej rahe hain
    onHire(id);
  }

  function handleViewProfile(event) {
    // Synthetic event — React wraps native events
    event.preventDefault();
    onViewProfile(developer);
  }

  return (
    // Card component use kar rahe hain — ye composition hai
    <Card highlighted={isSelected}>
      {/* Fragment — multiple sibling elements wrap karna bina extra div ke */}
      <>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <img
            src={avatar}
            alt={`${name}'s avatar`}   // Template literal in JSX attribute
            style={{ width: '52px', height: '52px', borderRadius: '50%', marginRight: '12px' }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>
              {/* Curly braces — JS expression directly in JSX */}
              {name}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              {/* StatusIndicator — component composition, nested child */}
              <StatusIndicator status={status} />
              {role}
            </p>
          </div>

          {/* Conditional rendering — && operator */}
          {isSelected && (
            <span style={{ marginLeft: 'auto', color: '#4f46e5', fontWeight: 'bold', fontSize: '13px' }}>
              ✓ Selected
            </span>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px', color: '#374151' }}>
          {/* Ternary operator — value decide karne ke liye */}
          <span>🗓 {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} exp</span>
          <span>📁 {projectCount} projects</span>

          {/* && — availability badge sirf tab dikhao jab available ho */}
          {isAvailable && (
            <span style={{ color: '#22c55e', fontWeight: '600' }}>● Available</span>
          )}
        </div>

        {/* Skills — .map() with key prop */}
        <div style={{ marginBottom: '14px' }}>
          {skills.map((skillObj) => (
            // key prop — har list item par ZAROORI hai, unique identifier
            // SkillBadge component — composed inside DeveloperCard
            <SkillBadge
              key={skillObj.name}   // key sirf list rendering mein chahiye
              skill={skillObj.name}
              level={skillObj.level}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* onClick — React synthetic event handler */}
          <button
            onClick={handleHireClick}
            disabled={!isAvailable}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isAvailable ? '#4f46e5' : '#d1d5db',
              color: isAvailable ? '#fff' : '#9ca3af',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            {/* Ternary in JSX — text change based on state */}
            {isAvailable ? 'Hire Now' : 'Not Available'}
          </button>

          <a
            href={githubUrl}
            onClick={handleViewProfile}     // Event handler on anchor
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              color: '#374151',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            View Profile
          </a>
        </div>
      </>
    </Card>
  );
}

DeveloperCard.propTypes = {
  developer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['online', 'offline', 'busy']),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        level: PropTypes.oneOf(['beginner', 'intermediate', 'expert']),
      })
    ).isRequired,
    yearsOfExperience: PropTypes.number.isRequired,
    isAvailable: PropTypes.bool.isRequired,
    githubUrl: PropTypes.string,
    projectCount: PropTypes.number,
  }).isRequired,
  onHire: PropTypes.func.isRequired,
  onViewProfile: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

// ─────────────────────────────────────────────────────────────
// PARENT COMPONENT — TeamDashboard
// Multiple DeveloperCard components ko compose karta hai
// ─────────────────────────────────────────────────────────────
function TeamDashboard() {
  // Static data — Part 2 (useState) mein ye dynamic hoga
  const developers = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Senior Frontend Engineer',
      avatar: 'https://i.pravatar.cc/150?img=47',
      status: 'online',
      skills: [
        { name: 'React', level: 'expert' },
        { name: 'TypeScript', level: 'expert' },
        { name: 'CSS', level: 'intermediate' },
      ],
      yearsOfExperience: 6,
      isAvailable: true,
      githubUrl: 'https://github.com',
      projectCount: 23,
    },
    {
      id: 2,
      name: 'Arjun Mehta',
      role: 'Full Stack Developer',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'busy',
      skills: [
        { name: 'Node.js', level: 'expert' },
        { name: 'React', level: 'intermediate' },
        { name: 'PostgreSQL', level: 'intermediate' },
        { name: 'Docker', level: 'beginner' },
      ],
      yearsOfExperience: 4,
      isAvailable: false,
      githubUrl: 'https://github.com',
      projectCount: 17,
    },
    {
      id: 3,
      name: 'Sneha Patil',
      role: 'UI/UX + React Developer',
      avatar: 'https://i.pravatar.cc/150?img=32',
      status: 'online',
      skills: [
        { name: 'Figma', level: 'expert' },
        { name: 'React', level: 'intermediate' },
        { name: 'Tailwind', level: 'expert' },
      ],
      yearsOfExperience: 3,
      isAvailable: true,
      githubUrl: 'https://github.com',
      projectCount: 11,
    },
  ];

  // Simple event handlers — in Part 2 these will update state
  function handleHire(developerId) {
    console.log(`Hire request for developer ID: ${developerId}`);
    alert(`Hire request sent for developer #${developerId}!`);
  }

  function handleViewProfile(developer) {
    console.log('Viewing profile:', developer);
    alert(`Viewing profile of ${developer.name}`);
  }

  // onChange demo — search input (uncontrolled preview, controlled in Part 2)
  function handleSearchChange(event) {
    console.log('Search query:', event.target.value);
  }

  // Derived value — kitne developers available hain
  const availableCount = developers.filter((d) => d.isAvailable).length;

  return (
    // Fragment — page ka topmost wrapper, extra div nahi chahiye
    <>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
            Team Dashboard
          </h1>
          {/* Template literal + expression in JSX */}
          <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
            {`${developers.length} developers · ${availableCount} available for hire`}
          </p>
        </div>

        {/* Search input — onChange event */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="dev-search"       // htmlFor — React mein 'for' nahi chalega
            style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}
          >
            Search Developers
          </label>
          <input
            id="dev-search"
            type="text"
            placeholder="Name, role, or skill..."
            onChange={handleSearchChange}   // onChange — React controlled input pattern
            style={{
              width: '100%',
              padding: '9px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Developer list — .map() with key */}
        {developers.map((dev, index) => (
          <DeveloperCard
            key={dev.id}              // key — index use karna avoid karo
            developer={dev}
            onHire={handleHire}
            onViewProfile={handleViewProfile}
            isSelected={index === 0}  // Pehla card "selected" dikhao — demo ke liye
          />
        ))}

        {/* Conditional rendering — agar koi developer nahi mila */}
        {developers.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
            No developers found. Adjust your search.
          </p>
        )}
      </div>
    </>
  );
}

// Default export — is file ka main component
export default TeamDashboard;

// Named exports — child components bhi export kar rahe hain (reuse ke liye)
export { DeveloperCard, SkillBadge, Card, StatusIndicator };
```

**`src/main.jsx` mein use karna:**
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TeamDashboard from './components/TeamDashboard';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TeamDashboard />
  </StrictMode>
);
```

> [!NOTE]
> **PropTypes** ke liye pehle install karo: `npm install prop-types`  
> Modern React 18+ mein `import React from 'react'` required **nahi** hai — Vite ka JSX transform automatically handle karta hai. TypeScript projects mein `.tsx` extension use karo aur PropTypes ki jagah TypeScript interfaces/types prefer karo.

---

## Part 2 — Syntax Cheat Sheet

| # | Feature | React/JSX Example | What It Does | Vanilla JS/TS Equivalent |
|---|---------|-------------------|--------------|--------------------------|
| 1 | **JSX element** | `<div className="card">Hi</div>` | HTML-like syntax jo JS function call mein compile hota hai | `document.createElement('div')` |
| 2 | **JS expression in JSX** | `<h1>{developer.name}</h1>` | Curly braces ke andar koi bhi JS expression | `element.textContent = developer.name` |
| 3 | **className** | `<div className="card active">` | CSS class apply karna | `element.className = 'card active'` |
| 4 | **htmlFor** | `<label htmlFor="email">` | Label ko input se link karna | `label.htmlFor = 'email'` |
| 5 | **Self-closing tag** | `<SkillBadge skill="React" />` | Children-less elements shorthand | `createElement('SkillBadge', {...})` |
| 6 | **Fragment (short)** | `<> <h1/> <p/> </>` | Multiple siblings, no wrapper DOM node | Koi equivalent nahi (extra div chahiye) |
| 7 | **Fragment (named)** | `<Fragment key={id}> ... </Fragment>` | Fragment mein `key` prop use karna | N/A |
| 8 | **Functional component** | `function Card({ children }) { return <div>{children}</div>; }` | Reusable UI unit — function jo JSX return kare | Regular function returning HTML string |
| 9 | **Props (object)** | `<DeveloperCard developer={devObj} />` | Parent se child ko data bhejta hai | Function argument pass karna |
| 10 | **Props (primitive)** | `<Card highlighted={true} count={5} />` | Boolean/number/string props | Function args |
| 11 | **Prop shorthand (boolean true)** | `<Card highlighted />` | `highlighted={true}` ka shorthand | N/A |
| 12 | **Default props (ES6)** | `function Card({ highlighted = false })` | Prop na dene par fallback value | Default function parameter |
| 13 | **defaultProps (legacy)** | `Card.defaultProps = { highlighted: false }` | Old way, still works | N/A |
| 14 | **children prop** | `<Card><h1>Hello</h1></Card>` → `{children}` | Component ke andar nested JSX pass karna | Callback ya innerHTML pattern |
| 15 | **Spread props** | `<input {...inputProps} />` | Object ke saare keys as props | `Object.assign(element, props)` |
| 16 | **Conditional — ternary** | `{isAvailable ? 'Hire' : 'Busy'}` | Do options mein se ek render karo | Ternary in template literal |
| 17 | **Conditional — &&** | `{isAvailable && <Badge />}` | Sirf ek cheez conditionally render karo | `if (cond) el.append(badge)` |
| 18 | **Early return** | `if (!status) return null;` | Component kuch render na kare | Guard clause before DOM manipulation |
| 19 | **List rendering** | `{skills.map(s => <SkillBadge key={s.name} />)}` | Array se JSX elements banana | `forEach` + `appendChild` |
| 20 | **key prop** | `key={dev.id}` | React ka reconciler efficient update ke liye use karta hai | N/A (React-specific concept) |
| 21 | **onClick** | `<button onClick={handleClick}>` | Click event attach karna | `element.addEventListener('click', fn)` |
| 22 | **onClick inline** | `<button onClick={() => onHire(id)}>` | Inline arrow function handler | `el.onclick = () => fn(id)` |
| 23 | **onChange** | `<input onChange={handleChange}>` | Input change event | `input.addEventListener('input', fn)` |
| 24 | **onSubmit** | `<form onSubmit={handleSubmit}>` | Form submit event | `form.addEventListener('submit', fn)` |
| 25 | **event.preventDefault()** | `function handle(e) { e.preventDefault(); }` | Default browser action rokna | Same — native event method |
| 26 | **Inline style** | `<div style={{ color: 'red', fontSize: '14px' }}>` | JS object se inline CSS | `el.style.color = 'red'` |
| 27 | **Template literal in attr** | `` <img alt={`${name}'s photo`} /> `` | Dynamic string attribute value | `el.alt = name + "'s photo"` |
| 28 | **Component composition** | `<Card><DeveloperCard ... /></Card>` | Ek component doosre ke andar use karna | Manual DOM nesting |
| 29 | **null renders nothing** | `return null` | Component kuch DOM mein add nahi karta | `element.style.display = 'none'` ya remove |
| 30 | **PropTypes.shape** | `PropTypes.shape({ id: PropTypes.number })` | Nested object ka type check | TypeScript interface |
| 31 | **PropTypes.arrayOf** | `PropTypes.arrayOf(PropTypes.string)` | Array of specific type | TypeScript: `string[]` |
| 32 | **PropTypes.oneOf** | `PropTypes.oneOf(['online','offline'])` | Enum-like validation | TypeScript union: `'online' \| 'offline'` |
| 33 | **PropTypes.func** | `PropTypes.func.isRequired` | Function prop — callback pattern | TypeScript: `() => void` |
| 34 | **Export default** | `export default TeamDashboard` | Main component export | JS module default export |
| 35 | **Named export** | `export { DeveloperCard, SkillBadge }` | Multiple components ek file se | JS named exports |

---

## Part 3 — JSX Deep Dive (Q&A format)

### Q1: JSX kya hai — actually kya compile hota hai?

JSX ek **syntax extension** hai — ye actual JavaScript nahi hai. Babel (ya Vite ka esbuild) isko compile karta hai.

**Tujhne likha:**
```jsx
<DeveloperCard developer={dev} isSelected={true} />
```

**Compile hone ke baad banta hai (React 17+ new JSX transform):**
```js
import { jsx as _jsx } from 'react/jsx-runtime';
_jsx(DeveloperCard, { developer: dev, isSelected: true });
```

**Old way (React 16 aur pehle):**
```js
React.createElement(DeveloperCard, { developer: dev, isSelected: true });
```

Isliye purane code mein `import React from 'react'` zaroori tha — `React.createElement` call karne ke liye. Naye JSX transform (Vite default) mein ye import automatically handle hoti hai.

**Nested JSX ka example:**
```jsx
// Ye likhte hain:
<Card highlighted={true}>
  <h3>{name}</h3>
</Card>

// Ye banta hai:
_jsx(Card, {
  highlighted: true,
  children: _jsx("h3", { children: name })
});
```

> **Key insight:** JSX sirf `React.createElement` (ya `_jsx`) ka **syntactic sugar** hai. Isliye JSX mein sirf wahi cheezein kaam karti hain jo ek function call ke arguments mein kaam karti hain.

---

### Q2: `className` kyun hai, `class` kyun nahi?

React mein JSX ultimately **JavaScript** hai — aur `class` ek **reserved keyword** hai JS mein (classes define karne ke liye). Isliye React ne `className` use kiya taaki conflict na ho.

```jsx
// ✅ React mein — className
<div className="card card--highlighted">

// ❌ Ye bhi chalega technically (React 16+ mein warning aayegi) par wrong hai
<div class="card">   // React console mein warning dega

// Compile hone ke baad (DOM mein):
// <div class="card card--highlighted">  ← Browser ko class attribute milti hai
```

**Iske jaisa hi:** `htmlFor` bhi `for` ki jagah use hota hai (kyunki `for` bhi JS ka reserved keyword hai — loops ke liye).

```jsx
// ✅ React
<label htmlFor="dev-search">Search</label>
<input id="dev-search" />

// ❌ Vanilla HTML wala nahi chalega correctly
<label for="dev-search">Search</label>
```

> **Rule:** Jo bhi HTML attribute JS keyword se clash karta ho, React mein camelCase alternate milta hai. Baaki attributes same hain (`id`, `type`, `placeholder`, `href`, etc.).

---

### Q3: Curly braces `{}` mein kya kya likh sakte hain?

`{}` mein koi bhi **JS expression** chal sakta hai — lekin **statement nahi**.

```jsx
// ✅ Variables
{name}
{developer.role}

// ✅ Arithmetic
{yearsOfExperience * 2}

// ✅ Ternary (expression hai)
{isAvailable ? 'Available' : 'Busy'}

// ✅ Logical AND
{isSelected && <span>✓ Selected</span>}

// ✅ Function calls
{getDisplayName(developer)}
{skills.map(s => <SkillBadge key={s.name} skill={s.name} />)}

// ✅ Template literals
{`${name} — ${role}`}

// ✅ Array (React renders arrays)
{['React', 'TS', 'CSS'].map(s => <span key={s}>{s}</span>)}

// ✅ Object spread (in props)
<SkillBadge {...skillObj} />

// ❌ if/else statement — expression nahi hai
{if (isAvailable) { return <Badge /> }}   // SYNTAX ERROR

// ❌ for loop — statement hai
{for (let i = 0; i < 3; i++) { ... }}    // SYNTAX ERROR

// ❌ Variable declaration — statement hai
{const x = 5}    // SYNTAX ERROR
```

> **Trick:** Agar kuch `=` assign karta hai ya curly braces block banata hai statement wali feel se — wo JSX `{}` mein nahi chalega. Expression use karo — ternary, `.map()`, logical operators.

---

### Q4: Why can't you use `if/else` directly inside JSX return?

JSX `{}` mein sirf **expressions** allowed hain — `if/else` ek **statement** hai, expression nahi.

```jsx
// ❌ Ye nahi chalega — if is a statement, not an expression
function DeveloperCard({ isAvailable }) {
  return (
    <div>
      {if (isAvailable) { <span>Available</span> } else { <span>Busy</span> }}
    </div>
  );
}

// ✅ Option 1 — Ternary (expression hai)
<div>
  {isAvailable ? <span>Available</span> : <span>Busy</span>}
</div>

// ✅ Option 2 — Variable pehle declare karo, return ke baad use karo
function DeveloperCard({ isAvailable }) {
  let statusLabel;
  if (isAvailable) {
    statusLabel = <span style={{ color: 'green' }}>Available</span>;
  } else {
    statusLabel = <span style={{ color: 'gray' }}>Busy</span>;
  }
  return <div>{statusLabel}</div>;
}

// ✅ Option 3 — Early return (best for fundamentally different UIs)
function DeveloperCard({ developer }) {
  if (!developer) return null;               // Kuch mat render karo
  if (developer.isLoading) return <Spinner />;  // Loading state
  return <div>{developer.name}</div>;        // Normal render
}

// ✅ Option 4 — IIFE (rarely used, but valid)
<div>
  {(() => {
    if (isAvailable) return <span>Available</span>;
    if (isBusy) return <span>Busy</span>;
    return <span>Offline</span>;
  })()}
</div>
```

> **Best practice:** Agar do options hain — ternary. Agar ek cheez show/hide karni hai — `&&`. Agar fundamentally alag UI hai — early return ya variable.

---

### Q5: Fragment kyun use karte hain?

React component sirf **ek root element** return kar sakta hai. Fragment ek "invisible wrapper" deta hai DOM mein extra node add kiye bina.

```jsx
// ❌ Ye error dega — adjacent JSX elements must be wrapped
function TwoThings() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>   // Error: Two adjacent elements without wrapper
  );
}

// ✅ Extra div — kaam karta hai but DOM mein unnecessary node aata hai
function TwoThings() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}
// DOM mein aata hai: <div><h1>...</h1><p>...</p></div>

// ✅ Fragment — clean, koi extra DOM node nahi
function TwoThings() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
// DOM mein aata hai: <h1>...</h1><p>...</p>  (no wrapper)
```

**Real problem jab extra div harmful hota hai:**
```jsx
// CSS Flexbox/Grid mein extra div layout todta hai
<ul>
  {items.map(item => (
    <>  {/* Fragment — no extra DOM node between ul and li */}
      <li key={item.id}>{item.name}</li>
      <li key={`${item.id}-sep`}>---</li>
    </>
  ))}
</ul>

// key ke saath Fragment chahiye — short syntax (<>) mein key nahi de sakte
import { Fragment } from 'react';
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.name}</dt>
    <dd>{item.role}</dd>
  </Fragment>
))}
```

> **Rule:** Jab bhi sibling elements return karne ho aur wrapper div layout ya semantics tod raha ho — Fragment use karo.

---

### Q6: `key` prop itna important kyun hai — kya hoga agar na dein?

`key` React ka **reconciliation algorithm** use karta hai ye samajhne ke liye ki list mein kaunsa item changed/added/removed hua.

```jsx
// Data:
const developers = [
  { id: 1, name: 'Priya', role: 'Frontend' },
  { id: 2, name: 'Arjun', role: 'Backend' },
  { id: 3, name: 'Sneha', role: 'Design' },
];

// ❌ key nahi diya — React console warning dega
{developers.map(dev => <DeveloperCard developer={dev} />)}

// ✅ Stable unique ID use karo
{developers.map(dev => <DeveloperCard key={dev.id} developer={dev} />)}

// ⚠️ Index use karna — AVOID (except truly static lists)
{developers.map((dev, index) => <DeveloperCard key={index} developer={dev} />)}
```

**Index key ka problem:**
```
Initial:  [Priya(0), Arjun(1), Sneha(2)]
Delete Arjun:  [Priya(0), Sneha(1)]

Index key se React sochega:
- Item at index 0: unchanged (Priya → Priya ✓)
- Item at index 1: CHANGED! (Arjun → Sneha)  ← Wrong! Poora re-render
- Item at index 2: removed

ID key se React sochega:
- id=1 (Priya): unchanged ✓
- id=2 (Arjun): removed — unmount karo
- id=3 (Sneha): unchanged ✓ — sirf position change hua
```

**Real bugs jo index key se aate hain:**
- Input fields mein value wrong item mein dikhti hai
- Animations wrong element par play hoti hain
- Component state galat item se associate hoti hai

> **Rule:** `key` hamesha stable, unique ID use karo (database ID, UUID). Index sirf tab theek hai jab list kabhi reorder/filter/delete nahi hoti.

---

## Part 4 — Props Deep Dive (Q&A format)

### Q1: Props kaise pass hote hain — object ya individual?

Props internally ek **single object** hain — React saare attributes collect karke ek object banata hai aur component function ko pass karta hai.

```jsx
// Ye likhte hain:
<DeveloperCard
  developer={devObj}
  onHire={handleHire}
  isSelected={true}
/>

// React internally call karta hai:
DeveloperCard({
  developer: devObj,
  onHire: handleHire,
  isSelected: true,
});

// Component definition mein — props object ek saath:
function DeveloperCard(props) {
  console.log(props.developer.name);  // "Priya Sharma"
  console.log(props.isSelected);      // true
}

// Ya destructure at parameter — ye preferred hai:
function DeveloperCard({ developer, onHire, isSelected }) {
  console.log(developer.name);   // "Priya Sharma"
}

// Nested destructuring bhi ho sakta hai:
function DeveloperCard({ developer: { name, role, skills }, onHire }) {
  console.log(name);  // "Priya Sharma"
}
```

**Expected render for sample data:**
```
Props passed:
  developer = { id: 1, name: "Priya Sharma", role: "Senior Frontend", isAvailable: true, ... }
  isSelected = true
  onHire = [Function handleHire]

Renders:
  ┌─────────────────────────────────────┐
  │ [Avatar] Priya Sharma          ✓ Selected │
  │          ● Senior Frontend Engineer  │
  │ 🗓 6 years exp  📁 23 projects  ● Available │
  │ [React:expert] [TypeScript:expert] [CSS:inter] │
  │ [Hire Now]  [View Profile]           │
  └─────────────────────────────────────┘
```

---

### Q2: Default props kaise set karte hain?

**Modern way (React 18+ preferred) — ES6 default parameters:**
```jsx
// Directly parameter mein default value
function DeveloperCard({
  developer,
  onHire,
  onViewProfile,
  isSelected = false,     // Default value — isSelected prop na dene par false
  theme = 'light',        // Koi aur default
}) {
  // ...
}

// Usage:
<DeveloperCard developer={dev} onHire={fn} onViewProfile={fn2} />
// isSelected = false (default)
// theme = 'light' (default)

<DeveloperCard developer={dev} onHire={fn} onViewProfile={fn2} isSelected={true} />
// isSelected = true (explicitly passed)
```

**Legacy way — `defaultProps` (deprecated in React 19):**
```jsx
function SkillBadge({ skill, level }) { /* ... */ }

SkillBadge.defaultProps = {
  level: 'beginner',   // level prop na aane par ye use hoga
};
```

**Object prop ke andar defaults — spread pattern:**
```jsx
// Agar developer object mein koi field missing ho
function DeveloperCard({ developer }) {
  const {
    name,
    role = 'Developer',         // Nested default
    projectCount = 0,
    githubUrl = '#',
  } = developer;

  return <div>{name} — {role} — {projectCount} projects</div>;
}
```

---

### Q3: `children` prop kya hai — kaise use karte hain?

`children` ek special built-in prop hai — component ke opening aur closing tags ke **beech** jo bhi likho wo `children` mein aata hai.

```jsx
// Card component — children accept karta hai
function Card({ children, highlighted = false }) {
  return (
    <div className={highlighted ? 'card card--highlighted' : 'card'}>
      {children}   {/* Yahan render hoga jo bhi parent ne pass kiya */}
    </div>
  );
}

// Usage 1 — simple text
<Card>Hello World</Card>
// children = "Hello World"
// Renders: <div class="card">Hello World</div>

// Usage 2 — JSX elements
<Card highlighted={true}>
  <h3>Priya Sharma</h3>
  <p>Senior Frontend Engineer</p>
</Card>
// children = [<h3>...</h3>, <p>...</p>]
// Renders: <div class="card card--highlighted"><h3>...</h3><p>...</p></div>

// Usage 3 — component composition (TeamDashboard mein):
<Card highlighted={isSelected}>
  <>
    <div>{name}</div>
    <SkillBadge skill="React" />
    <button onClick={handleHireClick}>Hire</button>
  </>
</Card>

// Multiple named children — render props pattern (advanced)
function Layout({ header, sidebar, main }) {
  return (
    <div>
      <nav>{header}</nav>
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}
// Usage:
<Layout
  header={<TopNav />}
  sidebar={<FilterPanel />}
  main={<DeveloperList />}
/>
```

**`children` ke saath kaam karne wale React utilities:**
```jsx
import { Children, cloneElement } from 'react';

// Children count
Children.count(children)

// Children iterate
Children.map(children, child => cloneElement(child, { extraProp: true }))
```

---

### Q4: Props read-only kyun hain — mutation kya problem create karta hai?

React ka **one-way data flow** model hai — data parent se child ki taraf jaata hai, ulti direction mein nahi. Props mutate karna is model ko todta hai.

```jsx
// ❌ KABHI MAT KARO — props mutate karna
function DeveloperCard({ developer }) {
  developer.name = 'Modified Name';    // Direct mutation — WRONG
  developer.isAvailable = true;        // Wrong! Parent ko pata nahi chalega

  return <div>{developer.name}</div>;
}

// Problems:
// 1. Parent component ko pata nahi chalega ki data change hua
// 2. React re-render trigger nahi hoga
// 3. Agar same developer object multiple jagah use ho raha hai — sab jagah corrupt hoga
// 4. Debugging mushkil — mutation ka source trace karna impossible ho jaata hai

// ✅ SAHI TARIKA — callback prop se parent ko bata do
function DeveloperCard({ developer, onUpdate }) {
  function handleMarkAvailable() {
    // Parent ko naya data bhejo — wo apna state update karega
    onUpdate({ ...developer, isAvailable: true });   // Spread — original copy, modified copy
  }

  return (
    <div>
      {developer.name}
      <button onClick={handleMarkAvailable}>Mark Available</button>
    </div>
  );
}

// Parent mein:
function TeamDashboard() {
  const [developers, setDevelopers] = useState(initialDevelopers);

  function handleUpdate(updatedDev) {
    setDevelopers(prev =>
      prev.map(d => d.id === updatedDev.id ? updatedDev : d)
    );
  }

  return developers.map(dev => (
    <DeveloperCard key={dev.id} developer={dev} onUpdate={handleUpdate} />
  ));
}
```

> **Mental model:** Props ko function ke arguments samjho — koi bhi well-designed function apne arguments modify nahi karta. Data aana ek taraf se, callback jaana doosre taraf se — ye **"lifting state up"** pattern hai jo Part 2 mein depth mein cover hoga.

---

### Q5: Spread props — kab use karein, kab avoid karein?

```jsx
// Spread props — ek object ke saare keys as individual props
const inputProps = {
  type: 'text',
  placeholder: 'Search...',
  onChange: handleSearchChange,
  style: { padding: '8px' },
};

// ✅ USE KARO — jab generic wrapper/passthrough component bana rahe ho
function SearchInput(props) {
  return <input {...props} />;   // Saare props input par jaate hain
}

// Usage:
<SearchInput type="text" placeholder="Dev search..." onChange={fn} />

// ✅ USE KARO — known props extract karo, baaki pass karo (rest pattern)
function Card({ highlighted, className, children, ...rest }) {
  // highlighted aur className Card ne consume kiya
  // ...rest mein jo bacha (data-*, aria-*, etc.) wo div ko jaata hai
  return (
    <div
      className={`card ${highlighted ? 'card--highlighted' : ''} ${className || ''}`}
      {...rest}   // data-testid, aria-label, etc. directly pass hoga
    >
      {children}
    </div>
  );
}

// ⚠️ AVOID KARO — blind spread (koi bhi unknown prop pass ho sakti hai)
function DeveloperCard({ ...allProps }) {
  return <div {...allProps} />;   // Dangerous — developer, onHire jaisi non-DOM props div tak jaayengi
}
// React warning: Unknown prop `onHire` on <div> tag.

// ⚠️ AVOID KARO — performance sensitive components mein (unnecessary re-renders)
// Better: explicit props listing se intent clear hota hai
```

**Expected renders with spread:**
```jsx
const devCardProps = {
  developer: priyaDev,
  onHire: handleHire,
  onViewProfile: handleView,
  isSelected: true,
};

<DeveloperCard {...devCardProps} />
// Same as:
<DeveloperCard
  developer={priyaDev}
  onHire={handleHire}
  onViewProfile={handleView}
  isSelected={true}
/>
// Renders: Priya's card with "✓ Selected" badge and highlighted border
```

---

## Part 5 — React vs Vanilla JS/TS Differences

### 1. JSX vs `createElement` — Element Banane Ka Tarika

````carousel
**React JSX**
```jsx
// Declarative — "kya dikhna chahiye" describe karo
function DeveloperCard({ name, role }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}
```
<!-- slide -->
**Vanilla JS/TS**
```ts
// Imperative — "kaise banana hai" step by step batao
function createDeveloperCard(name: string, role: string): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';

  const h3 = document.createElement('h3');
  h3.textContent = name;

  const p = document.createElement('p');
  p.textContent = role;

  card.appendChild(h3);
  card.appendChild(p);
  return card;
}
document.body.appendChild(createDeveloperCard('Priya', 'Frontend'));
```
````

---

### 2. Event Binding — React vs Vanilla

````carousel
**React**
```jsx
// onClick prop — function reference dete hain (string nahi)
// React saare events root par delegate karta hai (event delegation auto)
<button onClick={handleHireClick}>Hire</button>
<button onClick={() => onHire(developer.id)}>Hire</button>

// Synthetic Event — React ka wrapper
function handleClick(event) {
  event.preventDefault();           // Works same
  console.log(event.target);        // Works same
  console.log(event.nativeEvent);   // Original browser event
}
```
<!-- slide -->
**Vanilla JS/TS**
```ts
// addEventListener — manually attach karo
const btn = document.querySelector('#hire-btn') as HTMLButtonElement;
btn.addEventListener('click', handleHireClick);

// Ya inline (bad practice):
btn.onclick = handleHireClick;

// Manual cleanup zaroori hai:
btn.removeEventListener('click', handleHireClick);

// React mein cleanup automatic hota hai jab component unmount hota hai
```
````

---

### 3. `className` vs `class`

````carousel
**React JSX**
```jsx
// className — static
<div className="card">...</div>

// Dynamic className — ternary ya template literal
<div className={`card ${isSelected ? 'card--selected' : ''}`}>

// Multiple conditional classes
<div className={[
  'card',
  isSelected && 'card--selected',
  isAvailable && 'card--available',
].filter(Boolean).join(' ')}>
```
<!-- slide -->
**Vanilla JS/TS**
```ts
// Direct attribute
el.className = 'card';

// classList — better API
el.classList.add('card');
el.classList.toggle('card--selected', isSelected);
el.classList.toggle('card--available', isAvailable);

// getAttribute/setAttribute
el.setAttribute('class', 'card card--selected');
```
````

---

### 4. List Rendering

````carousel
**React — `.map()` with key**
```jsx
function TeamDashboard({ developers }) {
  return (
    <div>
      {developers.map(dev => (
        <DeveloperCard
          key={dev.id}         // Required! Stable unique ID
          developer={dev}
          onHire={handleHire}
          onViewProfile={handleView}
        />
      ))}
    </div>
  );
}
// React tracks each item by key — efficient updates
```
<!-- slide -->
**Vanilla JS/TS**
```ts
function renderTeam(developers: Developer[], container: HTMLElement): void {
  container.innerHTML = '';   // Clear first (or diff manually)

  developers.forEach(dev => {
    const card = createDeveloperCard(dev);
    container.appendChild(card);
  });
}

// Problem: No tracking — har update par poora re-render
// Animated transitions? Custom diff logic likhna padega
// React ye sab internally karta hai Virtual DOM ke through
```
````

---

### 5. Conditional Rendering

````carousel
**React**
```jsx
// && operator
{isAvailable && <span className="badge badge--available">Available</span>}

// Ternary
{isAvailable ? (
  <button onClick={handleHire}>Hire Now</button>
) : (
  <button disabled>Not Available</button>
)}

// Early return
if (!developer) return null;
if (isLoading) return <Spinner />;
return <DeveloperCard developer={developer} />;
```
<!-- slide -->
**Vanilla JS/TS**
```ts
// display none/block toggle
badge.style.display = isAvailable ? 'inline-block' : 'none';

// DOM removal/addition
if (isAvailable) {
  container.appendChild(hireBtn);
} else {
  hireBtn.remove();
}

// Template literal conditionals (messy for complex UI)
container.innerHTML = `
  ${isAvailable ? '<span class="badge">Available</span>' : ''}
  <button ${isAvailable ? '' : 'disabled'}>
    ${isAvailable ? 'Hire Now' : 'Not Available'}
  </button>
`;
```
````

---

### 6. Component Reuse

````carousel
**React — Reusable Components**
```jsx
// SkillBadge ek baar define — har jagah use karo
<SkillBadge skill="React" level="expert" />
<SkillBadge skill="TypeScript" level="intermediate" />
<SkillBadge skill="CSS" />  // Default level = 'beginner'

// Automatically: styles, behavior, PropTypes validation sab milta hai
// Parent ko internals ki chinta nahi
```
<!-- slide -->
**Vanilla JS/TS**
```ts
// Factory function ya class — similar but more boilerplate
function createSkillBadge(skill: string, level: string = 'beginner'): HTMLSpanElement {
  const badge = document.createElement('span');
  badge.className = `badge badge--${level}`;
  badge.textContent = skill;
  badge.style.backgroundColor = levelColors[level];
  // ... more manual setup
  return badge;
}

// Usage:
container.appendChild(createSkillBadge('React', 'expert'));
container.appendChild(createSkillBadge('TypeScript', 'intermediate'));
container.appendChild(createSkillBadge('CSS'));
```
````

---

### 7. Props vs Function Arguments

````carousel
**React Props**
```jsx
// Props — named, optional, self-documenting
<DeveloperCard
  developer={priyaDev}
  onHire={handleHire}
  isSelected={true}       // Optional — has default
/>

// Component clearly documents what it expects:
DeveloperCard.propTypes = {
  developer: PropTypes.object.isRequired,
  onHire: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,    // Optional
};

// Order doesn't matter — named props hain
```
<!-- slide -->
**Vanilla JS Function Args**
```ts
// Positional arguments — order matters, easy to mix up
createDeveloperCard(priyaDev, handleHire, true);  // What is 'true'?

// Better: options object (same as React props actually!)
function createDeveloperCard({
  developer,
  onHire,
  isSelected = false,
}: {
  developer: Developer;
  onHire: (id: number) => void;
  isSelected?: boolean;
}) {
  // ...
}
// React props essentially is same pattern ko components par apply karta hai
```
````

---

### 8. One-Way Data Flow

````carousel
**React — Unidirectional**
```jsx
// Data: Parent → Child (props)
// Events: Child → Parent (callbacks)

function TeamDashboard() {
  const [selected, setSelected] = useState(null);

  return developers.map(dev => (
    <DeveloperCard
      key={dev.id}
      developer={dev}
      isSelected={dev.id === selected}      // Data flows DOWN
      onHire={(id) => setSelected(id)}      // Events flow UP
    />
  ));
}

// DeveloperCard never directly modifies parent's state
// Clear, traceable data flow — easy to debug
```
<!-- slide -->
**Vanilla JS — Two-Way / Manual**
```ts
// Direct DOM access — any function can modify anything
let selectedId: number | null = null;

function renderCards() {
  developers.forEach(dev => {
    const card = createDeveloperCard(dev);
    const btn = card.querySelector('button');

    btn?.addEventListener('click', () => {
      selectedId = dev.id;    // Global state mutation
      renderCards();          // Manual re-render
    });

    if (dev.id === selectedId) {
      card.classList.add('selected');
    }

    container.appendChild(card);
  });
}
// Any function can read/write selectedId — harder to trace
```
````

---

### 9. `null` vs `display:none` — Component ka "Hide" karna

```jsx
// React way — component unmount karo (DOM se hata do)
{showProfile && <DeveloperProfile developer={selected} />}

// Agar component unmount hota hai:
// ✓ DOM se hata jaata hai — memory free
// ✓ Component ka internal state reset hoti hai
// ✓ Side effects cleanup hote hain (useEffect return)

// Agar sirf CSS hide karna chahte ho (state preserve karne ke liye):
<DeveloperProfile
  developer={selected}
  style={{ display: showProfile ? 'block' : 'none' }}
/>
// Ya CSS class se: className={showProfile ? '' : 'hidden'}
// Component mounted rahega — state preserve hogi
```

```ts
// Vanilla JS equivalent — manual toggle
const profile = document.getElementById('dev-profile');
profile.style.display = showProfile ? 'block' : 'none';
// Ya:
profile.classList.toggle('hidden', !showProfile);
```

---

### 10. Inline Style — Object vs String

```jsx
// React — JS object, camelCase properties
<div style={{
  backgroundColor: '#4f46e5',      // background-color nahi
  borderRadius: '12px',
  fontSize: '14px',
  paddingLeft: '16px',             // padding-left nahi
  marginTop: 0,                    // Numbers = pixels (kuch properties mein)
}}>

// CSS-in-JS feel — dynamic values easy hain:
<div style={{ color: isAvailable ? '#22c55e' : '#6b7280' }}>

// Double curly braces kyun?
// Outer {} = JSX expression
// Inner {} = JavaScript object literal
```

```ts
// Vanilla JS — same camelCase (JS DOM style)
el.style.backgroundColor = '#4f46e5';
el.style.borderRadius = '12px';

// Ya CSS string (setAttribute):
el.setAttribute('style', 'background-color: #4f46e5; border-radius: 12px;');
// Yahan kebab-case chalti hai — string hai toh
```

---

## Part 6 — Practice Tasks

> **Instructions:** Neeche diye gaye tasks `TeamDashboard.jsx` mein changes karke complete karo. Saare tasks same file par hain — ek ke baad ek karo. Solutions khud try karo — next tutorial mein discuss honge.

---

### Task 1 — Filter by Availability 🟢

`TeamDashboard` component mein ek "Show Only Available" checkbox add karo (`<input type="checkbox">`). Jab checked ho, sirf `isAvailable: true` wale developers dikhne chahiye. Unchecked karne par saare dikhne chahiye.

**Hints:**
- `onChange` event pe `event.target.checked` use karo
- Ek variable banao filtered developers ke liye
- Abhi ke liye React `useState` nahi, sirf ek local variable se try karo — kya problem aati hai? (Ye state ka pehla intuition hai)

---

### Task 2 — `SkillBadge` mein Tooltip 💬

`SkillBadge` component mein level ka tooltip add karo. Jab user badge par hover kare, `title` attribute se tooltip dikhna chahiye jisme likha ho: `"Skill level: expert"` (ya jo level ho).

**Hints:**
- `title` HTML attribute — kaise JSX mein pass karein?
- Template literal use karo `title` ki value ke liye
- `PropTypes` update karna mat bhoolna

---

### Task 3 — Empty State Message 📭

Abhi `developers` array mein teen items hain. Array ko temporarily empty karo (`const developers = []`). Jab array empty ho, tab page par dikhna chahiye:

```
No developers on the team yet.
Click "Add Developer" to get started.
```

Ye message ek styled box mein centered dikhna chahiye. Array mein item wapas daloge toh message gayab hona chahiye — developers ki list dikhni chahiye.

**Hints:**
- `developers.length === 0` condition
- `&&` ya ternary — dono mein se jo better lage

---

### Task 4 — `DeveloperCard` mein Experience Bar 📊

Har `DeveloperCard` mein `yearsOfExperience` ke basis par ek progress bar add karo. Assume karo ki 10 years = 100%. Bar ka color experience ke hisaab se change kare:
- 0–3 years → green (`#22c55e`)
- 4–7 years → blue (`#3b82f6`)
- 8+ years → purple (`#7c3aed`)

**Hints:**
- Bar ka width `style={{ width: \`${percentage}%\` }}` se set hoga
- Percentage calculate karo: `Math.min((years / 10) * 100, 100)`
- Inline style mein `backgroundColor` dynamically set karo

---

### Task 5 — `Card` Component mein `onClick` Support 🖱️

`Card` component ko clickable banana hai. Parent se ek optional `onClick` prop accept karo. Jab `onClick` pass ho:
- Poora card clickable dikhna chahiye (`cursor: pointer`)
- Click karne par `onClick` function call ho
- Keyboard accessibility ke liye `role="button"` aur `tabIndex={0}` bhi add karo

Jab `onClick` pass na ho — card normal non-interactive rahna chahiye.

**Hints:**
- Optional prop: `onClick = undefined`
- Conditional style: `cursor: onClick ? 'pointer' : 'default'`
- Spread ya conditional attributes — dono approaches try karo

---

*End of File 1 — JSX & Components*  
*File 2 will cover: `useState`, `useEffect`, `useRef`, controlled components, and custom hooks.*
