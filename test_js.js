// 测试 JavaScript 语法
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// 提取 script 内容
const match = content.match(/<script>([\s\S]*?)<\/script>/);
if (match) {
  const jsCode = match[1];
  try {
    new Function(jsCode);
    console.log('JavaScript syntax OK');
  } catch (e) {
    console.error('Syntax error:', e.message);
  }
}
