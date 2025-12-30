import { Card, CardBody, Container, Row, Col } from "reactstrap";

export default function Customers() {
  return (
    <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        
      <Container fluid className="py-4">
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <CardBody>
                <span style={{ fontSize: "40px" }}>🚧</span>
                <h3 className="mb-3">We’re Working on Something Great!</h3>
                <p className="text-muted">
                  This section is currently under development. Stay tuned — exciting updates are on the way!
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
