/**
 * MCitizen - Murang'a County Government Service Portal (Prototype)
 * Stack: Node.js, Express, SQLite3, bcryptjs, multer
 */
require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const PORT = process.env.PORT || 3000;

const DEMO_OTP = process.env.DEMO_OTP !== 'false';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@muranga.go.ke';
const ADMIN_ID = process.env.ADMIN_ID || '00000000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */
const murangaLocations = {
  "Gatanga": ["Ithanga", "Kakuzi/Mitubiri", "Mugumo-Ini", "Kihumbu-Ini", "Gatanga", "Kariara"],
  "Kandara": ["Ng'araria", "Muruka", "Kagundu-Ini", "Gaichanjiru", "Ithiru", "Ruchu"],
  "Kangema": ["Kanyenya-Ini", "Muguru", "Rwathia"],
  "Kigumo": ["Kahumbu", "Muthithi", "Kigumo", "Kangari", "Kinyona"],
  "Kiharu": ["Wangu", "Mugoiri", "Mbiri", "Township", "Murarandia", "Gaturi"],
  "Maragua": ["Kimorori/Wempa", "Makuyu", "Kambiti", "Kamahuha", "Ichagaki", "Nginda"],
  "Mathioya": ["Gitugi", "Kiru", "Kamacharia"]
};

const issuesData = {
  "Business & Trade": ["Single Business Permits (SBP)", "Noise Pollution", "Public Markets", "Illegal Hawking"],
  "Land & Building Control": ["Unapproved Constructions", "Encroachment", "Drainage Planning", "Land Disputes"],
  "Healthcare & Public Safety": ["Hospital Shortages", "Food Hygiene", "Stray Animals", "Noise and Air Pollution"],
  "Transport & Infrastructure": ["Damaged Feeder Roads", "Blocked Culverts", "Matatu Stages"],
  "Education & Social Services": ["ECDE Facilities", "Youth Polytechnics", "Bursary Distribution"],
  "Integrity & Corruption": ["Enforcement Misconduct (Kanjo)", "Service Delays by County Staff"],
  "Other": ["General Inquiry / Other Issue"] 
};

const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved'];

/* ------------------------------------------------------------------ */
/* Database                                                            */
/* ------------------------------------------------------------------ */
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Could not open database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      national_id TEXT UNIQUE,
      email TEXT UNIQUE,
      phone TEXT,
      constituency TEXT,
      ward TEXT,
      password TEXT,
      role TEXT DEFAULT 'citizen',
      language TEXT DEFAULT 'en',
      otp_code TEXT,
      otp_expiry DATETIME,
      reset_token TEXT,
      reset_token_expiry DATETIME
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      category TEXT,
      sub_category TEXT,
      constituency TEXT,
      ward TEXT,
      location_details TEXT,
      description TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const admin = await get('SELECT id FROM users WHERE role = ?', ['admin']);
  if (!admin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await run(
      `INSERT INTO users (full_name, national_id, email, phone, constituency, ward, password, role, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'admin', 'en')`,
      ['County Administrator', ADMIN_ID, ADMIN_EMAIL, '0700000000', 'Kiharu', 'Township', hash]
    );
    console.log(`Seeded admin account -> login: ${ADMIN_EMAIL} (or ID ${ADMIN_ID})`);
  }
}

