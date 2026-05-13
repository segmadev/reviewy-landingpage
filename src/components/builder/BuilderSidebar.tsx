import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Target, Phone, Briefcase, GraduationCap, Lightbulb, AlignLeft, PlusCircle, Trophy } from 'lucide-react';
import { useBuilder } from '../../context/BuilderContext';

const steps = [
  { num: 1, label: 'Job Targeting',       icon: Target     },
  { num: 2, label: 'CV Contact',           icon: Phone      },
  { num: 3, label: 'Work History',         icon: Briefcase  },
  { num: 4, label: 'Education',            icon: GraduationCap },
  { num: 5, label: 'Skills',               icon: Lightbulb  },
  { num: 6, label: 'Professional Summary', icon: AlignLeft  },
  { num: 7, label: 'Additional Info',      icon: PlusCircle },
  { num: 8, label: 'Result',               icon: Trophy     },
];

export default function BuilderSidebar() {
  const { state, goToStep } = useBuilder();
  const current = state.currentStep;

  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col h-screen sticky top-0 overflow-hidden" style={{ backgroundColor: '#65B026' }}>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link to="/">
          <img src="/asstes/onwhite-logo.png" alt="ReviewyMe" className="h-6 w-auto brightness-0 invert" />
        </Link>
      </div>

      {/* Section label */}
      <p className="px-5 pb-3 text-[10px] uppercase tracking-[0.18em] text-white/50 font-semibold">
        CV Sections
      </p>

      {/* Steps */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {steps.map(({ num, label, icon: Icon }) => {
            const done   = num < current;
            const active = num === current;
            const future = num > current;

            return (
              <li key={num}>
                <motion.button
                  onClick={() => (done || active) && goToStep(num)}
                  whileHover={!future ? { x: 2 } : {}}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    active
                      ? 'bg-white/20 text-white'
                      : done
                      ? 'text-white/80 hover:bg-white/10'
                      : 'text-white/40 cursor-default'
                  }`}
                  disabled={future}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      active
                        ? 'bg-white/30 text-white'
                        : done
                        ? 'bg-white/15 text-white/80'
                        : 'bg-white/10 text-white/30'
                    }`}
                  >
                    {done ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-sm font-medium leading-tight">{label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress bar at very bottom */}
      <div className="px-5 py-4 mt-auto">
        <div className="flex justify-between text-[10px] text-white/50 mb-1.5">
          <span>Progress</span>
          <span>{Math.round(((Math.min(current, 7) - 1) / 7) * 100)}%</span>
        </div>
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: `${((Math.min(current, 7) - 1) / 7) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </aside>
  );
}
