import React from 'react';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import { dataTable } from './dataChart';

// eslint-disable-next-line react/prop-types
const ReportDepartmentTable = ({ isFluid }) => {
	return (
		<Card stretch={isFluid}>
			<CardBody className='table-responsive' isScrollable={isFluid}>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th className='text-center' style={{ width: 10 }}>
								STT
							</th>
							<th style={{ textAlign: 'left' }}>Mã</th>
							<th style={{ textAlign: 'left' }}>Loại khách hàng</th>
							<th style={{ textAlign: 'right' }}>Đơn hàng</th>
							<th style={{ textAlign: 'right' }}>Số khách hàng</th>
							<th style={{ textAlign: 'right' }}>Số lượng (ĐVT Lẻ)</th>
							<th className='text-center'>Thành tiền</th>
							<th className='text-center'>Doanh thu</th>
							<th className='text-center'>Doanh thu thuần</th>
						</tr>
					</thead>
					<tbody>
						<tr style={{ color: '#FF0000', fontSize: '12px', fontWeight: 700 }}>
							<td className='text-center'>Tổng</td>
							<td />
							<td />
							<td style={{ textAlign: 'right' }}>274</td>
							<td style={{ textAlign: 'right' }}>225</td>
							<td style={{ textAlign: 'right' }}>6274</td>
							<td className='text-center'>1,688,116,080</td>
							<td className='text-center'>1,590,528,588</td>
							<td className='text-center'>1,471,614,988</td>
						</tr>
						{dataTable.map((item) => (
							<tr style={{ fontSize: '12px' }} key={item.id}>
								<td className='text-center'>{item.id}</td>
								<td style={{ textAlign: 'left' }}>{item.code}</td>
								<td style={{ textAlign: 'left', color: '#1AADCE' }}>
									{item.customerType}
								</td>
								<td style={{ textAlign: 'right' }}>{item.order}</td>
								<td style={{ textAlign: 'right' }}>{item.customerNumber}</td>
								<td style={{ textAlign: 'right' }}>{item.quantity}</td>
								<td className='text-center'>549,655,551</td>
								<td className='text-center'>499,540,321</td>
								<td className='text-center'>461,440,663</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
};

export default ReportDepartmentTable;
