class LinkedinLogin {
    // Navigate to LinkedIn login page and log
    async loginToLinkedin(page, sessionCookie) {
        const cookie = {'name': 'li_at', 'value': sessionCookie, 'domain': '.linkedin.com'};
        await page.setCookie(cookie);
        try {
            await page.goto('https://www.linkedin.com');
            await page.waitForSelector('.share-box-feed-entry__closed-share-box', { timeout : 3000});
            return true;
        } catch (e){
            console.log('Linkedin Login failed');
            return false;
        }
    }
}

export const linkedinLogin = new LinkedinLogin();
