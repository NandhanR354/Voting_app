# Political Alliance Voting System

A modern, secure voting system for political alliances with CSV export functionality.

## Features

✅ **Secure Voting System**
- Voter ID validation (ABC0000000 format)
- One-time voting per voter ID
- Real-time vote counting
- Professional interface

✅ **Admin Panel**
- Password protected dashboard
- Live vote statistics
- CSV export by alliance
- Image upload for alliance icons
- Poll data management

✅ **CSV Export Functionality**
- Download voter lists by individual alliance
- Combined CSV export for all voters
- Timestamp tracking for each vote
- Professional CSV formatting

✅ **Mobile Responsive**
- Works on all devices
- Touch-friendly interface
- Optimized for mobile voting

## Quick Setup

### 1. Download Files
Extract all files to your project folder:
- `index.html` - Main application
- `style.css` - Complete styling
- `app.js` - JavaScript functionality

### 2. Deploy to GitHub Pages (Free)

1. Create GitHub account
2. Create new repository called "voting-system"
3. Upload all 3 files
4. Go to Settings > Pages
5. Enable GitHub Pages from main branch
6. Your site will be live at: `https://yourusername.github.io/voting-system`

### 3. Test Your App

1. Open your website
2. Login with voter ID format: ABC1234567
3. Cast test votes
4. Access admin panel (password: admin123)
5. Test CSV downloads

## Usage Guide

### For Voters
1. Enter voter ID in format ABC0000000
2. Select preferred alliance
3. Confirm vote
4. System prevents duplicate voting

### For Administrators
1. Click "Admin Panel"
2. Enter password: admin123
3. View live statistics
4. Download CSV reports
5. Manage alliance icons
6. Reset poll data if needed

## Admin Features

### Real-time Dashboard
- Total votes cast
- Votes per alliance
- Percentage breakdown
- Individual voter counts

### CSV Export Options
- **Individual Alliance CSVs**: Separate files for TVK, DMK, ADMK
- **Combined CSV**: All voters in one master file
- **Timestamp Tracking**: Exact voting time recorded
- **Professional Format**: Ready for analysis

### Example CSV Format
```csv
Serial No,Voter ID,Voting Time,Alliance Name
1,"ABC1234567","22/08/2025, 23:15:30","TVK Alliance"
2,"XYZ9876543","22/08/2025, 23:16:45","TVK Alliance"
```

## Security Features

✅ **Voter ID Validation**: Strict format checking
✅ **Duplicate Prevention**: One vote per voter ID
✅ **Admin Protection**: Password-secured dashboard  
✅ **Data Integrity**: Client-side data validation
✅ **Secure Storage**: Browser-based data backup

## Customization

### Change Admin Password
Edit `app.js` file, find line:
```javascript
adminPassword: "admin123",  // ← CHANGE THIS
```

### Update Alliance Names
Edit the alliance names in `app.js`:
```javascript
{id: 1, name: "Your Alliance Name", votes: 0, icon: "", voterIds: []}
```

### Modify Voter ID Format
Edit the validation pattern in `app.js`:
```javascript
const pattern = /^[A-Za-z]{3}\d{7}$/;  // ABC0000000 format
```

## File Structure
```
voting-system/
├── index.html          # Main HTML structure
├── style.css           # Complete CSS styling  
├── app.js             # JavaScript functionality
└── README.md          # This documentation
```

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technical Requirements
- Modern web browser
- JavaScript enabled
- No server required (client-side only)
- Works offline once loaded

## CSV Download Features

### Automatic File Naming
Files are named with date/time stamps:
- `TVK_Alliance_voters_2025-08-22_23-15-30.csv`
- `All_Voters_2025-08-22_23-18-00.csv`

### Data Fields
Each CSV includes:
- Serial number
- Voter ID
- Voting timestamp (IST)
- Alliance name

## Deployment Options

### Free Hosting
1. **GitHub Pages** (Recommended)
2. **Netlify** - Drag & drop deployment
3. **Vercel** - Auto-deployment

### Paid Hosting (If Backend Needed)
1. **Railway** - $5/month
2. **Render** - $7/month
3. **Heroku** - $7/month

## Support & Updates

This system is ready to use out of the box. For customizations:

1. Edit alliance names in `app.js`
2. Change admin password
3. Modify voter ID validation
4. Update styling in `style.css`
5. Add more features as needed

## License
Open source - Free to use and modify for any purpose.

---

**Ready to deploy?** Upload all files to GitHub and your professional voting system will be live in minutes!
