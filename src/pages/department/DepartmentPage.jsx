/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { useToasts } from 'react-toast-notifications';
import { Form } from 'react-bootstrap';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import validate from './validate';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { addDepartment, deleteDepartment, updateDepartment } from './services';
import Toasts from '../../components/bootstrap/Toasts';
import Employee from './Employee';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import Icon from '../../components/icon/Icon';
import './style.scss';
import DepartmentForm from './DepartmentForm';
import useDarkMode from '../../hooks/useDarkMode';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const [toggle, setToggle] = useState(true);
	const [dataDepartment, setDepartmentId] = useState(true);
	const [valueSearch, setValueSearch] = useState('');
	const [department, setDepartment] = React.useState([]);
	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(department, { childrenField: 'children' })),
	);
	useEffect(() => {
		setDepartment(departments);
	}, [departments]);
	useEffect(() => {
		if (!isEmpty(department)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(department, { childrenField: 'children' })),
				),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [department]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	const departmentList = department?.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
		};
	});

	const organizationLevelOptions = [
		{
			label: 'Kh???i',
			value: 1,
		},
		{
			label: 'C??ng ty',
			value: 4,
		},
		{
			label: 'Ph??ng ban',
			value: 2,
		},
		{
			label: '?????i nh??m',
			value: 3,
		},
	];

	const columns = [
		{
			title: 'T??n ph??ng ban',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 8,
		},
		{
			title: 'M??',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 4,
		},
		{
			title: 'Thu???c c?? c???u t??? ch???c',
			id: 'parentId',
			key: 'parentId',
			type: 'select',
			align: 'center',
			options: departmentList,
			isShow: true,
			isMulti: false,
			col: 8,
		},
		{
			title: 'C???p t??? ch???c',
			id: 'organizationLevel',
			key: 'organizationLevel',
			type: 'select',
			align: 'center',
			options: organizationLevelOptions,
			isShow: true,
			isMulti: false,
			col: 4,
		},
		{
			title: 'M?? t???',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: '?????a ch???',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
	];

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
	const handleDelete = async (valueDelete) => {
		try {
			await deleteDepartment(valueDelete?.id);
			handleShowToast(`Xo?? ????n v???`, `Xo?? ????n v??? th??nh c??ng!`);
		} catch (error) {
			handleShowToast(`Xo?? ????n v???`, `Xo?? ????n v??? th???t b???i!`);
		}
		dispatch(fetchDepartmentList());
	};
	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			organizationLevel: data?.organizationLevel?.value,
			parent_id: data?.parentId?.value,
			name: data?.name,
			description: data?.description,
			code: data?.code,
			address: data?.address,
		};
		if (data?.id) {
			try {
				const response = await updateDepartment(dataSubmit);
				await response.data;
				dispatch(fetchDepartmentList());
				handleCloseForm();
				handleShowToast(`C???p nh???t ph??ng ban!`, `C???p nh???t ph??ng ban th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`C???p nh???t ph??ng ban`, `C???p nh???t ph??ng ban kh??ng th??nh c??ng!`);
				throw error;
			}
		} else {
			try {
				const response = await addDepartment(dataSubmit);
				const result = await response.data;
				dispatch(fetchDepartmentList());
				handleCloseForm();
				handleShowToast(
					`Th??m ph??ng ban`,
					`Ph??ng ban ${result.data.name} ???????c th??m th??nh c??ng!`,
				);
				setTreeValue(TreeState.expandAll(treeValue));
			} catch (error) {
				handleShowToast(`Th??m ph??ng ban`, `Th??m ph??ng ban kh??ng th??nh c??ng!`);
				setTreeValue(TreeState.expandAll(treeValue));
			}
		}
	};

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};
	const handleChangeSearch = (e) => {
		setValueSearch(e.target.value);
	};
	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
					fontSize: 14,
				}}
				onClick={() => setDepartmentId(row.data)}
				onDoubleClick={() =>
					handleOpenForm({
						...row.data,
						parentId: department.find((item) => item.id === row.data.parentId),
						organizationLevel: organizationLevelOptions.find(
							(item) => item.value === row.data.organizationLevel,
						),
					})
				}
				className={
					row.metadata.hasChildren
						? 'with-children d-flex align-items-center cursor-pointer user-select-none'
						: 'without-children cursor-pointer user-select-none'
				}>
				{row.metadata.hasChildren ? (
					<Icon
						color='success'
						type='button'
						size='lg'
						icon={row?.$state?.isExpanded ? 'ArrowDropDown' : 'ArrowRight'}
						className='d-block bg-transparent'
						style={{ fontSize: 25 }}
						onClick={row.toggleChildren}
					/>
				) : (
					''
				)}

				<span>{row?.data?.name || ''}</span>
			</div>
		);
	};

	const toggleExpand = () => {
		if (!toggle) {
			setToggle(!toggle);
			setTreeValue(TreeState.expandAll(treeValue));
		} else {
			setToggle(!toggle);
			setTreeValue(TreeState.collapseAll(treeValue));
		}
	};
	const handleSubmitSearch = () => {
		if (!isEmpty(department)) {
			// const dataSearch = department?.filter((item) =>
			// 	item?.name?.toLowerCase().includes(valueSearch?.toLowerCase()),
			// );
			const dataSearch = department.map((item) => {
				console.log(item.label.includes(valueSearch));
				return item;
			});
			console.log(dataSearch);
		}
	};
	return (
		<PageWrapper title={demoPages.companyPage.text}>
			<Page container='fluid'>
				<div className='row mb-0'>
					<div className='col-12'>
						<Card className='w-100 '>
							<CardHeader>
								<CardLabel icon='Sort' iconColor='primary'>
									<CardTitle>
										<CardLabel>Danh s??ch c?? c???u t??? ch???c</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardActions>
									<Button
										color='info'
										icon='AddCircleOutline'
										tag='button'
										onClick={() => handleOpenForm(null)}>
										Th??m m???i
									</Button>
								</CardActions>
							</CardHeader>
							<div className='row h-100 w-100'>
								<div className='col-lg-4 col-md-6 pb-4'>
									<Card className='h-100'>
										<CardBody>
											<div className='pt-4' style={{ height: '100%' }}>
												<div className='d-flex align-items-center justify-content-start'>
													<Button
														color='info'
														icon={!toggle ? 'ExpandMore' : 'ExpandLess'}
														tag='button'
														onClick={toggleExpand}>
														{!toggle ? 'Hi???n th??? t???t c???' : 'Thu g???n'}
													</Button>
												</div>
												<br />
												<div style={{ maxWidth: '100%' }}>
													<Form className='mb-3 d-flex align-items-center'>
														<Form.Control
															placeholder='Search...'
															className='rounded-none outline-none shadow-none'
															style={{
																border: '1px solid',
																borderRadius: '0.5rem',
															}}
															onChange={(e) => handleChangeSearch(e)}
															value={valueSearch}
														/>
														<Button
															color='info'
															isOutline={!darkModeStatus}
															isLight={darkModeStatus}
															onClick={handleSubmitSearch}
															className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
															icon='Search'>
															T??m ki???m
														</Button>
													</Form>
												</div>
												<div id='treeTable'>
													<TreeTable
														value={treeValue}
														height={600}
														onChange={handleOnChange}>
														<TreeTable.Column
															style={{ minWidth: 300 }}
															renderCell={renderIndexCell}
															renderHeaderCell={() => <span />}
														/>
													</TreeTable>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
								<div className='col-lg-8 col-md-6'>
									<Card>
										<CardBody>
											<Employee dataDepartment={dataDepartment} />
										</CardBody>
									</Card>
								</div>
							</div>
						</Card>
					</div>
				</div>
				<DepartmentForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'C???p nh???t c?? c???u t??? ch???c' : 'Th??m m???i c?? c???u t??? ch???c'}
					fields={columns}
					validate={validate}
					onDelete={handleDelete}
				/>
			</Page>
		</PageWrapper>
	);
};
export default DepartmentPage;
