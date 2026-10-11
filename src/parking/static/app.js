const $ = (id) => document.getElementById(id);
const lotSelect = $("lotSelect"), opMsg = $("opMsg");
let lots = [];

async function api(path, opts) {
  const r = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.detail || `HTTP ${r.status}`);
  return body;
}

function say(msg, ok = true) {
  opMsg.textContent = msg;
  opMsg.className = "msg " + (ok ? "ok" : "err");
}

function currentLot() { return lotSelect.value ? Number(lotSelect.value) : null; }

async function loadLots() {
  lots = await api("/api/lots");
  lotSelect.innerHTML = lots.map((l) =>
    `<option value="${l.id}">${l.name} (₹${l.hourly_rate}/hr)</option>`).join("");
  if (lots.length) await refresh();
}

async function refresh() {
  const id = currentLot();
  if (!id) return;
  const [slots, active, report] = await Promise.all([
    api(`/api/lots/${id}/slots`),
    api(`/api/lots/${id}/active`),
    api(`/api/lots/${id}/report`),
  ]);
  $("reportCards").innerHTML = [
    [report.occupied_slots + "/" + report.total_slots, "Occupied"],
    [report.free_slots, "Free"],
    [report.occupancy_pct + "%", "Occupancy"],
    ["₹" + report.total_revenue, "Revenue"],
  ].map(([b, s]) => `<div class="card"><b>${b}</b><span>${s}</span></div>`).join("");
  $("slotGrid").innerHTML = slots.map((s) =>
    `<div class="slot ${s.is_occupied ? "busy" : "free"}" title="${s.is_occupied ? "Occupied" : "Free"}">${s.code}</div>`
  ).join("") || "<p>No slots yet.</p>";
  document.querySelector("#activeTable tbody").innerHTML = active.map((t) =>
    `<tr><td>${t.plate}</td><td>${t.slot_code}</td><td>${new Date(t.entry_time).toLocaleString()}</td></tr>`
  ).join("");
}

$("lotForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await api("/api/lots", { method: "POST", body: JSON.stringify({
      name: $("lotName").value, hourly_rate: Number($("lotRate").value) || 50 }) });
    $("lotName").value = "";
    await loadLots();
    say("Lot added.");
  } catch (err) { say(err.message, false); }
});

$("slotForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = currentLot();
  if (!id) return say("Create a lot first.", false);
  try {
    await api(`/api/lots/${id}/slots`, { method: "POST",
      body: JSON.stringify({ codes: $("slotCodes").value.split(/[\s,]+/) }) });
    $("slotCodes").value = "";
    await refresh();
    say("Slots added.");
  } catch (err) { say(err.message, false); }
});

$("entryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const t = await api("/api/entry", { method: "POST",
      body: JSON.stringify({ lot_id: currentLot(), plate: $("entryPlate").value }) });
    $("entryPlate").value = "";
    await refresh();
    say(`Parked ${t.plate} at slot ${t.slot_code}.`);
  } catch (err) { say(err.message, false); }
});

$("exitForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const t = await api("/api/exit", { method: "POST",
      body: JSON.stringify({ lot_id: currentLot(), plate: $("exitPlate").value }) });
    $("exitPlate").value = "";
    await refresh();
    say(`Checked out ${t.plate} from ${t.slot_code}. Bill: ₹${t.amount}.`);
  } catch (err) { say(err.message, false); }
});

lotSelect.addEventListener("change", refresh);
$("refreshBtn").addEventListener("click", refresh);

loadLots().catch((err) => say(err.message, false));
setInterval(() => { if (currentLot()) refresh().catch(() => {}); }, 15000);
