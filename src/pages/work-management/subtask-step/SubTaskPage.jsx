import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import COLORS from '../../../common/data/enumColors';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Board from './board/Board';
import Card, {
	// CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	// CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Toasts from '../../../components/bootstrap/Toasts';
import // formatColorStatus,
// FORMAT_TASK_STATUS,
// renderStatus,
// STATUS,
'../../../utils/constants';
import { getSubTaskById, updateSubtask } from './services';
import Progress from '../../../components/bootstrap/Progress';
import Button from '../../../components/bootstrap/Button';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import useDarkMode from '../../../hooks/useDarkMode';
import Chart from '../../../components/extras/Chart';
import { deleteSubtask } from '../TaskDetail/services';
import ComfirmSubtask from '../TaskDetail/TaskDetailForm/ComfirmSubtask';
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import Popovers from '../../../components/bootstrap/Popovers';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
// import Icon from '../../../components/icon/Icon';
// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../components/bootstrap/Dropdown';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';
import ModalShowListCommon from '../../common/ComponentCommon/ModalShowListCommon';
import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';
import { demoPages } from '../../../menu';

const chartOptions = {
	chart: {
		type: 'donut',
		height: 350,
	},
	stroke: {
		width: 0,
	},
	labels: ['D??? ki???n', '??ang th???c hi???n', '???? ho??n th??nh', 'Qu?? h???n/Hu???'],
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
						fontSize: '24px',
						fontFamily: 'Poppins',
						fontWeight: 900,
						offsetY: 0,
						formatter(val) {
							return val;
						},
					},
					value: {
						show: true,
						fontSize: '16px',
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

const SubTaskPage = () => {
	const { addToast } = useToasts();
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const params = useParams(); // taskid, id
	const { id } = params;

	const [boardData, setBoardData] = useState([
		{
			id: 1,
			title: 'D??? ki???n',
			color: COLORS.INFO.name,
			icon: 'DoneOutline',
			status: 0,
			cards: [],
		},
		{
			id: 2,
			title: '??ang th???c hi???n',
			color: COLORS.PRIMARY.name,
			icon: 'PendingActions',
			status: 1,
			cards: [],
		},
		{
			id: 3,
			title: '???? ho??n th??nh',
			color: COLORS.SUCCESS.name,
			icon: 'DoneAll',
			status: 2,
			cards: [],
		},
		{
			id: 4,
			title: 'Qu?? h???n/Hu???',
			color: COLORS.DARK.name,
			icon: 'RateReview',
			status: 3,
			cards: [],
		},
	]);
	const [subtask, setSubtask] = useState({});
	const [subtaskReport, setSubtaskReport] = useState({});
	const [openConfirm, set0penConfirm] = useState(false);
	const [subTaskEdit, setSubTaskEdit] = useState({});
	const [editModalSubtaskStatus, setEditModalSubtaskStatus] = useState(false);
	const [subtaskEdit, setSubtaskEdit] = useState({});
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	const [openListInfoModal, setOpenListInfoModal] = useState(false);
	// const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
	// 	title: '',
	// 	subTitle: '',
	// 	status: null,
	// });

	const handleOnClickToEditPage = useCallback(
		(taskId, subTaskId) =>
			navigate(`${demoPages.jobsPage.subMenu.task.path}/${taskId}/cap-nhat/${subTaskId}`),
		[navigate],
	);

	async function fetchDataSubTaskById() {
		const reponse = await getSubTaskById(id);
		const result = await reponse.data;
		const subtaskRes = result?.data;
		setSubtask(result.data);
		setSubtaskReport(result.report);
		setBoardData(
			boardData.map((item) => {
				return {
					...item,
					cards: subtaskRes?.steps
						?.filter((step) => step?.status === item?.status)
						?.map((step) => {
							if (step?.status === item?.status) {
								return {
									...step,
									id: step.id,
									name: step.name,
									description: step.description,
								};
							}
							return {};
						}),
				};
			}),
		);
	}

	useEffect(() => {
		fetchDataSubTaskById();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// show toast
	const handleShowToast = (title, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={title} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleAddStepIntoSubtask = async (data) => {
		try {
			const response = await updateSubtask(data);
			const result = await response.data;
			setSubtask(result);
			setBoardData(
				boardData.map((item) => {
					return {
						...item,
						cards: result?.steps
							?.filter((step) => step?.status === item?.status)
							?.map((step) => {
								if (step?.status === item?.status) {
									return {
										...step,
										id: step.id,
										name: step.name,
										description: step.description,
									};
								}
								return {};
							}),
					};
				}),
			);
			fetchDataSubTaskById();
		} catch (error) {
			setSubtask(data);
		}
	};

	const handleClickChangeStatusSubtask = async (status, data) => {
		try {
			const subtaskClone = { ...data };
			subtaskClone.status = status;
			const response = await updateSubtask(subtaskClone);
			const result = await response.data;
			setSubtask(result);
			handleCloseConfirmStatusTask();
			handleShowToast(
				`C???p nh???t tr???ng th??i!`,
				`C???p nh???t tr???ng th??i ?????u vi???c ${result.name} th??nh c??ng!`,
			);
		} catch (error) {
			setSubtask(subtask);
		}
	};

	// Modal hi???n th??? th??ng tin note
	// const handleOpenListInfoModal = () => {
	// 	setOpenListInfoModal(true);
	// };

	const handleCloseListInfoModal = () => {
		setOpenListInfoModal(false);
	};

	// ------------			Modal confirm khi thay ?????i tr???ng th??i		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	// const handleOpenConfirmStatusTask = (item, nextStatus) => {
	// 	setOpenConfirmModalStatus(true);
	// 	setSubTaskEdit({ ...item });
	// 	setInfoConfirmModalStatus({
	// 		title: `X??c nh???n ${FORMAT_TASK_STATUS(nextStatus)} c??ng vi???c`.toUpperCase(),
	// 		subTitle: item?.name,
	// 		status: nextStatus,
	// 	});
	// };

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setSubTaskEdit(null);
	};

	// edit task
	// const handleOpenEditTask = (item) => {
	// 	setEditModalSubtaskStatus(true);
	// 	setSubtaskEdit({ ...item });
	// };
	const handleCloseEditSubtaskForm = () => {
		setEditModalSubtaskStatus(false);
		setSubtaskEdit(null);
	};
	const handleSubmitSubTaskForm = async (data) => {
		try {
			const response = await updateSubtask(data);
			const result = await response.data;
			setSubtask(result);
			handleCloseEditSubtaskForm();
			handleShowToast(
				`C???p nh???t ?????u vi???c!`,
				`?????u vi???c ${result.name} ???????c c???p nh???t th??nh c??ng!`,
			);
		} catch (error) {
			setSubtask(subtask);
			handleShowToast(`C???p nh???t ?????u vi???c`, `C???p nh???t ?????u vi???c kh??ng th??nh c??ng!`);
		}
	};

	const handleOpenConfirm = () => {
		set0penConfirm(true);
	};

	const handleCloseConfirm = () => {
		set0penConfirm(false);
	};

	const handleDeleteSubTask = async () => {
		try {
			await deleteSubtask(id);
			navigate(-1);
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u th??nh c??ng!`);
		} catch (error) {
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u th???t b???i!`);
		}
	};
	return (
		<PageWrapper title={subtask?.name}>
			<SubHeaderCommon />
			<Page container='fluid' className='overflow-hidden'>
				<div className='col-12'>
					<div className='d-flex justify-content-between align-items-center'>
						<div className='display-4 fw-bold py-3'>{subtask?.name}</div>
						<div>
							<Button
								isOutline={!darkModeStatus}
								color='primary'
								isLight={darkModeStatus}
								className='text-nowrap mx-2'
								icon='Edit'
								isDisable={subtask?.status === 4 || subtask?.status === 7}
								onClick={() => handleOnClickToEditPage(subtask.taskId, params.id)}>
								S???a
							</Button>
							<Button
								isOutline={!darkModeStatus}
								color='danger'
								isLight={darkModeStatus}
								className='text-nowrap mx-2'
								icon='Trash'
								onClick={handleOpenConfirm}>
								Xo??
							</Button>
						</div>
					</div>
				</div>
				<div className='row mb-4'>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary h-100 mb-0 pb-0'>
							<CardHeader className='py-2'>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										T???ng k???t
									</CardTitle>
								</CardLabel>
								{/* <CardActions className='d-flex'>
									<Dropdown>
										<DropdownToggle hasIcon={false}>
											<Button
												color='danger'
												icon='Report'
												className='text-nowrap'>
												C???p nh???t tr???ng th??i ?????u vi???c
											</Button>
										</DropdownToggle>
										<DropdownMenu>
											{Object.keys(renderStatus(subtask?.status)).map(
												(key) => (
													<DropdownItem
														key={key}
														onClick={() =>
															handleOpenConfirmStatusTask(
																subtask,
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
								</CardActions> */}
							</CardHeader>
							<CardBody className='py-2'>
								<div className='row h-100'>
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
															subtask?.status,
														)}`}>
														{FORMAT_TASK_STATUS(subtask?.status)}
													</CardSubTitle> */}
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col-12 text-start'>
														<div className='fw-bold fs-3 mb-0'>
															{subtaskReport.progress}%
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															tr??n t???ng s??? {subtaskReport.total} b?????c
														</div>
														<Progress
															isAutoColor
															value={subtaskReport.progress}
															height={10}
															size='lg'
														/>
													</div>
												</div>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col col-sm-6 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{subtask.kpiValue}
														</div>
														<div className='text-muted'>
															Gi?? tr??? KPI
														</div>
													</div>
													<div className='col col-sm-6 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{subtaskReport.completeKPI}
														</div>
														<div className='text-muted'>
															KPI th???c t??? ?????t ???????c
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<CardInfoCommon
											className='mb-4 pb-4'
											shadow='lg'
											style={{ minHeight: 320 }}
											title='Ph??ng ban ph??? tr??ch'
											icon='LayoutTextWindow'
											iconColor='info'
											data={subtask?.departments?.map((department, index) => {
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
											})}
										/>
										<CardInfoCommon
											className='mb-4 pb-4'
											shadow='lg'
											style={{ minHeight: 320 }}
											title='Nh??n vi??n ph??? tr??ch'
											icon='PersonCircle'
											iconColor='info'
											isScrollable
											data={subtask?.users?.map((user, index) => {
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
												<CardLabel icon='DoubleArrow' iconColor='success'>
													<CardTitle>Th???ng k?? ?????u vi???c</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												<ReportCommon
													data={[
														{
															label: 'T???ng s??? b?????c',
															value: subtaskReport.total,
														},
														{
															label: 'D??? ki???n',
															value: subtaskReport.expected,
														},
														{
															label: '???? ho??n th??nh',
															value: subtaskReport.completed,
														},
														{
															label: '??ang th???c hi???n',
															value: subtaskReport.inprogress,
														},
														{
															label: 'Hu???/Qu?? h???n',
															value: subtaskReport.cancel,
														},
													]}
												/>
												{subtask?.steps?.length > 0 ? (
													<div className='row align-items-center'>
														<div className='col-xl-12 col-md-12'>
															<Chart
																series={[
																	subtaskReport.expected,
																	subtaskReport.inprogress,
																	subtaskReport.completed,
																	subtaskReport.cancel,
																]}
																options={chartOptions}
																type={chartOptions.chart.type}
																height={chartOptions.chart.height}
															/>
														</div>
													</div>
												) : null}
											</CardBody>
										</Card>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-4'>
						<Card className='mb-0 h-100 shadow-3d-info'>
							<CardInfoCommon
								className='mb-4'
								shadow='lg'
								style={{ minHeight: 220 }}
								title='Th??ng tin ?????u vi???c'
								icon='Stream'
								iconColor='primary'
								data={[
									{
										icon: 'Pen',
										color: 'primary',
										children: (
											<Popovers desc={subtask?.description} trigger='hover'>
												<div
													className='fs-5'
													style={{
														WebkitLineClamp: 2,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														WebkitBoxOrient: 'vertical',
													}}>
													{subtask?.description}
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
													`${subtask?.startDate} ${subtask.startTime}`,
												).format('DD-MM-YYYY, HH:mm')}
											</div>
										),
									},
									{
										icon: 'CalendarCheck',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Th???i h???n ho??n th??nh:</span>
												{moment(
													`${subtask?.deadlineDate} ${subtask.deadlineTime}`,
												).format('DD-MM-YYYY, HH:mm')}
											</div>
										),
									},
								]}
							/>
							{/* Ch??? s??? key */}
							<CardInfoCommon
								className='transition-base w-100 rounded-2 mb-4'
								shadow='lg'
								style={{ minHeight: 250 }}
								title='Ch??? s??? key'
								icon='ShowChart'
								iconColor='danger'
								data={subtask?.keys?.map((key) => {
									return {
										icon: 'DoneAll',
										color: 'danger',
										children: (
											<>
												<div className='fw-bold fs-5 mb-1'>
													{key?.keyName}
												</div>
												<div className='mt-n2' style={{ fontSize: 14 }}>
													{key?.keyValue}
												</div>
											</>
										),
									};
								})}
							/>
							<Card className='h-100 mb-0' shadow='lg'>
								<CardHeader className='py-2'>
									<CardLabel icon='NotificationsActive' iconColor='warning'>
										<CardTitle tag='h4' className='h5'>
											Ho???t ?????ng g???n ????y
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='py-2'>
									{subtask?.logs
										?.slice()
										.reverse()
										.map((item) => (
											<RelatedActionCommonItem
												key={item?.id}
												type={item?.type}
												time={moment(`${item?.time}`).format(
													'DD/MM/YYYY HH:mm',
												)}
												username={
													item?.user?.name ? item?.user?.name : item?.user
												}
												id={item?.subtaskId}
												taskName={item?.subtaskName}
												prevStatus={item?.prevStatus}
												nextStatus={item?.nextStatus}
											/>
										))}
								</CardBody>
							</Card>
						</Card>
					</div>
				</div>
				<div className='row pt-4 mt-4'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Th??ng tin c??c b?????c</div>
					</div>
				</div>
				<div className='row mt-4'>
					<div className='col-12'>
						<Board
							subtask={subtask}
							onAddStep={handleAddStepIntoSubtask}
							data={boardData}
							setData={setBoardData}
						/>
					</div>
				</div>
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseConfirm}
					onConfirm={() => handleDeleteSubTask(subtask)}
					title='Xo?? ?????u vi???c'
					content={`X??c nh???n xo?? ?????u vi???c <strong>${subtask?.name}</strong> ?`}
				/>
				<TaskDetailForm
					show={editModalSubtaskStatus}
					item={subtaskEdit}
					onClose={handleCloseEditSubtaskForm}
					onSubmit={handleSubmitSubTaskForm}
				/>
				<ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={handleClickChangeStatusSubtask}
					item={subTaskEdit}
					// title={infoConfirmModalStatus.title}
					// subTitle={infoConfirmModalStatus.subTitle}
					// status={infoConfirmModalStatus.status}
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
								<span className='fs-5'>
									{new Date(item.time).toLocaleDateString()}
								</span>
							),
						},
					]}
					data={
						subtask?.notes
							?.sort((a, b) => b.time - a.time)
							?.filter((note) => note.note !== '') || []
					}
				/>
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
