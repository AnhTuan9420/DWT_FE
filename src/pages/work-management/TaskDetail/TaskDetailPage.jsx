// eslint-disable react/no-array-index-key
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useToasts } from 'react-toast-notifications';
// import Dropdown, {
// 	DropdownToggle,
// 	DropdownMenu,
// 	DropdownItem,
// } from '../../../components/bootstrap/Dropdown';
import {
	updateSubtask,
	updateStatusPendingTask,
	getAllSubtasksByTaskId,
	addNewSubtask,
	deleteSubtask,
} from './services';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	// CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	// CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import {
	FORMAT_TASK_STATUS,
	// formatColorStatus,
	formatColorPriority,
	// renderStatusTask,
	// STATUS,
	// renderStatus,
} from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
// import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import TaskDetailForm from './TaskDetailForm/TaskDetailForm';
import ComfirmSubtask from './TaskDetailForm/ComfirmSubtask';
import useDarkMode from '../../../hooks/useDarkMode';
import './styleTaskDetail.scss';
import TaskAlertConfirm from '../mission/TaskAlertConfirm';
import TaskFormModal from '../mission/TaskFormModal';
import { deleteTaskById, getTaskById, updateTaskByID } from '../mission/services';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
import Toasts from '../../../components/bootstrap/Toasts';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import Popovers from '../../../components/bootstrap/Popovers';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import Alert from '../../../components/bootstrap/Alert';
import ModalShowListCommon from '../../common/ComponentCommon/ModalShowListCommon';
import { formatDateFromMiliseconds } from '../../../utils/utils';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import { demoPages } from '../../../menu';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import styles from './circle.module.css';

