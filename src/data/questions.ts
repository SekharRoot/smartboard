import { Question } from '../types';
import { questionsSet1 } from './questionsSet1';
import { questionsSet2 } from './questionsSet2';
import { questionsSet3 } from './questionsSet3';
import { questionsSet4 } from './questionsSet4';

const rawQuestions: Question[] = [
  ...questionsSet1,
  ...questionsSet2,
  ...questionsSet3,
  ...questionsSet4,
];

// Helper to evenly randomize and distribute options and correct answers across A, B, C, D
function randomizeQuestionOptions(q: Question): Question {
  // 1. Identify the correct answer text
  const currentCorrect = q.options.find((o) => o.label === q.correctOption);
  const correctText = currentCorrect ? currentCorrect.text : q.finalAnswer;

  // 2. Extract option texts
  const otherTexts = q.options
    .map((o) => o.text)
    .filter((txt) => txt !== correctText);

  // If options were duplicated or missing, fill
  while (otherTexts.length < 3) {
    otherTexts.push(`Option ${otherTexts.length + 1}`);
  }

  // Shuffle incorrect option texts pseudo-randomly using question id
  const shuffledDistractors = [...otherTexts.slice(0, 3)];
  const seed = (q.id * 17 + 11) % 100;
  if (seed % 2 === 0) {
    shuffledDistractors.reverse();
  }
  if (seed % 3 === 0) {
    [shuffledDistractors[0], shuffledDistractors[1]] = [shuffledDistractors[1], shuffledDistractors[0]];
  }

  // 3. Target position for correct option: evenly distributed across A, B, C, D (0, 1, 2, 3)
  // Maps: Q1->C, Q2->A, Q3->D, Q4->B, Q5->C, Q6->A, etc.
  const targetIndex = (q.id * 3 + 2) % 4;

  const finalOptionsTexts: string[] = [];
  let distractorIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIndex) {
      finalOptionsTexts.push(correctText);
    } else {
      finalOptionsTexts.push(shuffledDistractors[distractorIdx++] || otherTexts[0]);
    }
  }

  const labels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const newOptions = finalOptionsTexts.map((text, idx) => ({
    label: labels[idx],
    text,
  }));

  return {
    ...q,
    options: newOptions,
    correctOption: labels[targetIndex],
  };
}

export const allQuestions: Question[] = rawQuestions.map(randomizeQuestionOptions);

export interface FormulaItem {
  name: string;
  latex: string;
  description: string;
}

export interface ChapterFormulaSheet {
  chapter: string;
  formulas: FormulaItem[];
}

