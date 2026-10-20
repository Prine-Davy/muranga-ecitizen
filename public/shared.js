/* ==========================================
   1. MODERN HELP & SUPPORT WIDGET
   ========================================== */
function addHelpWidget() {
    const helpBtn = document.createElement('div');
    helpBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    `;
    helpBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        width: 60px; height: 60px; background: #2E7D32; color: white;
        border-radius: 50%; display: flex; justify-content: center; align-items: center;
        cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 1000; transition: 0.3s;
    `;
    
    const helpPanel = document.createElement('div');
    helpPanel.id = 'help-panel';
    helpPanel.style.cssText = `
        position: fixed; bottom: 100px; right: 30px; width: 320px;
        background: white; border-radius: 12px; overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: none; z-index: 1001;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #eee; transition: 0.3s ease;
    `;
    
    helpPanel.innerHTML = `
        <div style="background: #2E7D32; padding: 20px; color: white;">
            <h3 style="margin: 0; font-size: 18px;" data-i18n="Help & Support">Help & Support</h3>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;" data-i18n="We're here to assist you.">We're here to assist you.</p>
        </div>
        <div style="padding: 20px;">
            <div style="margin-bottom: 15px;">
                <p style="margin: 0; font-size: 12px; color: #666; font-weight: bold;" data-i18n="TOLL-FREE NUMBER">TOLL-FREE NUMBER</p>
                <p style="margin: 2px 0 0 0; font-size: 16px; font-weight: bold; color: #1A1A1A;">0800 720 000</p>
            </div>
            <div style="margin-bottom: 15px;">
                <p style="margin: 0; font-size: 12px; color: #666; font-weight: bold;" data-i18n="EMAIL SUPPORT">EMAIL SUPPORT</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: #1976D2;">support@muranga.go.ke</p>
            </div>
            <div style="margin-bottom: 20px;">
                <p style="margin: 0; font-size: 12px; color: #666; font-weight: bold;" data-i18n="WORKING HOURS">WORKING HOURS</p>
                <p style="margin: 2px 0 0 0; font-size: 14px; color: #333;" data-i18n="Mon - Fri, 8:00 AM - 5:00 PM">Mon - Fri, 8:00 AM - 5:00 PM</p>
            </div>
            <button onclick="window.location.href='mailto:support@muranga.go.ke'" style="width: 100%; padding: 12px; background: #D4AF37; color: #1A1A1A; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;" data-i18n="Send an Email">
                Send an Email
            </button>
        </div>
        <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee;" data-i18n="Murang'a County Government">
            Murang'a County Government
        </div>
    `;

    document.body.appendChild(helpBtn);
    document.body.appendChild(helpPanel);

    let isOpen = false;
    helpBtn.onclick = () => {
        isOpen = !isOpen;
        if (isOpen) {
            helpPanel.style.display = 'block';
            helpBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            helpBtn.style.background = '#1A1A1A';
        } else {
            helpPanel.style.display = 'none';
            helpBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
            helpBtn.style.background = '#2E7D32';
        }
    };
}

/* ==========================================
   2. ADVANCED ACCESSIBILITY TOOLBAR
   ========================================== */
