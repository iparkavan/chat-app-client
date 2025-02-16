// import active_dashboard_icon from '../../public/icons/side-menu-icons/active-icons/dashboard.svg'
// import inactive_dashboard_icon from '../../public/icons/side-menu-icons/inactive-icons/dashboard.svg'
// import { user_roles } from './user-roles';


// export const Routes = [
//   {
//     activeIcon: '',
//     inactiveIcon: '',
//     path: '/login',
//     routeName: 'Login',
//     permission: [],
//     isProtectedRoute: false,
//   },
//   {
//     activeIcon: '',
//     inactiveIcon: '',
//     path: '/access-denied',
//     routeName: 'Access Denied',
//     permission: [],
//     isProtectedRoute: false,
//   },
//   {
//     activeIcon: active_dashboard_icon,
//     inactiveIcon: inactive_dashboard_icon,
//     path: '/dashboard',
//     routeName: 'Dashboard',
//     permission: [
//       user_roles.project_manager,
//       user_roles.hr_employee,
//       user_roles.dev_employee,
//       user_roles.hr_manager,
//     ],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_desc_icon,
//     inactiveIcon: inactive_desc_icon,
//     path: '#',
//     routeName: 'Description',
//     permission: [user_roles.project_manager],
//     categories: [
//       { path: '/dashboard/jd/job-description', routeName: 'Job Description' },
//       {
//         path: '/dashboard/jd/job-description-status',
//         routeName: 'Job Description Status',
//       },
//       { path: '/dashboard/jd/chatbot', routeName: 'Chatbot' },
//     ],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_desc_icon,
//     inactiveIcon: inactive_desc_icon,
//     path: '#',
//     routeName: 'Description',
//     permission: [user_roles.hr_manager],
//     categories: [
//       {
//         path: '/dashboard/job-description',
//         routeName: 'Job Description',
//       },
//       {
//         path: '/dashboard/',
//         routeName: 'Assets JD',
//       },
//       { path: '/dashboard/', routeName: 'Create JD' },
//     ],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_desc_icon,
//     inactiveIcon: inactive_desc_icon,
//     path: '#',
//     routeName: 'Task Details',
//     categories: [
//       { path: '/dashboard/task-details', routeName: 'Task Details' },
//       { path: '/dashboard/task-status', routeName: 'Task Status' },
//     ],
//     permission: [user_roles.hr_employee],
//     isProtectedRoute: true,
//   },

//   {
//     activeIcon: active_application_icon,
//     inactiveIcon: inactive_application_icon,
//     path: '#',
//     routeName: 'Application',
//     categories: [
//       { path: '/dashboard/application', routeName: 'API Applications' },
//       { path: '/dashboard/saved-application', routeName: 'Saved Applications' },
//     ],
//     permission: [user_roles.hr_manager],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_application_icon,
//     inactiveIcon: inactive_application_icon,
//     path: '#',
//     routeName: 'Application',
//     categories: [
//       { path: '/dashboard/application', routeName: 'API Applications' },
//       { path: '/dashboard/bulk-upload', routeName: 'Bulk Upload' },
//       {
//         path: '/dashboard/new-application',
//         routeName: 'Referral Applications',
//       },
//       { path: '/dashboard/saved-application', routeName: 'Saved Applications' },
//     ],
//     permission: [user_roles.hr_employee],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_status_icon,
//     inactiveIcon: inactive_status_icon,
//     path: '#',
//     routeName: 'Candidate Status',
//     categories: [
//       { path: '/dashboard/candidate-status', routeName: 'Candidates Status' },
//       { path: '/dashboard/bg-verification', routeName: 'BG Verification' },
//     ],
//     permission: [user_roles.hr_employee],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_todo_icon,
//     inactiveIcon: inactive_todo_icon,
//     path: '#',
//     routeName: 'Calendar',
//     categories: [
//       { path: '/todos/calendar', routeName: 'Calendar' },
//       { path: '/dashboard/messages', routeName: 'Messages' },
//       { path: '/dashboard/notification', routeName: 'Notifications' },
//       {
//         path: '/dashboard/interview/completed-interview',
//         routeName: 'Completed Interview Details',
//       },
//       {
//         path: '/dashboard/interview/later-interview',
//         routeName: 'Later Interview Marks',
//       },
//     ],
//     permission: [user_roles.hr_manager],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_teamIcon,
//     inactiveIcon: inactive_teamIcon,
//     path: '#',
//     routeName: 'Teams',
//     categories: [
//       { path: '/dashboard/employee', routeName: 'Employee’s' },
//       { path: '/dashboard/', routeName: 'My Team Members' },
//     ],
//     permission: [user_roles.hr_manager],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_posted_job_icon,
//     inactiveIcon: inactive_posted_job_icon,
//     path: '/dashboard/posted-job',
//     routeName: 'Posted Jobs',
//     permission: [user_roles.hr_employee, user_roles.hr_manager],
//     isProtectedRoute: true,
//   },

//   {
//     activeIcon: active_todo_icon,
//     inactiveIcon: inactive_todo_icon,
//     path: '#',
//     routeName: 'Calendar',
//     categories: [
//       { path: '/todos/calendar', routeName: 'Calendar' },
//       { path: '/dashboard/messages', routeName: 'Messages' },
//       { path: '/dashboard/notification', routeName: 'Notifications' },
//       {
//         path: '/dashboard/interview/completed-interview',
//         routeName: 'Completed Interview Details',
//       },
//       {
//         path: '/dashboard/interview/later-interview',
//         routeName: 'Later Interview Marks',
//       },
//     ],
//     permission: [
//       user_roles.project_manager,
//       user_roles.hr_employee,
//       user_roles.dev_employee,
//     ],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_application_icon,
//     inactiveIcon: inactive_application_icon,
//     path: '#',
//     routeName: 'Applications',
//     categories: [
//       {
//         path: '/dashboard/job-application/total-application',
//         routeName: 'Total Applications',
//       },
//       {
//         path: '/dashboard/job-application/hired-application',
//         routeName: 'Hired Applications',
//       },
//     ],
//     permission: [user_roles.project_manager],
//     isProtectedRoute: true,
//   },

//   {
//     activeIcon: active_employee_icon,
//     inactiveIcon: inactive_employee_icon,
//     path: '/dashboard/employee',
//     routeName: 'Employee’s',
//     permission: [user_roles.project_manager, user_roles.hr_employee],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_posted_job_icon,
//     inactiveIcon: inactive_posted_job_icon,
//     path: '/dashboard/posted-job',
//     routeName: 'Posted Jobs',
//     permission: [user_roles.project_manager],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_status_icon,
//     inactiveIcon: inactive_status_icon,
//     path: '/dashboard/candidate-status',
//     routeName: 'Candidate Status',
//     permission: [user_roles.project_manager, user_roles.hr_manager],
//     isProtectedRoute: true,
//   },
//   {
//     activeIcon: active_help_desk_icon,
//     inactiveIcon: inactive_help_desk_icon,
//     path: '/dashboard/help-desk',
//     routeName: 'Help Desk',
//     permission: [
//       user_roles.project_manager,
//       user_roles.hr_employee,
//       user_roles.hr_manager,
//       user_roles.dev_employee,
//     ],

//     isProtectedRoute: true,
//   },

//   {
//     activeIcon: active_setttings_icon,
//     inactiveIcon: inactive_settings_icon,
//     path: '/settings',
//     routeName: 'Settings',
//     permission: [
//       user_roles.project_manager,
//       user_roles.hr_employee,
//       user_roles.hr_manager,
//       user_roles.dev_employee,
//     ],

//     isProtectedRoute: true,
//   },
// ];