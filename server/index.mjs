import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createBeanScanner } from './bean-scan.mjs';
const port=Number(process.env.COFFEE_AI_PORT||8787);
const origins=(process.env.COFFEE_ALLOWED_ORIGINS||'http://127.0.0.1:5173').split(',').map(s=>s.trim()).filter(Boolean);
const quotaFile=process.env.COFFEE_QUOTA_FILE||'/var/lib/coffee-bean-ai/quota.json';
const dailyLimit=Number(process.env.COFFEE_DAILY_SCAN_LIMIT||25);
const ipLimit=Number(process.env.COFFEE_IP_SCAN_LIMIT||5);
if(!Number.isInteger(dailyLimit)||dailyLimit<1||!Number.isInteger(ipLimit)||ipLimit<1)throw new Error('Invalid quota settings');
let quotaQueue=Promise.resolve();
async function quota(request) {
 const operation=quotaQueue.then(async()=>{
  const today=new Date().toISOString().slice(0,10);let state;
  try{state=JSON.parse(await fs.readFile(quotaFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  if(!state||state.day!==today)state={day:today,total:0,ips:{}};
  // The HTTP listener binds loopback. Only the trusted Nginx location supplies this header.
  const ip=request.headers.get('x-coffee-client-ip')||'local';
  if(state.total>=dailyLimit||(state.ips[ip]||0)>=ipLimit)return false;
  state.total++;state.ips[ip]=(state.ips[ip]||0)+1;
  await fs.mkdir(path.dirname(quotaFile),{recursive:true});await fs.writeFile(quotaFile+'.tmp',JSON.stringify(state),{mode:0o600});await fs.rename(quotaFile+'.tmp',quotaFile);return true;
 });quotaQueue=operation.catch(()=>{});return operation;
}
const scan=createBeanScanner({apiKey:process.env.COFFEE_AI_KEY,origins,model:process.env.COFFEE_AI_MODEL||'gpt-4.1-mini',consumeQuota:quota});
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({service:'coffee-bean-ai',configured:Boolean(process.env.COFFEE_AI_KEY)}));return;}
  if(req.url!=='/api/bean-scan'){res.writeHead(404);res.end();return;}
  let length=0;const chunks=[];for await(const chunk of req){length+=chunk.length;if(length>10000000){res.writeHead(413);res.end();return;}chunks.push(chunk);}
  const request=new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
  const response=await scan(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'});res.end('{"error":"Service unavailable"}');}
});
server.requestTimeout=45000;server.headersTimeout=10000;
server.listen(port,'127.0.0.1',()=>console.log(`Coffee bean scanner listening on loopback port ${port}`));
