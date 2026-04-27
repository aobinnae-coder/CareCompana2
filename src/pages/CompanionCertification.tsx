import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, ArrowLeft, CheckCircle2 } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    q: "What is the primary role of a CareCompana companion?",
    options: ["A) Prescribe medication workflows", "B) Provide non-medical social companionship and safe assistance", "C) Modify client treatment plans", "D) Transport clients to emergency rooms"],
    answer: 1 // B
  },
  {
    q: "If a client requests help organizing their daily medications, you should:",
    options: ["A) Sort the pills for them by day", "B) Decline politely as administering or organizing medication is strictly prohibited", "C) Count the pills to ensure they match", "D) Check their prescription labels"],
    answer: 1 // B
  },
  {
    q: "Which of the following is a sign of potential financial exploitation?",
    options: ["A) Client pays for their own groceries", "B) Sudden unpaid bills or missing valuable items from the home", "C) Client tipping you using the app", "D) Family members paying the platform fees"],
    answer: 1 // B
  },
  {
    q: "If a client falls during a visit, what is the required protocol?",
    options: ["A) Pick them up immediately", "B) Give them water", "C) Do NOT move them, call 911 immediately if injured, and file an Emergency Incident Report", "D) Wait to see if they feel better"],
    answer: 2 // C
  },
  {
    q: "As a CareCompana companion, you are a mandatory reporter under state law. This means:",
    options: ["A) You only report if the family asks you to", "B) You must immediately report any reasonable suspicion of abuse, neglect, or exploitation to Adult Protective Services (APS)", "C) You report issues at the end of the month", "D) You are not required to report"],
    answer: 1 // B
  },
  {
    q: "A client seems unusually tearful and mentions they haven't been eating much lately. What should you do?",
    options: ["A) Try to diagnose them with depression", "B) Ignore it, it's just part of aging", "C) Document these observations in your post-visit summary as they may indicate depression or another issue, and inform the family.", "D) Force them to eat"],
    answer: 2 // C
  },
  {
    q: "When visiting a client with different cultural or dietary practices than your own, you should:",
    options: ["A) Educate them on your practices instead", "B) Respect their customs and avoid making assumptions", "C) Refuse to assist with meals", "D) Request a different client"],
    answer: 1 // B
  },
  {
    q: "Upon arriving at a client's home, what is the first step for infection control?",
    options: ["A) Start making coffee", "B) Wash your hands immediately", "C) Hug the client", "D) Open all the windows"],
    answer: 1 // B
  },
  {
    q: "If you observe a non-emergency hazard in the client's home, such as a loose rug, you should:",
    options: ["A) Call 911", "B) Throw the rug away", "C) Report the hazard via your incident logs so the family can be notified", "D) Ignore it as long as nobody falls"],
    answer: 2 // C
  },
  {
    q: "If you find yourself experiencing compassion fatigue or burnout, the professional course of action is to:",
    options: ["A) Cancel all your visits without notice", "B) Reach out to the CareCompana office for support to ensure safety and well-being for all", "C) Vent your frustrations to the clients", "D) Stop interacting during visits"],
    answer: 1 // B
  }
];

