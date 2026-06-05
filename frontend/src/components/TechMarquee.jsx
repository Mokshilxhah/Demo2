import React from 'react';
import {
  FaReact, FaNodeJs, FaPython, FaJava, FaAws, FaDocker, FaVuejs,
} from 'react-icons/fa';
import {
  SiMongodb, SiPostgresql, SiNextdotjs, SiDjango, SiSpringboot,
  SiTypescript, SiRedis, SiGraphql, SiFastapi, SiTailwindcss,
  SiFirebase, SiPrisma, SiVercel, SiGithub,
} from 'react-icons/si';

const row1 = [
  { Icon: FaReact,      name: 'React',       color: '#61dafb', tip: 'Component-based UI — pairs with any backend' },
  { Icon: SiNextdotjs,  name: 'Next.js',      color: '#e0e0e0', tip: 'Full-stack React with SSR & routing built-in' },
  { Icon: FaVuejs,      name: 'Vue.js',       color: '#42b883', tip: 'Progressive JS framework — gentle learning curve' },
  { Icon: SiTypescript, name: 'TypeScript',   color: '#3178c6', tip: 'Type-safe JavaScript — fewer runtime bugs' },
  { Icon: SiTailwindcss,name: 'Tailwind CSS', color: '#38bdf8', tip: 'Utility-first CSS — fast, consistent styling' },
  { Icon: FaNodeJs,     name: 'Node.js',      color: '#68a063', tip: 'JS runtime for scalable server-side logic' },
  { Icon: SiDjango,     name: 'Django',       color: '#44b78b', tip: 'Batteries-included Python web framework' },
  { Icon: SiSpringboot, name: 'Spring Boot',   color: '#6db33f', tip: 'Production-grade Java backend ecosystem' },
  { Icon: FaPython,     name: 'Python',        color: '#4b8bbf', tip: 'Ideal for AI/ML pipelines and backend APIs' },
];

const row2 = [
  { Icon: SiMongodb,    name: 'MongoDB',    color: '#47a248', tip: 'Flexible NoSQL — great for unstructured data' },
  { Icon: SiPostgresql, name: 'PostgreSQL', color: '#336791', tip: 'ACID-compliant relational DB — our top pick' },
  { Icon: SiRedis,      name: 'Redis',      color: '#dc382d', tip: 'In-memory store for caching & queues' },
  { Icon: FaJava,       name: 'Java',       color: '#f89820', tip: 'Robust language powering enterprise systems' },
  { Icon: SiVercel,     name: 'Vercel',     color: '#e0e0e0', tip: 'Zero-config deployment for frontend & edge' },
  { Icon: SiGithub,     name: 'GitHub',     color: '#ccc',    tip: 'Version control, CI/CD, and collaboration' },
];

function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-row">
      <div className={`marquee-track${reverse ? ' rev' : ''}`}>
        {doubled.map((item, i) => (
          <div key={i} className="marquee-item">
            <item.Icon style={{ color: item.color, fontSize: '1.1rem', opacity: 0.75 }} />
            <span>{item.name}</span>
            <div className="m-tooltip">{item.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-fade-left" />
      <div className="marquee-fade-right" />

      <MarqueeRow items={row1} reverse={false} />
      <MarqueeRow items={row2} reverse={true} />
    </div>
  );
}
