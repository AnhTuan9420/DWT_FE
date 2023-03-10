/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, memo } from 'react';
import _ from 'lodash';
import { Button, Modal } from 'react-bootstrap';
import SelectComponent from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useToasts } from 'react-toast-notifications';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import { fetchUnitList } from '../../../redux/slice/unitSlice';
import { addNewMission, updateMissionById } from './services';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import Toasts from '../../../components/bootstrap/Toasts';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;
const MissionFormModal = ({ show, onClose, item }) => {
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const units = useSelector((state) => state.unit.units);
	const [mission, setMission] = useState({});
	const [unitOption, setUnitOption] = useState({ label: '', value: '' });
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState({
		label: '',
		value: '',
	});
	const [errors, setErrors] = useState({
		name: { errorMsg: '' },
		departmentOption: { errorMsg: '' },
	});
	const { addToast } = useToasts();
	const nameRef = useRef(null);
	const departmentRef = useRef(null);

	useEffect(() => {
		dispatch(fetchDepartmentList());
		dispatch(fetchUnitList());
	}, [dispatch]);

	const handleClearErrorMsgAfterChange = (name) => {
		if (mission?.[name] || departmentOption?.value) {
			setErrors((prev) => ({
				...prev,
				[name]: { ...prev[name], errorMsg: '' },
			}));
		}
	};

	useEffect(() => {
		handleClearErrorMsgAfterChange('name');
		handleClearErrorMsgAfterChange('departmentOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mission?.name, departmentOption?.value]);

	useEffect(() => {
		setMission(item);
		if (!item.id) {
			setMission({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				startTime: '',
				endTime: '',
				status: 1,
				manday: '',
				quantity: '',
			});
			setUnitOption({});
			setDepartmentOption({});
			setDepartmentRelatedOption({});
		} else {
			setMission({ ...item });
			setUnitOption({
				...item.unit,
				label: _.get(item, 'unit.name'),
				value: _.get(item, 'unit.id'),
			});
			setDepartmentOption({
				...item.departments.filter((i) => i.missionDepartments?.isResponsible)[0],
				label: item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.name,
				value: item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.id,
			});
			setDepartmentRelatedOption({
				...item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0],
				label: item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0]
					?.name,
				value: item.departments.filter((i) => !i.missionDepartments?.isResponsible)[0]?.id,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id]);

	const handleChange = (e) => {
		const { value } = e.target;
		setMission({
			...mission,
			[e.target.name]: value,
		});
	};

	// close form
	const handleCloseForm = () => {
		onClose();
		setMission({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			startTime: '',
			endTime: '',
			status: 0,
			quantity: '',
			manday: '',
		});
		setUnitOption({});
		setDepartmentOption({});
		setDepartmentRelatedOption({});
		setErrors({});
	};
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
	const handleSubmitMissionForm = async () => {
		const data = { ...mission };
		data.quantity = parseInt(mission.quantity, 10) || null;
		data.manday = parseInt(mission.manday, 10) || null;
		data.kpiValue = parseInt(mission.kpiValue, 10) || null;
		data.responsibleDepartment_id = departmentOption.id;
		data.relatedDepartment_id = departmentReplatedOption.id || null;
		data.unit_id = unitOption.id || null;
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				await response.data;
				dispatch(fetchMissionList());
				handleCloseForm();
				handleShowToast(`C???p nh???t m???c ti??u!`, `C???p nh???t m???c ti??u th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`C???p nh???t m???c ti??u`, `C???p nh???t m???c ti??u kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				await response.data;
				dispatch(fetchMissionList());
				handleCloseForm();
				handleShowToast(`Th??m m???c ti??u`, `Th??m m???c ti??u th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`Th??m m???c ti??u`, `Th??m m???c ti??u kh??ng th??nh c??ng!`);
			}
		}
	};
	return (
		<Modal show={show} onHide={handleCloseForm} size='lg' scrollable centered>
			<Modal.Header closeButton>
				<Modal.Title>{item?.id ? 'C???p nh???t m???c ti??u' : 'Th??m m???i m???c ti??u'}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-md-12'>
						<form>
							<Card shadow='sm'>
								<CardBody>
									<div className='row g-4'>
										<FormGroup
											color='red'
											className='col-12'
											id='name'
											label='T??n m???c ti??u'>
											<Input
												onChange={handleChange}
												value={mission.name || ''}
												name='name'
												ref={nameRef}
												placeholder='T??n m???c ti??u'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui l??ng nh???p t??n m???c ti??u</ErrorText>
										)}
										{/* S??? l????ng - ????n v??? t??nh - Manday */}
										<FormGroup className='col-2' id='quantity' label='S??? l?????ng'>
											<Input
												type='number'
												name='quantity'
												onChange={handleChange}
												value={mission.quantity || ''}
												placeholder='S??? l?????ng'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup className='col-3' id='unit' label='????n v??? t??nh'>
											<SelectComponent
												placeholder='????n v??? t??nh'
												defaultValue={unitOption}
												value={unitOption}
												onChange={setUnitOption}
												options={units}
											/>
										</FormGroup>
										<FormGroup
											className='col-4'
											id='manday'
											label='S??? ng??y c??ng c???n thi???t'>
											<Input
												type='number'
												name='manday'
												onChange={handleChange}
												value={mission.manday || ''}
												placeholder='S??? ng??y c??ng c???n thi???t'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{/* Gi?? tr??? KPI */}
										<FormGroup
											className='col-3'
											id='kpiValue'
											label='Gi?? tr??? KPI'>
											<Input
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={mission.kpiValue || ''}
												placeholder='Gi?? tr??? KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											color='red'
											className='col-4'
											id='department'
											label='Ph??ng ban ph??? tr??ch'>
											<SelectComponent
												placeholder='Ch???n ph??ng ban ph??? tr??ch'
												defaultValue={departmentOption}
												value={departmentOption}
												onChange={setDepartmentOption}
												options={departments}
												ref={departmentRef}
											/>
										</FormGroup>
										{errors?.departmentOption?.errorMsg && (
											<ErrorText>Vui l??ng ch???n ph??ng ban ph??? tr??ch</ErrorText>
										)}
										<FormGroup
											className='col-8'
											id='departmentReplatedOption'
											label='Ph??ng ban li??n quan'>
											<SelectComponent
												placeholder=''
												defaultValue={departmentReplatedOption}
												value={departmentReplatedOption}
												onChange={setDepartmentRelatedOption}
												options={departments.filter(
													(department) =>
														department.id !== departmentOption?.id,
												)}
											/>
										</FormGroup>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 mr-2'
												style={{ width: '45%', marginRight: 10 }}
												id='startTime'
												label='Ng??y b???t ?????u m???c ti??u'
												isFloating>
												<Input
													name='startTime'
													placeholder='Ng??y b???t ?????u m???c ti??u'
													onChange={handleChange}
													value={mission.startTime || ''}
													type='date'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ml-2'
												style={{ width: '45%', marginLeft: 10 }}
												id='endTime'
												label='Ng??y k???t th??c m???c ti??u'
												isFloating>
												<Input
													name='endTime'
													placeholder='Ng??y k???t th??c m???c ti??u'
													onChange={handleChange}
													value={mission.endTime || ''}
													type='date'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<FormGroup
											className='col-12'
											id='description'
											label='M?? t??? m???c ti??u'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={mission.description || ''}
												placeholder='M?? t??? m???c ti??u'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
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
				<Button variant='primary' type='submit' onClick={handleSubmitMissionForm}>
					L??u m???c ti??u
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default memo(MissionFormModal);