const TaskDetailPage = () => {
	const { darkModeStatus } = useDarkMode();
	const params = useParams();
	const navigate = useNavigate();
	const { addToast } = useToasts();

	// State
	const [task, setTask] = useState({});
	const [taskReport, setTaskReport] = useState({});
	const [subtasks, setSubtasks] = useState([]);

	const [editModalStatus, setEditModalStatus] = useState(false);
	const [itemEdit, setItemEdit] = useState({});

	const [openConfirm, set0penConfirm] = React.useState(false);
	const [deletes, setDeletes] = React.useState({});

	// edit & delete task
	const [editModalTaskStatus, setEditModalTaskStatus] = useState(false);
	const [taskEdit, setTaskEdit] = useState({});
	const [openConfirmTaskModal, setOpenConfirmTaskModal] = useState(false);
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	const [openListInfoModal, setOpenListInfoModal] = useState(false); // note task

	const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
		title: '',
		subTitle: '',
		status: null,
		type: 1,
		isShowNote: false,
	});

	const [state, setState] = React.useState({
		series: [0, 0, 0, 0, 0, 0, 0],
		options: chartOptions,
	});

	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: [
			'Ch??? ch???p nh???n',
			'??ang th???c hi???n',
			'???? ho??n th??nh',
			'Ch??? x??t duy???t',
			'Hu???',
			'????ng',
			'T???m d???ng',
		],
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
				expandOnClick: true,
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '16px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 0,
							formatter(val) {
								return val;
							},
						},
						value: {
							show: true,
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 16,
							formatter(val) {
								return val;
							},
						},
					},
				},
			},
		},
		legend: {
			show: true,
			position: 'bottom',
		},
	};

	const columns = [
		{
			title: 'T??n c??ng vi???c',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/dau-viec/${item?.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Th???i gian b???t ?????u',
			id: 'startDate',
			key: 'startDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'H???n ho??n th??nh',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Ti???n ?????',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Gi?? tr??? KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
			format: (item) => item || 0,
		},
		{
			title: '????? ??u ti??n',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center justify-content-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							`border-light`,
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`C???p ${item.priority ? item.priority : 1}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		// {
		// 	title: 'Tr???ng th??i',
		// 	id: 'status',
		// 	key: 'status',
		// 	type: 'text',
		// 	align: 'center',
		// 	render: (item) =>
		// 		verifyPermissionHOC(
		// 			<Dropdown>
		// 				<DropdownToggle hasIcon={false}>
		// 					<Button
		// 						isLink
		// 						color={formatColorStatus(item.status)}
		// 						icon='Circle'
		// 						className='text-nowrap'>
		// 						{FORMAT_TASK_STATUS(item.status)}
		// 					</Button>
		// 				</DropdownToggle>
		// 				<DropdownMenu>
		// 					{Object.keys(renderStatusTask(item.status)).map((key) => (
		// 						<DropdownItem
		// 							key={key}
		// 							onClick={() =>
		// 								handleOpenConfirmStatusTask(item, STATUS[key].value, 2)
		// 							}>
		// 							<div>
		// 								<Icon icon='Circle' color={STATUS[key].color} />
		// 								{STATUS[key].name}
		// 							</div>
		// 						</DropdownItem>
		// 					))}
		// 				</DropdownMenu>
		// 			</Dropdown>,
		// 			['admin', 'manager'],
		// 			<Button
		// 				isLink
		// 				color={formatColorStatus(item.status)}
		// 				icon='Circle'
		// 				className='text-nowrap'>
		// 				{FORMAT_TASK_STATUS(item.status)}
		// 			</Button>,
		// 		),
		// },
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<div>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Edit'
							onClick={() => handleOnClickToEditPage(params.id, item.id)}
						/>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2 '
							icon='Delete'
							onClick={() => handleOpenConfirm(item)}
						/>
					</div>,
					['admin', 'manager', 'user'],
				),
		},
	];

	const columnsPending = [
		{
			title: 'T??n ?????u vi???c',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/dau-viec/${item?.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Th???i gian b???t ?????u',
			id: 'startDate',
			key: 'startDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'H???n ho??n th??nh',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Ti???n ?????',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Gi?? tr??? KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
			format: (item) => item || 0,
		},
		{
			title: '????? ??u ti??n',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center justify-content-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							`border-light`,
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`C???p ${item.priority ? item.priority : 1}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		// {
		// 	title: 'Tr???ng th??i',
		// 	id: 'status',
		// 	key: 'status',
		// 	type: 'number',
		// 	align: 'center',
		// 	render: (item) => (
		// 		<Button
		// 			isLink
		// 			color={formatColorStatus(item.status)}
		// 			icon='Circle'
		// 			className='text-nowrap'>
		// 			{FORMAT_TASK_STATUS(item.status)}
		// 		</Button>
		// 	),
		// },
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<div>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							onClick={() => handleOpenConfirmStatusTask(item, 4, 2)}
							icon='Edit'>
							X??c nh???n
						</Button>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2 '
							onClick={() => handleOpenConfirmStatusTask(item, 5, 2)}
							icon='Trash'>
							T??? ch???i
						</Button>
					</div>,
					['admin', 'manager'],
				),
		},
	];

	const fetchTaskId = async (id) => {
		const res = await getTaskById(id);
		setTask(res.data.data);
		setTaskReport(res.data.report);
	};

	const fetchSubtasks = async (id) => {
		const res = await getAllSubtasksByTaskId(id);
		setSubtasks(res.data);
	};

	// Data
	React.useEffect(() => {
		fetchTaskId(params?.id);
		fetchSubtasks(params?.id);
	}, [params?.id]);

	const handleOnClickToActionPage = useCallback(
		(missionId) => navigate(`${demoPages.jobsPage.subMenu.task.path}/${missionId}/them-moi`),
		[navigate],
	);

	const handleOnClickToEditPage = useCallback(
		(taskId, subTaskId) =>
			navigate(`${demoPages.jobsPage.subMenu.task.path}/${taskId}/cap-nhat/${subTaskId}`),
		[navigate],
	);

	// show toast
	const handleShowToast = (titleToast, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={titleToast} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	// delete subtask
	const handleDelete = async (valueDelete) => {
		try {
			await deleteSubtask(valueDelete?.id);
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u th??nh c??ng!`);
		} catch (error) {
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u th???t b???i!`);
		}
		fetchSubtasks(params?.id);
	};

	const handleOpenConfirm = (item) => {
		setDeletes({
			id: item.id,
			name: item.name,
		});
		set0penConfirm(true);
	};

	const handleCloseComfirm = () => {
		setDeletes({});
		set0penConfirm(false);
	};

	// change status
	const handleStatus = async (status, data) => {
		try {
			const subtaskClone = { ...data };
			subtaskClone.status = status;
			const respose = await updateSubtask(subtaskClone);
			const result = await respose.data;
			handleShowToast(
				`C???p nh???t tr???ng th??i!`,
				`C???p nh???t tr???ng th??i ?????u vi???c ${result.name} th??nh c??ng!`,
			);
			handleCloseConfirmStatusTask();
		} catch (error) {
			handleShowToast(
				`C???p nh???t tr???ng th??i!`,
				`Thao t??c kh??ng th??nh c??ng. Xin vui l??ng th??? l???i!`,
				'Error',
				'danger',
			);
		}
	};

	// ------------------	UPDATE AND DELETE TASK	-------------------
	// form task modal
	// const handleOpenEditTaskForm = (item) => {
	// 	setEditModalTaskStatus(true);
	// 	setTaskEdit({ ...item });
	// };

	const handleCloseEditTaskForm = () => {
		setEditModalTaskStatus(false);
		setTaskEdit(null);
	};

	const handleOpenConfirmTaskModal = (item) => {
		setOpenConfirmTaskModal(true);
		setTaskEdit({ ...item });
	};

	const handleCloseConfirmTaskModal = () => {
		setOpenConfirmTaskModal(false);
		setTaskEdit(null);
	};

	const handleDeleteTask = async (taskId) => {
		try {
			await deleteTaskById(taskId);
			handleCloseConfirmTaskModal();
			navigate(-1);
			handleShowToast(`Xo?? c??ng vi???c!`, `Xo?? c??ng vi???c th??nh c??ng!`);
		} catch (error) {
			handleCloseConfirmTaskModal();
			handleShowToast(
				`Xo?? c??ng vi???c!`,
				`Thao t??c kh??ng th??nh c??ng. Xin vui l??ng th??? l???i!`,
				'Error',
				'danger',
			);
		}
	};

	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				setTask(result);
				handleShowToast(
					`C???p nh???t c??ng vi???c!`,
					`C???p nh???t c??ng vi???c ${result.name} th??nh c??ng!`,
				);
				handleCloseEditTaskForm();
			} catch (error) {
				setTask(task);
				handleShowToast(
					`C???p nh???t c??ng vi???c!`,
					`Thao t??c kh??ng th??nh c??ng. Xin vui l??ng th??? l???i!`,
					'Error',
					'danger',
				);
			}
		}
	};

	React.useEffect(() => {
		setState({
			series: [
				taskReport.pending,
				taskReport.inprogress,
				taskReport.completed,
				taskReport.solved,
				taskReport.cancel,
				taskReport.closed,
				taskReport.onhold,
			],
			options: chartOptions,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task]);

	// --------------	  X??? l?? ch???c n??ng thay ?????i tr???ng th??i	  	----------------
	// --------------	  Handle change status task	  	----------------

	const handleClickChangeStatusTask = async (status, data) => {
		try {
			const taskClone = { ...data };
			taskClone.status = status;
			const response = await updateStatusPendingTask(taskClone);
			const result = await response.data;
			setTask(result);
			handleCloseConfirmStatusTask();
			handleShowToast(
				`C???p nh???t tr???ng th??i!`,
				`C???p nh???t tr???ng th??i c??ng vi???c ${result.name} th??nh c??ng!`,
			);
		} catch (error) {
			handleShowToast(
				`C???p nh???t tr???ng th??i!`,
				`Thao t??c kh??ng th??nh c??ng. Xin vui l??ng th??? l???i!`,
				'Error',
				'danger',
			);
		}
	};

	// ------------			Modal confirm khi thay ?????i tr???ng th??i		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	const handleOpenConfirmStatusTask = (item, nextStatus, type = 1, isShowNote = false) => {
		setOpenConfirmModalStatus(true);
		setTaskEdit({ ...item });
		setInfoConfirmModalStatus({
			title: `X??c nh???n ${FORMAT_TASK_STATUS(nextStatus)} c??ng vi???c`.toUpperCase(),
			subTitle: item?.name,
			status: nextStatus,
			type, // 1 task, 2 subtask,
			isShowNote,
		});
	};

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setTaskEdit(null);
		fetchTaskId(params?.id);
		fetchSubtasks(params?.id);
	};

	// Modal hi???n th??? th??ng tin note
	// const handleOpenListInfoModal = () => {
	// 	setOpenListInfoModal(true);
	// };

	const handleCloseListInfoModal = () => {
		setOpenListInfoModal(false);
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
		fetchTaskId(params?.id);
		fetchSubtasks(params?.id);
	};

	const handleSubmitSubTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateSubtask(data);
				const result = await response.data;
				const newSubtasks = [...subtasks];
				setSubtasks(
					newSubtasks.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleCloseEditForm();
				handleShowToast(
					`C???p nh???t ?????u vi???c!`,
					`?????u vi???c ${result.name} ???????c c???p nh???t th??nh c??ng!`,
				);
			} catch (error) {
				setSubtasks(subtasks);
				handleShowToast(`C???p nh???t ?????u vi???c`, `C???p nh???t ?????u vi???c kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewSubtask({
					...data,
					taskId: parseInt(params.id, 10),
				});
				const result = await response.data;
				const newSubtasks = [...subtasks];
				newSubtasks.push(result);
				setSubtasks(newSubtasks);
				handleCloseEditForm();
				handleShowToast(`Th??m ?????u vi???c`, `?????u vi???c ${result.name} ???????c th??m th??nh c??ng!`);
			} catch (error) {
				setSubtasks(subtasks);
				handleShowToast(`Th??m ?????u vi???c`, `Th??m ?????u vi???c kh??ng th??nh c??ng!`);
			}
		}
	};

	return (
		<PageWrapper title={task?.name}>
			<SubHeaderCommon />
			<Page container='fluid' className='overflow-hidden'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-4 fw-bold py-3'>{task?.name}</div>
							{verifyPermissionHOC(
								<div>
									<Button
										isOutline={!darkModeStatus}
										color='primary'
										isLight={darkModeStatus}
										className='text-nowrap mx-2'
										icon='Edit'
										onClick={() =>
											navigate(
												`${demoPages.jobsPage.subMenu.mission.path}/cap-nhat/${task.id}`,
											)
										}>
										S???a
									</Button>
									<Button
										isOutline={!darkModeStatus}
										color='danger'
										isLight={darkModeStatus}
										className='text-nowrap mx-2'
										icon='Trash'
										onClick={() => handleOpenConfirmTaskModal(task)}>
										Xo??
									</Button>
								</div>,
								['admin', 'manager'],
							)}
						</div>
					</div>
					<div className='row mb-4'>
						<div className='col-lg-8'>
							<Card className='shadow-3d-primary h-100 mb-4 pb-4'>
								<CardHeader className='py-2'>
									<CardLabel icon='Summarize' iconColor='success'>
										<CardTitle tag='h4' className='h5'>
											T???ng k???t
										</CardTitle>
									</CardLabel>
									{/* {verifyPermissionHOC(
										<CardActions className='d-flex'>
											<Dropdown>
												<DropdownToggle hasIcon={false}>
													<Button
														color='danger'
														icon='Report'
														className='text-nowrap'>
														C???p nh???t tr???ng th??i c??ng vi???c
													</Button>
												</DropdownToggle>
												<DropdownMenu>
													{Object.keys(renderStatus(task?.status)).map(
														(key) => (
															<DropdownItem
																key={key}
																onClick={() =>
																	handleOpenConfirmStatusTask(
																		task,
																		STATUS[key].value,
																	)
																}>
																<div>
																	<Icon
																		icon='Circle'
																		color={STATUS[key].color}
																	/>
																	{STATUS[key].name}
																</div>
															</DropdownItem>
														),
													)}
												</DropdownMenu>
											</Dropdown>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className='text-nowrap mx-2 shadow-none'
												icon='Info'
												onClick={() => handleOpenListInfoModal()}
											/>
										</CardActions>,
										['admin', 'manager'],
									)} */}
								</CardHeader>
								<CardBody className='py-2'>
									<div className='row g-4'>
										<div className='col-md-5'>
											<Card
												className='bg-l25-primary transition-base rounded-2 mb-4'
												shadow='sm'>
												<CardHeader className='bg-transparent'>
													<CardLabel icon='Activity' iconColor='primary'>
														<CardTitle tag='h4' className='h5'>
															Ti???n ????? th???c hi???n
														</CardTitle>
														{/* <CardSubTitle
															tag='h4'
															className={`h5 text-${formatColorStatus(
																task?.status,
															)}`}>
															{FORMAT_TASK_STATUS(task.status)}
														</CardSubTitle> */}
													</CardLabel>
												</CardHeader>
												<CardBody className='py-2'>
													<div className='d-flex align-items-center pb-3'>
														<div className='flex-grow-1'>
															<div className='fw-bold fs-3 mb-0'>
																{taskReport.progress}%
																<div>
																	<Progress
																		isAutoColor
																		value={taskReport.progress}
																		height={10}
																	/>
																</div>
															</div>
															<div className='fs-5 mt-2'>
																<span className='fw-bold text-danger fs-5 me-2'>
																	{taskReport.completed}
																</span>
																tr??n t???ng s???
																<span className='fw-bold text-danger fs-5 mx-2'>
																	{taskReport.total}
																</span>
																?????u vi???c.
															</div>
														</div>
													</div>
													<div className='row d-flex align-items-end pb-3'>
														<div className='col col-sm-5 text-start'>
															<div className='fw-bold fs-4 mb-10'>
																{task?.kpiValue}
															</div>
															<div className='text-muted'>
																KPI ???????c giao
															</div>
															<div className='fw-bold fs-4 mb-10 mt-4'>
																{taskReport.currentKPI}
															</div>
															<div className='text-muted'>
																KPI th???c t???
															</div>
														</div>
														<div className='col col-sm-7'>
															<div className='fw-bold fs-4 mb-10'>
																{taskReport.completeKPI}
															</div>
															<div className='text-muted'>
																Kpi th???c t??? ???? ho??n th??nh
															</div>
														</div>
													</div>
												</CardBody>
											</Card>
											<CardInfoCommon
												className='mb-4 pb-4'
												shadow='lg'
												style={{ minHeight: 300 }}
												title='Ph??ng ban ph??? tr??ch'
												icon='LayoutTextWindow'
												iconColor='info'
												data={task?.departments?.map(
													(department, index) => {
														if (index === 0) {
															return {
																icon: 'TrendingFlat',
																color: 'info',
																children: (
																	<div className='fw-bold fs-5 mb-1'>
																		{department?.name}{' '}
																		<i className='d-block'>
																			(Ch???u tr??ch nhi???m)
																		</i>
																	</div>
																),
															};
														}
														return {
															icon: 'TrendingFlat',
															color: 'info',
															children: (
																<div className='fw-bold fs-5 mb-1'>
																	{department?.name}
																</div>
															),
														};
													},
												)}
											/>
											<CardInfoCommon
												className='mb-4 pb-4'
												shadow='lg'
												style={{ minHeight: 300 }}
												title='Nh??n vi??n ph??? tr??ch'
												icon='PersonCircle'
												iconColor='info'
												isScrollable
												data={task?.users?.map((user, index) => {
													if (index === 0) {
														return {
															icon: 'TrendingFlat',
															color: 'info',
															children: (
																<div className='fw-bold fs-5 mb-1'>
																	{user?.name}{' '}
																	<i className='d-block'>
																		(Ch???u tr??ch nhi???m)
																	</i>
																</div>
															),
														};
													}
													return {
														icon: 'TrendingFlat',
														color: 'info',
														children: (
															<div className='fw-bold fs-5 mb-1'>
																{user?.name}
															</div>
														),
													};
												})}
											/>
										</div>
										<div className='col-md-7'>
											<Card className='h-100'>
												<CardHeader className='py-2'>
													<CardLabel
														icon='DoubleArrow'
														iconColor='success'>
														<CardTitle>Th???ng k?? c??ng vi???c</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody className='py-2'>
													<ReportCommon
														col={4}
														data={[
															{
																label: 'T???ng s??? ?????u vi???c',
																value: taskReport.total,
															},
															{
																label: '???? ho??n th??nh',
																value: taskReport.completed,
															},
															{
																label: '??ang th???c hi???n',
																value: taskReport.inprogress,
															},
															{
																label: 'Ch??? x??t duy???t',
																value: taskReport.solved,
															},
															{
																label: 'Ch??? ch???p nh???n',
																value: taskReport.pending,
															},
															{
																label: 'T??? ch???i',
																value: taskReport.rejected,
															},
															{
																label: 'Hu???',
																value: taskReport.cancel,
															},
															{
																label: '????ng',
																value: taskReport.closed,
															},
															{
																label: 'T???m d???ng',
																value: taskReport.onhold,
															},
														]}
													/>
													{subtasks?.length > 0 ? (
														<div className='row align-items-center'>
															<div
																className='col-xl-12 col-md-12'
																style={{ marginTop: '25%' }}>
																<Chart
																	series={state?.series}
																	options={state?.options}
																	type={chartOptions.chart.type}
																	height={
																		state?.options?.chart
																			?.height
																	}
																/>
															</div>
														</div>
													) : (
														<div
															className='row align-items-center'
															style={{ opacity: 0.5 }}>
															<div className='col-xl-12 col-md-12'>
																<center>
																	<div
																		className={styles.circle}
																	/>
																	<br />
																	<h2>
																		Ch??a c?? c??ng vi???c cho m???c
																		ti??u n??y
																	</h2>
																</center>
															</div>
														</div>
													)}
												</CardBody>
											</Card>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-lg-4'>
							<Card className='mb-4 h-100 shadow-3d-info'>
								<CardInfoCommon
									className='mb-4'
									shadow='lg'
									style={{ minHeight: 220 }}
									title='Th??ng tin c??ng vi???c'
									icon='Stream'
									iconColor='primary'
									data={[
										{
											icon: 'Pen',
											color: 'primary',
											children: (
												<Popovers desc={task?.description} trigger='hover'>
													<div
														className='fs-5'
														style={{
															WebkitLineClamp: '2',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															display: '-webkit-box',
															WebkitBoxOrient: 'vertical',
														}}>
														{task?.description}
													</div>
												</Popovers>
											),
										},
										{
											icon: 'ClockHistory',
											color: 'primary',
											children: (
												<div className='fs-5'>
													<span className='me-2'>Th???i gian b???t ?????u:</span>
													{moment(
														`${task?.startDate} ${task.startTime}`,
													).format('DD-MM-YYYY, HH:mm')}
												</div>
											),
										},
										{
											icon: 'CalendarCheck',
											color: 'primary',
											children: (
												<div className='fs-5'>
													<span className='me-2'>
														Th???i h???n ho??n th??nh:
													</span>
													{moment(
														`${task?.deadlineDate} ${task.deadlineTime}`,
													).format('DD-MM-YYYY, HH:mm')}
												</div>
											),
										},
									]}
								/>
								{/* Ch??? s??? key */}

								<CardInfoCommon
									isScrollable
									className='transition-base w-100 rounded-2 mb-4'
									shadow='lg'
									style={{ minHeight: 315 }}
									title='Ch??? s??? key'
									icon='ShowChart'
									iconColor='danger'
									data={task?.keys?.map((key) => {
										return {
											icon: 'DoneAll',
											color: 'danger',
											children: (
												<div key={key?.keyName}>
													<div className='fw-bold fs-5 mb-1'>
														{key?.keyName}
													</div>
													<div className='mt-n2' style={{ fontSize: 14 }}>
														{key?.keyValue}
													</div>
												</div>
											),
										};
									})}
								/>
								<Card style={{ minHeight: '38%' }}>
									<CardHeader>
										<CardLabel icon='NotificationsActive' iconColor='warning'>
											<CardTitle tag='h4' className='h5'>
												Ho???t ?????ng g???n ????y
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody isScrollable>
										{task?.logs
											?.slice()
											.reverse()
											.map((item) => {
												return (
													<RelatedActionCommonItem
														key={item?.id}
														type={item?.type}
														time={item?.time}
														username={
															item?.user?.name
																? item?.user?.name
																: item?.user
														}
														id={item?.taskId}
														taskName={item?.taskName}
														prevStatus={item?.prevStatus}
														nextStatus={item?.nextStatus}
													/>
												);
											})}
									</CardBody>
								</Card>
							</Card>
						</div>
					</div>

					{/* T???ng k???t */}
					<Card>
						<Tabs defaultActiveKey='DetailSubtask' id='uncontrolled-tab-example'>
							<Tab
								eventKey='DetailSubtask'
								title={`Danh s??ch ?????u vi???c (${
									subtasks?.filter((item) => item.status !== 3).length
								})`}
								className='mb-3'>
								{/* Danh s??ch ?????u vi???c */}
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh s??ch ?????u vi???c</CardLabel>
										</CardTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<Button
											color='success'
											size='lg'
											isLight
											className='w-30 h-100'
											onClick={() => handleOnClickToActionPage(task.id)}
											icon='AddCircle'>
											Th??m ?????u vi???c
										</Button>,
										['admin', 'manager', 'user'],
									)}
								</CardHeader>
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columns}
										data={subtasks?.filter(
											(item) =>
												item.status === 0 ||
												item.status === 1 ||
												item.status === 2 ||
												item.status === 4 ||
												item.status === 5 ||
												item.status === 6 ||
												item.status === 7 ||
												item.status === 8,
										)}
									/>
								</div>
								<div className='p-4'>
									{!subtasks?.filter((item) => item.status !== 3)?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Kh??ng c?? ?????u vi???c thu???c c??ng vi???c n??y!
										</Alert>
									)}
								</div>
							</Tab>
							<Tab
								eventKey='SubmitSubtask'
								title={`?????u vi???c ch??? x??c nh???n (${
									subtasks?.filter((item) => item.status === 3).length
								})`}>
								<CardHeader>
									<CardLabel icon='ContactSupport' iconColor='secondary'>
										<CardTitle tag='h4' className='h5'>
											?????u vi???c ch??? x??c nh???n
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columnsPending}
										data={subtasks?.filter((item) => item.status === 3)}
									/>
								</div>
								<div className='p-4'>
									{!subtasks?.filter((item) => item.status === 3)?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Kh??ng c?? ?????u vi???c ??ang ch??? x??c nh???n!
										</Alert>
									)}
								</div>
							</Tab>
						</Tabs>
					</Card>
				</div>
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseComfirm}
					onConfirm={() => handleDelete(deletes)}
					title='Xo?? ?????u vi???c'
					content={`X??c nh???n xo?? ?????u vi???c <strong>${deletes?.name}</strong> ?`}
				/>
				<TaskDetailForm
					show={editModalStatus}
					item={itemEdit}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitSubTaskForm}
				/>
				<TaskFormModal
					show={editModalTaskStatus}
					onClose={handleCloseEditTaskForm}
					onSubmit={handleSubmitTaskForm}
					item={taskEdit}
				/>
				<TaskAlertConfirm
					openModal={openConfirmTaskModal}
					onCloseModal={handleCloseConfirmTaskModal}
					onConfirm={() => handleDeleteTask(taskEdit?.id)}
					title='Xo?? c??ng vi???c'
					content={`X??c nh???n xo?? c??ng vi???c <strong>${taskEdit?.name}</strong> ?`}
				/>
				<ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={
						infoConfirmModalStatus.type === 1
							? handleClickChangeStatusTask
							: handleStatus
					}
					item={taskEdit}
					isShowNote={infoConfirmModalStatus.isShowNote}
					title={infoConfirmModalStatus.title}
					subTitle={infoConfirmModalStatus.subTitle}
					status={infoConfirmModalStatus.status}
				/>
				<ModalShowListCommon
					show={openListInfoModal}
					onClose={handleCloseListInfoModal}
					title='Th??ng tin ghi ch??'
					columns={[
						{
							title: 'Ghi ch??',
							id: 'note',
							key: 'note',
							type: 'text',
							align: 'left',
							render: (item) => <span className='fs-5'>{item.note}</span>,
						},
						{
							title: 'Ng??y ghi ch??',
							id: 'time',
							key: 'time',
							type: 'text',
							align: 'center',
							render: (item) => (
								<span className='fs-5'>{formatDateFromMiliseconds(item.time)}</span>
							),
						},
					]}
					data={
						task?.notes
							?.sort((a, b) => b.time - a.time)
							?.filter((note) => note.note !== '') || []
					}
				/>
			</Page>
		</PageWrapper>
	);
};
export default TaskDetailPage;
