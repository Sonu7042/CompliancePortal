# Advanced Legal Compliance Management Portal

A comprehensive web-based compliance management system built with React for managing multi-plant manufacturing operations across India. This production-ready system features advanced analytics, reporting, and real-time compliance tracking.

## 🚀 Features

### Dashboard Analytics
- **Key Metrics Cards**: Total compliance items, compliance rate, non-compliances, upcoming deadlines
- **Year-wise Compliance Status**: Monthly trend analysis with interactive charts
- **Category-wise Breakdown**: Visual representation across Factory Act, Environmental, Safety, Labor Laws, Quality & ISO
- **Plant-wise Comparison**: Performance comparison across all manufacturing facilities
- **Upcoming Deadlines**: Tracking for 7/15/30-day windows
- **Recent Non-Compliances**: Real-time alerts for critical items

### Task Management
- **Advanced Filtering**: By status, category, plant, priority, and search
- **Multiple Status Types**: Compliant, Pending, In Progress, Submitted, Non-Compliant, Overdue, Partially Compliant
- **Priority Levels**: Critical, High, Medium, Low
- **Task Details**: Complete view with documents, comments, and history
- **Bulk Operations**: Export and manage multiple tasks
- **Real-time Updates**: Status changes reflect immediately

### Document Management
- **Document Tracking**: Upload, view, and download compliance documents
- **Expiry Management**: Automatic alerts for expiring documents (30/60/90 days)
- **Version Control**: Track document history and uploads
- **Category Organization**: Organize by compliance category
- **Search & Filter**: Quick access to specific documents
- **Expiry Dashboard**: Visual representation of document status

### Reports & Analytics
- **Pre-built Reports**:
  - Compliance Summary Report
  - Plant Performance Scorecard
  - Non-Compliance Analysis
  - Document Expiry Report
  - Trend Analysis Report
  - Audit Readiness Report
  - Category-wise Breakdown
  - Executive Dashboard
- **Export Options**: PDF and Excel format support
- **Custom Date Ranges**: Weekly, Monthly, Quarterly, Yearly, Custom
- **Interactive Charts**: Bar charts, line graphs, pie charts with drill-down capability
- **Real-time Data**: All reports reflect current compliance status

### Compliance Calendar
- **Monthly View**: Visual calendar with color-coded compliance status
- **Date Filtering**: Filter by category, status, and plant
- **Day Details**: Click any date to see all compliance items due
- **Status Indicators**:
  - Red: Critical (Overdue/Non-Compliant)
  - Yellow: Warning (Pending)
  - Green: Compliant
  - Blue: In Progress
- **Export Calendar**: Download calendar data

### User Roles & Access
1. **Corporate Compliance Team**:
   - Centralized oversight across all plants
   - Review and approve/reject submissions
   - Assign compliance tasks to plants
   - Generate comprehensive reports
   - Monitor overall compliance health
   - Switch between plant views

2. **Plant Users**:
   - View plant-specific dashboard
   - Manage compliance tasks
   - Upload evidence and documents
   - Submit compliance reports
   - Track own performance metrics
   - Add comments and updates

### Theme Support
- **Light Mode**: Clean, professional light theme
- **Dark Mode**: Eye-friendly dark theme with proper contrast
- **Auto-detection**: Respects system preferences
- **Persistent**: Theme preference saved locally

## 📦 Technologies Used

- **React 18.2**: Modern React with Hooks
- **React Router DOM**: Client-side routing
- **Recharts**: Beautiful, responsive charts
- **Lucide React**: Modern icon library
- **date-fns**: Date manipulation and formatting
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Lightning-fast build tool

## 🏗️ Project Structure

