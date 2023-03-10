import React, { lazy } from 'react';
import { dashboardMenu, demoPages, profile } from '../menu';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};

const TASKBYUSER = {
	TASKBYUSER: lazy(() => import('../pages/taskByUser/TaskByUser')),
};
const DAILYWORKTRACKING = {
	DAILYWORKTRACKING: lazy(() => import('../pages/dailyWorkTracking/DailyWorkTracking')),
	DAILYWORKTRACKINGUSER: lazy(() => import('../pages/dailyWorkTracking/DailyWorktrackingUser')),
	DAILYWORKTRACKINGME: lazy(() => import('../pages/dailyWorkTracking/DailyWorkTrackMe')),
	ORDERTASK: lazy(() => import('../pages/work-management/orderTask/orderTask')),
	PEDINGWORKTRACKPAGE: lazy(() => import('../pages/pendingWorktrack/PendingWorktrackPage')),
};
const TASK = {
	SUBTASK_STEP: lazy(() => import('../pages/work-management/subtask-step/SubTaskPage')),
	TASKMANAGEMENT: lazy(() =>
		import('../pages/work-management/task-management/TaskManagementPage'),
	),
	TASKDETAIL: lazy(() => import('../pages/work-management/TaskDetail/TaskDetailPage')),
	ADD_OR_UPDATE_TASK: lazy(() => import('../pages/work-management/task-list/TaskActionsPage')),
	ADD_OR_UPDATE_SUB_TASK: lazy(() =>
		import('../pages/work-management/subtask/TaskDetailActionPage'),
	),
	ADD_NEW_TASK: lazy(() => import('../pages/work-management/task-list/AddTaskPage')),
	TASKLIST: lazy(() => import('../pages/work-management/task-list/TaskListPage')),
	SUBTASK: lazy(() => import('../pages/work-management/subtask/SubTaskPage')),
	TASKLISTDEPARTMENT: lazy(() =>
		import('../pages/work-management/task-department/TaskDepartmentPage'),
	),
	DETAIL_TASK_DEPARTMENT: lazy(() =>
		import('../pages/work-management/detail-task-department/DetailTaskDepartment'),
	),
	CONFIGURE: lazy(() => import('../pages/work-management/configure/WorkConfigurePage')),
	REPORT: lazy(() => import('../pages/work-management/report-department/ReportDepartmentPage')),
};

const MANAGEMENT = {
	DEPARTMENT: lazy(() => import('../pages/department/DepartmentPage')),
	EMPLOYEE: lazy(() => import('../pages/employee/EmployeePage')),
	EMPLOYEE_DETAIL: lazy(() => import('../pages/employee/EmployeeDetailPage')),
	POSITION: lazy(() => import('../pages/position/PositionPage')),
	RECRUITMENT_REQUIREMENT: lazy(() =>
		import('../pages/recruitmentRequirements/RecruitmentRequirementsPage'),
	),
	PERMISSION: lazy(() => import('../pages/config/configPermission/ConfigPermissionPage')),
};
const POSITION_LEVEL_CONFIG = {
	POSITION_LEVEL_CONFIG: lazy(() => import('../pages/positionLevelConfig/positionLevelConfig')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
};
const PROFILE = {
	PROFILE: lazy(() => import('../pages/information/Information')),
};
const UNIT = {
	UNIT: lazy(() => import('../pages/unit/unitPage')),
};

const KPINORM = {
	KPINORM: lazy(() => import('../pages/kpiNorm/kpiNorm')),
};

const MISSION = {
	MISSION: lazy(() => import('../pages/work-management/mission/MissionPage')),
};

const presentation = [
	{
		path: dashboardMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.mission.path,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKING />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.employee.path,
		element: <TASKBYUSER.TASKBYUSER />,
		exact: true,
	},
	{
		path: `${demoPages.taskPage.path}`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGME />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.employee.path}/:id`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGUSER />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/:id`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGUSER />,
		exact: true,
	},
	{
		path: `${demoPages.taskAndAssign.path}`,
		element: <DAILYWORKTRACKING.ORDERTASK />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/:id`,
		element: <TASK.TASKDETAIL />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/them-moi`,
		element: <TASK.ADD_OR_UPDATE_TASK />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/cap-nhat/:id`,
		element: <TASK.ADD_OR_UPDATE_TASK />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/dau-viec/:id`,
		element: <TASK.SUBTASK_STEP />,
		exact: true,
	},
	{
		path: `${demoPages.hrRecords.subMenu.hrList.path}`,
		element: <MANAGEMENT.EMPLOYEE />,
		exact: true,
	},
	{
		path: `${demoPages.hrRecords.subMenu.hrList.path}/:id`,
		element: <MANAGEMENT.EMPLOYEE_DETAIL />,
		exact: true,
	},
	{
		path: `${demoPages.companyPage.path}`,
		element: <MANAGEMENT.DEPARTMENT />,
		exact: true,
	},
	{
		path: demoPages.hrRecords.subMenu.position.path,
		element: <MANAGEMENT.POSITION />,
	},
	{
		path: demoPages.cauHinh.subMenu.unit.path,
		element: <UNIT.UNIT />,
	},
	{
		path: demoPages.taskAndAssign.subMenu.kpiNorm.path,
		element: <KPINORM.KPINORM />,
		exact: true,
	},
	{
		path: demoPages.hrRecords.subMenu.positionLevelConfig.path,
		element: <POSITION_LEVEL_CONFIG.POSITION_LEVEL_CONFIG />,
		exact: true,
	},
	{
		path: demoPages.cauHinh.subMenu.recruitmentRequirements.path,
		element: <MANAGEMENT.RECRUITMENT_REQUIREMENT />,
	},
	{
		path: demoPages.mission.path,
		element: <MISSION.MISSION />,
	},
	{
		path: demoPages.taskAndAssign.subMenu.pendingAccepted.path,
		element: <DAILYWORKTRACKING.PEDINGWORKTRACKPAGE />,
	},
	{
		path: profile.profile.path,
		element: <PROFILE.PROFILE />,
	},
	{
		path: '*',
		element: <AUTH.PAGE_404 />,
		exact: true,
	},
];

const documentation = [
	/**
	 * Bootstrap
	 */
];

const contents = [...presentation, ...documentation];

export default contents;
