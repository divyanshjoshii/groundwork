#!/usr/bin/env node
// Map a project's code with Graphify for /groundwork and print only what architecture notes need.
//
// Run from anywhere inside the project:
//   node map.mjs            build the graph on the first run, refresh it after, print a summary
//   node map.mjs --force    also map a project below the size where a map pays off
//
// Code only: local tree-sitter parsing, no API key, no LLM calls. The full report stays in
// graphify-out/GRAPH_REPORT.md; this prints at most about 45 lines of it.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|java|kt|rb|php|cs|c|h|cpp|swift)$/;
const WORTH_IT = 100;   // below this many source files, reading the code directly is cheaper
// Graphify re-executes itself to pin PYTHONHASHSEED unless it is already set, and that re-exec
// crashes on Windows (and breaks on a home folder with a space in it). Setting it skips the re-exec.
const ENV = { ...process.env, PYTHONHASHSEED: "0" };

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, env: ENV, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  return { ok: r.status === 0, out: r.stdout || "", err: r.stderr || "" };
}

function say(line) { console.log(line); process.exit(0); }

function resolveGraphify(cwd) {
  for (const cmd of ["graphify", join(homedir(), ".local", "bin", "graphify")]) {
    if (run(cmd, ["--version"], cwd).ok) return (args) => run(cmd, args, cwd);
  }
  return null;
}

function section(report, heading) {
  const start = report.indexOf(`\n## ${heading}`);
  if (start < 0) return [];
  const rest = report.slice(start + 1).split("\n").slice(1);
  const end = rest.findIndex(l => l.startsWith("## "));
  return (end < 0 ? rest : rest.slice(0, end)).filter(l => l.trim());
}

function main() {
  const force = process.argv.includes("--force");
  const top = run("git", ["rev-parse", "--show-toplevel"], process.cwd());
  const root = top.ok ? top.out.trim() : process.cwd();

  const files = top.ok ? run("git", ["ls-files"], root).out.split(/\r?\n/) : [];
  const sources = files.filter(f => SOURCE.test(f)).length;
  if (top.ok && sources < WORTH_IT && !force) say(`map: skipped, ${sources} source files is small enough to read directly`);

  const graphify = resolveGraphify(root);
  if (!graphify) say("map: skipped, graphify is not installed");

  // `extract --code-only` every time: its cache makes a rerun quick, and `graphify update` would
  // also pull markdown headings into the graph. `--no-label` keeps community naming off the LLM.
  const out = join(root, "graphify-out");
  const built = graphify(["extract", root, "--code-only"]);
  if (!built.ok || !existsSync(join(out, "graph.json"))) {
    say("map: skipped, graphify could not build the graph. On Windows, a path longer than 260 characters also causes this.");
  }
  if (!graphify(["cluster-only", root, "--no-label", "--no-viz"]).ok) say("map: skipped, graphify built the graph but not its report");

  const report = readFileSync(join(out, "GRAPH_REPORT.md"), "utf8").replace(/\r\n/g, "\n");
  const summary = section(report, "Summary")[0]?.replace(/^- /, "") ?? "";
  const commit = (section(report, "Graph Freshness")[0] ?? "").match(/`([0-9a-f]+)`/)?.[1];
  console.log(`map: ${summary}${commit ? ` (built from ${commit})` : ""}`);

  const gods = section(report, "God Nodes").map(l => l.replace(/^\d+\.\s*/, "").replace(/`/g, "").replace(/ - (\d+) edges$/, " $1"));
  if (gods.length) console.log(`core symbols (most connected): ${gods.slice(0, 10).join(", ")}`);

  const surprises = section(report, "Surprising Connections");
  if (surprises.length) {
    console.log("surprising links:");
    for (let i = 0; i < surprises.length && i < 10; i += 2) {
      console.log(`  ${surprises[i].replace(/^- /, "").replace(/`/g, "").replace(/\s+\[\w+\]$/, "")}   ${(surprises[i + 1] ?? "").trim()}`);
    }
  }

  const cycles = section(report, "Import Cycles");
  console.log(`import cycles: ${cycles.length ? cycles.map(l => l.replace(/^- /, "")).join("; ") : "none"}`);

  const communities = report.split("\n### ").slice(1)
    .map(block => ({ name: block.split("\n")[0].replace(/ - "Community \d+"$/, ""), nodes: block.match(/^Nodes \((\d+)\): (.*)$/m) }))
    .filter(c => c.nodes)
    .sort((a, b) => Number(b.nodes[1]) - Number(a.nodes[1]));
  if (communities.length) {
    console.log(`communities (${communities.length}, largest first):`);
    communities.slice(0, 8).forEach(c => console.log(`  ${c.name} (${c.nodes[1]}): ${c.nodes[2]}`));
  }

  const ignored = run("git", ["check-ignore", "-q", "graphify-out"], root).ok;
  if (top.ok && !ignored) console.log("note: graphify-out/ is not in .gitignore yet");
  console.log("full report: graphify-out/GRAPH_REPORT.md");
}

main();
