// Linktree Page Specific Scripts

document.addEventListener('DOMContentLoaded', function () {
    // Podcast link placeholder
    const podcastLink = document.getElementById('podcast-link');
    if (podcastLink) {
        podcastLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Podcast 頁面建構中...');
        });
    }
});
