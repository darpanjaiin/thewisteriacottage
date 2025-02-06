// Google Sheets API configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const API_KEY = 'YOUR_API_KEY';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Initialize the Google Sheets API
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Load the auth2 library and API client library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
    if (!isSignedIn) {
        window.location.href = 'admin.html';
    }
}

// Handle login form submission
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Here you would typically validate against your authorized users list
        // For demo purposes, we're using a simple check
        if (email === 'admin@example.com' && password === 'password') {
            gapi.auth2.getAuthInstance().signIn();
        } else {
            const messageDiv = document.getElementById('loginMessage');
            messageDiv.textContent = 'Invalid credentials';
            messageDiv.className = 'login-message error';
        }
    });
}

// Handle logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        gapi.auth2.getAuthInstance().signOut();
    });
}

// Handle property name updates
if (document.getElementById('propertyNameForm')) {
    const propertyNameForm = document.getElementById('propertyNameForm');
    const propertyNameInput = document.getElementById('propertyName');
    const previewContent = document.getElementById('previewContent');

    // Update preview as user types
    propertyNameInput.addEventListener('input', function() {
        previewContent.textContent = this.value;
    });

    // Handle form submission
    propertyNameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updatePropertyName(propertyNameInput.value);
    });
}

// Update property name in Google Sheets and website
async function updatePropertyName(newName) {
    try {
        // Update Google Sheets
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Settings!A2', // Assuming we store the property name in A2
            valueInputOption: 'RAW',
            resource: {
                values: [[newName]]
            }
        });

        if (response.status === 200) {
            // Update the website content
            document.title = `${newName} - Admin Panel`;
            // You would typically update this in your database or configuration file
            
            // Show success message
            alert('Property name updated successfully!');
        }
    } catch (error) {
        console.error('Error updating property name:', error);
        alert('Error updating property name. Please try again.');
    }
}

// Load the Google Sheets API
handleClientLoad(); 