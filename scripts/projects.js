// Blog data loading and card generation
document.addEventListener("DOMContentLoaded", function(){
    const cardContainer = document.getElementById("cardcontainer");
    const tagFilter = document.getElementById("tagfilter");
    const sortToggle = document.getElementById("sorttoggle");

    let allEntries = [];
    let currentSort = "newest";
    const selectedTags = new Set();

    // Display label for each tag value (matches the old <select> option text)
    const TAG_LABELS = {
        "html": "HTML",
        "css": "CSS",
        "javascript": "JavaScript",
        "web-dev": "Web Development",
        "python": "Python",
    };

    // Icon path per tag, per theme.
    const TAG_ICON_MAP = {
        "html":       { light: "./images/icons/tags/html_icon.png",       dark: "./images/icons/darkmode/tags/html_icon.png" },
        "css":        { light: "./images/icons/tags/css_icon.png",        dark: "./images/icons/darkmode/tags/css_icon.png" },
        "javascript": { light: "./images/icons/tags/javascript_icon.png", dark: "./images/icons/darkmode/tags/javascript_icon.png" },
        "web-dev":    { light: "./images/icons/tags/web-dev_icon.png",    dark: "./images/icons/darkmode/tags/web-dev_icon.png" },
        "python":     { light: "./images/icons/tags/python_icon.png",     dark: "./images/icons/darkmode/tags/python_icon.png" },
    };

    // Extensions to try, in order, for each blog post's card image.
    const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
    const FALLBACK_IMAGE = "images/icons/computer_icon.png";

    // Called from the <img> tag's onerror. Walks through IMAGE_EXTENSIONS
    // in order; when all have failed, falls back to a placeholder icon.
    window.handleImageError = function(img) {
        const entryId = img.dataset.entryId;
        let extIndex = parseInt(img.dataset.extIndex, 10);

        extIndex += 1;
        if (extIndex >= IMAGE_EXTENSIONS.length) {
            img.onerror = null; // stop the chain, avoid infinite loop if fallback also 404s
            img.src = FALLBACK_IMAGE;
            return;
        }

        img.dataset.extIndex = extIndex;
        img.src = `./projects/${entryId}/images/cardimage.${IMAGE_EXTENSIONS[extIndex]}`;
    };

    // Determine current theme the same way theme.js does, so tag icons
    // on freshly-created cards match whatever's currently active.
    function isDarkMode() {
        const theme = localStorage.getItem("theme") || "system";
        return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    function tagIconSrc(tag) {
        const icons = TAG_ICON_MAP[tag];
        if (!icons) return FALLBACK_IMAGE;
        return isDarkMode() ? icons.dark : icons.light;
    }

    // load data and fetch from the JSON function
    async function loadData() {
        jsonentries = await fetch("./projects/posts.json");
        allEntries = await jsonentries.json();
        updateDisplay(allEntries);
    }

    //format date to local time
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString(undefined,{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short"
        });
    }

    // Build the pill-shaped tag markup shown on each card
    function buildTagsHtml(tags) {
        return tags.map(tag => {
            const label = TAG_LABELS[tag] || tag;
            const iconSrc = tagIconSrc(tag);
            return `
                <span class="tagpill cardtagpill">
                    <img src="${iconSrc}" alt="" class="tagicon" data-icon="tag-${tag}">
                    ${label}
                </span>
            `;
        }).join("");
    }

    //create a card element
    function createCard(entry) {
        const card = document.createElement("a");
        card.className = "projectcard";
        card.href = `./projects/${entry.id}/project.html`;
        const formattedDate = formatDate(entry.date);

        card.innerHTML = `
        <div>
        <img src="./projects/${entry.id}/images/cardimage.${IMAGE_EXTENSIONS[0]}"
             alt="${entry.title}"
             class="cardimage"
             data-entry-id="${entry.id}"
             data-ext-index="0"
             onerror="handleImageError(this)">
        <div class="cardtags">${buildTagsHtml(entry.tags)}</div>
        <h3 class="projecttitle"${entry.title}</h3>
        <div class="description">${entry.description}</div>
        <div class="projectdate">${formattedDate}</div>
        </div>
        `;

        return card;
    }

    //render cards based on filters and sort
    function renderCards(entries) {
        cardContainer.innerHTML = "";
        if (entries.length === 0) {
            cardContainer.innerHTML = "<p>No entries match your filters.</p>";
            return;
        }
        entries.forEach(entry =>{
            const card = createCard(entry); 
            cardContainer.appendChild(card);
        });
    }

    //filter entries
    function filterEntries() {
        if (selectedTags.size === 0){
            return allEntries;
        }
        return allEntries.filter(entry => {
            return [...selectedTags].every(tag => entry.tags.includes(tag));
        });
    }

    //sort entries
    function sortEntries(entries){
        return[...entries].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (currentSort === "newest"){
                return dateB - dateA;
            } 
            else{
                return dateA - dateB;
            }
        });
    }

    //update display wiht current filters and sort
    function updateDisplay() {
        let filteredEntries = filterEntries();
        const sortedEntries = sortEntries(filteredEntries);
        renderCards(sortedEntries);
    }

    //event listeners
    tagFilter.addEventListener("click", function(event) {
        const pill = event.target.closest(".tagpill");
        if (!pill) return;

        const tag = pill.dataset.tag;
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            pill.classList.remove("active");
        } else {
            selectedTags.add(tag);
            pill.classList.add("active");
        }
        updateDisplay();
    });

    sortToggle.addEventListener("click", function() {
        currentSort = currentSort === "newest" ? "oldest" : "newest";
        this.textContent = `Sort: ${currentSort === "newest" ? "Newest First" : "Oldest First"}`;
        updateDisplay();
    });

    //initialize
    loadData();
});
