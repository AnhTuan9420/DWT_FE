/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import {
	createSearchParams,
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewTask, getAllDepartments, updateTaskByID } from '../mission/services';
import { getAllTasksByDepartment } from './services';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	formatColorPriority,
	// formatColorStatus,
	// FORMAT_TASK_STATUS,
	// renderStatusTask,
	// STATUS,
} from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
// import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import TaskFormModal from '../mission/TaskFormModal';
import MissionAlertConfirm from '../mission/MissionAlertConfirm';
import Progress from '../../../components/bootstrap/Progress';
// import ExpandRow from './ExpandRow';
import Badge from '../../../components/bootstrap/Badge';
// import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
// import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';
// import { addNewSubtask } from '../TaskDetail/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import TaskChartReport from '../../dashboard/admin/TaskChartReport';
import { getReportSubTaskDepartment, getReportTask } from '../../dashboard/services';
import Search from '../../common/ComponentCommon/Search';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';

const Item = ({
	id,
	name,
	teamName,
	percent,
	dueDate,
	departmentsRelated = [],
	usersRelated = [],
	...props
}) => {
	const navigate = useNavigate();
	const handleOnClickToProjectPage = useCallback(
		() => navigate(`${demoPages.jobsPage.subMenu.mission.path}/${id}`),
		[id, navigate],
	);
	// ph??n quy???n
	return (
		<div className='col-md-6 col-xl-4 col-sm-12' {...props}>
			<Card stretch onClick={handleOnClickToProjectPage} className='cursor-pointer'>
				<CardHeader>
					<CardLabel icon='Ballot'>
						<CardTitle>{name}</CardTitle>
						<CardSubTitle>{`Ph??? tr??ch: ${teamName}`}</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<div className='row g-2 align-items-center'>
						<div className='col-auto mb-3'>
							<span>H???n ho??n th??nh:</span>
						</div>
						<div className='col-auto mb-3'>
							<small
								style={{ fontSize: 14 }}
								className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
								{moment(`${dueDate}`).format('DD-MM-YYYY')}
							</small>
						</div>
					</div>
					{departmentsRelated?.length > 0 && (
						<div className='row g-2 align-items-center'>
							<div className='col-auto mt-2'>
								<span>Ph??ng ban:</span>
							</div>
							{departmentsRelated?.map((k, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div key={index} className='col-auto mt-2'>
									<Badge
										isLight
										color='primary'
										className='px-3 py-3'
										style={{ fontSize: 14 }}>
										{k?.name}
									</Badge>
								</div>
							))}
						</div>
					)}
					{usersRelated?.length > 0 && (
						<div className='row g-2 mt-2 align-items-center'>
							<div className='col-auto mt-2'>
								<span>Nh??n vi??n:</span>
							</div>
							{usersRelated?.map((k, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div key={index} className='col-auto mt-2'>
									<Badge
										isLight
										color='danger'
										className='px-3 py-3'
										style={{ fontSize: 14 }}>
										{k?.name}
									</Badge>
								</div>
							))}
						</div>
					)}
					<div className='row mt-2'>
						<div className='col-md-12'>
							{percent}%
							<Progress isAutoColor value={percent} height={10} />
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

const TaskListPage = () => {
	// departments
	const [dataDepartments, setDataDepartments] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [taskReport, setTaskReport] = useState({});
	const [subTaskReportDepartment, setSubTaskReportDepartment] = useState({});
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(tasks, currentPage, perPage);

	const [departmentSelect, setDepartmentSelect] = useState(1);

	// const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	// const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
	// 	title: '',
	// 	subTitle: '',
	// 	status: null,
	// 	isShowNote: false,
	// });

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { themeStatus, darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	// all department
	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllDepartments();
			const result = await response.data;
			setDataDepartments(
				result
					.reverse()
					.concat({
						id: 1,
						name: 'T???t c???',
					})
					.reverse(),
			);
		};
		fetchData();
	}, []);

	const fetchDataAllTasks = useCallback(async () => {
		const response = await getAllTasksByDepartment(departmentSelect);
		const result = await response.data;
		setTasks(result);
	}, [departmentSelect]);

	useEffect(() => {
		fetchDataAllTasks();
		const fetchDataReportTaskByDepartment = async () => {
			const response = await getReportTask({ departmentId: departmentSelect });
			const result = await response.data;
			setTaskReport(result);
		};
		fetchDataReportTaskByDepartment();
	}, [departmentSelect, fetchDataAllTasks]);

	useEffect(() => {
		const fetchDataSubtasksReportDepartment = async () => {
			const response = await getReportSubTaskDepartment();
			const result = await response.data;
			setSubTaskReportDepartment(result);
		};
		fetchDataSubtasksReportDepartment();
	}, []);

	const handleOnClickToActionPage = useCallback(
		() => navigate(`${demoPages.jobsPage.subMenu.mission.path}/them-moi`),
		[navigate],
	);

	const handleClearValueForm = () => {
		setItemEdit({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			estimateDate: moment().add(0, 'days').format('YYYY-MM-DD'),
			estimateTime: '08:00',
			deadlineDate: moment().add(0, 'days').format('YYYY-MM-DD'),
			deadlineTime: '08:00',
			status: 0,
		});
	};

	const handleOpenConfirmModal = (item) => {
		setOpenConfirmModal(true);
		setItemEdit(item);
	};

	const handleCloseConfirmModal = () => {
		setOpenConfirmModal(false);
		setItemEdit(null);
	};

	// form modal
	const handleOpenEditForm = (item) => {
		setEditModalStatus(true);
		setItemEdit({ ...item });
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
	};

	// show toast
	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleCloseItem = async (data) => {
		try {
			const res = await updateTaskByID({ ...data, status: -1 });
			const result = await res.data;
			const newTasks = [...tasks];
			setTasks(newTasks.filter((item) => item.id !== result.id));
			handleCloseConfirmModal();
			handleShowToast(`Xo?? nhi???m v???`, `Xo?? nhi???m v??? th??nh c??ng!`);
		} catch (error) {
			handleCloseConfirmModal();
			handleShowToast(`Xo?? nhi???m v???`, `Xo?? nhi???m v??? kh??ng th??nh c??ng!`);
		}
	};

	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				const newTasks = [...tasks];
				setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
				fetchDataAllTasks();
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(
					`C???p nh???t nhi???m v???!`,
					`nhi???m v??? ${result.name} ???????c c???p nh???t th??nh c??ng!`,
				);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`C???p nh???t nhi???m v???`, `C???p nh???t nhi???m v??? kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewTask(data);
				const result = await response.data;
				const newTasks = [...tasks];
				newTasks.push(result);
				setTasks(newTasks);
				fetchDataAllTasks();
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(`Th??m nhi???m v???`, `nhi???m v??? ${result.name} ???????c th??m th??nh c??ng!`);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`Th??m nhi???m v???`, `Th??m nhi???m v??? kh??ng th??nh c??ng!`);
			}
		}
	};

	// const handleUpdateStatus = async (status, data) => {
	// 	try {
	// 		const newData = { ...data };
	// 		newData.status = status;
	// 		const response = await updateTaskByID(newData);
	// 		const result = await response.data;
	// 		const newTasks = [...tasks];
	// 		setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
	// 		handleClearValueForm();
	// 		handleCloseEditForm();
	// 		handleCloseConfirmStatusTask();
	// 		handleShowToast(
	// 			`C???p nh???t tr???ng th??i nhi???m v???!`,
	// 			`nhi???m v??? ${result.name} ???????c c???p nh???t tr???ng th??i th??nh c??ng!`,
	// 		);
	// 	} catch (error) {
	// 		setTasks(tasks);
	// 		handleShowToast(
	// 			`C???p nh???t tr???ng th??i nhi???m v???`,
	// 			`C???p nh???t tr???ng th??i nhi???m v??? kh??ng th??nh c??ng!`,
	// 		);
	// 	}
	// };

	const handleClickSwitchView = (view) => {
		navigate({
			pathname: location.pathname,
			search: `?${createSearchParams({
				view,
			})}`,
		});
	};

	// ------------			Modal confirm khi thay ?????i tr???ng th??i		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	// const handleOpenConfirmStatusTask = (item, nextStatus, isShowNote = false) => {
	// 	setOpenConfirmModalStatus(true);
	// 	setItemEdit({ ...item });
	// 	setInfoConfirmModalStatus({
	// 		title: `X??c nh???n xo?? nhi???m v???`.toUpperCase(),
	// 		subTitle: item?.name,
	// 		status: nextStatus,
	// 		isShowNote,
	// 	});
	// };

	// const handleCloseConfirmStatusTask = () => {
	// 	setOpenConfirmModalStatus(false);
	// 	setItemEdit(null);
	// };

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.mission.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold pt-3'>Danh s??ch nhi???m v???</div>
							<div>
								<Button
									size='lg'
									className='rounded-0 mr-2'
									color='primary'
									icon='Table'
									onClick={() => handleClickSwitchView(1)}
								/>
								<Button
									size='lg'
									className='rounded-0 ml-2'
									color='info'
									icon='CardList'
									onClick={() => handleClickSwitchView(2)}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='my-4'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Th???ng k?? nhi???m v???
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											B??o c??o
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											{isEmpty(taskReport) ? (
												<div
													className='col-xl-12 col-xxl-12'
													style={{ textAlign: 'center' }}>
													<div style={{ height: '290px' }}>
														<Spinner
															animation='border'
															variant='primary'
															style={{
																marginTop: '15%',
																width: '50px',
																height: '50px',
															}}
														/>
													</div>
												</div>
											) : (
												<TaskChartReport data={taskReport} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin', 'manager'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='my-4'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Th???ng k?? ?????u vi???c t???ng quan
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											B??o c??o
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											{isEmpty(subTaskReportDepartment) ? (
												<div
													className='col-xl-12 col-xxl-12'
													style={{ textAlign: 'center' }}>
													<div style={{ height: '290px' }}>
														<Spinner
															animation='border'
															variant='primary'
															style={{
																marginTop: '15%',
																width: '50px',
																height: '50px',
															}}
														/>
													</div>
												</div>
											) : (
												<TaskChartReport data={subTaskReportDepartment} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager', 'admin'],
					)}
				</div>
				<div className='row'>
					<div className='col-md-12'>
						{parseInt(searchParams.get('view'), 10) === 1 ||
						!searchParams.get('view') ? (
							<Card>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh s??ch nhi???m v???</CardLabel>
										</CardTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<CardActions className='d-flex align-items-center'>
											<Button
												color='info'
												icon='Plus'
												tag='button'
												// onClick={() => handleOpenEditForm(null)}>
												onClick={handleOnClickToActionPage}>
												Th??m nhi???m v???
											</Button>
											{verifyPermissionHOC(
												<Dropdown>
													<DropdownToggle hasIcon={false}>
														<Button
															color='primary'
															icon='Circle'
															className='text-nowrap'>
															{
																dataDepartments.filter(
																	(item) =>
																		item.id ===
																		departmentSelect,
																)[0]?.name
															}
														</Button>
													</DropdownToggle>
													<DropdownMenu>
														{dataDepartments?.map((item) => (
															<DropdownItem
																key={item?.id}
																onClick={() =>
																	setDepartmentSelect(item.id)
																}>
																<div>{item?.name}</div>
															</DropdownItem>
														))}
													</DropdownMenu>
												</Dropdown>,
												['admin'],
											)}
										</CardActions>,
										['admin', 'manager'],
									)}
								</CardHeader>
								<div className='p-4'>
									<div style={{ maxWidth: '25%' }}>
										<Search />
									</div>
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th className='text-center'>STT</th>
												<th>T??n nhi???m v???</th>
												<th>Ph??ng ban ph??? tr??ch</th>
												<th>Nh??n vi??n ph??? tr??ch</th>
												<th className='text-center'>H???n ho??n th??nh</th>
												<th className='text-center'>????? ??u ti??n</th>
												<th className='text-center'>Ti???n ?????</th>
												<td />
											</tr>
										</thead>
										<tbody>
											{items?.map((item, index) => (
												<React.Fragment key={item.id}>
													<tr>
														<td>{index + 1}</td>
														<td className='cursor-pointer'>
															<Link
																className='text-underline'
																to={`${demoPages.jobsPage.subMenu.mission.path}/${item?.id}`}>
																{item?.name}
															</Link>
														</td>
														<td>{item?.departments[0]?.name}</td>
														<td>{item?.users[0]?.name}</td>
														<td align='center'>
															{moment(`${item.deadlineDate}`).format(
																'DD-MM-YYYY',
															)}
														</td>
														<td className='text-center'>
															<span
																style={{
																	paddingRight: '1rem',
																	paddingLeft: '1rem',
																}}
																className={classNames(
																	'badge',
																	'border border-2',
																	[`border-${themeStatus}`],
																	'bg-success',
																	'pt-2 pb-2 me-2',
																	`bg-${formatColorPriority(
																		item.priority,
																	)}`,
																)}>
																<span className=''>{`C???p ${item.priority}`}</span>
															</span>
														</td>
														<td className='text-center'>
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
														</td>
														<td className='text-center'>
															{verifyPermissionHOC(
																<div className='d-flex align-items-center'>
																	<Button
																		isOutline={!darkModeStatus}
																		color='success'
																		isLight={darkModeStatus}
																		className='text-nowrap mx-2'
																		icon='Edit'
																		onClick={() =>
																			navigate(
																				`${demoPages.jobsPage.subMenu.mission.path}/cap-nhat/${item.id}`,
																			)
																		}
																	/>
																	<Button
																		isOutline={!darkModeStatus}
																		color='danger'
																		isLight={darkModeStatus}
																		className='text-nowrap mx-2'
																		icon='Close'
																		onClick={() =>
																			handleOpenConfirmModal(
																				item,
																			)
																		}
																	/>
																</div>,
																['admin', 'manager'],
															)}
														</td>
													</tr>
												</React.Fragment>
											))}
										</tbody>
									</table>
									<hr />
									<footer>
										<PaginationButtons
											data={tasks}
											setCurrentPage={setCurrentPage}
											currentPage={currentPage}
											perPage={perPage}
											setPerPage={setPerPage}
										/>
									</footer>
								</div>
								{!tasks?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										Kh??ng c?? nhi???m v???!
									</Alert>
								)}
							</Card>
						) : (
							<div className='row'>
								{tasks.map((item) => {
									return (
										<Item
											key={item?.id}
											keys={item?.keys}
											departmentsRelated={item?.departments?.slice(1)}
											usersRelated={item?.users?.slice(1)}
											id={item?.id}
											name={item?.name}
											teamName={`${item?.departments[0]?.name} - ${item?.users[0]?.name}`}
											dueDate={`${item?.deadlineDate}`}
											percent={item.progress || 0}
											data-tour='project-item'
										/>
									);
								})}
								{verifyPermissionHOC(
									<div className='col-md-12 col-xl-4 col-sm-12'>
										<Card stretch>
											<CardBody className='d-flex align-items-center justify-content-center'>
												<Button
													color='info'
													size='lg'
													isLight
													className='w-100 h-100'
													icon='AddCircle'
													onClick={() => handleOpenEditForm(null)}>
													Th??m nhi???m v???
												</Button>
											</CardBody>
										</Card>
									</div>,
									['admin', 'manager'],
								)}
							</div>
						)}
					</div>
				</div>
				<MissionAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleCloseItem(itemEdit)}
					title='Xo?? nhi???m v???'
					content={`X??c nh???n xo?? nhi???m v??? <strong>${itemEdit?.name}</strong> ?`}
				/>
				<TaskFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitTaskForm}
					item={itemEdit}
					isShowMission={!itemEdit?.id}
				/>
				{/* <ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={handleUpdateStatus}
					item={itemEdit}
					isShowNote={infoConfirmModalStatus.isShowNote}
					title={infoConfirmModalStatus.title}
					subTitle={infoConfirmModalStatus.subTitle}
					status={infoConfirmModalStatus.status}
				/> */}
			</Page>
		</PageWrapper>
	);
};

export default TaskListPage;
