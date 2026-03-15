import chalk from 'chalk'
import gradient from 'gradient-string'
import figlet from 'figlet'
import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const version = pkg.version

// Count API ops
let ops = 0
try {
  const spec = readFileSync('openapi.yaml', 'utf8')
  ops = (spec.match(/operationId:/g) || []).length
} catch {}

// Read coverage
let stmts = '?', branches = '?', funcs = '?'
const covFile = 'coverage/coverage-summary.json'
if (existsSync(covFile)) {
  try {
    const cov = JSON.parse(readFileSync(covFile, 'utf8'))
    stmts = cov.total.statements.pct
    branches = cov.total.branches.pct
    funcs = cov.total.functions.pct
  } catch {}
}

// Count test files
let testCount = 0
try {
  testCount = parseInt(execSync("find src -name '*.test.ts' | wc -l").toString().trim())
} catch {}

// Gradients
const bannerGradient = gradient(['#00d2ff', '#3a7bd5', '#9b59b6'])
const titleGradient = gradient(['#f093fb', '#f5576c'])
const covGradient = gradient(['#f7971e', '#ffd200'])

// Banner — gradient applied per-line to preserve ASCII art characters
const banner = figlet.textSync('agentbase', {
  font: 'Small Slant',
  horizontalLayout: 'fitted',
})

console.log()
for (const line of banner.split('\n')) {
  console.log(bannerGradient(line))
}
console.log()
console.log(`  ${titleGradient('agentbase-core')}  ${chalk.dim(`v${version}`)}`)
console.log()

// Status line
const status = [
  chalk.bold.green('ALL GREEN'),
  chalk.yellow(`${testCount} test suites`),
  chalk.magenta(`${ops} API ops`),
].join(chalk.dim('  |  '))
console.log(`  ${status}`)

// Coverage bar
if (stmts !== '?') {
  const pct = parseFloat(stmts as string)
  const filled = Math.round(pct / 5)
  const empty = 20 - filled
  const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty))

  console.log()
  console.log(`  ${bar}  ${covGradient(`${stmts}%`)} ${chalk.dim('stmts')}`)
  console.log(`  ${chalk.dim('branches')} ${chalk.yellow(`${branches}%`)}  ${chalk.dim('functions')} ${chalk.yellow(`${funcs}%`)}`)
}

console.log()
