// Comprehensive Mock Data Generator for Compliance Portal
import { addDays, subDays, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Plant Locations
export const plants = [
  {
    id: 1,
    name: 'Mumbai Plant',
    location: 'Mumbai, Maharashtra',
    code: 'MUM-01',
    manager: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    established: '2015',
    employeeCount: 250,
    complianceScore: 92
  },
  {
    id: 2,
    name: 'Pune Manufacturing',
    location: 'Pune, Maharashtra',
    code: 'PUN-02',
    manager: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    established: '2018',
    employeeCount: 180,
    complianceScore: 87
  },
  {
    id: 3,
    name: 'Bangalore Facility',
    location: 'Bangalore, Karnataka',
    code: 'BLR-03',
    manager: 'Amit Patel',
    email: 'amit.patel@company.com',
    established: '2016',
    employeeCount: 320,
    complianceScore: 95
  },
  {
    id: 4,
    name: 'Chennai Unit',
    location: 'Chennai, Tamil Nadu',
    code: 'CHN-04',
    manager: 'Lakshmi Iyer',
    email: 'lakshmi.iyer@company.com',
    established: '2019',
    employeeCount: 150,
    complianceScore: 78
  },
  {
    id: 5,
    name: 'Delhi NCR Plant',
    location: 'Gurgaon, Haryana',
    code: 'DEL-05',
    manager: 'Vikram Singh',
    email: 'vikram.singh@company.com',
    established: '2017',
    employeeCount: 200,
    complianceScore: 85
  }
];

// Compliance Categories
export const categories = [
  { id: 1, name: 'Factory Act & Rules', icon: 'Factory', color: '#3B82F6' },
  { id: 2, name: 'Environmental Compliance', icon: 'Leaf', color: '#10B981' },
  { id: 3, name: 'Safety & Fire', icon: 'Shield', color: '#EF4444' },
  { id: 4, name: 'Labor Laws', icon: 'Users', color: '#F59E0B' },
  { id: 5, name: 'Quality & ISO', icon: 'Award', color: '#8B5CF6' },
  { id: 6, name: 'Other Compliance', icon: 'FileText', color: '#6B7280' }
];

// Compliance Status Types
export const statusTypes = [
  { value: 'compliant', label: 'Compliant', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'pending', label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'submitted', label: 'Submitted', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
  { value: 'non_compliant', label: 'Non-Compliant', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  { value: 'overdue', label: 'Overdue', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  { value: 'partially_compliant', label: 'Partially Compliant', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
  { value: 'not_applicable', label: 'Not Applicable', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
];

// Priority Levels
export const priorities = [
  { value: 'critical', label: 'Critical', color: 'red' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'green' }
];

// Generate Compliance Items
const complianceTemplates = [
  // Factory Act & Rules
  { name: 'Factory License Renewal', category: 1, frequency: 'yearly', priority: 'high', description: 'Annual factory license renewal with state factory department' },
  { name: 'Boiler Registration Certificate', category: 1, frequency: 'yearly', priority: 'high', description: 'Boiler registration and inspection certificate' },
  { name: 'Building Plan Approval', category: 1, frequency: 'once', priority: 'medium', description: 'Building plan approval from local authority' },
  { name: 'Occupier Appointment Letter', category: 1, frequency: 'yearly', priority: 'medium', description: 'Appointment letter of factory occupier' },
  { name: 'Manager Appointment Letter', category: 1, frequency: 'yearly', priority: 'medium', description: 'Appointment letter of factory manager' },
  { name: 'Form 11 - Machinery Declaration', category: 1, frequency: 'yearly', priority: 'low', description: 'Declaration of machinery installation' },
  { name: 'Leave Register Maintenance', category: 1, frequency: 'monthly', priority: 'low', description: 'Maintain leave records as per Factory Act' },

  // Environmental Compliance
  { name: 'Consent to Establish', category: 2, frequency: 'once', priority: 'critical', description: 'Environmental clearance for establishment' },
  { name: 'Consent to Operate', category: 2, frequency: 'yearly', priority: 'critical', description: 'Annual consent to operate from pollution board' },
  { name: 'Environmental Clearance', category: 2, frequency: 'yearly', priority: 'high', description: 'Environmental impact assessment clearance' },
  { name: 'Air Quality Monitoring Report', category: 2, frequency: 'monthly', priority: 'medium', description: 'Monthly ambient air quality monitoring' },
  { name: 'Water Quality Test Report', category: 2, frequency: 'monthly', priority: 'medium', description: 'Monthly effluent water quality testing' },
  { name: 'Hazardous Waste Authorization', category: 2, frequency: 'yearly', priority: 'high', description: 'Authorization for hazardous waste handling' },
  { name: 'E-Waste Management Plan', category: 2, frequency: 'yearly', priority: 'medium', description: 'Electronic waste disposal plan' },
  { name: 'Pollution Control Returns', category: 2, frequency: 'quarterly', priority: 'high', description: 'Quarterly returns to pollution control board' },

  // Safety & Fire
  { name: 'Fire NOC', category: 3, frequency: 'yearly', priority: 'critical', description: 'Fire No Objection Certificate renewal' },
  { name: 'Fire Safety Audit', category: 3, frequency: 'yearly', priority: 'high', description: 'Annual fire safety audit by certified agency' },
  { name: 'Fire Fighting Equipment Testing', category: 3, frequency: 'monthly', priority: 'high', description: 'Monthly testing of fire extinguishers and equipment' },
  { name: 'Safety Committee Meeting', category: 3, frequency: 'monthly', priority: 'medium', description: 'Monthly safety committee meeting minutes' },
  { name: 'Safety Training Records', category: 3, frequency: 'quarterly', priority: 'medium', description: 'Quarterly safety training for employees' },
  { name: 'Accident Report Submission', category: 3, frequency: 'asneeded', priority: 'critical', description: 'Report workplace accidents within 24 hours' },
  { name: 'MSDS Maintenance', category: 3, frequency: 'yearly', priority: 'medium', description: 'Material Safety Data Sheets maintenance' },
  { name: 'PPE Stock Verification', category: 3, frequency: 'monthly', priority: 'low', description: 'Personal protective equipment inventory check' },
  { name: 'Emergency Mock Drill', category: 3, frequency: 'quarterly', priority: 'high', description: 'Quarterly emergency evacuation drill' },

  // Labor Laws
  { name: 'PF Returns (ECR)', category: 4, frequency: 'monthly', priority: 'high', description: 'Monthly provident fund returns submission' },
  { name: 'ESI Returns', category: 4, frequency: 'monthly', priority: 'high', description: 'Monthly ESI contribution returns' },
  { name: 'Professional Tax Payment', category: 4, frequency: 'monthly', priority: 'medium', description: 'Monthly professional tax payment' },
  { name: 'Contract Labor License', category: 4, frequency: 'yearly', priority: 'high', description: 'Annual contract labor license renewal' },
  { name: 'Bonus Payment Compliance', category: 4, frequency: 'yearly', priority: 'medium', description: 'Annual bonus payment as per Bonus Act' },
  { name: 'Minimum Wages Compliance', category: 4, frequency: 'monthly', priority: 'high', description: 'Compliance with minimum wages act' },
  { name: 'Form 24 - Muster Roll', category: 4, frequency: 'monthly', priority: 'low', description: 'Monthly muster roll maintenance' },
  { name: 'Gratuity Fund Returns', category: 4, frequency: 'yearly', priority: 'medium', description: 'Annual gratuity fund returns' },

  // Quality & ISO
  { name: 'ISO 9001 Certification', category: 5, frequency: 'yearly', priority: 'high', description: 'Quality management system certification' },
  { name: 'ISO 14001 Certification', category: 5, frequency: 'yearly', priority: 'high', description: 'Environmental management system certification' },
  { name: 'ISO 45001 Certification', category: 5, frequency: 'yearly', priority: 'high', description: 'Occupational health and safety certification' },
  { name: 'Internal Quality Audit', category: 5, frequency: 'quarterly', priority: 'medium', description: 'Quarterly internal quality audit' },
  { name: 'Management Review Meeting', category: 5, frequency: 'quarterly', priority: 'medium', description: 'Quarterly management review meeting' },
  { name: 'Calibration Certificate', category: 5, frequency: 'yearly', priority: 'medium', description: 'Annual calibration of measuring instruments' },
  { name: 'Customer Complaint Analysis', category: 5, frequency: 'monthly', priority: 'low', description: 'Monthly customer complaint analysis report' },

  
  // Other Compliance
  { name: 'Trade License Renewal', category: 6, frequency: 'yearly', priority: 'medium', description: 'Annual trade license renewal' },
  { name: 'GST Returns Filing', category: 6, frequency: 'monthly', priority: 'high', description: 'Monthly GST returns filing' },
  { name: 'TDS Returns Filing', category: 6, frequency: 'quarterly', priority: 'high', description: 'Quarterly TDS returns filing' },
  { name: 'Legal Metrology Certificate', category: 6, frequency: 'yearly', priority: 'medium', description: 'Weights and measures certificate' },
  { name: 'Shops and Establishment Registration', category: 6, frequency: 'yearly', priority: 'medium', description: 'Annual registration renewal' },
  { name: 'Drug License (if applicable)', category: 6, frequency: 'yearly', priority: 'high', description: 'Drug manufacturing/trading license' }
];

// Generate compliance items for all plants
export const generateComplianceItems = () => {
  const items = [];
  let itemId = 1;

  plants.forEach(plant => {
    complianceTemplates.forEach(template => {
      // Generate multiple instances based on frequency
      const instances = template.frequency === 'monthly' ? 3 :
                       template.frequency === 'quarterly' ? 2 : 1;

      for (let i = 0; i < instances; i++) {
        const dueDate = generateDueDate(template.frequency, i);
        const status = generateStatus(dueDate, plant.complianceScore);

        items.push({
          id: itemId++,
          plantId: plant.id,
          plantName: plant.name,
          title: template.name,
          description: template.description,
          category: template.category,
          categoryName: categories.find(c => c.id === template.category)?.name,
          priority: template.priority,
          status: status,
          dueDate: dueDate,
          completedDate: status === 'compliant' ? subDays(dueDate, Math.floor(Math.random() * 10)) : null,
          assignedTo: plant.manager,
          createdDate: subDays(dueDate, 30),
          documents: generateDocuments(status),
          comments: generateComments(),
          frequency: template.frequency
        });
      }
    });
  });

  return items;
};

// Generate due dates based on frequency
const generateDueDate = (frequency, instance) => {
  const today = new Date();

  switch (frequency) {
    case 'monthly':
      return addDays(today, (instance - 1) * 30 + Math.floor(Math.random() * 15));
    case 'quarterly':
      return addDays(today, (instance - 1) * 90 + Math.floor(Math.random() * 30));
    case 'yearly':
      return addDays(today, Math.floor(Math.random() * 180 - 60));
    case 'once':
      return addDays(today, Math.floor(Math.random() * 365 - 180));
    default:
      return addDays(today, Math.floor(Math.random() * 90));
  }
};

// Generate status based on due date and plant compliance score
const generateStatus = (dueDate, complianceScore) => {
  const today = new Date();
  const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

  // Random factor based on plant's overall compliance score
  const random = Math.random() * 100;

  if (daysUntilDue < -7) {
    return random < complianceScore * 0.5 ? 'compliant' : 'overdue';
  } else if (daysUntilDue < 0) {
    return random < complianceScore * 0.6 ? 'compliant' : 'overdue';
  } else if (daysUntilDue < 7) {
    if (random < complianceScore * 0.7) return 'compliant';
    if (random < complianceScore * 0.85) return 'in_progress';
    return 'pending';
  } else if (daysUntilDue < 15) {
    if (random < complianceScore * 0.6) return 'compliant';
    if (random < complianceScore * 0.8) return 'in_progress';
    return 'pending';
  } else {
    if (random < complianceScore * 0.4) return 'compliant';
    if (random < complianceScore * 0.6) return 'in_progress';
    return 'pending';
  }
};

// Generate documents
const generateDocuments = (status) => {
  if (status === 'compliant' || status === 'submitted') {
    const docCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: docCount }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `Document_${i + 1}.pdf`,
      size: `${Math.floor(Math.random() * 2000 + 500)} KB`,
      uploadedDate: subDays(new Date(), Math.floor(Math.random() * 30)),
      uploadedBy: 'Plant User'
    }));
  }
  return [];
};

// Generate comments
const generateComments = () => {
  const commentCount = Math.floor(Math.random() * 4);
  const commentTemplates = [
    'Documents uploaded for review',
    'Waiting for approval from corporate team',
    'Certificate received from authorities',
    'Renewal application submitted',
    'Inspection completed successfully'
  ];

  return Array.from({ length: commentCount }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    text: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
    author: i % 2 === 0 ? 'Plant User' : 'Corporate Admin',
    date: subDays(new Date(), Math.floor(Math.random() * 20))
  }));
};

