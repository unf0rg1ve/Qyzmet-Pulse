import { ClipboardCheck, FileCheck2, ShieldAlert } from 'lucide-react';
import { ResultList } from '../components/ResultList';
import type { QualityResult } from '../types/domain';

export function QualityView({
  draftAnswer,
  qualityResult,
  setDraftAnswer,
  runCheck,
}: {
  draftAnswer: string;
  qualityResult: QualityResult | null;
  setDraftAnswer: (answer: string) => void;
  runCheck: () => void;
}) {
  return (
    <section className="two-column-grid">
      <section className="panel form-panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Anti-Otpiska</span>
            <h2>Проверка ответа</h2>
          </div>
          <ClipboardCheck size={19} />
        </div>
        <textarea className="answer-box" value={draftAnswer} onChange={(event) => setDraftAnswer(event.target.value)} />
        <button className="primary-button wide-button" onClick={runCheck}>
          <FileCheck2 size={18} />
          Проверить качество
        </button>
      </section>
      <section className="panel quality-result">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Quality score</span>
            <h2>{qualityResult ? `${qualityResult.score}%` : 'Ожидает проверки'}</h2>
          </div>
          <ShieldAlert size={19} />
        </div>
        {qualityResult ? (
          <>
            <p className="verdict">{qualityResult.verdict}</p>
            <ResultList title="Что хорошо" items={qualityResult.passed} positive />
            <ResultList title="Что исправить" items={qualityResult.missing} />
            <div className="improved-answer">
              <span>Улучшенная версия</span>
              <p>{qualityResult.improvedAnswer}</p>
            </div>
          </>
        ) : (
          <p className="muted-copy">Вставьте проект ответа госоргана, и система оценит риск формальной отписки.</p>
        )}
      </section>
    </section>
  );
}
