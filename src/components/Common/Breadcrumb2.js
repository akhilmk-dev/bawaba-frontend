import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"

const Breadcrumb = props => {
  const { title, breadcrumbItems } = props
  const itemLength = breadcrumbItems.length
  const {t} = useTranslation();

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex flex-column align-items-start" style={{padding:"5px 0"}}>
          <h4 className="mb-2 font-size-18">{t(title)}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {breadcrumbItems.map((item, key) => (
                <BreadcrumbItem key={key} active={key + 1 === itemLength}>
                  <Link to={item?.link}>{t(item.title)}</Link>
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItems: PropTypes.array,
  title: PropTypes.string
}

export default Breadcrumb
