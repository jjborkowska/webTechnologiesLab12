import './style.css'

const SUPABASE_URL = 'https://gawpgcluparlymheqqov.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhd3BnY2x1cGFybHltaGVxcW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjY3NDIsImV4cCI6MjA2MzI0Mjc0Mn0.nq4yMNUBPeCVkcDsCoEK6PXkSCCmoVOBjJjbGLaAyEg'

const fetchArticles = async () => {

  const apiurl = `${SUPABASE_URL}/rest/v1/article?select=id,title,subtitle,author,created_at,content`
  try {
    const response = await fetch(
      apiurl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => (
        {
          message: response.statusText

        }
      )
      );

      throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorData.message || 'Unknown server error.'}`);

    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


const appElement = document.querySelector('#app');

const showArticles = (articles) => {

  if (!appElement) {
    console.error('Error: The HTML element with ID "app" was not found in your index.html.');
    return;
  }

  appElement.innerHTML = '';

  if (!articles || articles.length === 0) {
    appElement.innerHTML = '<p>There are no articles to be shown.</p>';
    return;
  }

  const articlesList = document.createElement('ul');
articlesList.className = 'articles-list';

articles.forEach(article => {
  const listItem = document.createElement('li');
  listItem.className = 'article-item';

  listItem.innerHTML = `
      <h3>${article.title || 'No title'}</h3>
      ${article.subtitle ? `<p class="article-subtitle">${article.subtitle}</p>` : ''}
      <p class="article-content">${article.content ? article.content : 'No content'}</p>
      <small>
        ${article.author ? `Author: ${article.author}` : 'Unknown author'}
        ${article.created_at ? ` | Created at: ${new Date(article.created_at).toLocaleDateString('en-EN')}` : ''}
      </small>
    `;


  articlesList.appendChild(listItem);
});

appElement.appendChild(articlesList);

}

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM fully loaded and parsed. Fetching articles...");
  const articles = await fetchArticles(); 
  if (articles) { 
    showArticles(articles); 
  } else {
    if (appElement) {
        appElement.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
  }
});