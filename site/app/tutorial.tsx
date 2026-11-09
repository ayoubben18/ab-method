"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STEPS = ["Ask", "Grill", "Plan", "Critique", "Build", "Protect", "Review", "Ship"] as const;

type Q1 = "reuse" | "new" | null;
type Q2 = "auto" | "park" | null;
type Critique = "amend" | "dismiss" | null;
type FileName =
  | "progress-tracker.md"
  | "CONTEXT.md"
  | "unresolved-questions.md"
  | "seams/billing.md"
  | "change-map.md"
  | "review.md"
  | "pr-body.md";

type Mission = {
  title: string;
  steps: { text: string; flagged?: boolean; uq?: boolean }[];
  output: string;
};

type Protected = {
  useCase: string;
  boundary: string;
  red: string;
  green: string;
};

type Run = { index: number; phase: "red" | "green" } | null;

function missions(critique: Critique, q2: Q2): Mission[] {
  return [
    {
      title: "Billing: deepen the date math behind the billing module",
      steps: [
        { text: "extract addCalendarMonths from trial.ts and renewal.ts" },
        { text: "point both callers at it" },
      ],
      output: "typecheck clean, 212 existing tests pass",
    },
    {
      title: "Pause a subscription, end to end",
      steps: [
        { text: "pause rules: up to three months" },
        {
          text: critique === "amend" ? "skip and log charges while paused, in BillingSchedule" : "freeze charges while paused",
          flagged: true,
        },
        {
          text: q2 === "park" ? "resume billing through the UQ-1 placeholder" : "resume billing the day the pause ends",
          uq: q2 === "park",
        },
        { text: "pause button on the billing page (prototype B)" },
      ],
      output: "typecheck, lint and build clean, 212 existing tests pass",
    },
  ];
}

function protectedTests(critique: Critique, q2: Q2): Protected[] {
  return [
    {
      useCase: "A pause longer than three months is rejected",
      boundary: "Subscription",
      red: "broke the limit: accepted a four-month pause",
      green: "restored: rejected with PauseTooLong",
    },
    {
      useCase: critique === "amend" ? "A charge inside a pause is skipped and logged" : "A charge inside a pause is frozen",
      boundary: "billing seam",
      red: "removed the pause check: the charge ran",
      green: critique === "amend" ? "restored: skipped, one ledger entry" : "restored: frozen",
    },
    {
      useCase: q2 === "park" ? "Billing resumes through the UQ-1 placeholder" : "Billing resumes the day a pause ends",
      boundary: "billing seam",
      red: "shifted the end date: charged a day late",
      green: "restored: charged on the end date",
    },
  ];
}