/* ------------------------------------------------------------------ */
/* Middleware                                                          */
/* ------------------------------------------------------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed.'));
  }
});

const sessions = new Map();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, role: user.role, expires: Date.now() + SESSION_TTL_MS });
  return token;
}

function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  const session = token && sessions.get(token);
  if (!session || session.expires < Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ success: false, message: 'Please log in to continue.' });
  }
  req.session = session;
  next();
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    next();
  });
}

function passwordIsStrong(pw) {
  return typeof pw === 'string' &&
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);
}

const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isNationalId = (v) => typeof v === 'string' && /^\d{7,8}$/.test(v);
const isPhone = (v) => typeof v === 'string' && /^(?:\+?254|0)[17]\d{8}$/.test(v.replace(/\s+/g, ''));

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/* ------------------------------------------------------------------ */
/* Email Templates Helper                                              */
/* ------------------------------------------------------------------ */
function getEmailContent(type, lang, data) {
  const isSw = lang === 'sw';
  
  if (type === 'register') {
    return {
      subject: isSw ? 'MCitizen - Thibitisha Akaunti Yako' : 'MCitizen - Verify Your Account',
      html: `<p>${isSw ? 'Karibu kwenye' : 'Welcome to'} <b>MCitizen</b>!</p>
             <p>${isSw ? 'Msimbo wako wa uthibitisho ni' : 'Your account verification code is'}: <b style="font-size: 24px; color: #2E7D32;">${data.otp}</b></p>
             <p>${isSw ? 'Msimbo huu utaisha baada ya dakika 5.' : 'This code will expire in 5 minutes.'}</p>`
    };
  }
  if (type === 'login') {
    return {
      subject: isSw ? 'MCitizen - Msimbo Wako wa Kuingia' : 'MCitizen - Your Login Verification Code',
      html: `<p>${isSw ? 'Nenosiri lako la Mara Moja (OTP) la kuingia kwenye tovuti ya MCitizen ni' : 'Your One-Time Password (OTP) for logging into the MCitizen portal is'}: <b style="font-size: 20px;">${data.otp}</b></p>
             <p>${isSw ? 'Msimbo huu utaisha baada ya dakika 5.' : 'This code will expire in 5 minutes.'}</p>`
    };
  }
  if (type === 'resend') {
    return {
      subject: isSw ? 'MCitizen - Msimbo Mpya wa Uthibitisho' : 'MCitizen - Your New Verification Code',
      html: `<p>${isSw ? 'Huu hapa ni msimbo wako mpya wa Mara Moja (OTP)' : 'Here is your new One-Time Password (OTP)'}: <b style="font-size: 20px;">${data.otp}</b></p>
             <p>${isSw ? 'Msimbo huu utaisha baada ya dakika 5.' : 'This code will expire in 5 minutes.'}</p>`
    };
  }
  if (type === 'reset') {
    return {
      subject: isSw ? 'MCitizen - Ombi la Kuweka Nenosiri Mpya' : 'MCitizen - Password Reset Request',
      html: `<p>${isSw ? 'Umeomba kuweka upya nenosiri lako la akaunti ya MCitizen.' : 'You requested a password reset for your MCitizen account.'}</p>
             <p>${isSw ? 'Bofya kiungo hapa chini ili kuweka nenosiri jipya. Kiungo hiki kitaisha baada ya dakika 15.' : 'Click the link below to set a new password. This link expires in 15 minutes.'}</p>
             <a href="${data.resetLink}" style="background:#2E7D32; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block; margin-top:10px;">${isSw ? 'Weka Nenosiri Mpya' : 'Reset Password'}</a>`
    };
  }
}

/* ------------------------------------------------------------------ */
/* API ROUTES                                                          */
/* ------------------------------------------------------------------ */

