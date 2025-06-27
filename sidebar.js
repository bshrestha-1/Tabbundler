function renderGroups(groups) {
  const container = document.getElementById("tabGroups");
  container.innerHTML = "";

  for (const [groupName, tabs] of Object.entries(groups)) {
    const div = document.createElement("div");
    div.className = "group";

    const title = document.createElement("div");
    title.className = "group-title";
    title.textContent = groupName;
    div.appendChild(title);

    tabs.forEach(tab => {
      const tabDiv = document.createElement("div");
      tabDiv.className = "tab";
      tabDiv.textContent = tab.title || tab.url;
      tabDiv.onclick = () => browser.tabs.update(tab.id, { active: true });

      const controls = document.createElement("div");
      controls.className = "controls";

      const reassignBtn = document.createElement("span");
      reassignBtn.className = "button";
      reassignBtn.textContent = "Reassign";
      reassignBtn.onclick = () => handleReassign(tab);

      controls.appendChild(reassignBtn);
      tabDiv.appendChild(controls);
      div.appendChild(tabDiv);
    });

    container.appendChild(div);
  }
}

function handleReassign(tab) {
  const newGroup = prompt("Enter new group name for this tab:");
  if (!newGroup) return;

  browser.storage.local.get("tabGroups").then(data => {
    const groups = data.tabGroups || {};
    for (const group in groups) {
      groups[group] = groups[group].filter(t => t.id !== tab.id);
    }
    if (!groups[newGroup]) groups[newGroup] = [];
    groups[newGroup].push(tab);
    browser.storage.local.set({ tabGroups: groups });
  });
}

browser.storage.local.get("tabGroups").then(data => {
  renderGroups(data.tabGroups || {});
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.tabGroups) {
    renderGroups(changes.tabGroups.newValue);
  }
});

