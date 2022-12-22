import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MODAL_ACTION_CONFIRM } from '../../../utils/constants';
import './style.scss';

// eslint-disable-next-line react/prop-types
const ConfirmModalComponent = ({ openModal, onCloseModal, onAction, title, content }) => {
	return (
		<Modal
			show={openModal}
			onHide={() => onAction('close')}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			keyboard={false}
			centered>
			<Modal.Header closeButton>
				<Modal.Title className='header-modal'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='content-modal' dangerouslySetInnerHTML={{ __html: content }} />
			<Modal.Footer>
				<Button variant='secondary' onClick={onCloseModal}>
					Đóng
				</Button>
				<Button variant='primary' onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmModalComponent;