function addAccessibilityWidget() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const accBtn = document.createElement('span');
    accBtn.innerHTML = '♿';
    accBtn.style.cssText = 'cursor: pointer; font-size: 20px; margin-left: 15px;';
    accBtn.title = "Accessibility Options";
    navLinks.appendChild(accBtn);

    const panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.style.cssText = `
        position: fixed; top: 80px; right: 20px; width: 280px;
        background: white; border: 2px solid #2E7D32; border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 20px;
        display: none; z-index: 9999; font-family: sans-serif;
    `;
    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0; font-size:16px; color:#1A1A1A;" data-i18n="Accessibility">Accessibility</h3>
            <button id="close-a11y" style="background:none; border:none; font-size:18px; cursor:pointer;">✖</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="a11y-btn" onclick="toggleTextSize()" data-i18n="🔠 Text Size">🔠 Text Size: <span id="txt-size-label">Normal</span></button>
            <button class="a11y-btn" onclick="toggleContrast()" data-i18n="🌗 High Contrast Mode">🌗 High Contrast Mode</button>
            <button class="a11y-btn" onclick="toggleLinks()" data-i18n="🔗 Highlight Links">🔗 Highlight Links</button>
            <button class="a11y-btn" onclick="toggleDyslexia()" data-i18n="📖 Dyslexia Friendly Font">📖 Dyslexia Friendly Font</button>
            <button class="a11y-btn" onclick="resetA11y()" style="color:red; margin-top:10px;" data-i18n="Reset All Settings">Reset All Settings</button>
        </div>
    `;
    document.body.appendChild(panel);

    accBtn.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('close-a11y').onclick = () => panel.style.display = 'none';

    if (localStorage.getItem('a11y-contrast') === 'true') document.body.classList.add('a11y-contrast');
    if (localStorage.getItem('a11y-links') === 'true') document.body.classList.add('a11y-links');
    if (localStorage.getItem('a11y-dyslexia') === 'true') document.body.classList.add('a11y-dyslexia');
    const savedSize = localStorage.getItem('a11y-size') || 'normal';
    if (savedSize !== 'normal') document.body.classList.add('a11y-size-' + savedSize);
    document.getElementById('txt-size-label').textContent = savedSize.charAt(0).toUpperCase() + savedSize.slice(1);
}

window.toggleTextSize = function() {
    const body = document.body;
    let current = localStorage.getItem('a11y-size') || 'normal';
    let next = 'normal', label = 'Normal';
    if (current === 'normal') { next = 'large'; label = 'Large'; }
    else if (current === 'large') { next = 'xlarge'; label = 'Extra Large'; }
    body.classList.remove('a11y-size-normal', 'a11y-size-large', 'a11y-size-xlarge');
    body.classList.add('a11y-size-' + next);
    localStorage.setItem('a11y-size', next);
    document.getElementById('txt-size-label').textContent = label;
};

window.toggleContrast = function() {
    document.body.classList.toggle('a11y-contrast');
    localStorage.setItem('a11y-contrast', document.body.classList.contains('a11y-contrast'));
};

window.toggleLinks = function() {
    document.body.classList.toggle('a11y-links');
    localStorage.setItem('a11y-links', document.body.classList.contains('a11y-links'));
};

window.toggleDyslexia = function() {
    document.body.classList.toggle('a11y-dyslexia');
    localStorage.setItem('a11y-dyslexia', document.body.classList.contains('a11y-dyslexia'));
};

window.resetA11y = function() {
    document.body.classList.remove('a11y-contrast', 'a11y-links', 'a11y-dyslexia', 'a11y-size-large', 'a11y-size-xlarge');
    document.body.classList.add('a11y-size-normal');
    localStorage.removeItem('a11y-contrast');
    localStorage.removeItem('a11y-links');
    localStorage.removeItem('a11y-dyslexia');
    localStorage.removeItem('a11y-size');
    document.getElementById('txt-size-label').textContent = 'Normal';
};

/* ==========================================
   3. LANGUAGE SWITCH (ENGLISH <-> SWAHILI)
   ========================================== */
const translations = {
    'en': {
        // Nav & General
        'Home': 'Home', 'Logout': 'Logout', 'Login': 'Login', 'Register': 'Create account',
        'Services': 'Services', 'Contact': 'Contact',
        'Help & Support': 'Help & Support',
        
        // Landing Page
        'Murang\'a County Government': 'Murang\'a County Government',
        'All county public services, simplified.': 'All county public services, <span style="color: #D4AF37;">simplified</span>.',
        'Report a damaged road, a blocked culvert, a delayed permit or misconduct by county staff, and track it until it is resolved. All from your phone or computer, any time.': 'Report a damaged road, a blocked culvert, a delayed permit or misconduct by county staff, and track it until it is resolved. All from your phone or computer, any time.',
        'Create your account': 'Create your account',
        'Log in to MCitizen': 'Log in to MCitizen',
        'Constituencies covered': 'Constituencies covered',
        'Wards served': 'Wards served',
        'Service categories': 'Service categories',
        'Online access': 'Online access',
        'County services at your fingertips': 'County services at your fingertips',
        'Choose a category, describe the issue, attach a photo, and your request goes straight to the right county office.': 'Choose a category, describe the issue, attach a photo, and your request goes straight to the right county office.',
        'Business & Trade': 'Business & Trade',
        'Single business permits, public markets, illegal hawking and noise complaints.': 'Single business permits, public markets, illegal hawking and noise complaints.',
        'Land & Building Control': 'Land & Building Control',
        'Unapproved constructions, encroachment, drainage planning and land disputes.': 'Unapproved constructions, encroachment, drainage planning and land disputes.',
        'Healthcare & Public Safety': 'Healthcare & Public Safety',
        'Hospital shortages, food hygiene, stray animals and pollution.': 'Hospital shortages, food hygiene, stray animals and pollution.',
        'Transport & Infrastructure': 'Transport & Infrastructure',
        'Damaged feeder roads, blocked culverts and matatu stage issues.': 'Damaged feeder roads, blocked culverts and matatu stage issues.',
        'Education & Social Services': 'Education & Social Services',
        'ECDE facilities, youth polytechnics and bursary distribution.': 'ECDE facilities, youth polytechnics and bursary distribution.',
        'Integrity & Corruption': 'Integrity & Corruption',
        'Report enforcement misconduct and service delays by county staff.': 'Report enforcement misconduct and service delays by county staff.',
        'How it works': 'How it works',
        'Three simple steps from problem to resolution.': 'Three simple steps from problem to resolution.',
        'Register with your ID number, choose your constituency and ward, and secure your account.': 'Register with your ID number, choose your constituency and ward, and secure your account.',
        'Submit a request': 'Submit a request',
        'Pick a category, describe the issue and add a photo as evidence.': 'Pick a category, describe the issue and add a photo as evidence.',
        'Track the outcome': 'Track the outcome',
        'County officers review your request and update its status until it is resolved.': 'County officers review your request and update its status until it is resolved.',
        'Get started': 'Get started',
        'An online service portal of the County Government of Murang\'a, bringing public services closer to every citizen.': 'An online service portal of the County Government of Murang\'a, bringing public services closer to every citizen.',
        'Quick links': 'Quick links',
        'Murang\'a County Headquarters, Murang\'a Town, Kenya, Prototype portal for demonstration': 'Murang\'a County Headquarters<br>Murang\'a Town, Kenya<br>Prototype portal for demonstration',
        '© County Government of Murang\'a. MCitizen prototype.': '&copy; County Government of Murang\'a. MCitizen prototype.',
        
        // Login & Auth
        'Welcome back': 'Welcome back',
        'Log in to access Murang\'a County services.': 'Log in to access Murang\'a County services.',
        'Email address or ID number': 'Email address or ID number',
        'Password': 'Password',
        'Show': 'Show', 'Hide': 'Hide',
        'Forgot password?': 'Forgot password?',
        'Sign In': 'Sign In',
        'New to MCitizen?': 'New to MCitizen?',
        'Create an account': 'Create an account',
        'Verify it\'s you': 'Verify it\'s you',
        'Enter the one-time code to finish logging in.': 'Enter the one-time code to finish logging in.',
        'We sent a 6-digit verification code to your registered email address. It expires in 5 minutes.': 'We sent a 6-digit verification code to your registered email address. It expires in 5 minutes.',
        'Demo mode: your code is': 'Demo mode: your code is',
        'Verification code': 'Verification code',
        'Verify & continue': 'Verify & continue',
        'Use a different account': 'Use a different account',
        'Resend code': 'Resend code',

        // Forgot & Reset Password
        'Forgot Password?': 'Forgot Password?',
        'Enter your email address and we\'ll send you a link to reset your password.': 'Enter your email address and we\'ll send you a link to reset your password.',
        'Email Address*': 'Email Address*',
        'Enter your registered email': 'Enter your registered email',
        'Send Reset Link': 'Send Reset Link',
        'Back to Login': 'Back to Login',
        'Sending...': 'Sending...',
        'Set New Password': 'Set New Password',
        'Please enter your new strong password below.': 'Please enter your new strong password below.',
        'New Password*': 'New Password*',
        'Min 8 chars, Upper, Lower, Num, Symbol': 'Min 8 chars, Upper, Lower, Num, Symbol',
        'Must be at least 8 characters and include a number and a special character.': 'Must be at least 8 characters and include a number and a special character.',
        'Reset Password': 'Reset Password',

        // Registration
        'Create your account': 'Create your account',
        'Register once to access Murang\'a County services.': 'Register once to access Murang\'a County services.',
        'Identity': 'Identity', 'Location': 'Location', 'Security': 'Security', 'Complete': 'Complete',
        'Your identity': 'Your identity', 'Where do you live?': 'Where do you live?',
        'Contact & security': 'Contact & security', 'Review & confirm': 'Review & confirm',
        'National ID number': 'National ID number', 'Full name': 'Full name',
        'Constituency': 'Constituency', 'Ward': 'Ward',
        'Email address': 'Email address', 'Phone number': 'Phone number',
        'Confirm password': 'Confirm password',
        'Create account': 'Create account', 'Back': 'Back', 'Next': 'Next',
        'I have read and agree to the Terms & Conditions.': 'I have read and agree to the Terms & Conditions.',
        'Verify Your Account': 'Verify Your Account',
        'We have sent a 6-digit verification code to your email address. Please check your inbox.': 'We have sent a 6-digit verification code to your email address. Please check your inbox.',
        'Verify & Log In': 'Verify & Log In',
        'Already registered?': 'Already registered?',

        // Citizen Dashboard
        'My Profile': 'My Profile', 'Account Management': 'Account Management',
        'Notifications': 'Notifications', 'Recent requests': 'Recent requests',
        'Citizen': 'Citizen', 'Refresh': 'Refresh',
        'All county public services simplified': 'All county public services simplified',
        'Pick a service category below to report an issue or make a request.': 'Pick a service category below to report an issue or make a request.',
        'Search services, e.g. roads, permits, bursary': 'Search services, e.g. roads, permits, bursary',
        'Search': 'Search',
        'No services match your search. Try another word.': 'No services match your search. Try another word.',
        'My requests': 'My requests', '+ New request': '+ New request',
        'Loading your requests...': 'Loading your requests...',
        'Submit Request': 'Submit Request',

        // Submit Request
        '&larr; Back to dashboard': '&larr; Back to dashboard',
        'Submit a service request': 'Submit a service request',
        'Tell us what is wrong and where. The relevant county office will review it.': 'Tell us what is wrong and where. The relevant county office will review it.',
        'Select category': 'Select category', 'Select category first': 'Select category first',
        'Select constituency': 'Select constituency', 'Select constituency first': 'Select constituency first',
        'Select ward': 'Select ward', 'Select sub-category': 'Select sub-category',
        'Specific Location / Landmark': 'Specific Location / Landmark',
        'e.g., Near Kiharu Stadium, off the main road': 'e.g., Near Kiharu Stadium, off the main road',
        'Help our teams find the exact spot.': 'Help our teams find the exact spot.',
        'Description': 'Description', 'Describe the issue in detail...': 'Describe the issue in detail...',
        'characters (minimum 10)': 'characters (minimum 10)',
        'Photo evidence (optional)': 'Photo evidence (optional)',
        'Tap to upload': 'Tap to upload', 'or drag a photo here': 'or drag a photo here',
        'JPG, PNG, GIF or WEBP, up to 5MB': 'JPG, PNG, GIF or WEBP, up to 5MB',
        'Submit request': 'Submit request', 'Request submitted': 'Request submitted',
        'Your reference number is': 'Your reference number is',
        'You can follow its progress on your dashboard.': 'You can follow its progress on your dashboard.',
        'Go to dashboard': 'Go to dashboard', 'Submit another': 'Submit another',
        'Please choose a JPG, PNG, GIF or WEBP image.': 'Please choose a JPG, PNG, GIF or WEBP image.',
        'That image is larger than 5MB. Please choose a smaller one.': 'That image is larger than 5MB. Please choose a smaller one.',
        'Please select a category and sub-category.': 'Please select a category and sub-category.',
        'Please select your constituency and ward.': 'Please select your constituency and ward.',
        'Please provide a specific location or landmark.': 'Please provide a specific location or landmark.',
        'Please describe the issue in at least 10 characters.': 'Please describe the issue in at least 10 characters.',
        'Could not submit your request. Please try again.': 'Could not submit your request. Please try again.',
        'Could not reach the server. Check your connection and try again.': 'Could not reach the server. Check your connection and try again.',

        // Admin Dashboard
        'Admin Dashboard': 'Admin Dashboard',
        'County requests overview': 'County requests overview',
        'Review citizen requests and update their progress.': 'Review citizen requests and update their progress.',
        'Total Open Cases': 'Total Open Cases', 'Total Resolved Cases': 'Total Resolved Cases',
        'All statuses': 'All statuses', 'All categories': 'All categories',
        'User': 'User', 'Category': 'Category', 'Sub-category': 'Sub-category',
        'Location': 'Location', 'Specific Location': 'Specific Location',
        'Status': 'Status', 'Image': 'Image', 'Update status': 'Update status',
        'No requests match your filters.': 'No requests match your filters.',
        'No requests have been submitted yet.': 'No requests have been submitted yet.',
        'No image': 'No image', 'Out of ': 'Out of ', 'total requests': 'total requests',
        'Showing ': 'Showing ', 'of': 'of', 'requests': 'requests',
        'Could not load requests. Please refresh the page.': 'Could not load requests. Please refresh the page.',
        'Pending': 'Pending', 'In Progress': 'In Progress', 'Resolved': 'Resolved',

        // Help & A11y
        'We\'re here to assist you.': 'We\'re here to assist you.',
        'TOLL-FREE NUMBER': 'TOLL-FREE NUMBER', 'EMAIL SUPPORT': 'EMAIL SUPPORT', 'WORKING HOURS': 'WORKING HOURS',
        'Mon - Fri, 8:00 AM - 5:00 PM': 'Mon - Fri, 8:00 AM - 5:00 PM',
        'Send an Email': 'Send an Email',
        'Accessibility': 'Accessibility', '🔠 Text Size': '🔠 Text Size', '🌗 High Contrast Mode': '🌗 High Contrast Mode',
        '🔗 Highlight Links': '🔗 Highlight Links', '📖 Dyslexia Friendly Font': '📖 Dyslexia Friendly Font',
        'Reset All Settings': 'Reset All Settings'
    },
    'sw': {
        // Nav & General
        'Home': 'Nyumbani', 'Logout': 'Toka', 'Login': 'Ingia', 'Register': 'Sajili',
        'Services': 'Huduma', 'Contact': 'Mawasiliano',
        'Help & Support': 'Msaada & Huduma',
        
        // Landing Page
        'Murang\'a County Government': 'Serikali ya Kaunti ya Murang\'a',
        'All county public services, simplified.': 'Huduma zote za umma za kaunti, <span style="color: #D4AF37;">zimerahisishwa</span>.',
        'Report a damaged road, a blocked culvert, a delayed permit or misconduct by county staff, and track it until it is resolved. All from your phone or computer, any time.': 'Ripoti barabara iliyoharibika, mfereji ulioziba, kibali kilichochelewa au utovu wa nidhamu wa wafanyakazi wa kaunti, na ufuatilie hadi itakapotatuliwa. Yote kutoka kwa simu yako au kompyuta, wakati wowote.',
        'Create your account': 'Tengeneza akaunti yako',
        'Log in to MCitizen': 'Ingia kwenye MCitizen',
        'Constituencies covered': 'Majimbo yanayohudumiwa',
        'Wards served': 'Wadi zinazohudumiwa',
        'Service categories': 'Makundi ya huduma',
        'Online access': 'Ufikiaji mtandaoni',
        'County services at your fingertips': 'Huduma za kaunti mikononi mwako',
        'Choose a category, describe the issue, attach a photo, and your request goes straight to the right county office.': 'Chagua kundi, eleza suala, ambatisha picha, na ombi lako linakwenda moja kwa moja kwa ofisi sahihi ya kaunti.',
        'Business & Trade': 'Biashara & Fedha',
        'Single business permits, public markets, illegal hawking and noise complaints.': 'Vibali vya biashara moja, masoko ya umma, uuzaji haramu na malalamiko ya kelele.',
        'Land & Building Control': 'Ardhi & Udhibiti wa Majengo',
        'Unapproved constructions, encroachment, drainage planning and land disputes.': 'Ujenzi usioidhinishwa, uvamizi, upangaji wa mifereji na migogoro ya ardhi.',
        'Healthcare & Public Safety': 'Afya & Usalama wa Umma',
        'Hospital shortages, food hygiene, stray animals and pollution.': 'Uhaba wa hospitali, usafi wa chakula, wanyama waliopotea na uchafuzi wa mazingira.',
        'Transport & Infrastructure': 'Usafiri & Miundombinu',
        'Damaged feeder roads, blocked culverts and matatu stage issues.': 'Barabara za kulisha zilizoharibika, mifereji iliyoziba na masuala ya vituo vya matatu.',
        'Education & Social Services': 'Elimu & Huduma za Jamii',
        'ECDE facilities, youth polytechnics and bursary distribution.': 'Vituo vya ECDE, vyuo vya ufundi vya vijana na usambazaji wa bursary.',
        'Integrity & Corruption': 'Uadilifu & Rushwa',
        'Report enforcement misconduct and service delays by county staff.': 'Ripoti utovu wa nidhamu wa utekelezaji na ucheleweshaji wa huduma na wafanyakazi wa kaunti.',
        'How it works': 'Jinsi inavyofanya kazi',
        'Three simple steps from problem to resolution.': 'Hatua tatu rahisi kutoka kwa shida hadi utatuzi.',
        'Register with your ID number, choose your constituency and ward, and secure your account.': 'Jisajili na nambari yako ya kitambulisho, chagua jimbo lako na wadi, na ulinde akaunti yako.',
        'Submit a request': 'Wasilisha ombi',
        'Pick a category, describe the issue and add a photo as evidence.': 'Chagua kundi, eleza suala na uongeze picha kama ushahidi.',
        'Track the outcome': 'Fuatilia matokeo',
        'County officers review your request and update its status until it is resolved.': 'Maafisa wa kaunti hukagua ombi lako na kusasisha hali yake hadi litakapotatuliwa.',
        'Get started': 'Anza sasa',
        'An online service portal of the County Government of Murang\'a, bringing public services closer to every citizen.': 'Tovuti ya huduma mtandaoni ya Serikali ya Kaunti ya Murang\'a, inayowaletea huduma za umma karibu na kila mwananchi.',
        'Quick links': 'Viungo vya haraka',
        'Murang\'a County Headquarters, Murang\'a Town, Kenya, Prototype portal for demonstration': 'Makao Makuu ya Kaunti ya Murang\'a<br>Mji wa Murang\'a, Kenya<br>Tovuti ya mfano kwa maonyesho',
        '© County Government of Murang\'a. MCitizen prototype.': '&copy; Serikali ya Kaunti ya Murang\'a. Mfano wa MCitizen.',

        // Login & Auth
        'Welcome back': 'Karibu tena',
        'Log in to access Murang\'a County services.': 'Ingia ili kupata huduma za Kaunti ya Murang\'a.',
        'Email address or ID number': 'Barua pepe au Nambari ya Kitambulisho',
        'Password': 'Nenosiri',
        'Show': 'Onyesha', 'Hide': 'Ficha',
        'Forgot password?': 'Umesahau nenosiri?',
        'Sign In': 'Ingia',
        'New to MCitizen?': 'Mgeni kwenye MCitizen?',
        'Create an account': 'Tengeneza akaunti',
        'Verify it\'s you': 'Thibitisha ni wewe',
        'Enter the one-time code to finish logging in.': 'Weka msimbo wa mara moja ili kumaliza kuingia.',
        'We sent a 6-digit verification code to your registered email address. It expires in 5 minutes.': 'Tumetuma msimbo wa uthibitisho wa tarakimu 6 kwenye barua pepe yako iliyosajiliwa. Utaisha baada ya dakika 5.',
        'Demo mode: your code is': 'Hali ya majaribio: msimbo wako ni',
        'Verification code': 'Msimbo wa uthibitisho',
        'Verify & continue': 'Thibitisha & uendelee',
        'Use a different account': 'Tumia akaunti nyingine',
        'Resend code': 'Tuma msimbo tena',

        // Forgot & Reset Password
        'Forgot Password?': 'Umesahau Nenosiri?',
        'Enter your email address and we\'ll send you a link to reset your password.': 'Weka barua pepe yako na tutakutumia kiungo cha kuweka upya nenosiri lako.',
        'Email Address*': 'Barua Pepe*',
        'Enter your registered email': 'Weka barua pepe yako iliyosajiliwa',
        'Send Reset Link': 'Tuma Kiungo cha Kuweka Upya',
        'Back to Login': 'Rudi kwenye Kuingia',
        'Sending...': 'Inatuma...',
        'Set New Password': 'Weka Nenosiri Mpya',
        'Please enter your new strong password below.': 'Tafadhali weka nenosiri lako jipya imara hapa chini.',
        'New Password*': 'Nenosiri Mpya*',
        'Min 8 chars, Upper, Lower, Num, Symbol': 'Herufi 8+, Kubwa, Ndogo, Namba, Alama',
        'Must be at least 8 characters and include a number and a special character.': 'Lazima iwe angalau herufi 8 na iwe na namba na alama maalum.',
        'Reset Password': 'Weka Upya Nenosiri',

        // Registration
        'Create your account': 'Tengeneza akaunti yako',
        'Register once to access Murang\'a County services.': 'Jisajili mara moja ili kupata huduma za Kaunti ya Murang\'a.',
        'Identity': 'Utambulisho', 'Location': 'Mahali', 'Security': 'Usalama', 'Complete': 'Kamilisha',
        'Your identity': 'Utambulisho wako', 'Where do you live?': 'Unaishi wapi?',
        'Contact & security': 'Mawasiliano & usalama', 'Review & confirm': 'Kagua & thibitisha',
        'National ID number': 'Nambari ya Kitambulisho', 'Full name': 'Jina kamili',
        'Constituency': 'Jimbo', 'Ward': 'Wadi',
        'Email address': 'Barua pepe', 'Phone number': 'Nambari ya simu',
        'Confirm password': 'Thibitisha nenosiri',
        'Create account': 'Tengeneza akaunti', 'Back': 'Rudi', 'Next': 'Endelea',
        'I have read and agree to the Terms & Conditions.': 'Nimesoma na kukubali Sheria na Masharti.',
        'Verify Your Account': 'Thibitisha Akaunti Yako',
        'We have sent a 6-digit verification code to your email address. Please check your inbox.': 'Tumetuma msimbo wa uthibitisho wa tarakimu 6 kwenye barua pepe yako. Tafadhali angalia kikasha chako.',
        'Verify & Log In': 'Thibitisha & Ingia',
        'Already registered?': 'Tayari umejisajili?',

        // Citizen Dashboard
        'My Profile': 'Wasifu Wangu', 'Account Management': 'Usimamizi wa Akaunti',
        'Notifications': 'Taarifa', 'Recent requests': 'Maombi ya hivi karibuni',
        'Citizen': 'Mwananchi', 'Refresh': 'Sasisha',
        'All county public services simplified': 'Huduma zote za umma za kaunti zimerahisishwa',
        'Pick a service category below to report an issue or make a request.': 'Chagua kundi la huduma hapa chini ili kuripoti suala au kuomba huduma.',
        'Search services, e.g. roads, permits, bursary': 'Tafuta huduma, k.m. barabara, vibali, bursary',
        'Search': 'Tafuta',
        'No services match your search. Try another word.': 'Hakuna huduma inayolingana na utafutaji wako. Jaribu neno lingine.',
        'My requests': 'Maombi yangu', '+ New request': '+ Ombi jipya',
        'Loading your requests...': 'Inapakia maombi yako...',
        'Submit Request': 'Wasilisha Ombi',

        // Submit Request
        '&larr; Back to dashboard': '&larr; Rudi kwenye dashibodi',
        'Submit a service request': 'Wasilisha ombi la huduma',
        'Tell us what is wrong and where. The relevant county office will review it.': 'Tuambie ni nini kibaya na wapi. Ofisi husika ya kaunti itakagua.',
        'Select category': 'Chagua kundi', 'Select category first': 'Chagua kundi kwanza',
        'Select constituency': 'Chagua jimbo', 'Select constituency first': 'Chagua jimbo kwanza',
        'Select ward': 'Chagua wadi', 'Select sub-category': 'Chagua kundi ndogo',
        'Specific Location / Landmark': 'Mahali Mahususi / Alama',
        'e.g., Near Kiharu Stadium, off the main road': 'k.m., Karibu na Uwanja wa Kiharu, kando ya barabara kuu',
        'Help our teams find the exact spot.': 'Saidia timu zetu kupata eneo kamili.',
        'Description': 'Maelezo', 'Describe the issue in detail...': 'Eleza suala kwa undani...',
        'characters (minimum 10)': 'herufi (kiwango cha chini 10)',
        'Photo evidence (optional)': 'Picha ya ushahidi (hiari)',
        'Tap to upload': 'Gusa kupakia', 'or drag a photo here': 'au buruta picha hapa',
        'JPG, PNG, GIF or WEBP, up to 5MB': 'JPG, PNG, GIF au WEBP, hadi 5MB',
        'Submit request': 'Wasilisha ombi', 'Request submitted': 'Ombi limewasilishwa',
        'Your reference number is': 'Nambari yako ya kumbukumbu ni',
        'You can follow its progress on your dashboard.': 'Unaweza kufuatilia maendeleo yake kwenye dashibodi yako.',
        'Go to dashboard': 'Nenda kwenye dashibodi', 'Submit another': 'Wasilisha lingine',
        'Please choose a JPG, PNG, GIF or WEBP image.': 'Tafadhali chagua picha ya JPG, PNG, GIF au WEBP.',
        'That image is larger than 5MB. Please choose a smaller one.': 'Picha hiyo ni kubwa kuliko 5MB. Tafadhali chagua ndogo zaidi.',
        'Please select a category and sub-category.': 'Tafadhali chagua kundi na kundi ndogo.',
        'Please select your constituency and ward.': 'Tafadhali chagua jimbo lako na wadi.',
        'Please provide a specific location or landmark.': 'Tafadhali toa mahali mahususi au alama.',
        'Please describe the issue in at least 10 characters.': 'Tafadhali eleza suala kwa angalau herufi 10.',
        'Could not submit your request. Please try again.': 'Imeshindwa kuwasilisha ombi lako. Tafadhali jaribu tena.',
        'Could not reach the server. Check your connection and try again.': 'Imeshindwa kufikia seva. Angalia muunganisho wako na ujaribu tena.',

        // Admin Dashboard
        'Admin Dashboard': 'Dashibodi ya Msimamizi',
        'County requests overview': 'Muhtasari wa maombi ya kaunti',
        'Review citizen requests and update their progress.': 'Kagua maombi ya wananchi na usasishe maendeleo yao.',
        'Total Open Cases': 'Jumla ya Kesi Zilizo Wazi', 'Total Resolved Cases': 'Jumla ya Kesi Zilizotatuliwa',
        'All statuses': 'Hali zote', 'All categories': 'Makundi yote',
        'User': 'Mtumiaji', 'Category': 'Kundi', 'Sub-category': 'Kundi Ndogo',
        'Location': 'Mahali', 'Specific Location': 'Mahali Mahususi',
        'Status': 'Hali', 'Image': 'Picha', 'Update status': 'Sasisha hali',
        'No requests match your filters.': 'Hakuna maombi yanayolingana na vichujio vyako.',
        'No requests have been submitted yet.': 'Hakuna maombi yaliyowasilishwa bado.',
        'No image': 'Hakuna picha', 'Out of ': 'Kati ya ', 'total requests': 'jumla ya maombi',
        'Showing ': 'Inaonyesha ', 'of': 'kati ya', 'requests': 'maombi',
        'Could not load requests. Please refresh the page.': 'Imeshindwa kupakia maombi. Tafadhali onyesha upya ukurasa.',
        'Pending': 'Inasubiri', 'In Progress': 'Inaendelea', 'Resolved': 'Imetatuliwa',

        // Help & A11y
        'We\'re here to assist you.': 'Tuko hapa kukusaidia.',
        'TOLL-FREE NUMBER': 'NAMBA YA BURE', 'EMAIL SUPPORT': 'MSAADA WA BARUA PEPE', 'WORKING HOURS': 'SAA ZA KAZI',
        'Mon - Fri, 8:00 AM - 5:00 PM': 'Jumatatu - Ijumaa, 8:00 AM - 5:00 PM',
        'Send an Email': 'Tuma Barua Pepe',
        'Accessibility': 'Ufikivu', '🔠 Text Size': '🔠 Ukubwa wa Maandishi', '🌗 High Contrast Mode': '🌗 Hali ya Utofautishaji wa Juu',
        '🔗 Highlight Links': '🔗 Angazia Viungo', '📖 Dyslexia Friendly Font': '📖 Fonti Rafiki ya Dyslexia',
        'Reset All Settings': 'Weka Upya Mipangilio Yote'
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// Expose this globally so other scripts (like admin.html and submit-request.html) can use it
window.t = function(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return key;
};

function addLanguageWidget() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const langBtn = document.createElement('span');
    langBtn.id = 'lang-toggle-btn';
    langBtn.innerHTML = currentLang === 'en' ? '🌐 EN' : '🌐 SW';
    langBtn.style.cssText = 'cursor: pointer; font-size: 14px; font-weight: bold; margin-left: 15px; color: #1976D2;';
    langBtn.title = "Switch Language";
    
    langBtn.onclick = () => {
        currentLang = currentLang === 'en' ? 'sw' : 'en';
        localStorage.setItem('lang', currentLang);
        langBtn.innerHTML = currentLang === 'en' ? '🌐 EN' : '🌐 SW';
        
        // 1. Translate the static elements instantly
        if (typeof translatePage === 'function') {
            translatePage();
        }

        // 2. Dispatch a custom event so dynamic pages can listen and update themselves
        window.dispatchEvent(new Event('languageChanged'));
    };
    navLinks.appendChild(langBtn);
}

function translatePage() {
    const dict = translations[currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            // USE innerHTML INSTEAD OF textContent TO PRESERVE HTML TAGS (like spans and brs)
            el.innerHTML = dict[key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    addHelpWidget();
    addAccessibilityWidget();
    addLanguageWidget();
    translatePage();
});