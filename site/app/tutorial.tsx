"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STEPS = ["Ask", "Grill", "Plan", "Critique", "Build", "Review", "Map"] as const;

type Q1 = "reuse" | "new" | null;
type Q2 = "auto" | "park" | null;
type Critique = "amend" | "dismiss" | null;
type FileName =
  | "progress-tracker.md"
  | "CONTEXT.md"
  | "unresolved-questions.md"
  | "change-map.md"
  | "review.md";

type Mission = {
  title: string;
  verify: "test" | "build";
  output: string;
  uq?: boolean;
};

function missions(critique: Critique, q2: Q2): Mission[] {
  return [
    { title: "Extract addCalendarMonths from trial.ts", verify: "build", output: "typecheck clean, 212 existing tests pass" },
    { title: "Pause a subscription for up to three months", verify: "test", output: "rejects a pause longer than three months" },
    {
      title: critique === "amend" ? "Skip and log charges while paused" : "Freeze charges while paused",
      verify: "test",
      output: critique === "amend" ? "skips and logs the charge inside a pause" : "freezes the charge inside a pause",
    },
    {
      title: "Resume billing when the pause ends",
      verify: "test",
      output: q2 === "park" ? "resumes through the UQ-1 placeholder policy" : "resumes billing on the day the pause ends",
      uq: q2 === "park",
    },
    { title: "Pause button on the billing page", verify: "build", output: "you picked prototype B of 3; typecheck and build pass" },
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
  const [running, setRunning] = useState<{ index: number; phase: "red" | "green" } | null>(null);
  const [reviewRun, setReviewRun] = useState(false);
  const [activeFile, setActiveFile] = useState<FileName>("progress-tracker.md");
  const timers = useRef<number[]>([]);

  const list = useMemo(() => missions(critique, q2), [critique, q2]);

  const files = useMemo(() => {
    const f: FileName[] = [];
    if (sent) f.push("progress-tracker.md");
    if (q1 === "new") f.push("CONTEXT.md");
    if (q2 === "park") f.push("unresolved-questions.md");
    if (step >= 2) f.push("change-map.md");
    if (reviewRun) f.push("review.md");
    return f;
  }, [sent, q1, q2, step, reviewRun]);

  // A newly written file takes focus, so the reader sees what each choice produced.
  const lastFile = files[files.length - 1];
  useEffect(() => {
    if (lastFile) setActiveFile(lastFile);
  }, [lastFile]);

  useEffect(() => {
    const primary: Partial<Record<number, FileName>> = { 2: "progress-tracker.md", 3: "progress-tracker.md", 4: "progress-tracker.md", 6: "change-map.md" };
    const f = primary[step];
    if (f) setActiveFile(f);
  }, [step]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const canAdvance = [sent, q1 === "new" && q2 !== null, true, critique !== null, done === list.length, reviewRun, false][step];

  function go(to: number) {
    setStep(to);
    setReached((r) => Math.max(r, to));
  }

  function runMissions(count: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const redFor = reduced ? 0 : 650;
    const gap = reduced ? 0 : 450;
    let t = 0;
    for (let k = 0; k < count; k++) {
      const index = done + k;
      const isTest = list[index].verify === "test";
      timers.current.push(window.setTimeout(() => setRunning({ index, phase: isTest ? "red" : "green" }), t));
      if (isTest) t += redFor;
      timers.current.push(
        window.setTimeout(() => {
          setRunning({ index, phase: "green" });
          setDone(index + 1);
        }, t),
      );
      t += gap;
    }
    timers.current.push(window.setTimeout(() => setRunning(null), t));
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
    setReviewRun(false);
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
                  Before asking anything, I read the domain glossary, <code>CONTEXT.md</code> and the billing docs, so
                  my questions use your project&apos;s words. I&apos;ve started a tracker for the task.
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
                            Then I won&apos;t guess. I&apos;ve parked it as <strong>UQ-1</strong>: mission 4 ships a
                            placeholder behind one function, marked <code>TODO(UQ-1)</code>, so the build doesn&apos;t
                            wait for finance.
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
              <Turn who="agent">
                Here&apos;s the plan, written to the tracker. Three things decide its shape:
              </Turn>
              <dl className="explain">
                <div>
                  <dt>Placement</dt>
                  <dd>
                    Date math already lives in <code>trial.ts</code>. Writing it again would make a second copy, so
                    mission 1 extracts it before anything uses it.
                  </dd>
                </div>
                <div>
                  <dt>Verification</dt>
                  <dd>
                    Missions that change behavior get a test written first. Moving code and adding a button get
                    typecheck, build and the existing suite instead.
                  </dd>
                </div>
                <div>
                  <dt>New UI</dt>
                  <dd>
                    The pause button is new, so before mission 5 you&apos;ll pick from three throwaway prototypes in the
                    browser.
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
                A separate critic read the plan against your domain docs. It stays silent when a plan is sound. This one
                found one real conflict:
              </Turn>
              <Turn who="agent" tone={critique === "amend" ? "resolved" : "pushback"} source="critique-plan">
                Mission 3 says <strong>freeze</strong> charges. ADR-0007 says charges are never frozen: one that
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
                    ? "Mission 3 renamed and its test updated. The plan now agrees with ADR-0007."
                    : "Dismissed. Your reason contradicts an existing decision, so I drafted ADR-0012 to supersede ADR-0007 rather than leaving the two to disagree."}
                </Turn>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <Turn who="agent">
                Each mission runs in order. A tested mission must fail before its code exists, then pass once it does.
                The tracker ticks as each one goes green.
              </Turn>
              <ul className="run-list">
                {list.map((m, i) => {
                  const state =
                    running?.index === i ? running.phase : i < done ? "green" : "todo";
                  return (
                    <li key={m.title} data-state={state}>
                      <span className="run-mark" aria-hidden="true" />
                      <span className="run-title">
                        {i + 1}. {m.title}
                        {m.uq && <span className="uq">UQ-1</span>}
                      </span>
                      {state !== "todo" && (
                        <code className="run-output">
                          {m.verify === "test" ? (state === "red" ? "✗ " : "✓ ") : ""}
                          {m.output}
                        </code>
                      )}
                      <span className="sr-only">
                        {state === "red" ? "failing" : state === "green" ? "passing" : "not run"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {done < list.length ? (
                <div className="choices row">
                  <button type="button" className="primary" disabled={running !== null} onClick={() => runMissions(1)}>
                    Run mission {done + 1}
                  </button>
                  <button type="button" disabled={running !== null} onClick={() => runMissions(list.length - done)}>
                    Run the rest
                  </button>
                </div>
              ) : (
                <Turn who="agent">
                  All five missions are green, each in its own commit. The full suite runs once at the end: 219 tests
                  pass.
                </Turn>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <Turn who="agent">
                Now three critics read the finished diff, each looking for one kind of problem. A fourth checks whether
                the docs know about everything the diff added.
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
                    result="POST /subscriptions/:id/pause wasn't documented. Added it to the backend API doc."
                    fixed
                  />
                </ul>
              )}
            </>
          )}

          {step === 6 && (
            <>
              <Turn who="agent">
                Last, the change map: where the task actually landed, compared with where the plan said it would.
              </Turn>
              <Turn who="agent">
                One drift. Mission 2 reached <strong>Notifications</strong> to send a pause confirmation email, which
                nobody planned for. It was a real requirement, so it stays, and it&apos;s on record.
              </Turn>
              <div className="finish">
                <p>That&apos;s the whole loop. Run it on your own problem:</p>
                <code className="inline-cmd">npx ab-method</code>
                <button type="button" className="text-button" onClick={reset}>
                  Start the tutorial again
                </button>
              </div>
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
                  <Tracker q1={q1} q2={q2} step={step} critique={critique} list={list} done={done} reviewRun={reviewRun} />
                )}
                {activeFile === "CONTEXT.md" && <ContextDoc />}
                {activeFile === "unresolved-questions.md" && <UnresolvedDoc />}
                {activeFile === "change-map.md" && <ChangeMap actual={step >= 6} />}
                {activeFile === "review.md" && <ReviewDoc />}
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
    "The answers become missions.",
    "A critic checks the plan before any code.",
    "Missions run red, then green.",
    "Critics check the finished change.",
    "The plan is measured against the diff.",
  ][step];
}

function filePath(f: FileName) {
  return f === "CONTEXT.md" ? "CONTEXT.md" : `docs/tasks/pause-subscription/${f}`;
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
  reviewRun,
}: {
  q1: Q1;
  q2: Q2;
  step: number;
  critique: Critique;
  list: Mission[];
  done: number;
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
              Date math: <em>extract</em> <code>addCalendarMonths</code> from <code>trial.ts</code>
            </li>
            <li>
              Pause rules: <em>new</em> <code>subscription/pause.ts</code>
            </li>
            <li>
              Charge schedule: <em>extend</em> <code>BillingSchedule</code>
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
                <span
                  className="mission-title"
                  data-flagged={i === 2 && step === 3 && critique === null ? "" : undefined}
                >
                  {m.title}
                </span>
                <code className="verify">verify: {m.verify}</code>
                {m.uq && <span className="uq">UQ-1</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {critique === "dismiss" && (
        <p className="note">Plan critique dismissed with a reason. Draft: ADR-0012 supersedes ADR-0007.</p>
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

const MAP_ROWS: { module: string; planned: string; actual: string }[] = [
  { module: "Shared date utils", planned: "extracted", actual: "extracted" },
  { module: "Subscription", planned: "new", actual: "new" },
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

function ReviewDoc() {
  return (
    <article className="doc">
      <h3>Review</h3>
      <h4>Applied</h4>
      <ul>
        <li>
          Inlined <code>PauseService.pause()</code>, a wrapper that only forwarded a call.
        </li>
        <li>
          Documented <code>POST /subscriptions/:id/pause</code> in the backend API doc.
        </li>
      </ul>
      <h4>Open</h4>
      <p>Nothing. The other two critics found no problems.</p>
    </article>
  );
}
