import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from '../../components/bootstrap/Card';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog, getWorktrackById, updateWorktrackLog } from './services';
import { fetchWorktrackListAll } from '../../redux/slice/worktrackSlice';
import Toasts from '../../components/bootstrap/Toasts';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import { updateStatusWorktrack } from '../pendingWorktrack/services';

const styleHead = {
	border: '1px solid #c8c7c7',
	width: '100%',
	height: '75px',
	padding: '15px',
};

const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
		});
	}
	return result;
};

const renderColor = (status) => {
	switch (status) {
		case 'inProgress':
			return '#ffc000';
		case 'completed':
			return '#c5e0b3';
		case 'expired':
			return '#f97875';
		default:
			return 'transparent';
	}
};

const DailyWorktrackingModal = ({ data, show, handleClose }) => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const [worktrack, setWorktrack] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [dataShow, setDataShow] = useState({
		row: {},
		column: {},
		valueForm: {},
	});

	async function getById(id) {
		getWorktrackById(id)
			.then((res) => setWorktrack(res.data.data))
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	}

	useEffect(() => {
		if (!_.isEmpty(data)) {
			getById(data.id);
		}
	}, [data, data.id]);

	const handleShowToast = (title, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={title} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: false,
			},
		);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setDataShow({
			valueForm: {},
			row: {},
		});
	};

	const handleShowForm = (row, item) => {
		setShowForm(true);
		setDataShow({
			valueForm: item,
			row,
		});
	};

	const handleSubmit = (item) => {
		const dataSubmit = {
			id: item.data?.row?.id,
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			workTrack_id: data.id,
		};
		if (item?.data?.row?.id) {
			updateWorktrackLog(dataSubmit)
				.then(() => {
					handleCloseForm();
					dispatch(fetchWorktrackListAll());
					getById(worktrack.id);
					handleShowToast(
						`X??c nh???n nh???t tr??nh c??ng vi???c`,
						`X??c nh???n nh???t tr??nh c??ng vi???c th??nh c??ng!`,
						'Warning',
						'danger',
						// 'Check2Circle',
						// 'success',
					);
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log(err);
					handleShowToast(
						`X??c nh???n nh???t tr??nh c??ng vi???c`,
						`X??c nh???n nh???t tr??nh c??ng vi???c kh??ng th??nh c??ng!`,
						'Warning',
						'danger',
					);
				});
		} else {
			addWorktrackLog(dataSubmit)
				.then(() => {
					handleCloseForm();
					getById(worktrack.id);
					dispatch(fetchWorktrackListAll());
					handleShowToast(
						`X??c nh???n nh???t tr??nh c??ng vi???c`,
						`X??c nh???n nh???t tr??nh c??ng vi???c th??nh c??ng!`,
					);
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log(err);
					handleShowToast(
						`X??c nh???n nh???t tr??nh c??ng vi???c`,
						`X??c nh???n nh???t tr??nh c??ng vi???c kh??ng th??nh c??ng!`,
						'Warning',
						'danger',
					);
				});
		}
	};

	const handleChangeStatus = (worktrackSubmit) => {
		const dataSubmit = {
			id: worktrackSubmit?.id,
			status: 'completed',
		};
		updateStatusWorktrack(dataSubmit)
			.then(() => {
				dispatch(fetchWorktrackListAll());
				getById(worktrack.id);
				handleShowToast(
					`X??c nh???n ho??n th??nh c??ng vi???c`,
					`X??c nh???n ho??n th??nh c??ng vi???c th??nh c??ng!`,
				);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
				handleShowToast(
					`X??c nh???n ho??n th??nh c??ng vi???c`,
					`X??c nh???n ho??n th??nh c??ng vi???c kh??ng th??nh c??ng!`,
					'Warning',
					'danger',
				);
			});
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			aria-labelledby='contained-modal-title-vcenter'
			size='lg'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>
					B??o c??o c??ng vi???c: {worktrack?.kpiNorm?.name}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Card className='w-100 h-100 p-4'>
					<div
						style={styleHead}
						className='d-flex justify-content-between align-items-center'>
						<p className='m-0 d-block fs-4 fw-bold'>Nh???t tr??nh c??ng vi???c</p>
						{worktrack.status === 'accepted' && (
							<Button
								color='info'
								isOutline={!darkModeStatus}
								isLight={darkModeStatus}
								onClick={() => handleChangeStatus(worktrack)}
								isDisable={worktrack.status === 'closed'}
								className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
								icon='Check'>
								X??c nh???n ho??n th??nh
							</Button>
						)}
					</div>
					<table className='table table-modern mb-0 py-4'>
						<thead>
							<tr className='d-flex flex-wrap'>
								{columns().map((item) => {
									return (
										<th
											key={item?.day}
											style={{
												border: '1px solid #c8c7c7',
												backgroundColor: renderColor(
													worktrack?.workTrackLogs?.find(
														(i) => i?.date === item?.date,
													)?.status,
												),
												borderRadius: 0,
											}}
											onClick={() =>
												handleShowForm(
													worktrack?.workTrackLogs?.find(
														(i) => i?.date === item?.date,
													),
													item,
												)
											}
											className='text-center mb-2 rounded-none cursor-pointer'>
											<span className='d-block'>Ng??y</span>
											{item?.day}
										</th>
									);
								})}
							</tr>
						</thead>
					</table>
				</Card>
			</Modal.Body>
			<DailyWorktrackForm
				data={dataShow}
				show={showForm}
				handleClose={handleCloseForm}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	);
};

DailyWorktrackingModal.propTypes = {
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
DailyWorktrackingModal.defaultProps = {
	show: false,
	handleClose: null,
	data: null,
};

export default DailyWorktrackingModal;
