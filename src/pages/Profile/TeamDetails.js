import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Container, Button } from 'reactstrap';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTeamMembersRequest,
  updateTeamMemberRequest,
  deleteTeamMemberRequest,
  addTeamMemberRequest,
  getTeams,
} from 'store/actions';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'pages/Utility/axiosInstance';
import Breadcrumb from 'components/Common/Breadcrumb2';
import TeamList from 'pages/Teams/TeamList';
import { FadeLoader } from 'react-spinners';
import ConfirmationModal from 'components/Modals/ConfirmationModal';

import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const TeamDetails = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { id } = useParams(); // Get the team ID from route
  const dispatch = useDispatch();
  const [members, setMembers] = useState();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenModal] = useState()
  const [confirmAction, setConfirmAction] = useState();

  const teams = useSelector((state) => state?.Team?.teams);
  const membersList = useSelector((state) => state?.TeamMember.members);
  const loading = useSelector(state => state?.TeamMember.loading)

  const fetchUserList = async () => {
    const users = await axiosInstance('', { params: { sp: 'usp_GetTeamMembersNotinAnyTeam' } });
    setMembers(users?.data?.Data?.map((item) => ({ label: item?.userName, value: item?.userId })));
  };

  useEffect(() => {
    fetchUserList();
  }, [membersList]);

  useEffect(() => {
   if(id){
    dispatch(getTeams(id));
    dispatch(getTeamMembersRequest(id));
   }
  }, [id]);

  useEffect(()=>{
    console.log(teams,"teams");
  },[teams])

  const toggleModal = () => {
    setEditingMember(null);
    formik.resetForm();
    setModalOpen(!modalOpen);
  };

  const validationSchema = Yup.object({
    selectedMember: Yup.object().required('Team Member selection is required.'),
    isTeamLeader: Yup.boolean(),
  });


  const formik = useFormik({
    initialValues: {
      selectedMember: null,
      isTeamLeader: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingMember) {
        dispatch(
          updateTeamMemberRequest({
            "sp": "usp_UpdateTeamMember",
            "teamMemberId": editingMember?.teamMemberId,
            "userId": values?.selectedMember?.value,
            "teamId": Number(id),
            "isLeader": values.isTeamLeader ? 1 : 0
          })
        );
        setEditingMember(null); // Clear editing state
      } else {
        dispatch(
          addTeamMemberRequest({
            sp: 'usp_InsertTeamMember',
            userId: values.selectedMember.value,
            teamId: Number(id),
            isLeader: values.isTeamLeader ? 1 : 0,
          })
        );
      }
      toggleModal();
    },
  });

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  useEffect(() => {
    if (editingMember) {
      formik.setFieldValue('selectedMember', {
        label: editingMember.userName,
        value: editingMember.userId,
      });
      formik.setFieldValue('isTeamLeader', editingMember.isLeader);
      setModalOpen(true);
    }
  }, [editingMember]);


  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = (member) => {
    dispatch(deleteTeamMemberRequest(member));
    setDeleteId('')
    setOpenModal(false);
    setConfirmAction(false);
  };

  useEffect(() => {
    if (deleteId && confirmAction) {
      handleDelete(deleteId);
    }
  }, [deleteId, confirmAction])

  return (
    <Container className="page-content mt-3">
      <ConfirmationModal okText={"Confirm"} onCancel={() => { setDeleteId(''); setOpenModal(false); }} onOk={() => { setConfirmAction(true); }} isVisible={openModal} title="Delete Team Member" content={deleteId?.isLeader ?'This is the team leader. Are you sure you want to delete?' : 'Are You Sure You Want to Delete the Team Member'} />
      <div className="d-flex justify-content-between align-items-center mx-0">
        <Breadcrumb title="Team Profile" breadcrumbItems={[{ title: "Dashboard", link: `/dashboard` }, { title: "Team Profile", link: '#' }]} />
        <Button className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center" onClick={() => navigate('/teams')}>
          Back
        </Button>
      </div>

      {/* Displaying team details */}
      <Card className="shadow-sm">
        <CardBody>
          <Row>
            <Col xs={12} sm={6}>
              <p>
                <strong>Team Name:</strong>{' '}
                {teams?.Data?.filter((item) => item?.teamId == id)?.[0]?.teamName}
              </p>
              <p>
                <strong>Shift:</strong>{' '}
                {teams?.Data?.filter((item) => item?.teamId == id)?.[0]?.shiftName}
              </p>
            </Col>
            <Col xs={12} sm={6}>
              <p>
                <strong>Specialization:</strong>{' '}
                {teams?.Data?.filter((item) => item?.teamId == id)?.[0]?.specialization}
              </p>
              <p>
                <strong>Break Time:</strong>{' '}
                {teams?.Data?.filter((item) => item?.teamId == id)?.[0]?.breakTimeInMins} minutes
              </p>
            </Col>
          </Row>

          <Button color="primary" onClick={toggleModal} className="mt-4">
            Add Team Member
          </Button>
        </CardBody>
      </Card>

      {/* Displaying team members */}
      <div className="mt-5">
        <h5>Team Members</h5>
        <Card className="shadow-sm">
          <CardBody>
            <Row>
              <Col xs={12}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersList?.Data?.map((member) => (
                      <tr key={member.userId}>
                        <td style={{color: member?.isLeader ? '#00a895':''}}>{member.userName}</td>
                        <td>
                          <Button color="primary" onClick={() => handleEdit(member)}>
                            <FaRegEdit size={18} />
                          </Button>
                          <Button
                            color="danger"
                            className="ms-2"
                            onClick={() => { setOpenModal(true); setDeleteId(member) }}
                          >
                            <MdDeleteOutline size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(!loading && membersList?.Data?.length <= 0) && <td colSpan={2}>
                      <h6 className='text-center'>No Members Available</h6>
                    </td>}
                    {loading && <tr>
                      <td colSpan={2} className="text-center border-none">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                          <FadeLoader color="#f28c28" size={40} />
                        </div>
                      </td>
                    </tr>}
                  </tbody>
                </table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>

      <div className='p-3 bg-white'>
        <h5>Team UnAvailability</h5>
        <TeamUnAvailabilityList teamId={id} />
      </div>

      {/* Modal for adding/updating team member */}
      <Modal
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        visible={modalOpen}
        onCancel={toggleModal}
        footer={null}
        destroyOnClose
        centered
        width={600}
        className="custom-modal-header p-0"
        maskClosable={false}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label  fs-7">Select Team Member</label> <span className='text-danger'>*</span>
              <Select
                options={members}
                onChange={(option) => {
                  if (option) {
                    formik.setFieldValue('selectedMember', option);  // Set the selected value
                  } else {
                    formik.setFieldValue('selectedMember', null);  // Set to null when cleared
                  }
                }}
                value={formik.values.selectedMember || null}  // Handle null or undefined as the value
                isClearable={true}
              />
              {formik.touched.selectedMember && formik.errors.selectedMember && (
                <div className="text-danger fs-7 mt-1">
                  {formik.errors.selectedMember}
                </div>
              )}
            </div>

            <div className="col-md-12 mt-2 d-flex align-items-center">
              <label className="form-label  fs-7">Is Team Leader</label>
              <input
                type="checkbox"
                className='mb-1 ms-2'
                checked={formik.values.isTeamLeader}
                onChange={() =>
                  formik.setFieldValue('isTeamLeader', !formik.values.isTeamLeader)
                }
              />
            </div>
          </div>

          <div className="modal-footer mt-3">
            <button type="button" className="btn btn-light" onClick={toggleModal}>
              Close
            </button>
            <button type="submit" className="btn btn-primary ms-3">
              {editingMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default TeamDetails;