export default function CompanionCertification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = Legal, 1 = Training, 2 = Quiz, 3 = Result
  const [legalConsents, setLegalConsents] = useState({
    TOS: false,
    HIPAA: false,
    LIABILITY: false,
    BACKGROUND: false
  });
  
  const [answers, setAnswers] = useState<number[]>(new Array(QUIZ_QUESTIONS.length).fill(-1));
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleLegalSubmit = async () => {
    if (Object.values(legalConsents).some(v => !v)) {
      alert("You must agree to all policies to continue.");
      return;
    }
    setStep(1);
  };

  const handleQuizSubmit = async () => {
    if (answers.some(a => a === -1)) {
      alert("Please answer all questions.");
      return;
    }

    let correct = 0;
    answers.forEach((ans, idx) => {
      if (ans === QUIZ_QUESTIONS[idx].answer) correct++;
    });

    const isPass = correct >= 8; // 80% pass rate for 10 questions
    setScore(correct);
    setPassed(isPass);

    await fetch('/api/companions/CMP-001/certify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: correct, passed: isPass, signature: "Signed Electronically" })
    });

    setStep(3);
  };

  if (step === 0) {
    return (
      <div className="max-w-md mx-auto bg-[#0C0C0D] border-x border-slate-800 min-h-screen text-slate-300 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6">
           <button onClick={() => navigate('/companion')} className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-full border border-slate-700 text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-light text-white leading-tight mb-2">Legal & Compliance Onboarding</h2>
          <p className="text-sm text-slate-500 mb-8">Please review and digitally sign the mandatory agreements to activate your companion profile.</p>

          <div className="space-y-4">
            <ConsentBox 
              title="Terms of Service & Platform Rules"
              desc="I acknowledge CareCompana is a technology platform connecting independent contractors with clients. I will not provide medical services."
              checked={legalConsents.TOS}
              onChange={(c) => setLegalConsents(p => ({...p, TOS: c}))}
            />
            <ConsentBox 
              title="HIPAA-Aligned Privacy Policy"
              desc="I agree to protect health-adjacent sensitive information and follow minimum-necessary data access rules."
              checked={legalConsents.HIPAA}
              onChange={(c) => setLegalConsents(p => ({...p, HIPAA: c}))}
            />
            <ConsentBox 
              title="Companion Liability Waiver"
              desc="I assume risks associated with companion services and agree to the independent contractor indemnification terms."
              checked={legalConsents.LIABILITY}
              onChange={(c) => setLegalConsents(p => ({...p, LIABILITY: c}))}
            />
            <ConsentBox 
              title="FCRA Background Check Consent"
              desc="I authorize CareCompana to pull my county, state, and national criminal records via Checkr."
              checked={legalConsents.BACKGROUND}
              onChange={(c) => setLegalConsents(p => ({...p, BACKGROUND: c}))}
            />
          </div>

          <button onClick={handleLegalSubmit} className="w-full mt-8 py-4 bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-opacity">
            Acknowledge & Proceed to Quiz
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-md mx-auto bg-[#0C0C0D] border-x border-slate-800 min-h-screen text-slate-300 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        <div className="bg-blue-600 p-6 z-10 shrink-0">
          <h2 className="text-white font-bold uppercase tracking-widest text-sm text-center">Companion Training Handbook</h2>
        </div>
        <div className="p-6 overflow-y-auto pb-32 space-y-8 flex-1">
          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900">
             <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide text-xs">Module 1: Role & Boundaries</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               Companions provide social connection and practical observation. <strong>Do not</strong> perform skilled nursing, administer medication, or provide clinical care. Arrive on time and communicate respectfully.
             </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900">
             <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide text-xs">Module 2: Mental Health & Culture</h3>
             <p className="text-sm text-slate-400 leading-relaxed mb-3">
               Understand cultural customs and dietary practices without assumptions. Recognize signs of depression (loss of appetite, tearfulness) and document them. Do not provide therapy.
             </p>
          </div>

          <div className="border border-blue-500/30 rounded-2xl p-5 bg-blue-600/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
             <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-xs flex items-center gap-2">
               ⚠ Mandatory Reporting
             </h3>
             <p className="text-sm text-slate-300 leading-relaxed mb-3">
               If you suspect <strong>elder abuse, neglect, or financial exploitation</strong>, you are legally obligated to report it to Adult Protective Services (APS) and CareCompana immediately. You are protected from retaliation.
             </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900">
             <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide text-xs">Module 3: Safety & Infection Control</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               Wash hands upon arrival. Do not visit if you have symptoms of contagious illness. Report all hazards via incident logs. Know the difference between non-emergency escalation and calling 911.
             </p>
          </div>

          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900">
             <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide text-xs">Module 4: Burnout Prevention</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               Emotional labor is real. If you experience compassion fatigue, reach out to the CareCompana office. Asking for help is professional and ensures safety for all.
             </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full max-w-md bg-slate-900 border-t border-slate-800 p-4 z-50">
           <button onClick={() => setStep(2)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
            Continue to Quiz
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto bg-[#0C0C0D] border-x border-slate-800 min-h-screen text-slate-300 relative pb-24 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="bg-blue-600 p-6 sticky top-0 z-50">
          <h2 className="text-white font-bold uppercase tracking-widest text-sm text-center">Safety Certification Quiz</h2>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto pb-32">
          {QUIZ_QUESTIONS.map((q, qIndex) => (
            <div key={qIndex} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <p className="text-white font-medium text-sm mb-4 leading-relaxed">{q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, oIndex) => (
                  <button 
                    key={oIndex} 
                    onClick={() => {
                       const newAns = [...answers];
                       newAns[qIndex] = oIndex;
                       setAnswers(newAns);
                    }}
                    className={`w-full text-left p-3 text-xs font-medium rounded-xl border transition-colors ${answers[qIndex] === oIndex ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full max-w-md bg-slate-900 border-t border-slate-800 p-4 z-50">
           <button onClick={handleQuizSubmit} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
            Submit Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#0C0C0D] border-x border-slate-800 min-h-screen p-6 flex flex-col items-center justify-center text-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {passed ? (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-[#0A192F] border border-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 opacity-20 rotate-45 transform scale-150"></div>
             <Award className="w-12 h-12 text-emerald-400 relative z-10" />
          </div>
          <h2 className="text-2xl font-light text-white mb-2">Certification Complete</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">Score: {score}/{QUIZ_QUESTIONS.length}</p>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full text-left mb-8">
            <h3 className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">CareCompana Certified</h3>
            <p className="text-white text-sm font-medium">Maria Gonzalez</p>
            <p className="text-[10px] text-slate-500 font-mono mt-2">CERT ID: CC-2025-000001</p>
            <p className="text-[10px] text-slate-500 font-mono">Valid Through: 12/2026</p>
          </div>

          <button onClick={() => navigate('/companion')} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 uppercase tracking-widest text-xs">
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-light text-white mb-2">Did Not Pass</h2>
          <p className="text-slate-400 text-sm mb-8">You scored {score}/{QUIZ_QUESTIONS.length}. A minimum score of 80% is required to pass the mandatory safety certification.</p>
          <button onClick={() => { setStep(1); setAnswers(new Array(QUIZ_QUESTIONS.length).fill(-1)); }} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 uppercase tracking-widest text-xs mb-4">
            Retake Assessment
          </button>
           <button onClick={() => navigate('/companion')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl border border-slate-800 hover:bg-slate-800 uppercase tracking-widest text-xs">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

function ConsentBox({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} className="flex items-start gap-4 p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl cursor-pointer">
       <div className="mt-1">
         {checked ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 border-2 border-slate-600 rounded-full"></div>}
       </div>
       <div>
         <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
         <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-medium tracking-wide">{desc}</p>
       </div>
    </div>
  );
}
