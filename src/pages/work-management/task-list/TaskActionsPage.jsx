import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import SelectComponent from 'react-select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewTask, getTaskById, updateTaskByID } from '../mission/services';
import Toasts from '../../../components/bootstrap/Toasts';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import Select from '../../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../../utils/constants';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';
import Icon from '../../../components/icon/Icon';
import CustomSelect from '../../../components/form/CustomSelect';
import { fetchKeyList } from '../../../redux/slice/keySlice';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import { fetchUnitList } from '../../../redux/slice/unitSlice';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import NotPermission from '../../presentation/auth/NotPermission';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskActionsPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const departments = useSelector((state) => state.department.departments);
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const missions = useSelector((state) => state.mission.missions);
	const units = useSelector((state) => state.unit.units);

	const [task, setTask] = useState({});
	const [kpiNormOptions, setKpiNormOptions] = useState([]);
	const [missionOption, setMissionOption] = useState({});
	const [unitOption, setUnitOption] = useState({});
	const [departmentOption, setDepartmentOption] = useState({ label: null, value: null });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);

	useEffect(() => {
		if (params?.id) {
			getTaskById(params.id).then((res) => {
				const response = res.data;
				setTask(response?.data);
				setMissionOption(
					{
						...response.data.mission,
						label: response.data.mission?.name,
						value: response.data.mission?.id,
					} || {},
				);
				setUnitOption(
					{
						...response.data.unit,
						label: response.data.unit?.name,
						value: response.data.unit?.id,
					} || {},
				);
				setKpiNormOptions(
					response.data?.kpiNorms?.map((item) => {
						return {
							...item,
							value: item.id,
							label: item.name,
						};
					}) || [],
				);
				setDepartmentOption({
					...response.data.departments[0],
					id: response.data.departments[0].id,
					label: response.data.departments[0].name,
					value: response.data.departments[0].id,
				});
				setUserOption({
					...response.data.users[0],
					id: response.data.users[0].id,
					label: response.data.users[0].name,
					value: response.data.users[0].id,
				});
				setDepartmentRelatedOption(
					response.data?.departments?.slice(1)?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
				setUserRelatedOption(
					response.data?.users?.slice(1)?.map((user) => {
						return {
							id: user.id,
							label: user.name,
							value: user.id,
						};
					}),
				);
			});
		} else {
			setTask({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
				startTime: '08:00',
				deadlineDate: moment().add(1, 'days').format('YYYY-MM-DD'),
				deadlineTime: '17:00',
				status: 0,
				quantity: '',
				manday: '',
			});
			setDepartmentOption({});
			setUserOption({});
			setUnitOption({});
			setDepartmentRelatedOption([]);
			setUserRelatedOption([]);
			setMissionOption({});
		}
	}, [params?.id]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKeyList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchMissionList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);

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

	const handleChange = (e) => {
		const { value, name } = e.target;
		setTask({
			...task,
			[name]: value,
		});
	};

	// th??m field nhi???m v??? ph???
	const handleAddFieldKPINorm = () => {
		const initKeyState = {};
		setKpiNormOptions((prev) => [...prev, initKeyState]);
	};

	// h??m onchange ch???n nhi???m v???
	const handleChangeKpiNormOption = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					...event,
					[event?.target?.name]: event?.target?.value,
				};
			});
		});
	};

	// xo?? c??c nhi???m v??? theo index
	const handleRemoveKpiNormField = (e, index) => {
		setKpiNormOptions((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setTask({
			id: null,
			name: '',
			description: '',
			priority: '',
			kpiValue: '',
			startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
			startTime: '08:00',
			deadlineDate: moment().add(1, 'days').format('YYYY-MM-DD'),
			deadlineTime: '17:00',
			status: 0,
			quantity: '',
			manday: '',
			review: '',
		});
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setUnitOption({});
		setUserOption({});
		setUserRelatedOption([]);
		setKpiNormOptions([]);
		setMissionOption({});
	};

	const person = window.localStorage.getItem('name');

	const handleSubmitTaskForm = async () => {
		const newWorks = JSON.parse(JSON.stringify(task?.logs || []));
		const newNotes = JSON.parse(JSON.stringify(task?.notes || []));
		const newLogs = [
			...newWorks,
			{
				user: person,
				type: 2,
				prevStatus: null,
				nextStatus: task?.id ? 'C???p nh???t' : 'Th??m m???i',
				taskId: task?.id,
				taskName: task?.name,
				time: moment().format('DD/MM/YYYY hh:mm'),
				createdAt: Date.now(),
			},
		];
		const data = { ...task };
		data.kpiValue = parseInt(task?.kpiValue, 10);
		data.priority = parseInt(task?.priority, 10);
		data.manday = parseInt(task?.manday, 10);
		data.quantity = parseInt(task?.quantity, 10);
		data.mission = missionOption?.value
			? {
					id: missionOption?.value,
					name: missionOption?.label,
			  }
			: null;
		data.missionId = missionOption?.id || null;
		data.kpiNormIds = kpiNormOptions.map((item) => item.id);
		data.kpiNorms = kpiNormOptions.map((item) => {
			return {
				name: item.name,
				id: item.id,
				manday: parseInt(item.manday, 10),
				quantity: parseInt(item.quantity, 10),
			};
		});
		data.departmentId = departmentOption.id || null;
		data.departments = [
			{
				id: departmentOption.id,
				name: departmentOption.label,
			},
			...departmentReplatedOption.map((department) => {
				return {
					id: department.id,
					name: department.label,
				};
			}),
		];
		data.userId = userOption.value || null;
		data.users = [
			{
				id: userOption.id,
				name: userOption.label,
			},
			...userReplatedOption.map((user) => {
				return {
					id: user.id,
					name: user.label,
				};
			}),
		];
		data.unitId = unitOption.id;
		data.unit = {
			id: unitOption.id,
			name: unitOption.label,
		};
		const dataSubmit = { ...data, logs: newLogs, notes: newNotes };
		if (data.id) {
			try {
				const response = await updateTaskByID(dataSubmit);
				const result = await response.data;
				handleShowToast(
					`C???p nh???t nhi???m v???!`,
					`Nhi???m v??? ${result.name} ???????c c???p nh???t th??nh c??ng!`,
				);
				navigate(-1);
			} catch (error) {
				handleShowToast(`C???p nh???t nhi???m v???`, `C???p nh???t nhi???m v??? kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewTask(dataSubmit);
				const result = await response.data;
				handleClearForm();
				navigate(-1);
				handleShowToast(`Th??m nhi???m v???`, `nhi???m v??? ${result.name} ???????c th??m th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`Th??m nhi???m v???`, `Th??m nhi???m v??? kh??ng th??nh c??ng!`);
			}
		}
	};
	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.mission.text}>
			<SubHeaderCommon />
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row mx-4 px-4 my-4'>
						<Card className='p-4 w-100 m-auto'>
							<CardHeader className='py-2'>
								<CardLabel>
									<CardTitle className='fs-4 ml-0'>Th??m nhi???m v???</CardTitle>
								</CardLabel>
							</CardHeader>
							<div className='col-12 p-4'>
								<div className='row g-4'>
									{/* T??n nhi???m v??? */}
									<div className='row g-2'>
										<div className='col-12'>
											<FormGroup id='name' label='T??n nhi???m v???'>
												<Input
													onChange={handleChange}
													value={task?.name || ''}
													name='name'
													ariaLabel='T??n nhi???m v???'
													placeholder='T??n nhi???m v???'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* Thu???c m???c ti??u */}
									<div className='row g-2'>
										<div className='col-12'>
											<FormGroup id='task' label='Thu???c m???c ti??u'>
												<SelectComponent
													placeholder='Thu???c m???c ti??u'
													defaultValue={missionOption}
													value={missionOption}
													onChange={setMissionOption}
													options={missions}
												/>
											</FormGroup>
										</div>
									</div>
									{/* M?? t??? nhi???m v??? */}
									<div className='row g-2'>
										<div className='col-12'>
											<FormGroup id='description' label='M?? t??? nhi???m v???'>
												<Textarea
													name='description'
													onChange={handleChange}
													value={task.description || ''}
													ariaLabel='M?? t??? nhi???m v???'
													placeholder='M?? t??? nhi???m v???'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* ????n v??? t??nh, s??? l?????ng */}
									<div className='row g-2'>
										<div className='col-4'>
											<FormGroup id='' label='S??? l?????ng'>
												<Input
													type='number'
													name='quantity'
													onChange={handleChange}
													value={task?.quantity || ''}
													ariaLabel='S??? l?????ng'
													placeholder='S??? l?????ng'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-4'>
											<FormGroup id='unit' label='????n v??? t??nh'>
												<SelectComponent
													style={customStyles}
													placeholder='Ch???n ????n v??? t??nh'
													defaultValue={unitOption}
													value={unitOption}
													onChange={setUnitOption}
													options={units}
												/>
											</FormGroup>
										</div>
										<div className='col-4'>
											<FormGroup id='?????c t??nh MD' label='?????c t??nh MD'>
												<Input
													type='number'
													name='manday'
													onChange={handleChange}
													value={task.manday || ''}
													ariaLabel='?????c t??nh MD'
													placeholder='?????c t??nh MD'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* Gi?? tr??? KPI - ?????c t??nh MD - ????? ??u ti??n */}
									<div className='row g-2'>
										<div className='col-4'>
											<FormGroup id='priority' label='????? ??u ti??n'>
												<Select
													name='priority'
													ariaLabel='Board select'
													className='border border-2 rounded-0 shadow-none'
													placeholder='????? ??u ti??n'
													onChange={handleChange}
													value={task?.priority}>
													{PRIORITIES.map((priority) => (
														<Option key={priority} value={priority}>
															{`C???p ${priority}`}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
										<div className='col-4'>
											<FormGroup id='kpiValue' label='Gi?? tr??? KPI'>
												<Input
													type='number'
													name='kpiValue'
													onChange={handleChange}
													value={task?.kpiValue || ''}
													ariaLabel='Gi?? tr??? KPI'
													placeholder='Gi?? tr??? KPI'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-4'>
											<FormGroup id='review' label='Th?????ng/Ph???t'>
												<Input
													onChange={handleChange}
													value={task?.review || ''}
													name='review'
													ariaLabel='Th?????ng/Ph???t'
													placeholder='Th?????ng/Ph???t'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* Ng?????i ph??? tr??ch - Ph??ng ban ph??? tr??ch - Th?????ng/Ph???t */}
									<div className='row g-2'>
										<div className='col-6'>
											<FormGroup id='userOption' label='Ngu???i ph??? tr??ch'>
												<SelectComponent
													style={customStyles}
													placeholder='Ch???n ngu???i ph??? tr??ch'
													defaultValue={userOption}
													value={userOption}
													onChange={setUserOption}
													options={users}
												/>
											</FormGroup>
										</div>
										<div className='col-6'>
											<FormGroup
												id='departmentOption'
												label='Ph??ng ban ph??? tr??ch'>
												<SelectComponent
													style={customStyles}
													placeholder='Ch???n ph??ng ban ph??? tr??ch'
													defaultValue={departmentOption}
													value={departmentOption}
													onChange={(selectedOption) => {
														setDepartmentOption(selectedOption);
														setKpiNormOptions([]);
													}}
													options={departments}
												/>
											</FormGroup>
										</div>
									</div>
									{/* Ph??ng ban h??? tr??? - Ng?????i h??? tr??? */}
									<div className='row g-2'>
										<div className='col-6'>
											<FormGroup
												id='departmentReplatedOption'
												label='Ph??ng ban h??? tr???'>
												<SelectComponent
													style={customStyles}
													placeholder=''
													defaultValue={departmentReplatedOption}
													value={departmentReplatedOption}
													onChange={setDepartmentRelatedOption}
													isDisabled={!departmentOption.value}
													options={departments.filter(
														(department) =>
															department.id !== departmentOption?.id,
													)}
													isMulti
												/>
											</FormGroup>
										</div>
										<div className='col-6'>
											<FormGroup id='userReplatedOption' label='Ng?????i h??? tr???'>
												<SelectComponent
													style={customStyles}
													placeholder=''
													defaultValue={userReplatedOption}
													value={userReplatedOption}
													onChange={setUserRelatedOption}
													isDisabled={!userOption.value}
													options={users.filter(
														(user) => user.id !== userOption?.id,
													)}
													isMulti
												/>
											</FormGroup>
										</div>
									</div>
									{/* Ghi ch?? */}
									<div className='row g-2'>
										<div className='col-12'>
											<FormGroup id='note' label='Ghi ch??'>
												<Textarea
													name='note'
													onChange={handleChange}
													value={task.note || ''}
													ariaLabel='Ghi ch??'
													placeholder='Ghi ch??'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* Th???i gian b???t ?????u - Th???i gian d??? ki???n */}
									<div className='row g-2'>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='startDate'
												label='Ng??y b???t ?????u'>
												<Input
													name='startDate'
													placeholder='Ng??y b???t ?????u'
													onChange={handleChange}
													value={task.startDate}
													type='date'
													ariaLabel='Ng??y b???t ?????u'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ms-2'
												id='startTime'
												label='Th???i gian b???t ?????u'>
												<Input
													name='startTime'
													placeholder='Th???i gian b???t ?????u'
													type='time'
													value={task.startTime || '08:00'}
													onChange={handleChange}
													ariaLabel='Th???i gian b???t ?????u'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									{/* H???n ng??y ho??n th??nh - Th???i h???n ho??n th??nh */}
									<div className='row g-2'>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='deadlineDate'
												label='H???n ng??y ho??n th??nh'>
												<Input
													name='deadlineDate'
													placeholder='H???n ng??y ho??n th??nh'
													onChange={handleChange}
													value={
														task.deadlineDate ||
														moment().add(1, 'days').format('YYYY-MM-DD')
													}
													type='date'
													ariaLabel='H???n ng??y ho??n th??nh'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ms-2'
												id='deadlineTime'
												label='H???n th???i gian ho??n th??nh'>
												<Input
													name='deadlineTime'
													placeholder='H???n th???i gian ho??n th??nh'
													type='time'
													value={task.deadlineTime || '17:30'}
													onChange={handleChange}
													ariaLabel='H???n th???i gian ho??n th??nh'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
									<div className='row g-2'>
										<div className='col-12'>
											<FormGroup>
												<Button
													color='success'
													type='button'
													className='d-block w-25 py-3'
													onClick={handleAddFieldKPINorm}>
													Th??m nhi???m v??? ph???
												</Button>
											</FormGroup>
											{/* eslint-disable-next-line no-shadow */}
											{kpiNormOptions?.map((item, index) => {
												return (
													<div
														// eslint-disable-next-line react/no-array-index-key
														key={index}
														className='row mt-4 d-flex align-items-center justify-content-between'>
														<div className='col-11'>
															<div className='w-100'>
																<FormGroup
																	className='mr-2'
																	id='name'
																	label={`Nhi???m v??? ph??? ${
																		index + 1
																	}`}>
																	<CustomSelect
																		placeholder='Ch???n nhi???m v??? ph???'
																		value={item}
																		disabled={
																			!departmentOption.value
																		}
																		onChange={(e) => {
																			handleChangeKpiNormOption(
																				index,
																				e,
																			);
																		}}
																		options={kpiNorms}
																	/>
																</FormGroup>
															</div>
														</div>
														<div className='col-1'>
															<div className='w-100'>
																<Button
																	color='light'
																	variant='light'
																	size='lg'
																	className='mt-4 h-100 bg-transparent border-0'
																	onClick={(e) =>
																		handleRemoveKpiNormField(
																			e,
																			index,
																		)
																	}>
																	<Icon icon='Trash' size='lg' />
																</Button>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
							<div className='col-12 my-4'>
								<div className='w-100 mt-4 text-center'>
									<Button
										color='primary'
										className='w-50 p-3'
										type='button'
										isDisable={!task.name}
										onClick={handleSubmitTaskForm}>
										L??u th??ng tin
									</Button>
								</div>
							</div>
						</Card>
					</div>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default TaskActionsPage;
