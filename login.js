class Login {
    // Navigate to LinkedIn login page and log
    async loginToLinkedin(page, sessionCookie) {
        const cookie = {'name': 'li_at', 'value': sessionCookie, 'domain': '.linkedin.com'};
        await page.setCookie(cookie);
        await page.goto('https://www.linkedin.com');

        try {
            await page.waitForSelector('.share-box-feed-entry__closed-share-box', { timeout : 3000});
            console.log('Login successful');
        } catch (e){
            throw new Error('Login failed');
        }
    }
}

export const login = new Login();
