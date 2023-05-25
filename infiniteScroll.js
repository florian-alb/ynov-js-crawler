class Scrolling {
// Scroll down to the page in case of infinity scroll configuration
    async infiniteScroll(page, maxScrolls = 10) {
        let previousHeight = await page.evaluate('document.body.scrollHeight');
        let currentHeight;
        let currentScoll = 0;
        do {
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForTimeout(2000);
            currentHeight = await page.evaluate('document.body.scrollHeight');
            currentScoll++;
        } while (currentHeight > previousHeight && (previousHeight = currentHeight) && currentScoll < maxScrolls);
    }
}

export const scrolling = new scrolling();