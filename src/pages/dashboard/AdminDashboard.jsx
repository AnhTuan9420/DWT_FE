import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { dashboardMenu, demoPages } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import Toasts from '../../components/bootstrap/Toasts';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Chart from '../../components/extras/Chart';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Popovers from '../../components/bootstrap/Popovers';
import Avatar from '../../components/Avatar';
import USERS from '../../common/data/userDummyData';
import useDarkMode from '../../hooks/useDarkMode';
import TaskProgress from '../work-management/task-management/TaskProgress';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Progress from '../../components/bootstrap/Progress';
import {
	addNewMission,
	deleteMissionById,
	getAllMission,
	updateMissionById,
} from '../work-management/mission/services';
import MissionAlertConfirm from '../work-management/mission/MissionAlertConfirm';
import MissionFormModal from '../work-management/mission/MissionFormModal';
import Alert from '../../components/bootstrap/Alert';

// eslint-disable-next-line react/prop-types
const AnswerCustomer = ({ id, imgWebp, img, name, job, value, color }) => {
	const [state] = useState({
		series: [value],
		options: {
			chart: {
				type: 'radialBar',
				width: 50,
				height: 50,
				sparkline: {
					enabled: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				radialBar: {
					hollow: {
						margin: 0,
						size: '50%',
					},
					track: {
						margin: 0,
					},
					dataLabels: {
						show: false,
					},
				},
			},
			stroke: {
				lineCap: 'round',
			},
			colors: [
				(color === 'primary' && process.env.REACT_APP_PRIMARY_COLOR) ||
					(color === 'secondary' && process.env.REACT_APP_SECONDARY_COLOR) ||
					(color === 'success' && process.env.REACT_APP_SUCCESS_COLOR) ||
					(color === 'info' && process.env.REACT_APP_INFO_COLOR) ||
					(color === 'warning' && process.env.REACT_APP_WARNING_COLOR) ||
					(color === 'danger' && process.env.REACT_APP_DANGER_COLOR),
			],
		},
	});
	return (
		<div className='col-12' key={id}>
			<div className='row g-2'>
				<div className='col d-flex'>
					<div className='flex-shrink-0'>
						<Avatar
							src={img}
							srcSet={imgWebp}
							size={54}
							userName={name}
							color={color}
						/>
					</div>
					<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
						<div>
							{name}
							<div className='text-muted mt-n1'>
								<small>{job}</small>
							</div>
						</div>
					</div>
				</div>
				<div className='col-auto'>
					<div className='d-flex align-items-center'>
						<Popovers desc='Remaining time' trigger='hover'>
							<span className='me-3'>%{value}</span>
						</Popovers>
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart.type}
							height={state.options.chart.height}
							width={state.options.chart.width}
							className='me-3'
						/>
						<Button
							color='info'
							isLight
							icon='ScheduleSend'
							className='text-nowrap'
							tag='a'
							href='mailto:example@site.com'>
							G???i
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const AdminDashboardPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const [missions, setMissions] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});

	const columns = [
		{
			title: 'T??n m???c ti??u',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`${demoPages.quanLyCongViec.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Th???i gian b???t ?????u',
			id: 'startTime',
			key: 'startTime',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Th???i gian k???t th??c',
			id: 'endTime',
			key: 'endTime',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Ti???n ????? m???c ti??u',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center'>
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
		},
		{
			title: 'KPI th???c t???',
			id: 'currentKPI',
			key: 'currentKPI',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI ???? ho??n th??nh',
			id: 'completeKPI',
			key: 'completeKPI',
			type: 'number',
			align: 'center',
		},
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<div className='d-flex align-items-center'>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Edit'
							onClick={() => handleOpenEditForm(item)}
						/>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Trash'
							onClick={() => handleOpenConfirmModal(item)}
						/>
					</div>,
					['admin'],
				),
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllMission();
			const result = await response.data;
			setMissions(result);
		};
		fetchData();
	}, []);

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

	// confirm modal
	const handleOpenConfirmModal = (item) => {
		setOpenConfirmModal(true);
		setItemEdit({ ...item });
	};

	const handleCloseConfirmModal = () => {
		setOpenConfirmModal(false);
		setItemEdit(null);
	};

	const handleDeleteItem = async (id) => {
		try {
			await deleteMissionById(id);
			const newState = [...missions];
			setMissions(newState.filter((item) => item.id !== id));
			handleCloseConfirmModal();
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u th??nh c??ng!`);
		} catch (error) {
			handleCloseConfirmModal();
			handleShowToast(`Xo?? m???c ti??u`, `Xo?? m???c ti??u kh??ng th??nh c??ng!`);
		}
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

	const handleSubmitMissionForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				const result = await response.data;
				const newMissions = [...missions];
				setMissions(
					newMissions.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleCloseEditForm();
				handleShowToast(
					`C???p nh???t m???c ti??u!`,
					`m???c ti??u ${result.name} ???????c c???p nh???t th??nh c??ng!`,
				);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`C???p nh???t m???c ti??u`, `C???p nh???t m???c ti??u kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				const result = await response.data;
				const newMissions = [...missions];
				newMissions.push(result);
				setMissions(newMissions);
				handleCloseEditForm();
				handleShowToast(`Th??m m???c ti??u`, `m???c ti??u ${result.name} ???????c th??m th??nh c??ng!`);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`Th??m m???c ti??u`, `Th??m m???c ti??u kh??ng th??nh c??ng!`);
			}
		}
	};

	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-12'>
						<div className='row'>
							<div className='col-xxl-7'>
								<Card stretch>
									<CardHeader>
										<CardLabel icon='ReceiptLong'>
											<CardTitle tag='h4' className='h5'>
												B??o c??o m???c ti??u
											</CardTitle>
											<CardSubTitle tag='h5' className='h6'>
												B??o c??o
											</CardSubTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row'>
											<div className='col-xl-12 col-xxl-12'>
												<TaskProgress />
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
							<div className='col-xxl-5'>
								<Card stretch>
									<CardHeader>
										<CardLabel icon='ContactSupport' iconColor='secondary'>
											<CardTitle tag='h4' className='h5'>
												Ch??? c??u tr??? l???i
											</CardTitle>
											<CardSubTitle tag='h5' className='h6'>
												Kh??ch h??ng
											</CardSubTitle>
										</CardLabel>
										<CardActions>
											<Dropdown>
												<DropdownToggle hasIcon={false}>
													<Button
														color={darkModeStatus ? 'light' : 'dark'}
														isLink
														hoverShadow='default'
														icon='MoreHoriz'
														aria-label='More Actions'
													/>
												</DropdownToggle>
												<DropdownMenu isAlignmentEnd>
													<DropdownItem>
														<Button
															icon='Send'
															tag='a'
															href='mailto:example@site.com'>
															G???i
														</Button>
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
										</CardActions>
									</CardHeader>
									<CardBody>
										<div className='row g-3'>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={43}
											/>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={35}
											/>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={27}
											/>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={15}
											/>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={12}
											/>
											<AnswerCustomer
												id={USERS.EMPLOYEETEST.id}
												img={USERS.EMPLOYEETEST.src}
												imgWebp={USERS.EMPLOYEETEST.srcSet}
												name={`${USERS.EMPLOYEETEST.fullname}`}
												color={USERS.EMPLOYEETEST.color}
												job='a@doppelherz.vn'
												value={12}
											/>
										</div>
									</CardBody>
								</Card>
							</div>
							<div className='col-xxl-12 col-xl-12'>
								<Card>
									<CardHeader>
										<CardLabel icon='Task' iconColor='danger'>
											<CardTitle>
												<CardLabel>Danh s??ch m???c ti??u</CardLabel>
											</CardTitle>
										</CardLabel>
										{verifyPermissionHOC(
											<CardActions>
												<Button
													color='info'
													icon='Plus'
													tag='button'
													onClick={() => handleOpenEditForm(null)}>
													Th??m m???c ti??u
												</Button>
											</CardActions>,
											['admin'],
										)}
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={missions}
										/>
									</div>
									{!missions?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Kh??ng c?? m???c ti??u!
										</Alert>
									)}
								</Card>
							</div>
						</div>
					</div>
				</div>
				<MissionAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleDeleteItem(itemEdit?.id)}
					title='Xo?? m???c ti??u'
					content={`X??c nh???n xo?? m???c ti??u <strong>${itemEdit?.name}</strong> ?`}
				/>
				<MissionFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitMissionForm}
					item={itemEdit}
				/>
			</Page>
		</PageWrapper>
	);
};

export default AdminDashboardPage;