// 1. Register
app.post('/api/register', async (req, res) => {
  try {
    const full_name = clean(req.body.full_name);
    const national_id = clean(req.body.national_id);
    const email = clean(req.body.email).toLowerCase();
    const phone = clean(req.body.phone).replace(/\s+/g, '');
    const constituency = clean(req.body.constituency);
    const ward = clean(req.body.ward);
    const password = req.body.password;
    const language = req.body.language === 'sw' ? 'sw' : 'en';

    if (!full_name || full_name.length < 3) return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    if (!isNationalId(national_id)) return res.status(400).json({ success: false, message: 'National ID must be 7 or 8 digits.' });
    if (!murangaLocations[constituency] || !murangaLocations[constituency].includes(ward)) return res.status(400).json({ success: false, message: 'Please select a valid constituency and ward.' });
    if (!isEmail(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    if (!isPhone(phone)) return res.status(400).json({ success: false, message: 'Please enter a valid Kenyan phone number.' });
    if (!passwordIsStrong(password)) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character.' });

    const existing = await get('SELECT id FROM users WHERE email = ? OR national_id = ?', [email, national_id]);
    if (existing) return res.status(409).json({ success: false, message: 'An account with this email or ID number already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const otp = String(crypto.randomInt(100000, 1000000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const result = await run(
      `INSERT INTO users (full_name, national_id, email, phone, constituency, ward, password, role, language, otp_code, otp_expiry)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'citizen', ?, ?, ?)`,
      [full_name, national_id, email, phone, constituency, ward, hash, language, otp, expiry]
    );

    const emailContent = getEmailContent('register', language, { otp });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending registration email:', error);
            return res.status(201).json({ success: true, requireOtp: true, userId: result.lastID, emailError: true });
        }
        res.status(201).json({ success: true, requireOtp: true, userId: result.lastID });
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// 2. Login
app.post('/api/login', async (req, res) => {
  try {
    const identifier = clean(req.body.identifier).toLowerCase();
    const password = req.body.password;

    if (!identifier || !password) return res.status(400).json({ success: false, message: 'Please enter your email/ID and password.' });

    const user = await get('SELECT * FROM users WHERE LOWER(email) = ? OR national_id = ?', [identifier, identifier]);
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials. Please check and try again.' });

    const otp = String(crypto.randomInt(100000, 1000000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await run('UPDATE users SET otp_code = ?, otp_expiry = ? WHERE id = ?', [otp, expiry, user.id]);

    const emailContent = getEmailContent('login', user.language, { otp });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            // FIXED: Still return the demoOtp if Gmail fails!
            return res.json({ 
                success: true, 
                requireOtp: true, 
                userId: user.id, 
                emailError: true,
                demoOtp: (DEMO_OTP && user.role === 'admin') ? otp : undefined 
            });
        }
        res.json({ 
            success: true, 
            requireOtp: true, 
            userId: user.id,
            demoOtp: (DEMO_OTP && user.role === 'admin') ? otp : undefined 
        });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// 3. Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    const otp = clean(String(req.body.otp || ''));

    if (!userId || !/^\d{6}$/.test(otp)) return res.status(400).json({ success: false, message: 'Please enter the 6-digit code.' });

    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user || !user.otp_code) return res.status(400).json({ success: false, message: 'No active code. Please try again.' });
    
    if (!user.otp_expiry || new Date(user.otp_expiry).getTime() < Date.now()) {
      await run('UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE id = ?', [user.id]);
      return res.status(400).json({ success: false, message: 'Code has expired. Please try again.' });
    }

    const a = Buffer.from(user.otp_code);
    const b = Buffer.from(otp);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' });

    await run('UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE id = ?', [user.id]);
    const token = createSession(user);

    res.json({
      success: true,
      role: user.role,
      name: user.full_name,
      userId: user.id,
      constituency: user.constituency,
      ward: user.ward,
      language: user.language,
      token
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// 4. Submit a service request
app.post('/api/requests', requireAuth, (req, res) => {
  upload.single('image')(req, res, async (uploadErr) => {
    if (uploadErr) {
      const message = uploadErr.code === 'LIMIT_FILE_SIZE' ? 'Image is too large. Maximum size is 5MB.' : uploadErr.message;
      return res.status(400).json({ success: false, message });
    }

    try {
      const category = clean(req.body.category);
      const sub_category = clean(req.body.sub_category);
      const constituency = clean(req.body.constituency);
      const ward = clean(req.body.ward);
      const location_details = clean(req.body.location_details);
      const description = clean(req.body.description);

      const cleanupFile = () => { if (req.file) fs.unlink(req.file.path, () => {}); };

      if (!issuesData[category] || !issuesData[category].includes(sub_category)) { cleanupFile(); return res.status(400).json({ success: false, message: 'Invalid category.' }); }
      if (!murangaLocations[constituency] || !murangaLocations[constituency].includes(ward)) { cleanupFile(); return res.status(400).json({ success: false, message: 'Invalid location.' }); }
      if (location_details.length < 3) { cleanupFile(); return res.status(400).json({ success: false, message: 'Please provide a specific location or landmark.' }); }
      if (description.length < 10) { cleanupFile(); return res.status(400).json({ success: false, message: 'Description too short.' }); }

      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      const result = await run(
        `INSERT INTO requests (user_id, category, sub_category, constituency, ward, location_details, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.session.userId, category, sub_category, constituency, ward, location_details, description, image_url]
      );

      res.status(201).json({ success: true, message: 'Request submitted successfully.', requestId: result.lastID });
    } catch (err) {
      console.error('Submit request error:', err);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  });
});

// My requests
app.get('/api/my-requests', requireAuth, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId]);
    res.json({ success: true, requests: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 5. Admin: all requests
app.get('/api/admin/requests', requireAdmin, async (req, res) => {
  try {
    const rows = await all(`
      SELECT r.*, u.full_name AS user_name, u.phone AS user_phone
      FROM requests r
      LEFT JOIN users u ON u.id = r.user_id
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, requests: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 6. Admin: update request status
app.put('/api/admin/requests/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = clean(req.body.status);

    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

    const result = await run('UPDATE requests SET status = ? WHERE id = ?', [status, id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Request not found.' });
    
    res.json({ success: true, message: 'Status updated.', status });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 7. Admin: analytics
app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const rows = await all('SELECT status, COUNT(*) AS count FROM requests GROUP BY status');
    const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
    rows.forEach((r) => { if (r.status in counts) counts[r.status] = r.count; });

    res.json({
      success: true,
      pending: counts.Pending,
      inProgress: counts['In Progress'],
      resolved: counts.Resolved,
      open: counts.Pending + counts['In Progress'],
      total: counts.Pending + counts['In Progress'] + counts.Resolved
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 8. Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const email = clean(req.body.email).toLowerCase();
    const user = await get('SELECT * FROM users WHERE LOWER(email) = ?', [email]);

    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60000).toISOString();
    await run('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [token, expiry, user.id]);

    const resetLink = `${req.protocol}://${req.get('host')}/reset-password.html?token=${token}`;
    const emailContent = getEmailContent('reset', user.language, { resetLink });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error sending reset email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send reset email.' });
        }
        res.json({ success: true, message: 'A reset link has been sent to your email.' });
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 9. Reset Password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !passwordIsStrong(newPassword)) {
      return res.status(400).json({ success: false, message: 'Invalid token or weak password.' });
    }

    const user = await get('SELECT * FROM users WHERE reset_token = ?', [token]);
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or already used reset link.' });
    }

    if (new Date(user.reset_token_expiry).getTime() < Date.now()) {
      await run('UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', [user.id]);
      return res.status(400).json({ success: false, message: 'Reset link has expired. Please try again.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await run('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', [hash, user.id]);

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 10. Resend OTP
app.post('/api/resend-otp', async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required.' });

    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const otp = String(crypto.randomInt(100000, 1000000));
    const expiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await run('UPDATE users SET otp_code = ?, otp_expiry = ? WHERE id = ?', [otp, expiry, user.id]);

    const emailContent = getEmailContent('resend', user.language, { otp });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error resending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        res.json({ success: true, message: 'A new code has been sent.' });
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MCitizen server running on port ${PORT}`);
      if (DEMO_OTP) console.log('DEMO_OTP is ON: OTP is included in the login response (set DEMO_OTP=false to disable).');
    });
  })
  .catch((err) => {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  });