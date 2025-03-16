let allArticles = [];  // Store all fetched articles

async function fetchNews() {
    let apiKey = "a76711680012e493460b8bef1429c5a4";  // Your GNews API Key
    let url = 'https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=us&apikey=a76711680012e493460b8bef1429c5a4';

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (!response.ok) {
            throw new Error("API error or limit reached.");
        }

        allArticles = data.articles;  // Store all articles for filtering
        displayNews(allArticles);  // Display the articles

    } catch (error) {
        console.error(error.message);
        document.getElementById("news-container").innerHTML = "Error loading news.";
    }
}

function displayNews(articles) {
    let newsHTML = "";
    articles.forEach(article => {
        newsHTML += `
            <div class="news-item">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `;
    });
    document.getElementById("news-container").innerHTML = newsHTML;
}

// Search functionality for filtering news
document.getElementById("search-btn").addEventListener("click", () => {
    let query = document.getElementById("search-input").value.toLowerCase();
    let filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
    );
    displayNews(filteredArticles);  // Display the filtered news
});

// Fetch news when page loads
fetchNews();