export const physicsFormulaSheets: ChapterFormulaSheet[] = [
  {
    chapter: 'Units & Dimensions',
    formulas: [
      {
        name: 'Force Dimension',
        latex: '[F] = [M L T^{-2}]',
        description: 'Derived from Newton\'s second law: $F = m \\cdot a$',
      },
      {
        name: 'Work / Energy Dimension',
        latex: '[W] = [E] = [M L^2 T^{-2}]',
        description: 'Applies to Work, Kinetic Energy, Potential Energy, Heat, and Torque.',
      },
      {
        name: 'Pressure / Stress Dimension',
        latex: '[P] = [M L^{-1} T^{-2}]',
        description: 'Force per unit area ($P = F/A$), also applies to Young\'s Modulus.',
      },
      {
        name: 'Gravitational Constant (G)',
        latex: '[G] = [M^{-1} L^3 T^{-2}]',
        description: 'From $F = G m_1 m_2 / r^2 \\implies G = F r^2 / (m_1 m_2)$.',
      },
      {
        name: 'Planck\'s Constant (h)',
        latex: '[h] = [M L^2 T^{-1}]',
        description: 'From $E = h\\nu$, same dimension as Angular Momentum ($L = m v r$).',
      },
      {
        name: 'Relative & Percentage Error',
        latex: '\\frac{\\Delta X}{X} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B}',
        description: 'For $X = A^a B^b / C^c$, percentage errors add with absolute powers.',
      },
      {
        name: 'Principle of Homogeneity',
        latex: '[A] = [B] = [C] \\text{ in } A + B = C',
        description: 'Only physical quantities with identical dimensions can be added or compared.',
      },
    ],
  },
  {
    chapter: 'Motion in a Straight Line',
    formulas: [
      {
        name: '1st Equation of Motion',
        latex: 'v = u + a t',
        description: 'Relates final velocity, initial velocity, uniform acceleration, and time.',
      },
      {
        name: '2nd Equation of Motion',
        latex: 's = u t + \\frac{1}{2} a t^2',
        description: 'Displacement with constant acceleration over time interval $t$.',
      },
      {
        name: '3rd Equation of Motion',
        latex: 'v^2 = u^2 + 2 a s',
        description: 'Relates velocities, acceleration, and displacement independent of time.',
      },
      {
        name: 'Distance in nth Second',
        latex: 'S_n = u + \\frac{a}{2}(2n - 1)',
        description: 'Displacement covered specifically during the $n^{\\text{th}}$ single second.',
      },
      {
        name: 'Maximum Height in Free Fall',
        latex: 'H_{\\max} = \\frac{u^2}{2g}',
        description: 'Highest vertical point reached by an object projected upwards with speed $u$.',
      },
      {
        name: 'Total Time of Flight',
        latex: 'T = \\frac{2u}{g}',
        description: 'Ascent time $t_{up} = u/g$ plus descent time $t_{down} = u/g$.',
      },
      {
        name: 'Fall from Height h',
        latex: 't = \\sqrt{\\frac{2h}{g}}, \\quad v = \\sqrt{2gh}',
        description: 'Time to fall and impact speed when dropped from rest ($u = 0$).',
      },
      {
        name: 'Average Speed (Equal Distances)',
        latex: 'v_{avg} = \\frac{2 v_1 v_2}{v_1 + v_2}',
        description: 'Harmonic mean when covering two equal distance segments.',
      },
      {
        name: 'Relative Velocity in 1D',
        latex: 'v_{AB} = v_A - v_B',
        description: 'Velocity of body $A$ relative to body $B$. Add speeds if traveling in opposite directions.',
      },
    ],
  },
  {
    chapter: 'Simple Derivatives',
    formulas: [
      {
        name: 'Power Rule',
        latex: '\\frac{d}{dt}(c t^n) = c \\cdot n t^{n-1}',
        description: 'Core differentiation rule for polynomials and kinematic expressions.',
      },
      {
        name: 'Instantaneous Velocity',
        latex: 'v(t) = \\frac{dx}{dt}',
        description: 'First derivative of position with respect to time.',
      },
      {
        name: 'Instantaneous Acceleration',
        latex: 'a(t) = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}',
        description: 'First derivative of velocity, second derivative of position.',
      },
      {
        name: 'Position-Dependent Acceleration',
        latex: 'a = v \\frac{dv}{dx}',
        description: 'By chain rule: $\\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v \\frac{dv}{dx}$.',
      },
      {
        name: 'Trigonometric Derivatives',
        latex: '\\frac{d}{dt}\\sin(\\omega t) = \\omega \\cos(\\omega t), \\quad \\frac{d}{dt}\\cos(\\omega t) = -\\omega \\sin(\\omega t)',
        description: 'Essential for Simple Harmonic Motion (SHM) and wave dynamics.',
      },
      {
        name: 'Product & Quotient Rules',
        latex: '(uv)\' = u\'v + uv\', \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}',
        description: 'Rules for multiplying and dividing functions.',
      },
    ],
  },
  {
    chapter: 'Simple Integration',
    formulas: [
      {
        name: 'Power Rule of Integration',
        latex: '\\int t^n dt = \\frac{t^{n+1}}{n+1} + C \\quad (n \\neq -1)',
        description: 'Basic antiderivative power rule.',
      },
      {
        name: 'Velocity from Acceleration',
        latex: 'v(t) = u + \\int_0^t a(t) dt',
        description: 'Integrate acceleration to obtain instantaneous velocity.',
      },
      {
        name: 'Displacement from Velocity',
        latex: 'x(t) = x_0 + \\int_0^t v(t) dt',
        description: 'Integrate velocity to find position / displacement.',
      },
      {
        name: 'Work Done by Variable Force',
        latex: 'W = \\int_{x_1}^{x_2} F(x) dx',
        description: 'Area under force-displacement curve (e.g. spring force $W = \\frac{1}{2} k x^2$).',
      },
      {
        name: 'Impulse from Time Force',
        latex: 'J = \\int_{t_1}^{t_2} F(t) dt = \\Delta p',
        description: 'Area under Force-time curve equals net change in linear momentum.',
      },
      {
        name: 'Work-Energy Theorem via Calculus',
        latex: '\\int_{u}^{v} m v dv = \\frac{1}{2} m v^2 - \\frac{1}{2} m u^2 = \\Delta K',
        description: 'Net work equals change in kinetic energy.',
      },
    ],
  },
];
