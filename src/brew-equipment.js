// Original code-drawn utensils shared by both games. No images or graphics engine.
export function brewEquipment(mode='first'){
 const fp=mode==='first',p=fp?'fp':'counter',kettle=fp?'fp-pot':'kettle',filter=fp?'fp-filter':'live-filter',server=fp?'fp-cup':'live-cup';
 return `<div class="brew-stand" aria-hidden="true"><svg viewBox="0 0 360 430" focusable="false"><ellipse cx="180" cy="414" rx="109" ry="10" fill="#101c1655"/><path d="M78 410V245q0-14 14-14h22M78 266h78m46 0h37" fill="none" stroke="#9b7650" stroke-width="7" stroke-linecap="round"/><path d="M62 411h191" stroke="#c29a66" stroke-width="8" stroke-linecap="round"/></svg></div>
 <div class="${kettle} brew-gooseneck"><svg viewBox="0 0 190 140" focusable="false"><defs><linearGradient id="${p}-metal"><stop stop-color="#e0ddc2"/><stop offset=".35" stop-color="#adb59e"/><stop offset=".7" stop-color="#6c7c6c"/><stop offset="1" stop-color="#a9b295"/></linearGradient></defs>
 <path d="M151 49q30-10 30 18v31q-1 23-26 17" fill="none" stroke="#201e17" stroke-width="12"/><path d="M153 49q24-7 24 18v30q0 15-19 15" fill="none" stroke="#92734e" stroke-width="4"/>
 <path d="M100 104C63 126 57 111 50 94S31 75 8 84" fill="none" stroke="#728373" stroke-width="9" stroke-linecap="round"/><path d="M100 101C64 121 60 107 53 92S31 72 8 82" fill="none" stroke="#e0dfc3" stroke-width="3" stroke-linecap="round"/>
 <path d="M107 42q-7 9-10 25l-11 48q-2 12 13 15h52q14-3 10-16l-14-48q-4-16-12-24z" fill="url(#${p}-metal)" stroke="#d7d5b8" stroke-width="2"/>
 <path d="M98 115q29 8 59 0M108 51q10 8 29 0" fill="none" stroke="#f7efd080" stroke-width="2"/><path d="m103 43 5-8h30l7 8q-20 8-42 0z" fill="#b3986c" stroke="#e2cf9f" stroke-width="2"/><rect x="117" y="26" width="12" height="10" rx="4" fill="#51402c"/><path d="m108 63-10 42" stroke="#f5efd5" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
 </svg></div>
 <div class="${fp?'fp-stream':'pour-stream'}"></div>
 <div class="${filter} brew-v60"><div class="brew-cone-liquid"><div class="${fp?'fp-water-bed':'live-water'}"></div><div ${fp?'id="fp-bloom"':'class="live-grounds"'}></div></div><svg viewBox="0 0 170 160" focusable="false"><g transform="scale(1 1.25)"><defs><linearGradient id="${p}-ceramic" x2="1" y2=".2"><stop stop-color="#eee4cb"/><stop offset=".5" stop-color="#c7b99c"/><stop offset="1" stop-color="#f4ebd3"/></linearGradient></defs>
 <path d="M146 29q28-5 18 24-5 11-26 12" fill="none" stroke="#cbbc99" stroke-width="7"/><path class="brew-cone-shell" d="M16 20Q22 63 75 111q9 10 18 0 53-48 59-91z" fill="url(#${p}-ceramic)" stroke="#e8d9b7" stroke-width="2"/>
 <g fill="none" stroke="#9b8c70" stroke-opacity=".65" stroke-width="2"><path d="M26 33q17 42 53 73M44 36q9 38 38 73M64 38q-1 34 21 73M86 39q-10 35 1 74M108 36q-19 39-18 76M130 32q-24 40-37 75M144 29q-19 38-46 68"/></g>
 <ellipse cx="84" cy="20" rx="69" ry="13" fill="#7c6750" stroke="#f4ead2" stroke-width="3"/><ellipse cx="84" cy="21" rx="61" ry="9" fill="#dfd0ac"/><ellipse class="brew-grounds-surface" cx="84" cy="23" rx="48" ry="6" fill="#63402a"/><ellipse class="brew-water-surface" cx="84" cy="22" rx="47" ry="5" fill="#dca45b55"/><path d="M77 112v5h15v-5" fill="#d7c8a8"/><ellipse cx="84" cy="120" rx="34" ry="5" fill="#d1c3a5" stroke="#eee1c1" stroke-width="2"/>
 </g></svg>${fp?'':'<span class="spill-line"></span>'}</div>
 <div class="${fp?'fp-coffee-stream':'drawdown-stream'}">${fp?'<i></i><i></i><i></i>':''}</div>${fp?'':'<div class="overflow-stream"></div>'}
 <div class="${server} brew-server"><div class="brew-server-liquid"><div ${fp?'id="fp-cup-fill"':'class="brew-coffee-fill"'}></div></div><svg viewBox="0 0 170 142" focusable="false">
 <path d="M124 35q38-12 36 23-2 31-34 30" fill="none" stroke="#b5cfc2" stroke-opacity=".85" stroke-width="8"/><path d="M127 38q29-7 27 20-1 22-26 24" fill="none" stroke="#e2eade" stroke-opacity=".7" stroke-width="2"/>
 <path d="m61 8-22 2 16 14v15q-1 15-16 36l-15 29q-9 23 14 27h81q24-3 14-27l-17-30q-13-21-13-35V20l6-8-18-4z" fill="#b6d5c20c" stroke="#c6dfd1" stroke-width="2.5" stroke-linejoin="round"/>
 <ellipse cx="78" cy="11" rx="29" ry="5" fill="#acc8b614" stroke="#d2e3d3" stroke-width="2"/><path d="M56 33h47" stroke="#302c23" stroke-width="9"/><path d="M57 31h45" stroke="#81734e" stroke-width="2"/>
 <path d="M55 55q-5 20-18 42-6 11-4 20M44 123h63" fill="none" stroke="#ecf4e2" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
 <g stroke="#c4d6c4" stroke-opacity=".7"><path d="M96 69h11M98 85h17M101 101h22"/></g><g fill="#e0e5cd" font-family="sans-serif" font-size="6" opacity=".8"><text x="83" y="71">300</text><text x="85" y="87">200</text><text x="88" y="103">100</text></g>
 </svg></div>`;
}
