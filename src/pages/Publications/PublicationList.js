import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Breadcrumb from 'components/Common/Breadcrumb2';
import CreatePublication from './CreatePublication'; // Your modal form for publications
import PublicationTable from './PublicationTable'; // Your table component for publications
import { addPublication, getClassifications, getPublications } from 'store/actions';
import { useTranslation } from 'react-i18next';

const PublicationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const publications = useSelector(state => state?.Publication.publications);
  const classifications = useSelector((state) => state.Classification.classifications);
  const loading = useSelector((state) => state.Publication.loading)
  const error = useSelector((state) => state.Publication.error)
  const fieldErrors = useSelector((state) => state?.Publication?.fieldErrors);

  useEffect(()=>{
    dispatch(getPublications())
    dispatch(getClassifications({
      "pagesize": 100000,
      "currentpage": 0,
      "sortorder":{},
      "searchstring": "",
      "filter": {}
  }))
  },[dispatch])

  const handleSubmit = (data,resetForm,handleClose) => {
    // Dispatch your addPublication action here
    dispatch(addPublication(data,resetForm,handleClose))
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  document.title = "Publications | Menahub-mvec";
  return (
    <>
      <CreatePublication loading={loading} fieldErrors={fieldErrors} classifications={classifications?.data?.classifications?.map(item=>({label:item?.name,value:item?.id}))} visible={isOpen} onSubmit={handleSubmit} handleClose={handleClose} />
      <div className="page-content container-fluid">
        <div className="d-flex justify-content-between align-items-center mx-3">
          <Breadcrumb
            title="Publications"
            breadcrumbItems={[
              { title: 'Dashboard', link: '/dashboard' },
              { title: 'Publications', link: '#' },
            ]}
          />
          <Button
            className="bg-primary text-white d-flex justify-content-center gap-1 align-items-center"
            onClick={() => setIsOpen(true)}
          >
            <i className="ti-plus"></i>{t('Add New')}
          </Button>
        </div>

        <PublicationTable fieldErrors={fieldErrors} totalrows={publications?.data?.total} classifications={classifications?.data?.classifications?.map(item=>({label:item?.name,value:item?.id}))} loading={loading} list={publications?.data?.publications} />
      </div>
    </>
  );
};

export default PublicationList;
