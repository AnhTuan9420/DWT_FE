import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-treegrid';
import _, { isEmpty } from 'lodash';
import { dashboardMenu } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Button, { ButtonGroup } from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import useDarkMode from '../../hooks/useDarkMode';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import Chart from '../../components/extras/Chart';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import CommonSalePerformance from '../common/CRMDashboard/CommonSalePerformance';
import CommonApprovedAppointmentChart from '../common/SubHeaders/CommonApprovedAppointmentChart';
import OrderBarChart from '../common/SubHeaders/OrderBarChat';
import { getAllWorktrackByUserId } from '../dailyWorkTracking/services';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import DailyWorktrackingModal from '../dailyWorkTracking/DailyWorktrackingModal';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (!_.isEmpty(aData.parentId)) {
			hashTable[aData.parentId].children.push(hashTable[aData.id]);
			// hashTable[aData.parentId]
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const DashboardPage = () => {
	const dispatch = useDispatch();
	const { themeStatus } = useDarkMode();
	const [worktrack, setWorktrack] = useState({});
	const [treeValue, setTreeValue] = React.useState([]);

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(users, currentPage, perPage);
	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	const id = localStorage.getItem('userId');

	useEffect(() => {
		async function fetchData() {
			getAllWorktrackByUserId(id).then((res) => {
				setWorktrack(res.data.data);
			});
		}
		fetchData();
	}, [dispatch, id]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack?.workTracks?.map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id,
						text: item.name,
						deadline: item.deadline ? moment(item.deadline).format('DD-MM-YYYY') : '--',
						parentId: item.parent_id,
						department: {
							name: _.get(worktrack, 'department.name', '--'),
						},
					};
				}),
			);
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [worktrack]);

	const [year, setYear] = useState(Number(moment().format('YYYY')));
	const companies = ['T???ng C??ng Ty', 'K??nh OTC', 'K??nh ETC', 'K??nh MT', 'K??nh Online'];
	const COMPANIES_TAB = {
		COMP1: companies[0],
		COMP2: companies[1],
		COMP3: companies[2],
		COMP4: companies[3],
		COMP5: companies[4],
	};
	const [activeCompanyTab, setActiveCompanyTab] = useState(COMPANIES_TAB.COMP1);
	const search = [
		// { name: 'Tu???n' },
		{ name: 'Ng??y' },
		{ name: 'Th??ng' },
		{ name: 'Qu??' },
		{ name: 'N??m' },
	];
	const SEARCH_TAB = {
		COMP1: search[0].name,
		COMP2: search[1].name,
		COMP3: search[2].name,
		COMP4: search[3].name,
	};
	const [searchTab, setSearchTab] = useState(SEARCH_TAB.COMP1);

	function randomize(value, x = year) {
		if (x === 2019) {
			// if (value.toFixed(0) % 2) {
			// 	return (value * 1.5).toFixed(2);
			// }
			// return (value / 1.4).toFixed(2);
			return 0;
		}
		if (x === 2020) {
			// if (value.toFixed(0) % 2) {
			// 	return (value / 1.5).toFixed(2);
			// }
			// return (value * 1.4).toFixed(2);
			return 0;
		}
		if (x === 2021) {
			// if (value.toFixed(0) % 2) {
			// 	return (value / 2).toFixed(2);
			// }
			// return (value * 1.4).toFixed(2);
			return 0;
		}
		// return value.toFixed(2);
		return 0;
	}
	function getDate(day) {
		const arr = [];
		for (let i = 0; i < day; i += 1) {
			arr.push(
				moment()
					.add(-1 * i, 'day')
					.format('ll'),
			);
		}
		return arr.reverse();
	}
	function getYear(day) {
		const arr = [];
		for (let i = 0; i < day; i += 1) {
			arr.push(
				moment()
					.add(-1 * i, 'year')
					.format('YYYY'),
			);
		}
		arr.sort();
		return arr;
	}
	const guestChart = {
		series: [
			{
				name: 'N???',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
			{
				name: 'Nam',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
		],
		options: {
			chart: {
				type: 'bar',
				height: 370,
				stacked: true,
			},
			colors: [process.env.REACT_APP_DANGER_COLOR, process.env.REACT_APP_INFO_COLOR],
			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '80%',
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				width: 1,
				colors: ['#fff'],
			},
			grid: {
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			yaxis: {
				min: -5,
				max: 5,
				title: {
					text: 'Age',
				},
			},
			tooltip: {
				shared: false,
				x: {
					formatter(val) {
						return val;
					},
				},
				y: {
					formatter(val) {
						return `${Math.abs(val)}%`;
					},
				},
			},
			title: {
				text: 'B??o c??o ng?????i d??ng s???n ph???m n??m 2022',
			},
			xaxis: {
				categories: [
					'85+',
					'80-84',
					'75-79',
					'70-74',
					'65-69',
					'60-64',
					'55-59',
					'50-54',
					'45-49',
					'40-44',
					'35-39',
					'30-34',
					'25-29',
					'20-24',
					'15-19',
					'10-14',
					'5-9',
					'0-4',
				],
				title: {
					text: 'Percent',
				},
				labels: {
					formatter(val) {
						return `${Math.abs(Math.round(val))}%`;
					},
				},
			},
		},
	};
	const salesByStoreOptions = {
		chart: {
			height: 335.5,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p ( Tri???u )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nh???p N??m Ngo??i',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p N??m Ngo??i',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft',
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};

	const dayOptions = {
		chart: {
			height: 335.5,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: getDate(30),
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p ( Tri???u )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft',
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const dayStoreSeries = [
		{
			name: 'Thu Nh???p Th??ng N??y',
			type: 'column',
			data: [
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0,
			],
		},
	];
	const monthOptions = {
		chart: {
			height: 335.5,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p ( Tri???u )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nh???p N??m Ngo??i',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p N??m Ngo??i',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft',
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const monthStoreSeries = [
		{
			name: 'Thu Nh???p N??m Nay',
			type: 'column',
			data: [
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
			],
		},
		{
			name: 'Thu Nh???p N??m Tr?????c',
			type: 'column',
			data: [
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
			],
		},
	];
	const quarterOptions = {
		chart: {
			height: 335.5,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: ['Qu?? 1', 'Qu?? 2', 'Qu?? 3', 'Qu?? 4'],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p ( Tri???u )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nh???p N??m Ngo??i',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p N??m Ngo??i',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft',
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const quarterStoreSeries = [
		{
			name: 'Thu Nh???p Qu?? N??m Nay',
			type: 'column',
			data: [0, 0, 0, 0],
		},
		{
			name: 'Thu Nh???p Qu?? N??m Tr?????c',
			type: 'column',
			data: [0, 0, 0, 0],
		},
	];
	const yearOptions = {
		chart: {
			height: 335.5,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: getYear(6),
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nh???p ( Tri???u )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft',
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const yearStoreSeries = [
		{
			// name: 'Thu Nh???p Qu?? N??m Nay',
			type: 'column',
			data: [0, 0, 0, 0, 0, 0],
		},
	];

	const salesByStoreSeries1 = [
		{
			name: 'Thu Nh???p N??m Nay',
			type: 'column',
			data: [
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
			],
		},
		{
			name: 'Thu Nh???p N??m Ngo??i',
			type: 'column',
			data: [
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
				randomize(0),
			],
		},
	];
	const salesByStoreSeries2 = [
		{
			name: 'Thu Nh???p N??m Nay',
			type: 'column',
			data: [
				randomize(234),
				randomize(456),
				randomize(371),
				randomize(499),
				randomize(378),
				randomize(678),
				randomize(567),
				randomize(789),
				randomize(460),
				randomize(575),
				randomize(661),
				randomize(515),
			],
		},
		{
			name: 'Thu Nh???p N??m Ngo??i',
			type: 'column',
			data: [
				randomize(100),
				randomize(150),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(250),
				randomize(300),
				randomize(300),
				randomize(400),
				randomize(300),
				randomize(400),
				randomize(444),
			],
		},
	];
	const salesByStoreSeries3 = [
		{
			name: 'Thu Nh???p N??m Nay',
			type: 'column',
			data: [
				randomize(477),
				randomize(323),
				randomize(241),
				randomize(478),
				randomize(268),
				randomize(379),
				randomize(344),
				randomize(486),
				randomize(580),
				randomize(680),
				randomize(480),
				randomize(370),
			],
		},
		{
			name: 'Thu Nh???p N??m Ngo??i',
			type: 'column',
			data: [
				randomize(100),
				randomize(155),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(300),
				randomize(300),
				randomize(355),
				randomize(356),
				randomize(299),
				randomize(400),
				randomize(499),
			],
		},
	];
	const salesByStoreSeries4 = [
		{
			name: 'Thu Nh???p N??m Nay',
			type: 'column',
			data: [
				randomize(354),
				randomize(366),
				randomize(264),
				randomize(575),
				randomize(313),
				randomize(278),
				randomize(470),
				randomize(420),
				randomize(579),
				randomize(615),
				randomize(311),
				randomize(692),
			],
		},
		{
			name: 'Thu Nh???p N??m Ngo??i',
			type: 'column',
			data: [
				randomize(100),
				randomize(180),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(300),
				randomize(300),
				randomize(388),
				randomize(377),
				randomize(300),
				randomize(400),
				randomize(478),
			],
		},
	];

	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid overflow-hidden'>
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-md-6'>
							<Card className='mb-0'>
								<CardHeader>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Th???ng K?? Doanh Thu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											B??o c??o
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardActions
									style={{
										textAlign: 'right',
										marginRight: '19.5px',
										marginLeft: '19.5px',
									}}>
									<Dropdown isButtonGroup>
										<DropdownToggle>
											<Button color='success' isLight>
												{activeCompanyTab}
											</Button>
										</DropdownToggle>
										<DropdownMenu isAlignmentEnd>
											<DropdownItem>
												<Button
													onClick={() =>
														setActiveCompanyTab(COMPANIES_TAB.COMP1)
													}>
													T???ng c??ng ty
												</Button>
											</DropdownItem>
											<DropdownItem>
												<Button
													onClick={() =>
														setActiveCompanyTab(COMPANIES_TAB.COMP2)
													}>
													K??nh OTC
												</Button>
											</DropdownItem>
											<DropdownItem>
												<Button
													onClick={() =>
														setActiveCompanyTab(COMPANIES_TAB.COMP3)
													}>
													K??nh ETC
												</Button>
											</DropdownItem>
											<DropdownItem>
												<Button
													onClick={() =>
														setActiveCompanyTab(COMPANIES_TAB.COMP4)
													}>
													K??nh MT
												</Button>
											</DropdownItem>
											<DropdownItem>
												<Button
													onClick={() =>
														setActiveCompanyTab(COMPANIES_TAB.COMP5)
													}>
													K??nh Online
												</Button>
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
									<ButtonGroup style={{ marginRight: '0' }}>
										{search.map((element) => (
											<div key={element.name}>
												<Button
													isLight={searchTab !== element.name}
													onClick={() => setSearchTab(element.name)}
													color={themeStatus}>
													{element.name}
												</Button>
											</div>
										))}
									</ButtonGroup>
									{searchTab === '30 Ng??y' || searchTab === 'N??m' ? null : (
										<Dropdown isButtonGroup>
											<DropdownToggle>
												<Button color='success' isLight>
													{year}
												</Button>
											</DropdownToggle>
											<DropdownMenu isAlignmentEnd>
												<DropdownItem>
													<Button
														color='primary'
														isLight
														isDisable={year === 2019}
														onClick={() => {
															setYear(2019);
															setSearchTab('');
														}}>
														2019
													</Button>
												</DropdownItem>
												<DropdownItem>
													<Button
														color='primary'
														isLight
														isDisable={year === 2020}
														onClick={() => {
															setYear(2020);
															setSearchTab('');
														}}>
														2020
													</Button>
												</DropdownItem>
												<DropdownItem>
													<Button
														color='primary'
														isLight
														isDisable={year === 2021}
														onClick={() => {
															setYear(2021);
															setSearchTab('');
														}}>
														2021
													</Button>
												</DropdownItem>
												<DropdownItem>
													<Button
														color='primary'
														isLight
														isDisable={year === 2022}
														onClick={() => {
															setYear(2022);
															setSearchTab('');
														}}>
														2022
													</Button>
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									)}
								</CardActions>
								<CardBody>
									<div className='row'>
										<div className='col-md-12'>
											<Chart
												series={
													(searchTab === SEARCH_TAB.COMP1 &&
														dayStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP2 &&
														monthStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP3 &&
														quarterStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP4 &&
														yearStoreSeries) ||
													(activeCompanyTab === COMPANIES_TAB.COMP2 &&
														salesByStoreSeries1) ||
													(activeCompanyTab === COMPANIES_TAB.COMP3 &&
														salesByStoreSeries2) ||
													(activeCompanyTab === COMPANIES_TAB.COMP4 &&
														salesByStoreSeries3) ||
													salesByStoreSeries4
												}
												options={
													(searchTab === SEARCH_TAB.COMP1 &&
														dayOptions) ||
													(searchTab === SEARCH_TAB.COMP2 &&
														monthOptions) ||
													(searchTab === SEARCH_TAB.COMP3 &&
														quarterOptions) ||
													(searchTab === SEARCH_TAB.COMP4 &&
														yearOptions) ||
													salesByStoreOptions
												}
												type={salesByStoreOptions.chart.type}
												height={salesByStoreOptions.chart.height}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
					<div className='col-md-6'>
						{verifyPermissionHOC(
							<Card stretch>
								<CardHeader>
									<CardLabel icon='StackedBarChart'>
										<CardTitle>Th???ng k?? ng?????i d??ng</CardTitle>
										<CardSubTitle>B??o c??o</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<Chart
										series={guestChart.series}
										options={guestChart.options}
										type='bar'
										height={370}
									/>
								</CardBody>
							</Card>,
							['admin'],
						)}
					</div>
				</div>
				<div className='row mt-0'>
					{verifyPermissionHOC(
						<>
							<div className='col-md-6' style={{ marginTop: '1%' }}>
								<CommonSalePerformance />
							</div>
							<div className='col-md-6' style={{ marginTop: '1%' }}>
								<CommonApprovedAppointmentChart />
							</div>
						</>,
						['admin', 'manager'],
					)}
				</div>
				{verifyPermissionHOC(
					<div className='row my-4'>
						<div className='col-md-12'>
							<Card>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Th???ng k?? c??ng vi???c theo nh??n vi??n</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<div className='p-4'>
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th>H??? v?? t??n</th>
												<th>Ph??ng ban</th>
												<th>V??? tr??</th>
												<th className='text-center'>S??? nhi???m v??? ??ang c??</th>
												<th>Ch???c v???</th>
											</tr>
										</thead>
										<tbody>
											{items?.map((item) => (
												<React.Fragment key={item.id}>
													<tr>
														<td>
															<a
																className='text-underline'
																href={`/cong-viec-hang-ngay/${item.id}`}>
																{item.name}
															</a>
														</td>
														<td>{item?.department?.name}</td>
														<td>{item?.position?.name}</td>
														<td className='text-center'>
															{item?.workTracks?.length || 0}
														</td>
														<td>
															{item?.role === 'manager'
																? 'Qu???n l?? '
																: 'Nh??n vi??n'}
														</td>
													</tr>
												</React.Fragment>
											))}
										</tbody>
									</table>
									<hr />
									<footer>
										<PaginationButtons
											data={users}
											setCurrentPage={setCurrentPage}
											currentPage={currentPage}
											perPage={perPage}
											setPerPage={setPerPage}
										/>
									</footer>
								</div>
							</Card>
						</div>
					</div>,
					['manager'],
				)}
				{verifyPermissionHOC(
					<div className='row mt-4'>
						<div className='col-md-12 h-100'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>
												Danh s??ch c??ng vi???c ??ang th???c hi???n
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<div className='p-4'>
									<div className='control-pane'>
										<div className='control-section'>
											<TreeGridComponent
												dataSource={treeValue}
												treeColumnIndex={0}
												className='cursor-pointer user-select-none'
												rowSelected={(item) => {
													handleOpenForm({
														...item.data.data,
														parent: worktrack?.workTracks?.find(
															(i) => i.id === item.data.data.parentId,
														),
													});
												}}
												childMapping='children'
												height='410'>
												<ColumnsDirective>
													<ColumnDirective
														field='data.kpiNorm.name'
														headerText='T??n nhi???m v???'
														width='200'
													/>
													<ColumnDirective
														field='data.mission.name'
														headerText='Thu???c m???c ti??u'
														width='90'
														textAlign='Left'
													/>
													<ColumnDirective
														field='data.deadline'
														headerText='H???n ho??n th??nh'
														format='yMd'
														width='90'
														textAlign='Center'
													/>
													<ColumnDirective
														field='data.quantity'
														headerText='S??? l?????ng'
														width='90'
														textAlign='Right'
													/>
												</ColumnsDirective>
											</TreeGridComponent>
										</div>
									</div>
								</div>
							</Card>
						</div>
						<DailyWorktrackingModal
							data={itemEdit}
							worktrack={worktrack}
							handleClose={handleCloseForm}
							show={toggleForm}
						/>
					</div>,
					['user', 'manager'],
				)}
				{verifyPermissionHOC(
					<div className='row'>
						<div className='col-md-6'>
							<OrderBarChart />
						</div>
					</div>,
					['admin'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
