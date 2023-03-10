import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';
import SelectComponent from 'react-select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewSubtask, getSubTaskById, updateSubtask } from '../TaskDetail/services';
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
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { fetchKpiNormListByParams } from '../../../redux/slice/kpiNormSlice';
import Icon from '../../../components/icon/Icon';
import CustomSelect from '../../../components/form/CustomSelect';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import { fetchAllTask, fetchTaskById } from '../../../redux/slice/taskSlice';
import styles from './style.module.css';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskDetailActionPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const departments = useSelector((state) => state.department.departments);
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const tasks = useSelector((state) => state.task.tasks);
	const task = useSelector((state) => state.task.task);

	const [subtask, setSubTask] = useState({});
	const [kpiNormOptions, setKpiNormOptions] = useState([]);
	const [taskOption, setTaskOption] = useState({ label: '', value: '' });
	const [departmentOption, setDepartmentOption] = useState({ label: null, value: null });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);

	useEffect(() => {
		if (params?.id) {
			getSubTaskById(params.id).then((res) => {
				const response = res.data;
				setSubTask(response?.data);
				setTaskOption({
					...response.data.task,
					label: response.data.task?.name,
					value: response.data.task?.id,
				});
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
			setSubTask({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
				startTime: '08:00',
				deadlineDate: moment().add(1, 'days').format('YYYY-MM-DD'),
				deadlineTime: '17:00',
				status: 0,
			});
			setDepartmentOption({});
			setUserOption({});
			setDepartmentRelatedOption([]);
			setUserRelatedOption([]);
			setTaskOption({});
		}
	}, [params?.id]);

	useEffect(() => {
		dispatch(fetchTaskById(params.taskId));
	}, [dispatch, params.taskId]);

	useEffect(() => {
		if (!isEmpty(task)) {
			setTaskOption(task);
		}
	}, [task]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchAllTask());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(
			fetchKpiNormListByParams({
				departmentId: parseInt(departmentOption.value, 10),
				parentId: 'null',
			}),
		);
	}, [departmentOption.value, dispatch]);

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
		setSubTask({
			...subtask,
			[name]: value,
		});
	};

	// th??m field ?????u vi???c ph???
	const handleAddFieldKPINorm = () => {
		const initKeyState = {};
		setKpiNormOptions((prev) => [...prev, initKeyState]);
	};

	// h??m onchange ch???n ?????u vi???c
	const handleChangeKpiNormOption = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					...event,
				};
			});
		});
	};

	// h??m onchange ch???n ?????u vi???c
	const handleChangeKpiNormInput = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event?.target?.name]: event?.target?.value,
				};
			});
		});
	};

	// xo?? c??c ?????u vi???c theo index
	const handleRemoveKpiNormField = (e, index) => {
		setKpiNormOptions((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setSubTask({
			id: null,
			name: '',
			description: '',
			priority: '',
			kpiValue: '',
			startDate: '',
			startTime: '',
			deadlineDate: '',
			deadlineTime: '',
			status: 0,
		});
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setUserOption({});
		setUserRelatedOption([]);
		setKpiNormOptions([]);
		setTaskOption({});
	};

	const calcTotalKpiValue = (arr = []) => {
		let result = 0;
		arr.forEach((item) => {
			result += parseInt(item.quantity, 10) * parseInt(item.point, 10);
		});
		return result || '';
	};

	const person = window.localStorage.getItem('name');

	const handleSubmitTaskForm = async () => {
		const newWorks = JSON.parse(JSON.stringify(subtask?.logs || []));
		const newNotes = JSON.parse(JSON.stringify(subtask?.notes || []));
		const newLogs = [
			...newWorks,
			{
				user: person,
				type: 2,
				prevStatus: null,
				nextStatus: subtask?.id ? 'C???p nh???t' : 'Th??m m???i',
				subtaskId: subtask.id,
				subtaskName: subtask?.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
				createdAt: Date.now(),
			},
		];
		const data = { ...subtask };
		data.kpiValue = parseInt(subtask?.kpiValue, 10) || calcTotalKpiValue(kpiNormOptions);
		data.priority = parseInt(subtask?.priority, 10);
		data.estimateMD = parseInt(subtask?.estimateMD, 10);
		data.task = taskOption?.value
			? {
					id: taskOption?.value,
					name: taskOption?.label,
			  }
			: null;
		data.taskId = taskOption?.id || null;
		data.kpiNormIds = kpiNormOptions.map((item) => item.id);
		data.kpiNorms = kpiNormOptions.map((item) => {
			return {
				name: item.name,
				id: item.id,
				point: parseInt(item.point, 10),
				quantity: parseInt(item.quantity, 10),
				total: parseInt(item.quantity * item.point, 10),
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
		data.steps = subtask.steps ? subtask.steps : [];
		const dataSubmit = { ...data, logs: newLogs, notes: newNotes };
		if (data.id) {
			try {
				const response = await updateSubtask(dataSubmit);
				const result = await response.data;
				handleShowToast(
					`C???p nh???t ?????u vi???c!`,
					`?????u vi???c ${result.name} ???????c c???p nh???t th??nh c??ng!`,
				);
				navigate(-1);
			} catch (error) {
				handleShowToast(`C???p nh???t ?????u vi???c`, `C???p nh???t ?????u vi???c kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewSubtask(dataSubmit);
				const result = await response.data;
				handleClearForm();
				navigate(-1);
				handleShowToast(`Th??m ?????u vi???c`, `?????u vi???c ${result.name} ???????c th??m th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`Th??m ?????u vi???c`, `Th??m ?????u vi???c kh??ng th??nh c??ng!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.mission.text}>
			<SubHeaderCommon />
			<Page container='fluid'>
				<div className='row mx-4 px-4 my-4'>
					<Card className='p-4 w-75 m-auto'>
						<CardHeader className='py-2'>
							<CardLabel>
								<CardTitle className='fs-4 ml-0'>
									{params.id ? 'C???p nh???t ?????u vi???c' : 'Th??m ?????u vi???c'}
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='col-12 p-4'>
							<div className='row g-4'>
								{/* T??n ?????u vi???c */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='name' label='T??n ?????u vi???c'>
											<Input
												onChange={handleChange}
												value={subtask?.name || ''}
												name='name'
												ariaLabel='T??n ?????u vi???c'
												placeholder='T??n ?????u vi???c'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Thu???c nhi???m v??? */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='task' label='Thu???c c??ng vi???c'>
											<SelectComponent
												placeholder='Thu???c c??ng vi???c'
												defaultValue={taskOption}
												value={taskOption}
												onChange={setTaskOption}
												options={tasks}
											/>
										</FormGroup>
									</div>
								</div>
								{/* M?? t??? ?????u vi???c */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='description' label='M?? t??? ?????u vi???c'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={subtask.description || ''}
												ariaLabel='M?? t??? ?????u vi???c'
												placeholder='M?? t??? ?????u vi???c'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Gi?? tr??? KPI - ?????c t??nh MD - ????? ??u ti??n */}
								<div className='row g-2'>
									<div className='col-4'>
										<FormGroup id='kpiValue' label='Gi?? tr??? KPI'>
											<Input
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={
													subtask.kpiValue ||
													calcTotalKpiValue(kpiNormOptions)
												}
												ariaLabel='Gi?? tr??? KPI'
												placeholder='Gi?? tr??? KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup id='?????c t??nh MD' label='?????c t??nh MD'>
											<Input
												type='number'
												name='estimateMD'
												onChange={handleChange}
												value={subtask.estimateMD || ''}
												ariaLabel='?????c t??nh MD'
												placeholder='?????c t??nh MD'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup id='review' label='Th?????ng/Ph???t'>
											<Input
												onChange={handleChange}
												value={subtask?.review || ''}
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
									<div className='col-4'>
										<FormGroup id='priority' label='????? ??u ti??n'>
											<Select
												name='priority'
												ariaLabel='Board select'
												className='border border-2 rounded-0 shadow-none'
												placeholder='????? ??u ti??n'
												onChange={handleChange}
												value={subtask?.priority}>
												{PRIORITIES.map((priority) => (
													<Option key={priority} value={priority}>
														{`C???p ${priority}`}
													</Option>
												))}
											</Select>
										</FormGroup>
									</div>
									<div className='col-4'>
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
									<div className='col-4'>
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
												value={subtask.note || ''}
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
												value={
													subtask.startDate ||
													moment().add(0, 'days').format('YYYY-MM-DD')
												}
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
												value={subtask.startTime || '08:00'}
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
													subtask.deadlineDate ||
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
												value={subtask.deadlineTime || '17:30'}
												onChange={handleChange}
												ariaLabel='H???n th???i gian ho??n th??nh'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Danh m???c ?????nh m???c KPI */}
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
													<div className='col-5'>
														<div className='w-100'>
															<FormGroup
																className='mr-2'
																id='name'
																label={`Nhi???m v??? ph??? ${index + 1}`}>
																<CustomSelect
																	placeholder='Ch???n nhi???m v??? ph???'
																	value={item}
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
													<div className='col-3'>
														<FormGroup
															className='ml-2'
															id='quantity'
															label='S??? l?????ng'>
															<Input
																onChange={(e) =>
																	handleChangeKpiNormInput(
																		index,
																		e,
																	)
																}
																min={0}
																disabled={!item.value}
																type='number'
																value={item?.quantity || ''}
																name='quantity'
																size='lg'
																ariaLabel='S??? l?????ng'
																className='border border-2 rounded-0 shadow-none'
																placeholder='S??? l?????ng'
															/>
														</FormGroup>
													</div>
													<div className='col-3'>
														<FormGroup
															className='ml-2'
															id='total'
															label='Quy ?????i (??i???m)'>
															<div
																className={`${styles.total} form-control`}>
																{parseInt(
																	item.quantity * item.point,
																	10,
																) || 0}
															</div>
														</FormGroup>
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
									isDisable={!subtask.name}
									onClick={handleSubmitTaskForm}>
									L??u th??ng tin
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TaskDetailActionPage;
