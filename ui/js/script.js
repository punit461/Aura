const loginButton = document.getElementById('loginButton');
const welcomeMessage = document.getElementById('welcomeMessage');
const deviceCodeElement = document.getElementById('deviceCode');

loginButton.addEventListener('click', initiateDeviceCodeFlow);

async function initiateDeviceCodeFlow() {
    try {
        const response = await fetch('/api/device_code', { method: 'POST' });
        const data = await response.json();
        
        deviceCodeElement.innerHTML = `
            <p><strong>Device Registration & Sign In Required</strong></p>
            
            <p>Copy your User Code: <strong>${data.user_code}</strong></p>
            <p>Please enter this code at: <a href="${data.verification_uri}" target="_blank">${data.verification_uri}</a></p>
        `;
        loginButton.style.display = 'none';
        
        pollForToken(data.device_code, data.expires_in, data.interval);
    } catch (error) {
        console.error('Error initiating device code flow:', error);
    }
}

async function pollForToken(deviceCode, expiresIn, interval) {
    const startTime = Date.now();
    const pollInterval = interval * 1000; // Convert to milliseconds

    async function poll() {
        if (Date.now() - startTime > expiresIn * 1000) {
            deviceCodeElement.textContent = "The device code has expired. Please try again.";
            loginButton.style.display = 'block';
            return;
        }

        try {
            const response = await fetch(`/api/token/${deviceCode}`, { method: 'POST' });
            const data = await response.json();

            if (response.ok && data.access_token) {
                console.log("Access token acquired successfully");
                welcomeMessage.textContent = `Welcome! You're now logged in.
                Redirecting... 
                Click here If not redirected.`;
                deviceCodeElement.style.display = 'none';
            } else {
                // If the token is not ready, poll again after the specified interval
                setTimeout(poll, pollInterval);
            }
        } catch (error) {
            console.error('Error polling for token:', error);
            setTimeout(poll, pollInterval);
        }
    }

    poll();
}