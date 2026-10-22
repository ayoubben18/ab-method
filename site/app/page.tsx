import { CopyCommand, ThemeToggle } from "./theme-toggle";
import { Tutorial } from "./tutorial";

const REPO = "https://github.com/ayoubben18/ab-method";

const sizes = [
  {
    command: "/create-task",
    name: "A task",
    body: "One feature or fix, split into missions. You run them one at a time and stay in the loop, or hand the whole task to /start-task and review the commits afterwards.",
  },
  {
    command: "/create-goal",
    name: "A goal",
    body: "One objective with a stop condition a machine can check. The same grilling produces a prompt for an autonomous /goal loop that keeps its own tracker.",
  },
  {
    command: "/create-roadmap",
    name: "A roadmap",
    body: "Several tasks that depend on each other: the schema before the API before the UI. Questions nobody can answer yet stay open on the map instead of being guessed.",
  },
];

const commandGroups = [
  {
    title: "Plan",
    commands: [
      ["/mastermind", "Not sure where to start? Describe it and get routed."],
      ["/create-task", "Grill a problem into a task with test-driven missions."],
      ["/create-goal", "Write the prompt for an autonomous /goal loop."],
      ["/create-roadmap", "Split a bigger idea into ordered tasks."],
      ["/extend-task", "Add missions to a task that already exists."],
    ],
  },
  {
    title: "Build",
    commands: [
      ["/resume-task", "Pick a task up where its tracker left off."],
      ["/start-task", "Run every remaining mission unattended, one commit each."],
      ["/start-roadmap", "Run a planned roadmap in dependency order."],
      ["/test-mission", "Add tests to code that wasn't written test-first."],
    ],
  },
  {
    title: "Keep docs current",
    commands: [
      ["/analyze-project", "Write the domain glossary, context and pattern docs."],
      ["/update-architecture", "Refresh those docs after a big change."],
      ["/ab-cleanup", "Compact docs back to budget and clear task leftovers."],
    ],
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top">
          ab-method
        </a>
        <nav aria-label="Main">
          <a href="#tutorial">Tutorial</a>
          <a href="#commands">Commands</a>
          <a href={REPO}>GitHub</a>
        </nav>
        <ThemeToggle />
      </header>

      <main id="main">
        <section className="hero" id="top">
          <h1>
            Make the agent
            <br />
            ask first.
          </h1>
          <div className="hero-body">
            <p className="lead">
              AB Method is a workflow for Claude Code and Codex. Before any code is written, it questions your problem
              until the plan is sharp. Then it builds that plan one tested mission at a time, and puts critics on both
              sides of the change.
            </p>
            <div className="hero-actions">
              <CopyCommand command="npx ab-method" />
              <a className="text-link" href="#tutorial">
                Walk through a task
              </a>
            </div>
          </div>
          <figure className="signal" aria-label="Five missions, each failing its test before it passes">
            <div className="signal-cells" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
            <figcaption>Every mission fails its test before it passes.</figcaption>
          </figure>
        </section>

        <section className="tutorial-section" id="tutorial" aria-labelledby="tutorial-title">
          <div className="section-head">
            <h2 id="tutorial-title">One task, start to finish</h2>
            <p>
              A customer asks to pause their subscription instead of cancelling it. Make the calls the method puts to
              you, and watch the files it writes as you go.
            </p>
          </div>
          <Tutorial />
        </section>

        <section className="sizes" aria-labelledby="sizes-title">
          <div className="section-head">
            <h2 id="sizes-title">Pick the size of the work</h2>
            <p>All three start with the same grilling. They differ in how much runs without you.</p>
          </div>
          <dl className="size-list">
            {sizes.map((s) => (
              <div key={s.command}>
                <dt>
                  {s.name} <code>{s.command}</code>
                </dt>
                <dd>{s.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="commands" id="commands" aria-labelledby="commands-title">
          <div className="section-head">
            <h2 id="commands-title">Commands</h2>
            <p>
              Slash commands in Claude Code. In Codex, call the matching skill, such as <code>$ab-create-task</code>, or
              just describe what you want.
            </p>
          </div>
          <div className="command-groups">
            {commandGroups.map((g) => (
              <div key={g.title}>
                <h3>{g.title}</h3>
                <dl>
                  {g.commands.map(([cmd, desc]) => (
                    <div key={cmd}>
                      <dt>
                        <code>{cmd}</code>
                      </dt>
                      <dd>{desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className="install" aria-labelledby="install-title">
          <h2 id="install-title">Install</h2>
          <div className="install-options">
            <div>
              <h3>Into your project</h3>
              <p>Copies the workflows, skills and commands into the repo, so your whole team gets the same version.</p>
              <CopyCommand command="npx ab-method" />
            </div>
            <div>
              <h3>As a plugin</h3>
              <p>Nothing is copied into the repo, and the plugin updates on its own. In Claude Code:</p>
              <pre className="code-block">
                <code>{`/plugin marketplace add ayoubben18/ab-method
/plugin install ab-method@ab-method`}</code>
              </pre>
              <p className="fine">
                Codex uses <code>codex plugin marketplace add</code> and <code>codex plugin add</code> with the same
                names.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>AB Method is MIT licensed.</span>
        <a href={REPO}>Source on GitHub</a>
        <a href="https://www.npmjs.com/package/ab-method">npm</a>
      </footer>
    </>
  );
}