// Generate historical data for charts (last 12 months)
export const generateHistoricalData = () => {
  const months = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i);
    const monthName = format(date, 'MMM yyyy');

    // Generate data for each month
    const totalItems = 50 + Math.floor(Math.random() * 20);
    const compliant = Math.floor(totalItems * (0.75 + Math.random() * 0.15));
    const pending = Math.floor((totalItems - compliant) * 0.4);
    const inProgress = Math.floor((totalItems - compliant) * 0.3);
    const overdue = totalItems - compliant - pending - inProgress;

    months.push({
      month: monthName,
      compliant,
      pending,
      inProgress,
      overdue,
      nonCompliant: Math.floor(Math.random() * 5),
      complianceRate: Math.round((compliant / totalItems) * 100)
    });
  }

  return months;
};

// Generate daily data for current month heatmap
export const generateMonthlyHeatmap = () => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  return days.map(day => ({
    date: format(day, 'yyyy-MM-dd'),
    day: format(day, 'd'),
    weekday: format(day, 'EEE'),
    submissions: Math.floor(Math.random() * 10),
    status: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
  }));
};

// Users
export const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'corporate',
    name: 'Suresh Menon',
    email: 'suresh.menon@company.com',
    designation: 'Corporate Compliance Head'
  },
  {
    id: 2,
    username: 'Compliant',
    password: 'Compliant123',
    role: 'plant',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    designation: 'Plant Manager',
    plantId: 1
  },
  {
    id: 3,
    username: 'user',
    password: 'user123',
    role: 'plant',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    designation: 'Plant Manager',
    plantId: 2
  }
];

