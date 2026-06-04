import React from 'react';
import { FaReact, FaNodeJs, FaPython, FaJava, FaAws, FaDocker } from 'react-icons/fa';
import { SiMongodb, SiPostgresql, SiNextdotjs, SiDjango, SiSpringboot, SiTypescript, SiRedis, SiGraphql } from 'react-icons/si';

const icons = [
  { el: <FaReact color="#61dafb" />, name: 'React' },
  { el: <FaNodeJs color="#68a063" />, name: 'Node.js' },
  { el: <SiMongodb color="#47a248" />, name: 'MongoDB' },
  { el: <FaPython color="#4b8bbf" />, name: 'Python' },
  { el: <SiDjango color="#44b78b" />, name: 'Django' },
  { el: <FaJava color="#f89820" />, name: 'Java' },
  { el: <SiSpringboot color="#6db33f" />, name: 'Spring' },
  { el: <SiPostgresql color="#336791" />, name: 'Postgres' },
  { el: <SiNextdotjs color="#ffffff" />, name: 'Next.js' },
  { el: <SiTypescript color="#3178c6" />, name: 'TypeScript' },
  { el: <SiRedis color="#dc382d" />, name: 'Redis' },
  { el: <SiGraphql color="#e10098" />, name: 'GraphQL' },
];

export default function TechMarquee() {
  const doubled = [...icons, ...icons];
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((ic, i) => (
          <span key={i} className="marquee-icon" title={ic.name} style={{ fontSize: '2rem' }}>
            {ic.el}
          </span>
        ))}
      </div>
    </div>
  );
}
