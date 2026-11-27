const zones = [
  { name: 'A 區', desc: '北側第一區，先從外圍光電板群開始拆除。' },
  { name: 'B 區', desc: '東北側面板密集區，完成後可打開右半側動線。' },
  { name: 'C 區', desc: '西側水面邊界區，拆除後能明顯降低可見板量。' },
  { name: 'D 區', desc: '中央主要區塊，是整體拆除進度的核心。' },
  { name: 'E 區', desc: '東南側收尾區，面板集中但拆除效率高。' },
  { name: 'F 區', desc: '南側最終區，完成後即全區拆除。' }
];

let selected = 0;
let progress = [0, 0, 0, 0, 0, 0];
let steps = 0;

const doneCount = document.getElementById('doneCount');
const totalPercent = document.getElementById('totalPercent');
const zoneTitle = document.getElementById('zoneTitle');
const zoneDesc = document.getElementById('zoneDesc');
const zoneProgressText = document.getElementById('zoneProgressText');
const zoneProgressBar = document.getElementById('zoneProgressBar');
const statusBox = document.getElementById('statusBox');
const actionBtn = document.getElementById('actionBtn');
const resetBtn = document.getElementById('resetBtn');
const replayBtn = document.getElementById('replayBtn');
const closeOverlayBtn = document.getElementById('closeOverlayBtn');
const completeOverlay = document.getElementById('completeOverlay');
const logList = document.getElementById('logList');
const finalSteps = document.getElementById('finalSteps');
const nodes = [...document.querySelectorAll('.map-node')];
const mapStage = document.getElementById('mapStage');

function addLog(text) {
  const item = document.createElement('li');
  item.textContent = text;
  logList.prepend(item);
}

function render() {
  const done = progress.filter(value => value >= 5).length;
  doneCount.textContent = `${done} / 6`;
  totalPercent.textContent = `${Math.round((done / 6) * 100)}%`;
  zoneTitle.textContent = `${zones[selected].name}｜拆除任務`;
  zoneDesc.textContent = zones[selected].desc;
  zoneProgressText.textContent = `${progress[selected]} / 5`;
  zoneProgressBar.style.width = `${progress[selected] * 20}%`;

  statusBox.textContent = done === 6
    ? '烏山頭水庫所有虛構點位已拆除完成。'
    : `${zones[selected].name} 位於烏山頭水庫任務圖中，需累積 5 次拆除。`;

  nodes.forEach((node, index) => {
    node.classList.toggle('active', index === selected);
    node.classList.toggle('done', progress[index] >= 5);
  });

  progress.forEach((value, index) => {
    const cluster = document.getElementById(`cluster${index}`);
    cluster.classList.toggle('done', value >= 5);
  });

  actionBtn.disabled = progress[selected] >= 5 || done === 6;
  actionBtn.textContent = progress[selected] >= 5 ? '✓ 此區已完成' : '⚡ 啟動拆除';
}

function selectZone(index) {
  selected = index;
  render();
  addLog(`已選擇 ${zones[index].name}，地點：烏山頭水庫。`);
}

function triggerCompleteOverlay() {
  finalSteps.textContent = String(steps);
  completeOverlay.classList.remove('hidden');
}

function action() {
  if (progress[selected] >= 5) return;

  progress[selected] += 1;
  steps += 1;
  mapStage.classList.remove('flash');
  void mapStage.offsetWidth;
  mapStage.classList.add('flash');

  addLog(`對 ${zones[selected].name} 執行第 ${progress[selected]} 次拆除。`);

  if (progress[selected] >= 5) {
    addLog(`${zones[selected].name} 已拆除完成。`);
    const next = progress.findIndex(value => value < 5);
    if (next !== -1) selected = next;
  }

  render();

  if (progress.every(value => value >= 5)) {
    addLog('烏山頭水庫所有拆除任務完成。');
    triggerCompleteOverlay();
  }
}

function resetGame() {
  selected = 0;
  progress = [0, 0, 0, 0, 0, 0];
  steps = 0;
  completeOverlay.classList.add('hidden');
  logList.innerHTML = '';
  addLog('任務已重置，可重新開始。');
  render();
}

nodes.forEach((node, index) => {
  node.addEventListener('click', () => selectZone(index));
});

actionBtn.addEventListener('click', action);
resetBtn.addEventListener('click', resetGame);
replayBtn.addEventListener('click', resetGame);
closeOverlayBtn.addEventListener('click', () => completeOverlay.classList.add('hidden'));

addLog('任務已載入，請在烏山頭水庫地圖上選擇亮點。');
render();
