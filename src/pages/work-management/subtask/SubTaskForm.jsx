import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import { OffCanvasTitle } from '../../../components/bootstrap/OffCanvas';
import USERS from '../../../common/data/userDummyData';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import Popovers from '../../../components/bootstrap/Popovers';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';

const SubTaskForm = ({
	setUpcomingEventsEditOffcanvas = Function,
	upcomingEventsEditOffcanvas = false,
	handleUpcomingEdit = Function,
	titleModal = '',
}) => {
	const formik = useFormik({
		initialValues: {
			workName: 'Công việc hàng ngày',
			workCategory: 'Công việc Marketing',
			department: 'Phòng Marketing',
			employee: `${USERS.EMPLOYEETEST.fullname}`,
			kpiPoint: 200,
			location: 'Maryland',
			estimateDate: moment().add(1, 'days').format('YYYY-MM-DD'),
			estimateTime: '10:30',
			deadlineDate: moment().add(2, 'days').format('YYYY-MM-DD'),
			deadlineTime: '10:30',
			note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut nisi odio. Nam sit amet pharetra enim. Nulla facilisi. Nunc dictum felis id massa mattis pretium. Mauris at blandit orci. Nunc vulputate vulputate turpis vitae cursus. In sit amet turpis tincidunt, interdum ex vitae, sollicitudin massa. Maecenas eget dui molestie, ullamcorper ante vel, tincidunt nisi. Donec vitae pulvinar risus. In ultricies nisl ac massa malesuada, vel tempus neque placerat.',
			notify: true,
		},
	});
	return (
		<Modal
			setIsOpen={setUpcomingEventsEditOffcanvas}
			isOpen={upcomingEventsEditOffcanvas}
			titleId='upcomingEdit'
			isCentered
			isScrollable
			size='lg'>
			<ModalHeader setIsOpen={setUpcomingEventsEditOffcanvas}>
				<OffCanvasTitle id='upcomingEdit'>{titleModal}</OffCanvasTitle>
			</ModalHeader>
			<ModalBody>
				<div className='row g-4'>
					<div className='col-12'>
						<FormGroup id='workName' label='Tên công việc' isFloating>
							<Input
								placeholder='Tên công việc'
								onChange={formik.handleChange}
								value={formik.values.workName}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='workCategory' label='Thuộc công việc' isFloating>
							<Input
								placeholder='Thuộc công việc'
								onChange={formik.handleChange}
								value={formik.values.workCategory}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='department' label='Phòng ban' isFloating>
							<Input
								placeholder='Phòng ban'
								onChange={formik.handleChange}
								value={formik.values.department}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='employee' label='Nhân viên phụ trách' isFloating>
							<Input
								placeholder='Nhân viên phụ trách'
								onChange={formik.handleChange}
								value={formik.values.employee}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='kpiPoint' label='Mức điểm KPI' isFloating>
							<Input
								placeholder='Mức điểm KPI'
								onChange={formik.handleChange}
								value={formik.values.kpiPoint}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='estimateDate' label='Ngày hoàn thành ước tính' isFloating>
							<Input
								placeholder='Ngày hoàn thành ước tính'
								onChange={formik.handleChange}
								value={formik.values.estimateDate}
								type='date'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup
							id='estimateTime'
							label='Thời gian hoàn thành ước tính'
							isFloating>
							<Input
								placeholder='Thời gian hoàn thành ước tính'
								onChange={formik.handleChange}
								value={formik.values.estimateTime}
								type='time'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineDate' label='Hạn ngày hoàn thành' isFloating>
							<Input
								placeholder='Hạn ngày hoàn thành'
								onChange={formik.handleChange}
								value={formik.values.deadlineDate}
								type='date'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineTime' label='Hạn thời gian hoàn thành' isFloating>
							<Input
								placeholder='Hạn thời gian hoàn thành'
								onChange={formik.handleChange}
								value={formik.values.deadlineTime}
								type='time'
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<Card isCompact className='mb-0'>
							<CardBody>
								<FormGroup id='note' label='Ghi chú đầu việc' isFloating>
									<Textarea
										className='h-100'
										rows={12}
										placeholder='note'
										onChange={formik.handleChange}
										value={formik.values.note}
									/>
								</FormGroup>
							</CardBody>
						</Card>
					</div>
					<div className='col-12'>
						<Card isCompact className='mb-0'>
							<CardHeader>
								<CardLabel>
									<CardTitle>Thông báo khi đến hạn</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<FormGroup>
									<Checks
										id='notify'
										type='switch'
										label={
											<>
												Thông báo cho khách hàng
												<Popovers
													trigger='hover'
													desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
													<Icon
														icon='Help'
														size='lg'
														className='ms-1 cursor-help'
													/>
												</Popovers>
											</>
										}
										onChange={formik.handleChange}
										checked={formik.values.notify}
									/>
								</FormGroup>
							</CardBody>
						</Card>
					</div>
					<div className='col-12'>
						<Card isCompact className='mb-0'>
							<CardHeader>
								<CardLabel>
									<CardTitle>Tạo đầu việc</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<Button
									color='info'
									size='lg'
									isLight
									className='h-100'
									icon='AddCircle'>
									Thêm mới
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</ModalBody>
			<ModalFooter className='bg-transparent'>
				<Button color='info' className='w-100' onClick={handleUpcomingEdit}>
					Lưu lại
				</Button>
			</ModalFooter>
		</Modal>
	);
};

SubTaskForm.propTypes = {
	setUpcomingEventsEditOffcanvas: PropTypes.func,
	upcomingEventsEditOffcanvas: PropTypes.bool,
	handleUpcomingEdit: PropTypes.func,
	titleModal: PropTypes.string,
};

SubTaskForm.defaultProps = {
	setUpcomingEventsEditOffcanvas: Function,
	upcomingEventsEditOffcanvas: false,
	handleUpcomingEdit: Function,
	titleModal: '',
};

export default SubTaskForm;
