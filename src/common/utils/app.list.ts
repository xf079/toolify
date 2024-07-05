import {spawn}  from 'node:child_process';

export function getAppList(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const systemProfiler = spawn('system_profiler', ['SPApplicationsDataType']);
    const appList: string[] = [];
    systemProfiler.stdout.on('data', (data) => {
      console.log('==',data.toString());
      appList.push(data.toString());
    });
    systemProfiler.stderr.on('data', (data) => {
      console.error('==',data.toString());
    });
    systemProfiler.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      resolve(appList);
    });
  });
}
