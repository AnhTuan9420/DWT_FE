import React from 'react';
import { useFormik } from 'formik';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Popovers from '../../../components/bootstrap/Popovers';
import Icon from '../../../components/icon/Icon';

const SubTaskPage = () => {
	const chartOptions = {
		chart: {
			type: 'area',
			height: 350,
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'straight',
		},
		title: {
			text: 'Fundamental Analysis of Stocks',
			align: 'left',
		},
		subtitle: {
			text: 'Price Movements',
			align: 'left',
		},
		labels: [
			'13 Nov 2017',
			'14 Nov 2017',
			'15 Nov 2017',
			'16 Nov 2017',
			'17 Nov 2017',
			'20 Nov 2017',
			'21 Nov 2017',
			'22 Nov 2017',
			'23 Nov 2017',
			'24 Nov 2017',
			'27 Nov 2017',
			'28 Nov 2017',
			'29 Nov 2017',
			'30 Nov 2017',
			'01 Dec 2017',
			'04 Dec 2017',
			'05 Dec 2017',
			'06 Dec 2017',
			'07 Dec 2017',
			'08 Dec 2017',
		],
		xaxis: {
			type: 'datetime',
			convertedCatToNumeric: false,
		},
		yaxis: {
			opposite: true,
		},
		legend: {
			horizontalAlign: 'left',
		},
		tooltip: {
			theme: 'dark',
		},
	};

	const series = [
		{
			name: 'STOCK ABC',
			data: [
				8107.85, 8128, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85, 8487.7,
				8506.9, 8626.2, 8668.95, 8602.3, 8607.55, 8512.9, 8496.25, 8600.65, 8881.1, 9340.85,
			],
		},
	];

	const formik = useFormik({
		initialValues: {
			workName: 'Cho phép',
			assignee: '',
		},
	});

	const data = [
		{
			id: 1,
			title: 'Cho phép',
			value: 1,
		},
		{
			id: 2,
			title: 'Không cho phép',
			value: 2,
		},
	];

	return (
		<PageWrapper title={demoPages.cauHinh.text}>
			<Page container='fluid'>
				<div className='row mt-4'>
					<Chart
						series={series}
						options={chartOptions}
						type={chartOptions.chart.type}
						height={chartOptions.chart.height}
						zoom={chartOptions.chart.zoom}
					/>
				</div>
				<div className='row'>
					<div className='col-12'>
						<Card className='mt-8 p-4 bg-white border-1'>
							<div className='row'>
								<div className='col-xl-6 col-md-12'>
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Cấu hình API
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<div className='mt-4 mb-4 d-flex align-items-center justify-content-between'>
										<div className='display-6' style={{ fontSize: '1.3rem' }}>
											Cấu hình API
										</div>
										<div>
											<FormGroup id='workName' className='col-12'>
												<Select
													className='bg-white border-light border border-1 shadow-none rounded-0'
													ariaLabel='Board select'
													placeholder='Chọn'
													size='lg'
													onChange={formik.handleChange}
													value={formik.values.workName}>
													{data.map((u) => (
														<Option key={u.id} value={u.value}>
															{u.title}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
									</div>
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Cấu hình app khách hàng đặt hàng
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<div className='mt-4 mb-4 d-flex align-items-center justify-content-between'>
										<div className='display-6' style={{ fontSize: '1.3rem' }}>
											Áp dụng khuyến mãi
											<Popovers
												trigger='hover'
												desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
												<Icon
													icon='Help'
													size='lg'
													className='ms-1 cursor-help'
												/>
											</Popovers>
										</div>
										<div>
											<FormGroup id='workName' className='col-12'>
												<Select
													className='bg-white border-light border border-1 shadow-none rounded-0'
													ariaLabel='Board select'
													placeholder='Chọn'
													size='lg'
													onChange={formik.handleChange}
													value={formik.values.workName}>
													{data.map((u) => (
														<Option key={u.id} value={u.value}>
															{u.title}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
									</div>
									<div className='mt-4 mb-4 d-flex align-items-center justify-content-between'>
										<div className='display-6' style={{ fontSize: '1.3rem' }}>
											Cập nhật thông tin khách hàng
										</div>
										<div>
											<FormGroup id='workName' className='col-12'>
												<Select
													className='bg-white border-light border border-1 shadow-none rounded-0'
													ariaLabel='Board select'
													placeholder='Chọn'
													size='lg'
													onChange={formik.handleChange}
													value={formik.values.workName}>
													{data.map((u) => (
														<Option key={u.id} value={u.value}>
															{u.title}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
									</div>
									<div className='mt-4 mb-4 d-flex align-items-center justify-content-between'>
										<div className='display-6' style={{ fontSize: '1.3rem' }}>
											Cho phép khách hàng chụp ảnh trưng bày
										</div>
										<div>
											<FormGroup id='workName' className='col-12'>
												<Select
													className='bg-white border-light border border-1 shadow-none rounded-0'
													ariaLabel='Board select'
													placeholder='Chọn'
													size='lg'
													onChange={formik.handleChange}
													value={formik.values.workName}>
													{data.map((u) => (
														<Option key={u.id} value={u.value}>
															{u.title}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
									</div>
									<div className='mt-4 mb-4 d-flex align-items-center justify-content-between'>
										<div className='display-6' style={{ fontSize: '1.3rem' }}>
											Cập nhật thông tin tồn kho
											<Popovers
												trigger='hover'
												desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
												<Icon
													icon='Help'
													size='lg'
													className='ms-1 cursor-help'
												/>
											</Popovers>
										</div>
										<div>
											<FormGroup id='workName' className='col-12'>
												<Select
													className='bg-white border-light border border-1 shadow-none rounded-0'
													ariaLabel='Board select'
													placeholder='Chọn'
													size='lg'
													onChange={formik.handleChange}
													value={formik.values.workName}>
													{data.map((u) => (
														<Option key={u.id} value={u.value}>
															{u.title}
														</Option>
													))}
												</Select>
											</FormGroup>
										</div>
									</div>
								</div>
								<div className='col-xl-6 col-md-12'>
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Cấu hình bảo mật
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Mobile{' '}
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Web - Bán hàng{' '}
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Web - Mua hàng{' '}
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
									<Card className='mb-4 border-1 shadow-none'>
										<CardHeader className='py-2' style={{ minHeight: '3rem' }}>
											<CardLabel>
												<CardTitle className='w-100'>
													Cấu hình tự động (Chỉ áp dụng với xuất bản 1
													lần){' '}
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='py-2'>
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
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
