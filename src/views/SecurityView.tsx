import { LockKeyhole } from 'lucide-react';
import { securityModel } from '../lib/securityModel';

export function SecurityView() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Privacy & security</span>
          <h2>Безопасность и доступы</h2>
        </div>
        <LockKeyhole size={20} />
      </div>
      <div className="regulation-grid">
        {securityModel.map((section) => (
          <article className="regulation-card" key={section.layer}>
            <span className="priority-pill high">{section.layer}</span>
            <strong>{section.layer}</strong>
            <p>{section.controls.join(' · ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
