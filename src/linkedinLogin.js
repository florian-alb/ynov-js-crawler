class LinkedinLogin {
    // Navigate to LinkedIn login page and log
    async loginToLinkedin(page, sessionCookie) {
        const cookie = {'name': 'li_at', 'value': sessionCookie, 'domain': '.linkedin.com'};
        await page.setCookie(cookie);
        await page.goto('https://www.linkedin.com');

        try {
            await page.waitForSelector('.share-box-feed-entry__closed-share-box', { timeout : 3000});
            console.log('Linkedin Login successful');
            return true;
        } catch (e){
            console.log('Linkedin Login failed');
            return false;
        }
    }
}

export const linkedinLogin = new LinkedinLogin();
