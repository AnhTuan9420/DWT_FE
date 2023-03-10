import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-treegrid';
import _, { isEmpty } from 'lodash';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { addKpiNorm, updateKpiNorm } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import NotPermission from '../presentation/auth/NotPermission';
import './style.css';
import KPINormForm from './KPINormForm';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const KpiNormPage = () => {
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const positions = useSelector((state) => state.position.positions);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	useEffect(() => {
		dispatch(fetchPositionList());
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	const [treeValue, setTreeValue] = React.useState([]);

	const fixForm = () => {
		return kpiNorm.map((item) => ({
			...item,
			quantity: !_.isNumber(item.quantity) ? '--' : item.quantity,
			kpi_value: !_.isNumber(item.kpi_value) ? '--' : item.kpi_value,
		}));
	};

	useEffect(() => {
		if (!isEmpty(kpiNorm)) {
			const treeData = createDataTree(fixForm());
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [kpiNorm]);

	const columns = [
		{
			title: 'T??n nhi???m v???',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'V??? tr?? ?????m nhi???m',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			options: positions,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Thu???c nhi???m v??? cha (n???u c??)',
			id: 'parent',
			key: 'parent',
			type: 'select',
			align: 'center',
			options: kpiNorm,
			isShow: true,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Lo???i nhi???m v???',
			id: 'taskType',
			key: 'taskType',
			type: 'select',
			align: 'center',
			options: [
				{
					label: 'Th?????ng xuy??n',
					value: 'Th?????ng xuy??n',
				},
				{
					label: 'Kh??ng th?????ng xuy??n',
					value: 'Kh??ng th?????ng xuy??n',
				},
				{
					label: 'Kinh doanh',
					value: 'Kinh doanh',
				},
			],
			isShow: true,
			isMulti: false,
			col: 6,
			render: (item) => <span>{item?.taskType?.value || 'No data'}</span>,
		},
		{
			title: 'M?? t???/Di???n gi???i',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'center',
			isShow: true,
		},
	];

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data?.id, 10),
			name: data?.name,
			description: data?.description,
			descriptionKpiValue: data.descriptionKpiValue,
			position_id: parseInt(data.position.id, 10) || null,
			department_id: parseInt(data.position.department.id, 10) || null,
			parent_id: parseInt(data.parent?.id, 10) || null,
			kpi_value: parseInt(data.kpi_value, 10) || null,
			quantity: parseInt(data.quantity, 10) || null,
			taskType: data?.taskType.value || 'Th?????ng xuy??n',
		};
		if (data.id) {
			try {
				const response = await updateKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
			} catch (error) {
				dispatch(fetchKpiNormList());
				throw error;
			}
		} else {
			try {
				const response = await addKpiNorm(dataSubmit);
				await response.data;
				dispatch(fetchKpiNormList());
				handleCloseForm();
			} catch (error) {
				dispatch(fetchKpiNormList());
				throw error;
			}
		}
	};

	return (
		<PageWrapper title='Khai b??o nhi???m v???'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div
						className='row mb-0'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						<div className='col-12'>
							<Card className='w-100 h-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='FormatListBulleted' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh s??ch nhi???m v???</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PlaylistAdd'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Th??m m???i
											</Button>
										</CardActions>
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												<TreeGridComponent
													dataSource={treeValue}
													treeColumnIndex={0}
													className='cursor-pointer'
													rowSelected={(item) => {
														handleOpenForm(item.data.data);
													}}
													childMapping='children'
													height='410'>
													<ColumnsDirective>
														<ColumnDirective
															field='data.name'
															headerText='T??n nhi???m v???'
															width='200'
														/>
														<ColumnDirective
															field='data.position.name'
															headerText='V??? tr?? ?????m nhi???m'
															width='90'
															textAlign='Left'
														/>
														<ColumnDirective
															field='data.quantity'
															headerText='S??? l?????ng'
															width='90'
															textAlign='Center'
														/>
														<ColumnDirective
															field='data.kpi_value'
															headerText='Gi?? tr??? KPI'
															width='90'
															textAlign='Center'
														/>
													</ColumnsDirective>
												</TreeGridComponent>
											</div>
										</div>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
				<KPINormForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'C???p nh???t nhi???m v???' : 'Th??m m???i nhi???m v???'}
					fields={columns}
					validate={validate}
				/>
			</Page>
		</PageWrapper>
	);
};

export default KpiNormPage;