export function Tutorial() {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [sent, setSent] = useState(false);
  const [q1, setQ1] = useState<Q1>(null);
  const [pushedBack, setPushedBack] = useState(false);
  const [q2, setQ2] = useState<Q2>(null);
  const [critique, setCritique] = useState<Critique>(null);
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState<Run>(null);
  const [protectStarted, setProtectStarted] = useState(false);
  const [protectDone, setProtectDone] = useState(0);
  const [protectRunning, setProtectRunning] = useState<Run>(null);
  const [reviewRun, setReviewRun] = useState(false);
  const [prReviewed, setPrReviewed] = useState(false);
  const [activeFile, setActiveFile] = useState<FileName>("progress-tracker.md");
  const timers = useRef<number[]>([]);

  const list = useMemo(() => missions(critique, q2), [critique, q2]);
  const tests = useMemo(() => protectedTests(critique, q2), [critique, q2]);

  const files = useMemo(() => {
    const f: FileName[] = [];
    if (sent) f.push("progress-tracker.md");
    if (q1 === "new") f.push("CONTEXT.md");
    if (q2 === "park") f.push("unresolved-questions.md");
    if (step >= 2) f.push("seams/billing.md", "change-map.md");
    if (reviewRun) f.push("review.md");
    if (step >= 7) f.push("pr-body.md");
    return f;
  }, [sent, q1, q2, step, reviewRun]);

  // A newly written file takes focus, so the reader sees what each choice produced.
  const lastFile = files[files.length - 1];
  useEffect(() => {
    if (lastFile) setActiveFile(lastFile);
  }, [lastFile]);

  useEffect(() => {
    const primary: Partial<Record<number, FileName>> = {
      2: "progress-tracker.md",
      3: "progress-tracker.md",
      4: "progress-tracker.md",
      5: "progress-tracker.md",
      7: "pr-body.md",
    };
    const f = primary[step];
    if (f) setActiveFile(f);
  }, [step]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const canAdvance = [
    sent,
    q1 === "new" && q2 !== null,
    true,
    critique !== null,
    done === list.length,
    protectDone === tests.length,
    reviewRun,
    false,
  ][step];

  function go(to: number) {
    setStep(to);
    setReached((r) => Math.max(r, to));
  }

  // Plays a sequence: each item optionally shows red first, then settles green.
  function play(
    from: number,
    count: number,
    withRed: boolean,
    setRun: (r: Run) => void,
    setCount: (n: number) => void,
  ) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const redFor = reduced ? 0 : 700;
    const gap = reduced ? 0 : 450;
    let t = 0;
    for (let k = 0; k < count; k++) {
      const index = from + k;
      timers.current.push(window.setTimeout(() => setRun({ index, phase: withRed ? "red" : "green" }), t));
      if (withRed) t += redFor;
      timers.current.push(
        window.setTimeout(() => {
          setRun({ index, phase: "green" });
          setCount(index + 1);
        }, t),
      );
      t += gap;
    }
    timers.current.push(window.setTimeout(() => setRun(null), t));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setStep(0);
    setReached(0);
    setSent(false);
    setQ1(null);
    setPushedBack(false);
    setQ2(null);
    setCritique(null);
    setDone(0);
    setRunning(null);
    setProtectStarted(false);
    setProtectDone(0);
    setProtectRunning(null);
    setReviewRun(false);
    setPrReviewed(false);
  }

  return (
    <div className="tutorial">
      <ol className="steps" aria-label="Tutorial steps">
        {STEPS.map((name, i) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => go(i)}
              disabled={i > reached}
              aria-current={i === step ? "step" : undefined}
              data-state={i < step ? "done" : i === step ? "current" : "todo"}
            >
              <span className="step-num">{i + 1}</span>
              <span className="step-name">{name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="stage">
        <div className="session" aria-live="polite">
          <p className="session-title">{sessionTitle(step)}</p>

          {step === 0 && (
            <>
              <Turn who="you">
                <code className="inline-cmd">/create-task</code> Customers want to pause their subscription for up to
                three months instead of cancelling.
              </Turn>
              {!sent ? (
                <div className="choices">
                  <button type="button" className="primary" onClick={() => setSent(true)}>
                    Send
                  </button>
                </div>
              ) : (
                <Turn who="agent">
                  Before asking anything, I read the domain glossary, <code>CONTEXT.md</code>, the seam docs and the
                  billing code, so my questions use your project&apos;s words. I&apos;ve started a tracker for the task.
                </Turn>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <Turn who="agent">
                <code>CONTEXT.md</code> defines a <strong>Suspension</strong> as access cut off after a failed payment. Is
                a pause a kind of suspension, or a new state?
              </Turn>
              {q1 === null && !pushedBack && (
                <div className="choices">
                  <button type="button" onClick={() => setQ1("new")}>
                    A new state. The customer chose it and keeps access until the paid period ends.
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPushedBack(true);
                      setQ1("reuse");
                    }}
                  >
                    The same thing. Reuse suspension.
                  </button>
                </div>
              )}
              {pushedBack && (
                <>
                  <Turn who="you">The same thing. Reuse suspension.</Turn>
                  <Turn who="agent" tone="pushback">
                    A suspension cuts access the moment it starts and sends dunning emails. A customer who paused would
                    be told their payment failed. Is that what you want?
                  </Turn>
                  {q1 === "reuse" && (
                    <div className="choices">
                      <button type="button" onClick={() => setQ1("new")}>
                        No. Make Pause its own state.
                      </button>
                    </div>
                  )}
                </>
              )}
              {q1 === "new" && (
                <>
                  <Turn who="you">
                    {pushedBack
                      ? "No. Make Pause its own state."
                      : "A new state. The customer chose it and keeps access until the paid period ends."}
                  </Turn>
                  <Turn who="agent">
                    Added <strong>Pause</strong> to <code>CONTEXT.md</code> next to Suspension. Next: what happens when
                    the three months run out?
                  </Turn>
                  {q2 === null ? (
                    <div className="choices">
                      <button type="button" onClick={() => setQ2("auto")}>
                        Billing resumes automatically that day.
                      </button>
                      <button type="button" onClick={() => setQ2("park")}>
                        I don&apos;t know yet. Finance hasn&apos;t decided how to prorate.
                      </button>
                    </div>
                  ) : (
                    <>
                      <Turn who="you">
                        {q2 === "auto"
                          ? "Billing resumes automatically that day."
                          : "I don't know yet. Finance hasn't decided how to prorate."}
                      </Turn>
                      <Turn who="agent">
                        {q2 === "auto" ? (
                          "Recorded in the tracker. That's everything I needed; on to the plan."
                        ) : (
                          <>
                            Then I won&apos;t guess. I&apos;ve parked it as <strong>UQ-1</strong>: the resume step
                            ships a placeholder behind one function, marked <code>TODO(UQ-1)</code>, so the build
                            doesn&apos;t wait for finance.
                          </>
                        )}
                      </Turn>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Turn who="agent">Here&apos;s the plan, written to the tracker. Four things decide its shape:</Turn>
              <dl className="explain">
                <div>
                  <dt>Seams</dt>
                  <dd>
                    <code>docs/seams/billing.md</code> says every charge goes through <code>BillingSchedule</code>. The
                    pause hooks in there, never around it.
                  </dd>
                </div>
                <div>
                  <dt>Deepening</dt>
                  <dd>
                    Date math is copied into <code>trial.ts</code> and <code>renewal.ts</code>. The pause would make a
                    third copy, so mission 1 pulls it into the billing module before anything builds on it.
                  </dd>
                </div>
                <div>
                  <dt>Missions</dt>
                  <dd>
                    Two, not five: the refactor first, then the whole capability end to end. A mission is split only
                    where one part must land before the next.
                  </dd>
                </div>
                <div>
                  <dt>Tests</dt>
                  <dd>
                    None planned yet. Once the code exists, the protect step picks what must not break. The pause button
                    is new UI, so you&apos;ll pick from three throwaway prototypes first.
                  </dd>
                </div>
              </dl>
              <Turn who="agent">
                I also predicted which modules this task will touch, in <code>change-map.md</code>. We&apos;ll compare
                that with the real diff at the end.
              </Turn>
            </>
          )}

          {step === 3 && (
            <>
              <Turn who="agent" source="critique-plan">
                A separate critic read the plan against your domain docs and seams. It stays silent when a plan is sound.
                This one found one real conflict:
              </Turn>
              <Turn who="agent" tone={critique === "amend" ? "resolved" : "pushback"} source="critique-plan">
                Mission 2 says <strong>freeze</strong> charges. ADR-0007 says charges are never frozen: one that
                shouldn&apos;t run is skipped and logged, so the ledger has no gaps.
              </Turn>
              {critique === null ? (
                <div className="choices">
                  <button type="button" onClick={() => setCritique("amend")}>
                    Amend the plan: skip and log the charges.
                  </button>
                  <button type="button" onClick={() => setCritique("dismiss")}>
                    Dismiss: a pause is chosen by the customer, so freezing is right.
                  </button>
                </div>
              ) : (
                <Turn who="agent">
                  {critique === "amend"
                    ? "Mission 2's step rewritten. The plan now agrees with ADR-0007. Plan committed; building starts from here."
                    : "Dismissed. Your reason contradicts an existing decision, so I drafted ADR-0012 to supersede ADR-0007 rather than leaving the two to disagree."}
                </Turn>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <Turn who="agent">
                Each mission builds to the plan, then runs typecheck, lint, build and the existing tests. One commit per
                mission. No new tests yet: the design comes first.
              </Turn>
              <ul className="run-list">
                {list.map((m, i) => {
                  const state = running?.index === i ? running.phase : i < done ? "green" : "todo";
                  return (
                    <li key={m.title} data-state={state}>
                      <span className="run-mark" aria-hidden="true" />
                      <span className="run-title">
                        {i + 1}. {m.title}
                      </span>
                      {state !== "todo" && <code className="run-output">✓ {m.output}</code>}
                      <span className="sr-only">{state === "green" ? "passing" : "not run"}</span>
                    </li>
                  );
                })}
              </ul>
              {done < list.length ? (
                <div className="choices row">
                  <button
                    type="button"
                    className="primary"
                    disabled={running !== null}
                    onClick={() => play(done, 1, false, setRunning, setDone)}
                  >
                    Run mission {done + 1}
                  </button>
                  <button
                    type="button"
                    disabled={running !== null}
                    onClick={() => play(done, list.length - done, false, setRunning, setDone)}
                  >
                    Run the rest
                  </button>
                </div>
              ) : (
                <Turn who="agent">Both missions are green, each in its own commit. The full suite passes: 212 tests.</Turn>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <Turn who="agent">
                Now the code exists, so I can see what must not break. I test it through the billing seam and the
                Subscription module, nothing internal:
              </Turn>
              <ul className="run-list">
                {tests.map((t, i) => {
                  const state = protectRunning?.index === i ? protectRunning.phase : i < protectDone ? "green" : "todo";
                  return (
                    <li key={t.useCase} data-state={state}>
                      <span className="run-mark" aria-hidden="true" />
                      <span className="run-title">
                        UC{i + 1}. {t.useCase} <span className="verify">→ {t.boundary}</span>
                      </span>
                      {state !== "todo" && (
                        <code className="run-output">{state === "red" ? `✗ ${t.red}` : `✓ ${t.green}`}</code>
                      )}
                      <span className="sr-only">
                        {state === "red" ? "failing" : state === "green" ? "passing" : "not run"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {!protectStarted ? (
                <>
                  <Turn who="agent">
                    Skipped: the pause button&apos;s rendering. Nothing a customer would notice breaks if it changes.
                  </Turn>
                  <div className="choices">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => {
                        setProtectStarted(true);
                        play(0, tests.length, true, setProtectRunning, setProtectDone);
                      }}
                    >
                      Protect these
                    </button>
                  </div>
                </>
              ) : protectDone === tests.length ? (
                <Turn who="agent">
                  Each test was seen failing: I broke the behaviour on purpose, watched it go red, then restored the code.
                  A test you never saw fail protects nothing.
                </Turn>
              ) : null}
            </>
          )}

          {step === 6 && (
            <>
              <Turn who="agent">
                Three critics read the finished diff, each looking for one kind of problem. A fourth checks whether the
                docs, seam docs included, know about everything the diff added.
              </Turn>
              {!reviewRun ? (
                <div className="choices">
                  <button type="button" className="primary" onClick={() => setReviewRun(true)}>
                    Run the critics
                  </button>
                </div>
              ) : (
                <ul className="critics">
                  <Critic name="cleaner-architecture" result="Nothing to report." />
                  <Critic
                    name="slop-defender"
                    result="PauseService.pause() only forwards to pauseSubscription(). Inlined it; tests still pass."
                    fixed
                  />
                  <Critic name="reusability-inspector" result="Nothing to report." />
                  <Critic
                    name="sync-architecture"
                    result="The billing seam doc now lists the pause skip, and POST /subscriptions/:id/pause is in the API doc."
                    fixed
                  />
                </ul>
              )}
            </>
          )}

          {step === 7 && (
            <>
              <Turn who="agent">
                The change map compared the plan with the diff. One drift: mission 2 reached{" "}
                <strong>Notifications</strong> to send a pause confirmation email, which nobody planned for. It&apos;s a
                real requirement, so it stays, on record.
              </Turn>
              <Turn who="agent">
                I pushed the branch and opened a draft pull request. Its body shows the change, the evidence from the
                protect step, and how risky it is to merge.
              </Turn>
              {!prReviewed ? (
                <div className="choices">
                  <button type="button" className="primary" onClick={() => setPrReviewed(true)}>
                    Run the final review
                  </button>
                </div>
              ) : (
                <>
                  <ul className="critics">
                    <Critic name="review-pr · seams" result="Nothing to report. Every charge goes through BillingSchedule." />
                    <Critic
                      name="review-pr · rules"
                      result="A comment repeated the three-month limit instead of naming MAX_PAUSE_MONTHS. Fixed and pushed."
                      fixed
                    />
                  </ul>
                  <Turn who="agent">Both reviewers started from a fresh context. PR #42 is marked ready for review.</Turn>
                  <div className="finish">
                    <p>That&apos;s the whole loop. Run it on your own problem:</p>
                    <code className="inline-cmd">npx ab-method</code>
                    <button type="button" className="text-button" onClick={reset}>
                      Start the tutorial again
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {step < STEPS.length - 1 && (
            <div className="session-nav">
              {step > 0 && (
                <button type="button" className="text-button" onClick={() => go(step - 1)}>
                  Back
                </button>
              )}
              <button type="button" className="primary" disabled={!canAdvance} onClick={() => go(step + 1)}>
                Next: {STEPS[step + 1]}
              </button>
            </div>
          )}
        </div>

        <div className="files">
          {files.length === 0 ? (
            <p className="files-empty">Files the method writes will appear here. Send the request to start.</p>
          ) : (
            <>
              <div className="file-tabs" role="tablist" aria-label="Files written by the task">
                {files.map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={f === activeFile}
                    onClick={() => setActiveFile(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="file-body" role="tabpanel">
                <p className="file-path">{filePath(activeFile)}</p>
                {activeFile === "progress-tracker.md" && (
                  <Tracker
                    q1={q1}
                    q2={q2}
                    step={step}
                    critique={critique}
                    list={list}
                    done={done}
                    tests={tests}
                    protectDone={protectDone}
                    reviewRun={reviewRun}
                  />
                )}
                {activeFile === "CONTEXT.md" && <ContextDoc />}
                {activeFile === "unresolved-questions.md" && <UnresolvedDoc />}
                {activeFile === "seams/billing.md" && <SeamDoc synced={reviewRun} />}
                {activeFile === "change-map.md" && <ChangeMap actual={step >= 7} />}
                {activeFile === "review.md" && <ReviewDoc prReviewed={prReviewed} />}
                {activeFile === "pr-body.md" && <PrBody tests={tests} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function sessionTitle(step: number) {
  return [
    "You describe the problem in a sentence.",
    "The agent asks until nothing is ambiguous.",
    "The answers become a plan, refactors first.",
    "A critic checks the plan before any code.",
    "Missions build to the plan.",
    "Tests protect what must not break.",
    "Critics check the finished change.",
    "It ships as a reviewed pull request.",
  ][step];
}

function filePath(f: FileName) {
  if (f === "CONTEXT.md") return "CONTEXT.md";
  if (f === "seams/billing.md") return "docs/seams/billing.md";
  return `docs/tasks/pause-subscription/${f}`;
}

function Turn({
  who,
  tone,
  source,
  children,
}: {
  who: "you" | "agent";
  tone?: "pushback" | "resolved";
  source?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="turn" data-who={who} data-tone={tone}>
      <span className="turn-who">{who === "you" ? "You" : source ?? "Agent"}</span>
      <div className="turn-body">{children}</div>
    </div>
  );
}

function Critic({ name, result, fixed }: { name: string; result: string; fixed?: boolean }) {
  return (
    <li data-fixed={fixed ? "" : undefined}>
      <code>{name}</code>
      <span>{result}</span>
      {fixed && <span className="badge">Fixed</span>}
    </li>
  );
}

function Tracker({
  q1,
  q2,
  step,
  critique,
  list,
  done,
  tests,
  protectDone,
  reviewRun,
}: {
  q1: Q1;
  q2: Q2;
  step: number;
  critique: Critique;
  list: Mission[];
  done: number;
  tests: Protected[];
  protectDone: number;
  reviewRun: boolean;
}) {
  const decided = q1 === "new" || q2 !== null;
  return (
    <article className="doc">
      <h3>Pause a subscription</h3>
      <h4>Problem</h4>
      <p>Customers want to pause their subscription for up to three months instead of cancelling.</p>

      {decided && (
        <>
          <h4>Decisions</h4>
          <ul>
            {q1 === "new" && <li>Pause is its own state, not a Suspension. Access continues until the paid period ends.</li>}
            {q2 === "auto" && <li>When a pause ends, billing resumes that day.</li>}
            {q2 === "park" && <li>What happens when a pause ends is open. See UQ-1.</li>}
          </ul>
        </>
      )}

      {step >= 2 && (
        <>
          <h4>Placement</h4>
          <ul>
            <li>
              Date math: <em>deepen</em>, one <code>addCalendarMonths</code> in the billing module
            </li>
            <li>
              Pause rules: <em>extend</em> Subscription, <code>subscription/pause.ts</code>
            </li>
            <li>
              Charges while paused: <em>extend</em> the billing seam, <code>BillingSchedule</code>
            </li>
            <li>
              Billing page: <em>extend</em> <code>BillingPanel</code>
            </li>
          </ul>

          <h4>Missions</h4>
          <ul className="missions">
            {list.map((m, i) => (
              <li key={m.title} data-done={i < done ? "" : undefined}>
                <span className="box" aria-hidden="true">
                  {i < done ? "✓" : ""}
                </span>
                <span className="sr-only">{i < done ? "Done: " : "To do: "}</span>
                <span className="mission-title">{m.title}</span>
                <code className="verify">verify: build</code>
                <ul className="mission-steps">
                  {m.steps.map((s) => (
                    <li key={s.text}>
                      <span data-flagged={s.flagged && step === 3 && critique === null ? "" : undefined} className="mission-title">
                        {s.text}
                      </span>
                      {s.uq && <span className="uq">UQ-1</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}

      {critique === "dismiss" && (
        <p className="note">Plan critique dismissed with a reason. Draft: ADR-0012 supersedes ADR-0007.</p>
      )}
      {protectDone > 0 && (
        <>
          <h4>Protected</h4>
          <ul>
            {tests.slice(0, protectDone).map((t, i) => (
              <li key={t.useCase}>
                UC{i + 1} {t.useCase} → {t.boundary}. Seen red, then green.
              </li>
            ))}
          </ul>
        </>
      )}
      {reviewRun && (
        <>
          <h4>Review</h4>
          <p>Two safe fixes applied, nothing left open. Details in review.md.</p>
        </>
      )}
    </article>
  );
}

function ContextDoc() {
  return (
    <article className="doc">
      <h3>Billing</h3>
      <dl className="glossary">
        <div>
          <dt>Suspension</dt>
          <dd>Access cut off after a failed payment. Sends dunning emails until the card is fixed.</dd>
        </div>
        <div data-added="">
          <dt>Pause</dt>
          <dd>
            A break the customer chooses, up to three months. Access continues until the paid period ends; no charges,
            no dunning.
          </dd>
        </div>
      </dl>
      <p className="note">The highlighted entry was added during the grill.</p>
    </article>
  );
}

function UnresolvedDoc() {
  return (
    <article className="doc">
      <h3>UQ-1: What happens when a pause ends?</h3>
      <dl className="fields">
        <div>
          <dt>Blocked on</dt>
          <dd>Finance hasn&apos;t decided how to prorate the first charge.</dd>
        </div>
        <div>
          <dt>Placeholder</dt>
          <dd>
            Resume billing on the day the pause ends, behind <code>resumePolicy()</code>.
          </dd>
        </div>
        <div>
          <dt>If the answer differs</dt>
          <dd>
            Only <code>resumePolicy()</code> and its test change.
          </dd>
        </div>
      </dl>
    </article>
  );
}

function SeamDoc({ synced }: { synced: boolean }) {
  return (
    <article className="doc">
      <h3>Billing schedule</h3>
      <dl className="fields">
        <div>
          <dt>Interface</dt>
          <dd>
            <code>BillingSchedule.next(subscription)</code> decides every charge and returns a Charge or a Skip.
          </dd>
        </div>
        {synced && (
          <div data-added="">
            <dt>Skips</dt>
            <dd>A paused subscription returns Skip(paused), logged to the ledger.</dd>
          </div>
        )}
        <div>
          <dt>Callers never</dt>
          <dd>create a charge or write to the ledger directly.</dd>
        </div>
        <div>
          <dt>Check</dt>
          <dd>
            <code>grep -rn &quot;ledger.insert&quot; src --exclude-dir=billing</code>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>settled · see ADR-0007</dd>
        </div>
      </dl>
      <p className="note">
        {synced
          ? "The highlighted entry was added by sync-architecture after the review."
          : "Read before placement: the pause goes through this seam, never around it."}
      </p>
    </article>
  );
}

const MAP_ROWS: { module: string; planned: string; actual: string }[] = [
  { module: "Billing date math", planned: "deepened", actual: "deepened" },
  { module: "Subscription", planned: "extended", actual: "extended" },
  { module: "Billing schedule", planned: "extended", actual: "extended" },
  { module: "Billing page", planned: "extended", actual: "extended" },
  { module: "Notifications", planned: "", actual: "touched" },
];

function ChangeMap({ actual }: { actual: boolean }) {
  return (
    <article className="doc">
      <h3>Change map</h3>
      <table className="map">
        <thead>
          <tr>
            <th scope="col">Module</th>
            <th scope="col">Planned</th>
            {actual && <th scope="col">Actual</th>}
          </tr>
        </thead>
        <tbody>
          {MAP_ROWS.filter((r) => actual || r.planned).map((r) => (
            <tr key={r.module} data-drift={actual && r.planned !== r.actual ? "" : undefined}>
              <th scope="row">{r.module}</th>
              <td>{r.planned || "not planned"}</td>
              {actual && <td>{r.actual}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {actual ? (
        <>
          <h4>Drift</h4>
          <ul>
            <li>Reached Notifications without a plan: the pause confirmation email. Real requirement, kept.</li>
            <li>Everything else landed where it was planned.</li>
          </ul>
        </>
      ) : (
        <p className="note">Predicted before any code. The actual map is added from the diff at the end.</p>
      )}
    </article>
  );
}

function ReviewDoc({ prReviewed }: { prReviewed: boolean }) {
  return (
    <article className="doc">
      <h3>Review</h3>
      <h4>Applied</h4>
      <ul>
        <li>
          Inlined <code>PauseService.pause()</code>, a wrapper that only forwarded a call.
        </li>
        <li>Billing seam doc and API doc updated for the pause.</li>
        {prReviewed && (
          <li>
            PR review: named <code>MAX_PAUSE_MONTHS</code> instead of repeating the limit in a comment.
          </li>
        )}
      </ul>
      <h4>Open</h4>
      <p>Nothing. The other critics found no problems.</p>
    </article>
  );
}

function PrBody({ tests }: { tests: Protected[] }) {
  return (
    <article className="doc">
      <h3>Pause a subscription</h3>
      <h4>Summary</h4>
      <pre className="code-block">
        <code>{` BillingSchedule.next(subscription)
+  if paused → Skip(paused), logged
 BillingPanel
+  <PauseButton />`}</code>
      </pre>
      <h4>Evidence</h4>
      <ul>
        {tests.map((t, i) => (
          <li key={t.useCase}>
            UC{i + 1}: before, {t.red}; after, {t.green}.
          </li>
        ))}
      </ul>
      <h4>Merge danger</h4>
      <dl className="fields">
        <div>
          <dt>Door</dt>
          <dd>Two-way. One additive column; rolling back leaves it unused.</dd>
        </div>
        <div>
          <dt>Blast radius</dt>
          <dd>Billing. Every charge passes the new pause check.</dd>
        </div>
      </dl>
    </article>
  );
}
