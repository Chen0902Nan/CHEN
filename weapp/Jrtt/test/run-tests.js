// 测试运行脚本
const { exec } = require('child_process');
const path = require('path');

console.log('🧪 开始运行注册功能测试...\n');

// 检查是否安装了 mocha
const checkMocha = () => {
  return new Promise((resolve, reject) => {
    exec('mocha --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ 未检测到 mocha，正在安装...');
        exec('npm install -g mocha', (installError) => {
          if (installError) {
            reject(new Error('安装 mocha 失败'));
          } else {
            console.log('✅ mocha 安装成功');
            resolve();
          }
        });
      } else {
        console.log(`✅ 检测到 mocha 版本: ${stdout.trim()}`);
        resolve();
      }
    });
  });
};

// 运行测试
const runTests = async () => {
  try {
    await checkMocha();

    console.log('\n🚀 运行测试中...\n');

    const testPath = path.join(__dirname, 'registration.test.js');
    exec(`mocha "${testPath}" --reporter spec`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 测试执行失败:', error);
        return;
      }

      console.log(stdout);

      if (stderr) {
        console.error('测试错误输出:', stderr);
      }

      console.log('\n🎉 测试完成！');
    });

  } catch (error) {
    console.error('❌ 测试准备失败:', error.message);
    console.log('\n💡 请手动运行以下命令安装依赖:');
    console.log('npm install -g mocha');
    console.log('\n然后运行:');
    console.log('mocha test/registration.test.js');
  }
};

runTests();