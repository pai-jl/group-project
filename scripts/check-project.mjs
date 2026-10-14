import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
const pages = JSON.parse(fs.readFileSync('src/pages.json', 'utf8'))
for (const page of pages.pages)
  assert(fs.existsSync(`src/${page.path}.vue`), `缺失页面 ${page.path}`)
for (const item of pages.tabBar.list) {
  assert(pages.pages.some((p) => p.path === item.pagePath))
  for (const k of ['iconPath', 'selectedIconPath'])
    assert(fs.existsSync(`src/${item[k]}`))
}
const catalog = JSON.parse(
  fs.readFileSync('src/contracts/catalog.json', 'utf8')
)
for (const [module, entry] of Object.entries(catalog)) {
  const code = fs.readFileSync(`src/services/${module}.js`, 'utf8')
  for (const method of entry.methods)
    assert(code.includes(`${module}.${method}`), `缺少接口 ${module}.${method}`)
}
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((x) =>
      x.isDirectory() ? walk(path.join(dir, x.name)) : [path.join(dir, x.name)]
    )
}
for (const file of walk('src').filter((f) => /\.(js|vue)$/.test(f))) {
  const code = fs.readFileSync(file, 'utf8')
  for (const m of code.matchAll(/from ['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('.'))
      assert(
        fs.existsSync(path.resolve(path.dirname(file), m[1])),
        `错误导入 ${file}: ${m[1]}`
      )
  }
}
console.log(
  `结构检查通过：${pages.pages.length} 个页面，${Object.values(catalog).reduce((n, v) => n + v.methods.length, 0)} 个接口调用位置。`
)
