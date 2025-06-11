import './style.css'

import { format } from 'date-fns';

document.querySelector('#app').innerHTML = `
  <div id="sort-field">
  <label for="sort-select" class="select-header">Sort by: </label><select id="sort-select">
    <option value="created_at.asc">Date Ascending</option>
    <option value="created_at.desc" selected>Date Descending</option>
    <option value="title.asc">Names Alphabetically</option>
  </select>
  </div>
  <ul id="articles-list"></ul>
  <h2 id="add-article-header">Add a new article</h2>
    <form id="article-form">
      <label>Title<input type="text" name="title" placeholder="tytuł" required /></label>
      <label>Subtitle:<input type="text" name="subtitle" placeholder="subtitle" required />
      </label>
      <label>
        Author:<input type="text" name="author" placeholder="author" required />
      </label>
      <label>
        Content:<textarea name="content" placeholder="content" required></textarea>
      </label>
      <label>
        Created at:<input type="date" name="created_at" placeholder="created at" />
      </label>
      <button type="submit" class="submit-button">Add article</button>
    </form>`;

const SUPABASE_URL = 'https://gawpgcluparlymheqqov.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhd3BnY2x1cGFybHltaGVxcW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjY3NDIsImV4cCI6MjA2MzI0Mjc0Mn0.nq4yMNUBPeCVkcDsCoEK6PXkSCCmoVOBjJjbGLaAyEg'

const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', () => {
  fetchArticles();
});

const fetchArticles = async () => {
  const sortSelect = document.getElementById('sort-select');
  const order = sortSelect ? sortSelect.value : 'created_at.desc';
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/article?order=${order}`,
      {
        headers: {
          apiKey: SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    showArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

function showArticles(articles) {
  const list = document.getElementById('articles-list');
  list.innerHTML = '';
  articles.forEach(article => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${article.title}</h2>
      <h3>${article.subtitle}</h3>
      <p><address>autor: ${article.author}</address></p>
      <p><time>data: ${format(new Date(article.created_at), 'dd-MM-yyyy')}</time></p>
      <p>${article.content}</p>
    `;
    list.appendChild(li);
  });
}

const form = document.getElementById('article-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const createdAtValue = formData.get('created_at');
  const newArticle = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    author: formData.get('author'),
    content: formData.get('content'),
    created_at: createdAtValue ? new Date(createdAtValue).toISOString() : new Date().toISOString(),
  };
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/article`, {
      method: 'POST',
      headers: {
        apiKey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(newArticle),
    });
    if (!response.ok) {
      throw new Error (`Status: ${response.status}`)
    }
    fetchArticles();
    form.reset();
  } catch (error) {
    console.error('Fetch error:', error)
  }
});

fetchArticles();
