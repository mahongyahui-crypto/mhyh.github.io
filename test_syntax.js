// 测试 JavaScript 语法
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// 提取 script 内容
const match = content.match(/<script>([\s\S]*?)<\/script>/);
if (match) {
  const jsCode = match[1];
  
  // 检查是否有未闭合的括号
  const openParens = (jsCode.match(/\{/g) || []).length;
  const closeParens = (jsCode.match(/\}/g) || []).length;
  console.log('Open braces:', openParens);
  console.log('Close braces:', closeParens);
  
  const openBrackets = (jsCode.match(/\[/g) || []).length;
  const closeBrackets = (jsCode.match(/\]/g) || []).length;
  console.log('Open brackets:', openBrackets);
  console.log('Close brackets:', closeBrackets);
  
  const openParens2 = (jsCode.match(/\(/g) || []).length;
  const closeParens2 = (jsCode.match(/\)/g) || []).length;
  console.log('Open parens:', openParens2);
  console.log('Close parens:', closeParens2);
  
  try {
    new Function(jsCode);
    console.log('\nJavaScript syntax OK');
  } catch (e) {
    console.error('\nSyntax error:', e.message);
    console.error('Line:', e.lineNumber);
  }
}
