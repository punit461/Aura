import { MICROSOFT_GRAPH_TENANT_ID } from './apiEndpoint.js'
import { MICROSOFT_GRAPH_CLIENT_ID } from "./apiEndpoint.js";

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: MICROSOFT_GRAPH_CLIENT_ID, // Replace with your Azure AD app's client ID
        authority: "https://login.microsoftonline.com/" + MICROSOFT_GRAPH_TENANT_ID, // Replace with your Azure AD tenant ID
        redirectUri: "http://localhost:8000/ui/home", // Replace with your app's redirect URI
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// Microsoft Graph API endpoints
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages?$filter=isRead eq false&$top=5&$orderby=receivedDateTime desc"
};

// Authentication request
const loginRequest = {
    scopes: ["User.Read","Mail.Read"]
};

// Mock emails for demonstration
const mockEmails = [
    { id: 1, subject: 'Important Meeting', sender: 'boss@company.com', body: 'We need to discuss the project timeline.' },
    { id: 2, subject: 'Lunch Plans', sender: 'friend@email.com', body: 'Want to grab lunch tomorrow?' },
    { id: 3, subject: 'Invoice Due', sender: 'accounting@company.com', body: 'Your invoice for this month is due in 3 days.' },
    { id: 4, subject: 'New Product Launch', sender: 'marketing@company.com', body: 'We\'re excited to announce our new product launch next week!' },
    { id: 5, subject: 'Vacation Request', sender: 'hr@company.com', body: 'Your vacation request has been approved.' },
    { id: 6, subject: 'Project Update', sender: 'team@company.com', body: 'Here\'s the latest update on our ongoing project.' },
    { id: 7, subject: 'Newsletter', sender: 'news@company.com', body: 'Check out our monthly newsletter for the latest updates.' },
];

let currentPage = 1;
const emailsPerPage = 5;


// Function to handle login
async function signIn() {
    try {
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        console.log("Login successful", loginResponse);
        showWelcomeMessage(loginResponse.account);
        getUserProfile();
    } catch (error) {
        console.error("Error during login", error);
    }
}

// Function to get user profile
async function getUserProfile() {
    try {
        const account = msalInstance.getAllAccounts()[0];
        const accessTokenRequest = {
            scopes: ["User.Read"],
            account: account
        };
        const tokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
        const response = await fetch(graphConfig.graphMeEndpoint, {
            headers: {
                Authorization: `Bearer ${tokenResponse.accessToken}`
            }
        });
        const profileData = await response.json();
        console.log("User Profile:", profileData);
        showWelcomeMessage(profileData);
    } catch (error) {
        console.error("Error getting user profile", error);
    }
}

// Function to show welcome message
function showWelcomeMessage(account) {
    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Hello, ${account.displayName || account.name || 'Guest'}`;
}
// Function to toggle email list visibility
function toggleEmails() {
    const emailList = document.getElementById('emailList');
    const toggleBtn = document.getElementById('toggleEmailsBtn');
    if (emailList.classList.contains('hidden')) {
        emailList.classList.remove('hidden');
        toggleBtn.textContent = 'Hide Unread Emails';
        displayEmails();
    } else {
        emailList.classList.add('hidden');
        toggleBtn.textContent = 'Read Unread Emails';
    }
}

// Function to display emails
function displayEmails() {
    const emailsContainer = document.getElementById('emails');
    emailsContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * emailsPerPage;
    const endIndex = startIndex + emailsPerPage;
    const displayedEmails = mockEmails.slice(startIndex, endIndex);

    displayedEmails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = 'email-item';
        emailElement.innerHTML = `
            <div class="email-header">
                <strong>${email.subject}</strong> - ${email.sender}
            </div>
            <div class="email-body">${email.body}</div>
        `;
        emailElement.querySelector('.email-header').addEventListener('click', () => {
            const body = emailElement.querySelector('.email-body');
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
        });
        emailsContainer.appendChild(emailElement);
    });

    updatePagination();
}

// Function to update pagination
function updatePagination() {
    const pageInfo = document.getElementById('pageInfo');
    const totalPages = Math.ceil(mockEmails.length / emailsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateRepliesBtn').addEventListener('click', () => {
        alert('Generate Email Replies clicked');
    });
    document.getElementById('toggleEmailsBtn').addEventListener('click', toggleEmails);
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayEmails();
        }
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(mockEmails.length / emailsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayEmails();
        }
    });

    // Attempt to sign in silently
    msalInstance.handleRedirectPromise().then(() => {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
            getUserProfile();
        } else {
            signIn();
        }
    }).catch(error => {
        console.error(error);
    });
});