// Notifications
export const generateNotifications = () => {
  return [
    {
      id: 1,
      type: 'deadline',
      title: 'Fire NOC Renewal Due in 3 Days',
      message: 'Mumbai Plant - Fire NOC renewal due on ' + format(addDays(new Date(), 3), 'dd MMM yyyy'),
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'submission',
      title: 'New Submission from Pune Plant',
      message: 'ISO 9001 certificate submitted for approval',
      time: '5 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'overdue',
      title: 'Overdue Compliance Alert',
      message: 'Chennai Unit - PF Returns are overdue by 5 days',
      time: '1 day ago',
      read: false,
      priority: 'critical'
    },
    {
      id: 4,
      type: 'approved',
      title: 'Submission Approved',
      message: 'Your Environmental Clearance document has been approved',
      time: '2 days ago',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'deadline',
      title: 'Upcoming Compliance Deadlines',
      message: '5 compliance items due in next 7 days',
      time: '3 days ago',
      read: true,
      priority: 'medium'
    }
  ];
};

// Export all data
export const mockData = {
  plants,
  categories,
  statusTypes,
  priorities,
  complianceItems: generateComplianceItems(),
  historicalData: generateHistoricalData(),
  monthlyHeatmap: generateMonthlyHeatmap(),
  users,
  notifications: generateNotifications()
};

export default mockData;