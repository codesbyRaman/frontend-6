const loadBtn = document.getElementById("loadBtn");
const sourceSelect = document.getElementById("sourceSelect");
const categoryInput = document.getElementById("categoryInput");
const newsContainer = document.getElementById("newsContainer");
const statusEl = document.getElementById("status");
const sortSelect = document.getElementById("sortSelect");
const themeBtn = document.getElementById("themeBtn");

const backendBase = ""; 

loadBtn.addEventListener("click", loadNews);
sortSelect.addEventListener("change", () => renderArticles(currentArticles));
themeBtn.addEventListener("click", toggleTheme);

let currentArticles = [];

async function loadNews(){
  const source = sourceSelect.value;
  const category = (categoryInput.value || "general").trim();
  statusEl.textContent = `Loading ${category} from ${source}...`;
  newsContainer.innerHTML = "";

  try {
    const res = await fetch(`${backendBase}/api/news?source=${encodeURIComponent(source)}&category=${encodeURIComponent(category)}`);
    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = `Error: ${data.error || 'Failed to fetch'}`;
      return;
    }

    currentArticles = data.articles || [];
    statusEl.textContent = `Showing ${currentArticles.length} articles from ${data.source} (category: ${data.category})`;
    renderArticles(currentArticles);
  } catch (err) {
    statusEl.textContent = "Fetch failed: " + (err.message || err);
  }
}

function renderArticles(articles){
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p style='padding:12px'>No articles found.</p>";
    return;
  }

  const sorted = [...articles];
  if (sortSelect.value === "new") {
    sorted.sort((a,b) => (new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)));
  } else {
    sorted.sort((a,b) => (new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0)));
  }

  let html = "";
  for (const a of sorted) {
    html += `
      <article class="card">
        ${a.urlToImage ? `<img src="${a.urlToImage}" alt="thumb">` : ""}
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.description || "").substring(0,220)}</p>
        <div class="meta">${a.source} • ${a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ""}</div>
        <p style="margin-top:8px"><a href="${a.url}" target="_blank">Read full article!</a></p>
      </article>
    `;
  }
  newsContainer.innerHTML = html;
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}

function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }


document.addEventListener("DOMContentLoaded", () => {
  categoryInput.value = "punjabi india";
  loadNews();
});