```
src/
├── components/
│   └── Layout.jsx              # Main layout with sidebar and header
├── pages/
│   ├── Login.jsx               # Authentication page
│   ├── Dashboard.jsx           # Analytics dashboard
│   ├── Tasks.jsx               # Task management
│   ├── Documents.jsx           # Document management
│   ├── Reports.jsx             # Reports and analytics
│   └── Calendar.jsx            # Compliance calendar
├── context/
│   └── AppContext.jsx          # Global state management
├── data/
│   └── mockData.js             # Comprehensive mock data generator
├── App.jsx                     # Main app with routing
├── main.jsx                    # Entry point
└── index.css                   # Global styles with dark mode
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## 🔐 Demo Credentials

### Corporate Admin
- **Username**: admin
- **Password**: admin123
- **Access**: All plants, full oversight, approve/reject capabilities

### Plant Users
- **Mumbai Plant**
  - Username: mumbai
  - Password: mumbai123
  - Access: Mumbai Plant only

- **Pune Plant**
  - Username: pune
  - Password: pune123
  - Access: Pune Manufacturing only

## 📊 Sample Data

The application includes comprehensive mock data:
- **5 Manufacturing Plants** across India (Mumbai, Pune, Bangalore, Chennai, Delhi NCR)
- **50+ Compliance Items** across 6 categories
- **12 Months Historical Data** for trend analysis
- **Multiple Documents** per compliance item
- **Comments and Activity Logs** for collaboration
- **Real-time Notifications** for upcoming deadlines

## 🎨 Key Features Details

### Compliance Categories
1. **Factory Act & Rules**: Licenses, registrations, declarations
2. **Environmental Compliance**: Pollution control, waste management
3. **Safety & Fire**: Fire NOC, safety audits, emergency procedures
4. **Labor Laws**: PF, ESI, professional tax, contract labor
5. **Quality & ISO**: ISO certifications, internal audits
6. **Other Compliance**: Trade licenses, GST, TDS returns

### Status Types
- ✅ **Compliant**: All requirements met
- ⏳ **Pending**: Awaiting action
- 🔄 **In Progress**: Work ongoing
- 📤 **Submitted**: Awaiting review
- ❌ **Non-Compliant**: Failed/rejected
- ⚠️ **Overdue**: Past due date
- ⚡ **Partially Compliant**: Some requirements met
- ⭕ **Not Applicable**: Doesn't apply

### Priority Levels
- 🔴 **Critical**: Immediate attention required
- 🟠 **High**: Important, address soon
- 🟡 **Medium**: Normal priority
- 🟢 **Low**: Can be scheduled

## 🌙 Dark Mode

The application features a comprehensive dark mode implementation:
- Toggle from header (sun/moon icon)
- Preference saved in localStorage
- All components fully styled for dark mode
- Proper contrast ratios for accessibility
- Charts and graphs dark-mode compatible

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with bottom navigation

## 🔄 State Management

Uses React Context API for:
- Authentication state
- Theme preferences
- Compliance data
- Notifications
- Plant selection
- UI state (sidebar, filters, etc.)

## 📈 Analytics & Reporting

### Dashboard Metrics
- Real-time compliance rate calculation
- Status distribution across all items
- Category-wise performance
- Plant-wise comparison
- Historical trend analysis
- Upcoming deadline tracking

### Report Generation
All reports include:
- Summary statistics
- Visual charts and graphs
- Detailed breakdowns
- Export capabilities (PDF/Excel)
- Custom date range selection
- Print-friendly layouts

## 🎯 Future Enhancements

Potential additions for production:
- Backend API integration
- Real-time WebSocket notifications
- Email alert system
- SMS notifications for critical items
- Document OCR for automatic data extraction
- Workflow automation rules
- Multi-language support
- Mobile app (React Native)
- Advanced analytics with ML predictions
- Integration with ERP systems

## 🤝 Contributing

This is a demonstration project showcasing:
- Modern React patterns and best practices
- Comprehensive state management
- Advanced data visualization
- Professional UI/UX design
- Dark mode implementation
- Responsive design
- Accessibility considerations

## 📄 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

- React team for the amazing framework
- Recharts for beautiful charts
- Tailwind CSS for utility-first styling
- Lucide for modern icons
- Vite for blazing-fast development

## 📞 Support

For questions or feedback about this demonstration project, please refer to the code documentation and comments throughout the application.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
