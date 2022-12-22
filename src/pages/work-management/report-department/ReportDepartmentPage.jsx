import React, { useState } from 'react';
import ApexCharts from 'apexcharts';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { dataChart1, dataChart2, dataChart3 } from './dataChart';
import ReportDepartmentTable from './ReportDepartmentTable';

const ReportDepartmentPage = () => {
	const [state1, setState1] = useState(dataChart1);
	const [state2] = useState(dataChart2);
	const [state3] = useState(dataChart3);

	const updateData1 = (timeline) => {
		setState1({
			series: [...state1.series],
			options: { ...state1.options },
			selection: timeline,
		});

		switch (timeline) {
			case 'one_month':
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('28 Jan 2013').getTime(),
					new Date('27 Feb 2013').getTime(),
				);
				break;
			case 'six_months':
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('27 Sep 2012').getTime(),
					new Date('27 Feb 2013').getTime(),
				);
				break;
			case 'one_year':
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('27 Feb 2012').getTime(),
					new Date('27 Feb 2013').getTime(),
				);
				break;
			case 'ytd':
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('01 Jan 2013').getTime(),
					new Date('27 Feb 2013').getTime(),
				);
				break;
			case 'all':
				ApexCharts.exec(
					'area-datetime',
					'zoomX',
					new Date('23 Jan 2012').getTime(),
					new Date('27 Feb 2013').getTime(),
				);
				break;
			default:
		}
	};
	return (
		<PageWrapper title={demoPages.baoCao.text}>
			<Page container='fluid'>
				<div className='row mt-4'>
					<div className='col-lg-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='AreaChart'>
									<CardTitle>
										type <small>area</small>
									</CardTitle>
									<CardSubTitle>Chart</CardSubTitle>
								</CardLabel>
								<CardActions>
									<ButtonGroup>
										<Button
											color='primary'
											isLight
											id='one_month'
											onClick={() => updateData1('one_month')}
											isActive={state1.selection === 'one_month'}>
											1M
										</Button>
										<Button
											color='primary'
											isLight
											id='six_months'
											onClick={() => updateData1('six_months')}
											isActive={state1.selection === 'six_months'}>
											6M
										</Button>
										<Button
											color='primary'
											isLight
											id='one_year'
											onClick={() => updateData1('one_year')}
											isActive={state1.selection === 'one_year'}>
											1Y
										</Button>
										<Button
											color='primary'
											isLight
											id='ytd'
											onClick={() => updateData1('ytd')}
											isActive={state1.selection === 'ytd'}>
											YTD
										</Button>
										<Button
											color='primary'
											isLight
											id='all'
											onClick={() => updateData1('all')}
											isActive={state1.selection === 'all'}>
											ALL
										</Button>
									</ButtonGroup>
								</CardActions>
							</CardHeader>
							<CardBody>
								<Chart
									id='area-datetime'
									series={dataChart1.series}
									options={dataChart1.options}
									type='area'
									height={350}
								/>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='AreaChart'>
									<CardTitle>
										type <small>area</small>
									</CardTitle>
									<CardSubTitle>Chart</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<Chart
									series={state2.series}
									options={state2.options}
									type='area'
									height={350}
								/>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className='row'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-4 my-4'>
							Báo cáo thống kê khách hàng theo loại khách hàng
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-xl-6 col-xxl-4 col-md-12 col-sm-12'>
						<Card stretch>
							<CardHeader>
								<CardTitle
									className='text-center w-100'
									style={{ fontSize: '2rem', fontWeight: 500 }}>
									Đơn hàng
								</CardTitle>
							</CardHeader>
							<CardBody>
								<Chart
									series={state3.series}
									options={state3.options}
									type={state3.options.chart.type}
									width={state3.options.chart.width}
									className='d-flex align-items-center justify-content-center'
								/>
							</CardBody>
						</Card>
					</div>
					<div className='col-xl-6 col-xxl-4 col-md-12 col-sm-12'>
						<Card stretch>
							<CardHeader>
								<CardTitle
									className='text-center w-100'
									style={{ fontSize: '2rem', fontWeight: 500 }}>
									Sản lượng
								</CardTitle>
							</CardHeader>
							<CardBody>
								<Chart
									series={state3.series}
									options={state3.options}
									type={state3.options.chart.type}
									width={state3.options.chart.width}
									className='d-flex align-items-center justify-content-center'
								/>
							</CardBody>
						</Card>
					</div>
					<div className='col-xl-6 col-xxl-4 col-md-12 col-sm-12'>
						<Card stretch>
							<CardHeader>
								<CardTitle
									className='text-center w-100'
									style={{ fontSize: '2rem', fontWeight: 500 }}>
									Doanh thu
								</CardTitle>
							</CardHeader>
							<CardBody>
								<Chart
									series={state3.series}
									options={state3.options}
									type={state3.options.chart.type}
									width={state3.options.chart.width}
									className='d-flex align-items-center justify-content-center'
								/>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className='row h-100'>
					<ReportDepartmentTable />
				</div>
			</Page>
		</PageWrapper>
	);
};

export default ReportDepartmentPage;
