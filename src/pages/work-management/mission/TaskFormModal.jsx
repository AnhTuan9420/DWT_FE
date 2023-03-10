/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button, Modal } from 'react-bootstrap';
import SelectComponent from 'react-select';
import styled from 'styled-components';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Option from '../../../components/bootstrap/Option';
import Icon from '../../../components/icon/Icon';
import { PRIORITIES } from '../../../utils/constants';
import { getAllDepartments, getAllKeys, getAllMission, getAllUser, getTaskById } from './services';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '4px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskFormModal = ({ show, onClose, item, onSubmit, isShowMission }) => {
	const [task, setTask] = useState({});
	const [keysState, setKeysState] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [users, setUsers] = useState([]);
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);
	const [missionOptions, setMissionOptions] = useState([]);
	const [valueMission, setValueMisson] = useState({});
	const [keyOption, setKeyOption] = useState([]);
	const [errors, setErrors] = useState({
		name: { error: false, errorMsg: '' },
		kpiValue: { error: false, errorMsg: '' },
		priority: { error: false, errorMsg: '' },
		departmentOption: { error: false, errorMsg: '' },
		userOption: { error: false, errorMsg: '' },
	});

	const nameRef = useRef(null);
	const kpiValueRef = useRef(null);
	const priorityRef = useRef(null);
	const departmentRef = useRef(null);
	const userRef = useRef(null);

	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};

	const validateFieldForm = (field, value) => {
		if (value === '' || !value || value === false) {
			onValidate(true, field);
		}
	};

	const validateForm = () => {
		validateFieldForm('name', task?.name);
		validateFieldForm('kpiValue', task?.kpiValue);
		validateFieldForm('kpiValue', parseInt(task?.kpiValue, 10) > 0);
		validateFieldForm('priority', task?.priority);
		validateFieldForm('departmentOption', departmentOption?.value);
		validateFieldForm('userOption', userOption?.value);
	};

	const handleClearErrorMsgAfterChange = (name) => {
		if (task?.[name] || departmentOption?.value || userOption?.value) {
			setErrors((prev) => ({
				...prev,
				[name]: { ...prev[name], errorMsg: '' },
			}));
		}
	};

	useEffect(() => {
		handleClearErrorMsgAfterChange('name');
		handleClearErrorMsgAfterChange('kpiValue');
		handleClearErrorMsgAfterChange('priority');
		handleClearErrorMsgAfterChange('departmentOption');
		handleClearErrorMsgAfterChange('userOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task?.name, task?.kpiValue, task?.priority, departmentOption?.value, userOption?.value]);

	useEffect(() => {
		if (item?.id) {
			getTaskById(item?.id).then((res) => {
				const response = res.data;
				setTask(response?.data);
				setKeysState(response.data?.keys || []);
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
				estimateDate: '',
				estimateTime: '',
				deadlineDate: '',
				deadlineTime: '',
				status: 0,
			});
			setKeysState([]);
			setDepartmentOption({});
			setUserOption({});
			setDepartmentRelatedOption([]);
			setUserRelatedOption([]);
		}
	}, [item?.id]);

	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
				const data = await response.data;
				setDepartments(
					data.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
			} catch (error) {
				setDepartments([]);
			}
		}
		getDepartments();
	}, []);

	useEffect(() => {
		async function getUsers() {
			try {
				const response = await getAllUser();
				const data = await response.data;
				setUsers(
					data.map((user) => {
						return {
							id: user.id,
							label: user.name,
							value: user.id,
						};
					}),
				);
			} catch (error) {
				setUsers([]);
			}
		}
		getUsers();
	}, []);

	useEffect(() => {
		getAllMission().then((res) => {
			setMissionOptions(
				res.data.map((mission) => {
					return {
						id: mission.id,
						label: mission.name,
						value: mission.id,
					};
				}),
			);
		});
	}, []);
	useEffect(() => {
		async function getKey() {
			try {
				const response = await getAllKeys();
				const data = await response.data;
				setKeyOption(data);
			} catch (error) {
				setKeyOption([]);
			}
		}
		getKey();
	}, []);
	// h??m validate cho dynamic field form
	const prevIsValid = () => {
		if (keysState?.length === 0 || keysState === null) {
			return true;
		}
		const someEmpty = keysState?.some(
			(key) => key.keyName === '' || key.keyValue === '' || key.keyType === '',
		);

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].keyName === '') {
					allPrev[index].error.keyName = 'Nh???p T??n ch??? s??? ????nh gi??!';
				}
				if (keysState[index].keyValue === '') {
					allPrev[index].error.keyValue = 'Nh???p gi?? tr???!';
				}
				if (keysState[index].keyType === '') {
					allPrev[index].error.keyType = 'Nh???p lo???i key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};

	// th??m field cho c??c gi?? tr??? key
	const handleAddFieldKey = () => {
		const initKeyState = {
			keyName: '',
			keyValue: '',
			keyType: '',
			error: {
				keyName: null,
				keyValue: null,
				keyType: null,
			},
		};
		if (prevIsValid() && keysState?.length <= 3) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};

	const handleChange = (e) => {
		const { value, name } = e.target;
		setTask({
			...task,
			[name]: value,
		});
	};

	// h??m onchange cho input key
	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0 ? null : `Vui l??ng nh???p ?????u ????? th??ng tin`,
					},
				};
			});
		});
	};

	// xo?? c??c key theo index
	const handleRemoveKeyField = (e, index) => {
		setKeysState((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setTask({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			estimateDate: '',
			estimateTime: '08:00',
			deadlineDate: '',
			deadlineTime: '08:00',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setUserOption({});
		setUserRelatedOption([]);
	};

	// close form
	const handleCloseForm = () => {
		onClose();
		setTask({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			estimateDate: '',
			estimateTime: '08:00',
			deadlineDate: '',
			deadlineTime: '17:00',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({ label: '', value: '' });
		setUserOption({ label: '', value: '' });
		setDepartmentRelatedOption([]);
		setUserRelatedOption([]);
		setErrors({});
	};
	const person = window.localStorage.getItem('name');
	const handleSubmit = () => {
		validateForm();
		if (!task?.name) {
			nameRef.current.focus();
			return;
		}
		if (parseInt(task?.kpiValue, 10) <= 0) {
			kpiValueRef.current.focus();
			return;
		}
		if (!task?.priority) {
			priorityRef.current.focus();
			return;
		}
		if (!departmentOption?.value) {
			departmentRef.current.focus();
			return;
		}
		if (!userOption?.value) {
			userRef.current.focus();
			return;
		}
		if (!prevIsValid()) {
			return;
		}
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
		data.keys = keysState.map((key) => {
			return {
				keyName: key.keyName,
				keyValue: key.keyValue,
				keyType: key.keyType,
			};
		});
		data.missionId = valueMission.id || null;
		data.departmentId = departmentOption.id;
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
		data.userId = userOption.value;
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
		const newData = { ...data, logs: newLogs, notes: newNotes };
		onSubmit(newData);
		handleClearForm();
	};
	const compare = ['>', '=', '<', '<=', '>='];
	return (
		<Modal show={show} onHide={handleCloseForm} size='lg' scrollable centered>
			<Modal.Header closeButton>
				<Modal.Title>{item?.id ? 'C???p nh???t c??ng vi???c' : 'Th??m m???i c??ng vi???c'}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-md-12'>
						<form>
							<Card shadow='sm'>
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>Th??ng tin c??ng vi???c</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup
											color='red'
											className='col-12'
											id='name'
											label='T??n c??ng vi???c'>
											<Input
												onChange={handleChange}
												value={task?.name || ''}
												name='name'
												ref={nameRef}
												required
												placeholder='T??n c??ng vi???c'
												size='lg'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui l??ng nh???p t??n c??ng vi???c</ErrorText>
										)}
										{isShowMission && (
											<div className='col-12'>
												<FormGroup id='task' label='Thu???c m???c ti??u'>
													<SelectComponent
														placeholder='Thu???c m???c ti??u'
														defaultValue={valueMission}
														value={valueMission}
														onChange={setValueMisson}
														options={missionOptions}
													/>
												</FormGroup>
											</div>
										)}
										<FormGroup
											className='col-12'
											id='description'
											label='M?? t??? c??ng vi???c'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={task.description || ''}
												required
												placeholder='M?? t??? c??ng vi???c'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											color='red'
											className='col-12'
											id='kpiValue'
											label='Gi?? tr??? KPI'>
											<Input
												ref={kpiValueRef}
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={task.kpiValue || ''}
												required
												size='lg'
												placeholder='Gi?? tr??? KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.kpiValue?.errorMsg && (
											<ErrorText>Vui l??ng nh???p gi?? tr??? KPI h???p l???</ErrorText>
										)}
										<FormGroup
											color='red'
											className='col-12'
											id='priority'
											label='????? ??u ti??n'>
											<Select
												ref={priorityRef}
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
										{errors?.priority?.errorMsg && (
											<ErrorText>
												Vui l??ng ch???n ????? ??u ti??n cho c??ng vi???c
											</ErrorText>
										)}
										{/* ph??ng ban ph??? tr??ch */}
										<div className='col-6'>
											<FormGroup
												color='red'
												id='departmentOption'
												label='Ph??ng ban ph??? tr??ch'>
												<SelectComponent
													style={customStyles}
													placeholder='Ch???n ph??ng ban ph??? tr??ch'
													defaultValue={departmentOption}
													value={departmentOption}
													onChange={setDepartmentOption}
													options={departments}
													ref={departmentRef}
												/>
											</FormGroup>
											{errors?.departmentOption?.errorMsg && (
												<ErrorText>
													Vui l??ng ch???n ph??ng ban ph??? tr??ch
												</ErrorText>
											)}
										</div>
										{/* nh??n vi??n ph??? tr??ch ch??nh */}
										<div className='col-6'>
											<FormGroup
												id='userOption'
												label='Nh??n vi??n ph??? tr??ch'
												color='red'>
												<SelectComponent
													style={customStyles}
													placeholder='Ch???n nh??n vi??n ph??? tr??ch'
													defaultValue={userOption}
													value={userOption}
													onChange={setUserOption}
													options={users}
													ref={userRef}
												/>
											</FormGroup>
											{errors?.userOption?.errorMsg && (
												<ErrorText>
													Vui l??ng ch???n nh??n vi??n ph??? tr??ch
												</ErrorText>
											)}
										</div>
										{/* ph??ng ban li??n quan */}
										<FormGroup
											className='col-12'
											id='departmentReplatedOption'
											label='Ph??ng ban li??n quan'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={departmentReplatedOption}
												value={departmentReplatedOption}
												onChange={setDepartmentRelatedOption}
												options={departments.filter(
													(department) =>
														department.id !== departmentOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
										{/* Nh??n vi??n li??n quan */}
										<FormGroup
											className='col-12'
											id='userReplatedOption'
											label='Nh??n vi??n li??n quan'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={userReplatedOption}
												value={userReplatedOption}
												onChange={setUserRelatedOption}
												options={users.filter(
													(user) => user.id !== userOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='estimateDate'
												label='Ng??y d??? ki???n ho??n th??nh'>
												<Input
													name='estimateDate'
													placeholder='Ng??y d??? ki???n ho??n th??nh'
													onChange={handleChange}
													value={task.estimateDate || ''}
													type='date'
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ms-2'
												id='estimateTime'
												label='Th???i gian d??? ki???n ho??n th??nh'>
												<Input
													name='estimateTime'
													placeholder='Th???i gian d??? ki???n ho??n th??nh'
													type='time'
													value={task.estimateTime || ''}
													onChange={handleChange}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='deadlineDate'
												label='H???n ng??y ho??n th??nh'>
												<Input
													name='deadlineDate'
													placeholder='H???n ng??y ho??n th??nh'
													onChange={handleChange}
													value={task.deadlineDate || ''}
													type='date'
													size='lg'
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
													value={task.deadlineTime || ''}
													onChange={handleChange}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<FormGroup>
											<Button variant='success' onClick={handleAddFieldKey}>
												Th??m ti??u ch?? ????nh gi??
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{keysState?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
													className='mt-4 d-flex align-items-center justify-content-between'>
													<div style={{ width: '40%', marginRight: 10 }}>
														<FormGroup
															className='mr-2'
															id='name'
															label={`Ch??? s??? key ${index + 1}`}>
															<Select
																name='keyName'
																required
																size='lg'
																className='border border-2 rounded-0 shadow-none'
																placeholder='Ch???n ch??? s??? Key'
																value={item?.keyName}
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}>
																{keyOption.map((key) => (
																	<Option
																		key={`${key?.name} (${key?.unit?.name})`}
																		value={`${key?.name} (${key?.unit?.name})`}>
																		{`${key?.name} (${key?.unit?.name})`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyName && (
															<ErrorText>
																{item.error?.keyName}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '15%' }}>
														<FormGroup
															className='ml-2'
															id='type'
															label='So s??nh'>
															<Select
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyType}
																name='keyType'
																size='lg'
																required
																ariaLabel='So s??nh'
																className='border border-2 rounded-0 shadow-none'
																placeholder='> = <'>
																{compare.map((element) => (
																	<Option
																		key={`${element}`}
																		value={`${element}`}>
																		{`${element}`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyType && (
															<ErrorText>
																{item.error?.keyType}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '30 %', marginLeft: 10 }}>
														<FormGroup
															className='ml-2'
															id='name'
															label='Gi?? tr???'>
															<Input
																type='number'
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyValue || ''}
																name='keyValue'
																size='lg'
																required
																className='border border-2 rounded-0 shadow-none'
																placeholder='VD: 100 , 1000 , ..'
															/>
														</FormGroup>
														{item.error?.keyValue && (
															<ErrorText>
																{item.error?.keyValue}
															</ErrorText>
														)}
													</div>
													<FormGroup>
														<Button
															color='light'
															variant='light'
															style={{
																background: 'transparent',
																border: 0,
															}}
															size='lg'
															className='mt-4 h-100'
															onClick={(e) =>
																handleRemoveKeyField(e, index)
															}>
															<Icon icon='Trash' size='lg' />
														</Button>
													</FormGroup>
												</div>
											);
										})}
									</div>
								</CardBody>
							</Card>
						</form>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseForm}>
					????ng
				</Button>
				<Button variant='primary' type='submit' onClick={handleSubmit}>
					L??u c??ng vi???c
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default TaskFormModal;
